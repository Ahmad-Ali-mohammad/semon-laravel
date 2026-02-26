
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Page } from '../App';

interface ResetPasswordPageProps {
    setPage: (page: Page) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const hash = window.location.hash;

        if (hash.includes('?')) {
            const hashParams = new URLSearchParams(hash.split('?')[1]);
            hashParams.forEach((value, key) => {
                if (!params.has(key)) {
                    params.set(key, value);
                }
            });
        }

        const emailParam = params.get('email');
        const tokenParam = params.get('token');

        if (emailParam) setEmail(emailParam);
        if (tokenParam) setToken(tokenParam);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token || !email) {
            setError('Please confirm the reset link and email.');
            return;
        }

        if (!password || password !== confirmPassword) {
            setError('Passwords do not match or are empty.');
            return;
        }

        setIsSubmitting(true);

        try {
            await api.resetPassword({
                token,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            setPage('login');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to reset password.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">تعيين كلمة مرور جديدة</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="reset-email"  className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            id="reset-email"
                            name="reset-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="reset-token"  className="block text-sm font-medium text-gray-300 mb-2">Reset token</label>
                        <input
                            id="reset-token"
                            name="reset-token"
                            type="text"
                            required
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="token"
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password"  className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور الجديدة</label>
                        <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="********"
                        />
                    </div>
                     <div>
                        <label htmlFor="confirm-password"  className="block text-sm font-medium text-gray-300 mb-2">تأكيد كلمة المرور</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="********"
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
                        {isSubmitting ? 'Saving...' : 'Save password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
