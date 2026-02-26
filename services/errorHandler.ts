// Frontend Error Handler Service
export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    debug?: any;
    timestamp: string;
    context?: ErrorContext;
}

export interface ErrorContext {
    action: string;
    component: string;
    userId?: string;
    additionalData?: Record<string, any>;
}

class ErrorHandler {
    private static instance: ErrorHandler;
    private errors: ApiError[] = [];

    private constructor() { }

    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    // Handle API errors
    public handleApiError(error: ApiError, context: ErrorContext): void {
        // Silently log error internally

        // Store error for debugging
        this.errors.push({
            ...error,
            context,
            timestamp: new Date().toISOString()
        });

        // Show user-friendly message
        this.showUserMessage(error.message);

        // Log to external service in production
        if (import.meta.env.PROD) {
            this.logToService(error, context);
        }
    }

    // Handle JavaScript errors
    public handleJsError(error: Error, context: ErrorContext): void {
        // Silently log error internally

        this.errors.push({
            success: false,
            message: error.message,
            debug: {
                name: error.name,
                stack: error.stack,
                context
            },
            timestamp: new Date().toISOString()
        });

        if (import.meta.env.PROD) {
            this.logToService({
                success: false,
                message: error.message,
                debug: error
            }, context);
        }
    }

    // Show user-friendly error message
    private showUserMessage(message: string): void {
        // Create toast notification or alert
        if (typeof window !== 'undefined') {
            // You can integrate with your toast library here
            if (window.confirm(`Error: ${message}\n\nWould you like to refresh the page?`)) {
                window.location.reload();
            }
        }
    }

    // Log errors to external service
    private logToService(error: ApiError | any, context: ErrorContext): void {
        // Implement logging to your error tracking service
        // Example: Sentry, LogRocket, custom endpoint
        try {
            fetch('/api/v1/errors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error,
                    context,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                })
            }).catch(() => {
                // Silent fail for error logging
            });
        } catch {
            // Silent fail for error logging
        }
    }

    // Get recent errors for debugging
    public getRecentErrors(): ApiError[] {
        return this.errors.slice(-10); // Last 10 errors
    }

    // Clear error log
    public clearErrors(): void {
        this.errors = [];
    }

    // Check if error is network related
    public isNetworkError(error: any): boolean {
        return error instanceof TypeError &&
            (error.message.includes('fetch') ||
                error.message.includes('network') ||
                error.message.includes('Failed to fetch'));
    }

    // Retry failed requests with exponential backoff
    public async retryWithBackoff<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        baseDelay: number = 1000
    ): Promise<T> {
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries) {
                    throw error;
                }

                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }
}

export const errorHandler = ErrorHandler.getInstance();

// Global error handlers
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        errorHandler.handleJsError(event.error || new Error(event.message), {
            action: 'global_error',
            component: 'window',
            additionalData: {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            }
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        errorHandler.handleJsError(
            new Error(event.reason?.message || 'Unhandled Promise Rejection'),
            {
                action: 'unhandled_promise',
                component: 'window',
                additionalData: { reason: event.reason }
            }
        );
    });
}

export default errorHandler;
