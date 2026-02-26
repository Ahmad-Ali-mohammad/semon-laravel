
import React, { useState } from 'react';
import { api } from '../services/api';
import { Page } from '../App';

interface ForgotPasswordPageProps {
    setPage: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await api.forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">إعادة تعيين كلمة المرور</h2>
                {submitted ? (
                     <div className="text-center text-gray-300">
                        <p>إذا كان بريدك الإلكتروني موجوداً في نظامنا، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً.</p>
                        <button onClick={() => setPage('login')} className="mt-4 text-amber-400 font-bold">
                            العودة لتسجيل الدخول
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-gray-300">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                             <div>
                                <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                                <input
                                    id="email-forgot"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-red-400 font-bold text-center">{error}</div>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60"
                            >
                                {isSubmitting ? 'Sending...' : 'Send reset link'}
                            </button>
                        </form>
                        <p className="text-center">
                            <a href="#" onClick={() => setPage('login')} className="font-medium text-amber-400 hover:text-amber-300">
                                العودة لتسجيل الدخول
                            </a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;




