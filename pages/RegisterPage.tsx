
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../App';

interface RegisterPageProps {
    setPage: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setPage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(name, email, password);
        setPage('home');
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">إنشاء حساب جديد</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">الاسم الكامل</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="اسمك الكامل"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-register" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                        <input
                            id="email-register"
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
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">رقم الهاتف</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="+963 912 345 678"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-register" className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
                        <input
                            id="password-register"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105"
                    >
                        إنشاء الحساب
                    </button>
                </form>
                <p className="text-center text-gray-400">
                    لديك حساب بالفعل؟{' '}
                    <a href="#" onClick={() => setPage('login')} className="font-medium text-amber-400 hover:text-amber-300">
                        سجل الدخول
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
