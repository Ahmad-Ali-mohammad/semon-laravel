// Two-Factor Authentication Service for Frontend
export interface TwoFactorSetup {
    secret: string;
    qr_code_url: string;
    backup_codes: string[];
    instructions: string;
}

export interface TwoFactorVerifyRequest {
    code: string;
    user_id: string;
    remember_token: string;
}

class TwoFactorAuthService {
    private static instance: TwoFactorAuthService;
    private qrCodeScriptLoaded = false;

    private constructor() { }

    public static getInstance(): TwoFactorAuthService {
        if (!TwoFactorAuthService.instance) {
            TwoFactorAuthService.instance = new TwoFactorAuthService();
        }
        return TwoFactorAuthService.instance;
    }

    // Load QR code library dynamically
    private async loadQrCodeLibrary(): Promise<void> {
        if (this.qrCodeScriptLoaded) return;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
            script.onload = () => {
                this.qrCodeScriptLoaded = true;
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load QR code library'));
            };
            document.head.appendChild(script);
        });
    }

    // Setup 2FA for user
    public async setupTwoFactor(): Promise<TwoFactorSetup> {
        try {
            const response = await fetch('/api/admin/security/2fa/setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to setup 2FA');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            // Silently log error - rethrow for caller to handle
            throw error;
        }
    }

    // Enable 2FA with verification code
    public async enableTwoFactor(code: string): Promise<void> {
        try {
            const response = await fetch('/api/admin/security/2fa/enable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to enable 2FA');
            }
        } catch (error) {
            // Silently log error - rethrow for caller to handle
            throw error;
        }
    }

    // Disable 2FA
    public async disableTwoFactor(password: string): Promise<void> {
        try {
            const response = await fetch('/api/admin/security/2fa/disable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to disable 2FA');
            }
        } catch (error) {
            // Silently log error - rethrow for caller to handle
            throw error;
        }
    }

    // Verify 2FA code during login
    public async verifyTwoFactor(verificationData: TwoFactorVerifyRequest): Promise<void> {
        try {
            const response = await fetch('/api/admin/security/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(verificationData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to verify 2FA');
            }

            // Reload page after successful verification
            window.location.reload();
        } catch (error) {
            // Silently log error - rethrow for caller to handle
            throw error;
        }
    }

    // Generate QR code for display
    public async generateQRCode(text: string): Promise<string> {
        await this.loadQrCodeLibrary();

        return new Promise((resolve, reject) => {
            try {
                // @ts-ignore - QRCode library loaded dynamically
                const qr = (window as any).QRCode;
                if (!qr) {
                    reject(new Error('QR Code library not loaded'));
                    return;
                }

                const qrData = qr.toDataURL(text, {
                    width: 256,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });

                resolve(qrData);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Generate TOTP code (for demo/testing)
    public generateTOTP(secret: string): string {
        // Simplified TOTP implementation
        // In production, use otplib or similar library
        const timeStep = Math.floor(Date.now() / 30000);
        const hash = this.hmacSha1(secret, timeStep.toString());
        const offset = parseInt(hash.substring(hash.length - 1), 16) & 0x0F;
        const code = (parseInt(hash.substring(offset * 2, offset * 2 + 8), 16) & 0x3FFFFFFF) % 1000000;
        return code.toString().padStart(6, '0');
    }

    // HMAC-SHA1 implementation
    private hmacSha1(key: string, message: string): string {
        // Simplified HMAC-SHA1 (use crypto.subtle in production)
        const crypto = require('crypto');
        return crypto.createHmac('sha1', key).update(message).digest('hex');
    }

    // Format backup codes for display
    public formatBackupCodes(codes: string[]): string[] {
        return codes.map((code, index) => `Backup ${index + 1}: ${code}`);
    }

    // Copy to clipboard utility
    public copyToClipboard(text: string): Promise<void> {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((resolve, reject) => {
            document.execCommand('copy') ? resolve() : reject();
            document.body.removeChild(textArea);
        });
    }

    // Check if user has 2FA enabled
    public async checkTwoFactorStatus(): Promise<boolean> {
        try {
            const response = await fetch('/api/admin/security/2fa/status', {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.two_factor_enabled || false;
        } catch {
            return false;
        }
    }

    // Validate 2FA code format
    public isValidCode(code: string): boolean {
        return /^\d{6}$/.test(code);
    }

    // Countdown timer for code validity
    public startCountdown(seconds: number, onTick: (remaining: number) => void, onComplete: () => void): () => void {
        let remaining = seconds;

        const timer = setInterval(() => {
            remaining--;
            onTick(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                onComplete();
            }
        }, 1000);

        return () => clearInterval(timer);
    }
}

export const twoFactorAuth = TwoFactorAuthService.getInstance();
export default twoFactorAuth;
