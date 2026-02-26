
import React, { useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

const MASCOT_IMAGE_URL = "/assets/photo_2026-02-04_07-13-35.jpg";

interface BlogPageProps {
    setPage: (page: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ setPage }) => {
    const { articles, loadArticles } = useDatabase();

    useEffect(() => {
        loadArticles().catch(() => undefined);
    }, [loadArticles]);

    return (
        <div className="space-y-16 animate-fade-in text-right">
            {/* Hero Section */}
            <section className="relative h-[45vh] rounded-[3.5rem] overflow-hidden flex items-center justify-center text-center shadow-2xl">
                <img src={MASCOT_IMAGE_URL} alt="Blog Header" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90"></div>
                <div className="relative z-10 px-6 max-w-3xl space-y-6">
                    <div className="inline-block bg-amber-500/20 border border-amber-500/30 text-amber-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Reptile House Knowledge Base
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">مدونة الزواحف</h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-bold leading-relaxed">
                        اكتشف عالم الزواحف من خلال نصائح احترافية وأحدث الأخبار من الخبير <span className="text-amber-400">سيمون</span>.
                    </p>
                </div>
            </section>

            {/* Quick Filter */}
            <div className="flex flex-wrap justify-center gap-4">
                {['الكل', 'تعليمي', 'أخبار', 'نصائح طبية'].map(cat => (
                    <button key={cat} className="px-10 py-4 glass-light rounded-2xl font-black text-sm hover:bg-amber-500 hover:text-gray-900 transition-all active:scale-95 border border-white/10">
                        {cat}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                {articles.map(article => (
                    <button
                        type="button"
                        key={article.id}
                        onClick={() => setPage(`article/${article.id}`)}
                        className="glass-medium rounded-[3rem] overflow-hidden border border-white/10 group hover:border-amber-500/50 transition-all duration-500 shadow-2xl cursor-pointer flex flex-col"
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute top-8 right-8 bg-amber-500 text-gray-900 px-5 py-2 rounded-full text-xs font-black uppercase shadow-xl">
                                {article.category}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="p-10 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-6 text-xs font-bold text-gray-500">
                                    <span className="font-poppins uppercase">{article.date}</span>
                                    <span className="text-amber-400 font-black">بقلم: {article.author}</span>
                                </div>
                                <h2 className="text-3xl font-black mb-6 leading-tight group-hover:text-amber-400 transition-colors">{article.title}</h2>
                                <p className="text-gray-400 leading-relaxed text-lg mb-8 line-clamp-3">{article.excerpt}</p>
                            </div>
                            <div className="flex items-center gap-4 text-amber-500 font-black text-sm group-hover:gap-6 transition-all">
                                <span>اقرأ المقال بالكامل</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
            </section>

            {/* Newsletter section */}
            <section className="glass-dark rounded-[3.5rem] p-12 md:p-20 border border-white/10 text-center relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]"></div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">ابقَ على اطلاع دائم بجديدنا</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-bold">اشترك في قائمتنا البريدية لتصلك أحدث نصائح تربية الزواحف والعروض الحصرية مباشرة إلى بريدك.</p>
                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={e => e.preventDefault()}>
                    <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                    <button className="bg-amber-500 text-gray-900 font-black px-10 py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95">اشتراك</button>
                </form>
            </section>
        </div>
    );
};

export default BlogPage;
