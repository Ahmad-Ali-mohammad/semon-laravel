
import React, { useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { ChevronRightIcon, UserIcon, BellIcon } from '../components/icons';

interface ArticleDetailsPageProps {
    articleId: number;
    setPage: (page: string) => void;
}

const ArticleDetailsPage: React.FC<ArticleDetailsPageProps> = ({ articleId, setPage }) => {
    const { articles, loadArticles } = useDatabase();
    const article = articles.find(a => a.id === articleId);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadArticles().catch(() => undefined);
    }, [articleId, loadArticles]);

    if (!article) {
        return (
            <div className="text-center py-32 glass-medium rounded-3xl">
                <h1 className="text-4xl font-bold">عذراً، المقال غير موجود</h1>
                <button onClick={() => setPage('blog')} className="mt-8 text-amber-500 font-bold hover:underline">العودة للمدونة</button>
            </div>
        );
    }

    const otherArticles = articles.filter(a => a.id !== article.id).slice(0, 2);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in text-right">
            <nav className="flex items-center space-x-2 space-x-reverse mb-8 text-sm text-gray-400">
                <button onClick={() => setPage('home')} className="hover:text-amber-400 transition-colors">الرئيسية</button>
                <ChevronRightIcon className="w-4 h-4 rotate-180" />
                <button onClick={() => setPage('blog')} className="hover:text-amber-400 transition-colors">المدونة</button>
                <ChevronRightIcon className="w-4 h-4 rotate-180" />
                <span className="text-amber-400 font-black">{article.title}</span>
            </nav>

            <article className="glass-dark rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="relative aspect-video">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 right-8">
                        <span className="bg-amber-500 text-gray-900 px-6 py-2 rounded-full text-xs font-black uppercase shadow-lg">
                            {article.category}
                        </span>
                    </div>
                </div>

                <div className="p-10 md:p-16 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">{article.author}</p>
                                <p className="text-[10px] text-gray-500">خبير معتمد في Reptile House</p>
                            </div>
                        </div>
                        <span className="text-sm text-gray-500 font-bold">{article.date}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">{article.title}</h1>
                    
                    <div className="prose prose-invert max-w-none text-gray-300 leading-loose text-lg space-y-6">
                        <p className="font-bold text-amber-400/90 text-xl">{article.excerpt}</p>
                        <div className="border-r-4 border-amber-500 pr-6 py-2 bg-white/5 rounded-l-2xl italic">
                            يقول سيمون: "الرعاية الصحيحة تبدأ بفهم احتياجات الزاحف قبل شرائه، ونحن هنا لنضمن لك هذه المعرفة."
                        </div>
                        <p>
                            {article.content || "جاري تحديث المحتوى التفصيلي لهذا المقال... نحن نعمل على توفير أدق المعلومات العلمية لضمان رعاية مثالية لزواحفكم."}
                        </p>
                        <p>
                            تربية الزواحف ليست مجرد هواية، بل هي مسؤولية تجاه أرواح بدم بارد تحتاج إلى بيئة تحاكي الطبيعة قدر الإمكان. في متجرنا دمشق، نحرص على توفير كافة الأجهزة من إضاءة UVB وحرارة مناسبة لكل نوع.
                        </p>
                    </div>

                    <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                         <div className="flex gap-4">
                            <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <span className="text-xs font-bold px-2">مشاركة</span>
                            </button>
                             <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <span className="text-xs font-bold px-2">نسخ الرابط</span>
                            </button>
                         </div>
                         <div className="text-amber-500 flex items-center gap-2">
                            <BellIcon className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">اشترك لتصلك نصائحنا</span>
                         </div>
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            <section className="mt-20">
                <h2 className="text-3xl font-black mb-10">مقالات قد تهمك</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherArticles.map(a => (
                        <button
                            type="button"
                            key={a.id}
                            onClick={() => setPage(`article/${a.id}`)}
                            className="glass-medium p-6 rounded-[2rem] border border-white/10 flex gap-6 hover:border-amber-500/50 transition-all cursor-pointer group w-full text-right"
                        >
                            <img src={a.image} alt={a.title} className="w-24 h-24 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
                            <div>
                                <span className="text-[10px] text-amber-500 font-black mb-2 block">{a.category}</span>
                                <h3 className="font-black text-white group-hover:text-amber-400 transition-colors">{a.title}</h3>
                                <p className="text-xs text-gray-400 mt-2 line-clamp-1">{a.excerpt}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ArticleDetailsPage;
