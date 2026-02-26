
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../App';
import { DashboardIcon, UserIcon } from '../components/icons';

interface LoginPageProps {
    setPage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const authenticatedUser = await login(email, password);
            if (authenticatedUser) {
                // Navigate immediately without waiting
                if (authenticatedUser.role === 'admin' || authenticatedUser.role === 'manager') {
                    setPage('dashboard');
                } else {
                    setPage('home');
                }
            } else {
                setError('البريد الإلكتروني غير مسجل أو كلمة المرور خاطئة');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = async (role: 'admin' | 'user') => {
        // For demo purposes only - remove in production
        setError('Quick login disabled for security. Please use credentials.');
        return;

        // Production: Remove this entire section
        const credentials = role === 'admin'
            ? { email: 'admin@example.com', pass: 'password' }
            : { email: 'user@example.com', pass: 'user12345' };

        setError('');
        setIsLoading(true);
        try {
            const authenticatedUser = await login(credentials.email, credentials.pass);
            if (authenticatedUser) {
                // Navigate immediately
                if (authenticatedUser.role === 'admin' || authenticatedUser.role === 'manager') {
                    setPage('dashboard');
                } else {
                    setPage('home');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 text-right pr-12">
                    <div className="space-y-4">
                        <div className="inline-block">
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30 rotate-6 hover:rotate-0 transition-transform duration-500">
                                <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-6xl font-black text-white leading-tight">
                            مرحباً بعودتك!
                        </h1>
                        <p className="text-2xl text-gray-400 font-bold">
                            سجّل دخولك للوصول إلى حسابك
                        </p>
                    </div>

                    <div className="space-y-4 pt-8">
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all">
                                <span className="text-2xl">🦎</span>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg">متجر شامل</h3>
                                <p className="text-gray-400 text-sm">كل ما تحتاجه لزواحفك في مكان واحد</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg">شحن سريع وآمن</h3>
                                <p className="text-gray-400 text-sm">توصيل احترافي لجميع المحافظات</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all">
                                <span className="text-2xl">💳</span>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg">دفع آمن</h3>
                                <p className="text-gray-400 text-sm">دعم Sham Cash والتحويل البنكي</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full">
                    <div className="relative glass-dark rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl -z-10"></div>

                        <div className="relative z-10 space-y-8">
                            {/* Header */}
                            <div className="text-right space-y-3">
                                <h2 className="text-4xl font-black text-white">تسجيل الدخول</h2>
                                <p className="text-gray-400">أدخل بياناتك للوصول إلى حسابك</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 border-2 border-red-500/50 text-red-200 p-4 rounded-2xl text-sm font-bold text-right flex items-center gap-3 animate-shake">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-black text-amber-400 uppercase tracking-wider">
                                        البريد الإلكتروني
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="relative w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all text-right"
                                            placeholder="example@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-black text-amber-400 uppercase tracking-wider">
                                            كلمة المرور
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setPage('forgotPassword')}
                                            className="text-amber-500 hover:text-amber-400 font-bold transition-colors text-sm"
                                        >
                                            هل نسيت كلمة المرور؟
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="relative w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all text-right"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-black py-5 rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative flex items-center justify-center gap-3 text-lg">
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>جارٍ الدخول...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>دخول</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="text-center pt-4">
                                <p className="text-gray-400">
                                    ليس لديك حساب؟{' '}
                                    <button
                                        type="button"
                                        onClick={() => setPage('register')}
                                        className="font-black text-amber-500 hover:text-amber-400 transition-colors"
                                    >
                                        إنشاء حساب جديد →
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
