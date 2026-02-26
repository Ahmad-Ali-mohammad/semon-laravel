import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // اختياري: قم بـ log الخطأ لخدمة logging
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <div className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg max-w-md">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4v2m0 6H7.5a2.25 2.25 0 110-4.5H3v-7.5A2.25 2.25 0 015.25 5h13.5A2.25 2.25 0 0121 7.5v13.5A2.25 2.25 0 0118.75 23H7.5"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-white mb-3">حدث خطأ ما</h1>
              <p className="text-gray-400 mb-6 leading-relaxed">
                نعتذر! حدث خطأ غير متوقع. يرجى تحديث الصفحة والمحاولة مرة أخرى.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                  <p className="text-xs font-mono text-red-400 break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-amber-500 text-gray-900 font-black py-3.5 rounded-2xl hover:bg-amber-400 transition-all shadow-lg"
              >
                تحديث الصفحة
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full mt-3 bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-2xl hover:bg-white/10 transition-all"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
