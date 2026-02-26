// Session Management Service with Timeout Handling
export interface SessionInfo {
    userId: string | null;
    loginTime: number | null;
    lastActivity: number | null;
    timeoutWarning: boolean;
    timeRemaining: number;
}

class SessionManager {
    private static instance: SessionManager;
    private sessionCheckInterval: NodeJS.Timeout | null = null;
    private readonly SESSION_TIMEOUT = 120 * 60 * 1000; // 2 hours in milliseconds
    private readonly WARNING_TIMEOUT = 105 * 60 * 1000; // 1 hour 45 minutes

    private constructor() {}

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    // Initialize session monitoring
    public initializeSessionMonitoring(): void {
        this.updateLastActivity();
        this.startActivityMonitoring();
        this.setupVisibilityChangeListener();
    }

    // Update last activity time
    public updateLastActivity(): void {
        const now = Date.now();
        localStorage.setItem('last_activity', now.toString());
        
        // Update session info
        const sessionInfo = this.getSessionInfo();
        sessionInfo.lastActivity = now;
        this.saveSessionInfo(sessionInfo);
    }

    // Get current session information
    public getSessionInfo(): SessionInfo {
        const encryptedUser = localStorage.getItem('auth_user_secure');
        const loginTime = localStorage.getItem('login_time');
        const lastActivity = localStorage.getItem('last_activity');
        
        return {
            userId: encryptedUser ? this.extractUserId(encryptedUser) : null,
            loginTime: loginTime ? parseInt(loginTime) : null,
            lastActivity: lastActivity ? parseInt(lastActivity) : null,
            timeoutWarning: false,
            timeRemaining: this.calculateTimeRemaining(lastActivity ? parseInt(lastActivity) : null)
        };
    }

    // Save session information
    private saveSessionInfo(sessionInfo: SessionInfo): void {
        sessionStorage.setItem('session_info', JSON.stringify(sessionInfo));
    }

    // Calculate remaining time before timeout
    private calculateTimeRemaining(lastActivity: number | null): number {
        if (!lastActivity) return this.SESSION_TIMEOUT;
        
        const elapsed = Date.now() - lastActivity;
        const remaining = Math.max(0, this.SESSION_TIMEOUT - elapsed);
        return remaining;
    }

    // Start monitoring session activity
    private startActivityMonitoring(): void {
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
        }

        this.sessionCheckInterval = setInterval(() => {
            this.checkSessionStatus();
        }, 30000); // Check every 30 seconds
    }

    // Check session status and show warnings
    private checkSessionStatus(): void {
        const sessionInfo = this.getSessionInfo();
        const timeRemaining = sessionInfo.timeRemaining;
        
        // Update timeout warning status
        sessionInfo.timeoutWarning = timeRemaining <= (this.WARNING_TIMEOUT);
        this.saveSessionInfo(sessionInfo);

        // Show warning if needed
        if (sessionInfo.timeoutWarning && !this.isWarningShown()) {
            this.showTimeoutWarning(timeRemaining);
        }

        // Auto logout if session expired
        if (timeRemaining <= 0) {
            this.handleSessionTimeout();
        }
    }

    // Show timeout warning to user
    private showTimeoutWarning(timeRemaining: number): void {
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        
        // Create warning notification
        this.showNotification(
            'Session Timeout Warning',
            `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''} due to inactivity.`,
            'warning'
        );
        
        // Set warning shown flag
        localStorage.setItem('session_warning_shown', Date.now().toString());
    }

    // Handle session timeout
    private handleSessionTimeout(): void {
        this.showNotification(
            'Session Expired',
            'Your session has expired due to inactivity. Please login again.',
            'error'
        );
        
        // Clear session data
        this.clearSession();
        
        // Redirect to login after short delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }

    // Show notification (toast or alert)
    private showNotification(title: string, message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
        // Create toast notification if possible
        if (this.createToast) {
            this.createToast(title, message, type);
        } else {
            // Fallback to alert
            alert(`${title}: ${message}`);
        }
    }

    // Create toast notification (simplified)
    private createToast(title: string, message: string, type: string): void {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        toast.innerHTML = `
            <div class="font-bold">${title}</div>
            <div class="text-sm mt-1">${message}</div>
            <button onclick="this.parentElement.remove()" class="mt-2 text-xs underline">Dismiss</button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 10000);
    }

    // Check if warning was already shown
    private isWarningShown(): boolean {
        const warningShown = localStorage.getItem('session_warning_shown');
        if (!warningShown) return false;
        
        const warningTime = parseInt(warningShown);
        const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
        
        return warningTime > fifteenMinutesAgo;
    }

    // Setup page visibility change listener
    private setupVisibilityChangeListener(): void {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page became visible - update activity
                this.updateLastActivity();
            }
        });

        // Monitor user activity events
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                this.updateLastActivity();
            }, { passive: true });
        });
    }

    // Clear session data
    public clearSession(): void {
        localStorage.removeItem('auth_user_secure');
        localStorage.removeItem('login_time');
        localStorage.removeItem('last_activity');
        localStorage.removeItem('session_warning_shown');
        sessionStorage.removeItem('session_info');
        
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
            this.sessionCheckInterval = null;
        }
    }

    // Extend session (call when user performs activity)
    public extendSession(): void {
        this.updateLastActivity();
        this.hideTimeoutWarning();
    }

    // Hide timeout warning
    private hideTimeoutWarning(): void {
        const toasts = document.querySelectorAll('[class*="fixed top-4 right-4"]');
        toasts.forEach(toast => {
            if (toast.textContent?.includes('Session will expire')) {
                toast.remove();
            }
        });
    }

    // Extract user ID from encrypted session (simplified)
    private extractUserId(encryptedUser: string): string | null {
        try {
            // This would use the same decryption as AuthContext
            // For now, return null - in real implementation, decrypt and extract ID
            return null;
        } catch {
            return null;
        }
    }

    // Get session time remaining in human readable format
    public getTimeRemaining(): string {
        const sessionInfo = this.getSessionInfo();
        const timeRemaining = sessionInfo.timeRemaining;
        
        if (timeRemaining <= 0) return 'Expired';
        
        const minutes = Math.floor(timeRemaining / (60 * 1000));
        const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        
        return `${seconds}s`;
    }

    // Cleanup
    public destroy(): void {
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
            this.sessionCheckInterval = null;
        }
    }
}

export const sessionManager = SessionManager.getInstance();
export default sessionManager;
