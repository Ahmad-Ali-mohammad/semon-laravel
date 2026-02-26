
import React, { useEffect, useRef, useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Article } from '../../types';
import { EditIcon, TrashIcon, PlusIcon, SearchIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';
import { api } from '../../services/api';

const BlogManagementPage: React.FC = () => {
    const { articles, addArticle, deleteArticle, loadArticles } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadArticles().catch(() => undefined);
    }, [loadArticles]);

    const filteredArticles = articles.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (article?: Article) => {
        setSelectedImageFile(null);
        if (article) {
            setEditingArticle({ ...article });
        } else {
            setEditingArticle({
                id: 0,
                title: '',
                excerpt: '',
                content: '',
                category: 'تعليمي',
                author: 'سيمون',
                date: new Date().toLocaleDateString('ar-SY'),
                image: '/assets/photo_2026-02-04_07-13-35.jpg'
            });
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('حجم الصورة كبير جداً. الحد الأقصى 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('يرجى رفع صورة فقط');
                return;
            }

            const localPreview = URL.createObjectURL(file);
            setSelectedImageFile(file);
            setEditingArticle(prev => ({ ...prev, image: localPreview }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingArticle) {
            if (!editingArticle.title || !editingArticle.excerpt || !editingArticle.content || !editingArticle.image) {
                alert('يرجى ملء جميع الحقول المطلوبة ورفع صورة');
                return;
            }

            let imageUrlToSave = editingArticle.image || '';

            try {
                if (selectedImageFile) {
                    setIsImageProcessing(true);
                    const uploaded = await api.uploadMedia(selectedImageFile);
                    imageUrlToSave = uploaded.url;
                    setIsImageProcessing(false);
                }

                const articleToSave: Article = {
                    ...(editingArticle as Article),
                    id: Number(editingArticle.id) || 0,
                    image: imageUrlToSave,
                    title: editingArticle.title,
                    excerpt: editingArticle.excerpt,
                    content: editingArticle.content,
                    category: (editingArticle.category || 'تعليمي') as Article['category'],
                    author: editingArticle.author || 'سيمون',
                    date: editingArticle.date || new Date().toLocaleDateString('ar-SY'),
                    isActive: (editingArticle as any).isActive ?? true,
                };

                await addArticle(articleToSave);
                setIsModalOpen(false);
                setEditingArticle(null);
                setSelectedImageFile(null);
            } catch (error) {
                setIsImageProcessing(false);
                const reason = error instanceof Error ? error.message : 'خطأ غير معروف';
                alert(`تعذر حفظ المقال: ${reason}`);
            }
        }
    };

    return (
        <div className="animate-fade-in space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">إدارة المدونة</h1>
                    <p className="text-gray-400">تحكم في المقالات التعليمية والأخبار التي تظهر للعملاء</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <input
                        type="text"
                        placeholder="بحث في المقالات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-4 px-6 ps-14 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-500 text-gray-900 font-black px-8 py-4 rounded-xl hover:bg-amber-400 flex items-center gap-2 shadow-xl shadow-amber-500/10 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    إضافة مقال
                </button>
            </div>

            <div className="glass-medium rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <table className="w-full text-right">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <tr>
                            <th className="p-6">المقال</th>
                            <th className="p-6">الفئة</th>
                            <th className="p-6">التاريخ</th>
                            <th className="p-6 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredArticles.map(article => (
                            <tr key={article.id} className="hover:bg-white/5 group transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img src={article.image} alt={article.title} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/10" />
                                        <div>
                                            <span className="font-black text-lg text-white block">{article.title}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{article.author}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6"><span className="text-amber-400 font-black bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10 text-xs">{article.category}</span></td>
                                <td className="p-6 text-gray-400 text-sm font-poppins">{article.date}</td>
                                <td className="p-6">
                                    <div className="flex justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(article)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all" title="تعديل"><EditIcon className="w-5 h-5 text-amber-500" /></button>
                                        <button onClick={() => deleteArticle(article.id)} className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl w-full h-full cursor-default"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="إغلاق النافذة"
                    ></button>
                    <form onSubmit={handleSave} className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3rem] p-12 space-y-8 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-4xl font-black tracking-tighter">{editingArticle?.id ? 'تعديل المقال' : 'إنشاء مقال تعليمي جديد'}</h2>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="article-title" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">عنوان المقال</label>
                                    <input id="article-title" required placeholder="اكتب عنواناً جذاباً..." className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-amber-500" value={editingArticle?.title || ''} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="article-category" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">فئة المقال</label>
                                    <select
                                        id="article-category"
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500"
                                        value={editingArticle?.category}
                                        onChange={e => setEditingArticle({...editingArticle, category: e.target.value as Article['category']})}
                                    >
                                        <option value="تعليمي">تعليمي</option>
                                        <option value="أخبار">أخبار</option>
                                        <option value="نصائح طبية">نصائح طبية</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="article-image-upload" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">صورة المقال</label>
                                    <div className="space-y-3">
                                        <div className="w-full h-48 rounded-2xl border border-white/10 bg-[#1a1c23] overflow-hidden flex items-center justify-center">
                                            {editingArticle?.image ? (
                                                <img src={editingArticle.image} alt={editingArticle.title || 'صورة المقال'} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-500 text-sm">لم يتم اختيار صورة</span>
                                            )}
                                        </div>
                                        <input id="article-image-upload" type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} aria-label="اختيار صورة المقال" />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-black hover:bg-white/10 transition-all"
                                        >
                                            {editingArticle?.image ? 'تغيير الصورة' : 'اختيار صورة'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="article-excerpt" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">ملخص قصير (Excerpt)</label>
                                    <textarea id="article-excerpt" required rows={4} placeholder="يظهر هذا النص في المعرض الرئيسي للمدونة..." className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none" value={editingArticle?.excerpt || ''} onChange={e => setEditingArticle({...editingArticle, excerpt: e.target.value})} />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="article-content" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">المحتوى الكامل للمقال</label>
                                <textarea id="article-content" required rows={10} placeholder="اكتب المقال كاملاً هنا... يمكنك شرح كافة التفاصيل التعليمية." className="w-full bg-[#1a1c23] border border-white/10 rounded-3xl p-6 text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-loose" value={editingArticle?.content || ''} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="submit" disabled={isImageProcessing} className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 text-xl disabled:opacity-50 disabled:cursor-not-allowed">{isImageProcessing ? 'جاري رفع الصورة...' : 'حفظ ونشر المقال'}</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-white/5 rounded-2xl border border-white/10 font-bold hover:bg-white/10 transition-all">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.blog_mgmt.title}
                sections={helpContent.blog_mgmt.sections}
            />
        </div>
    );
};

export default BlogManagementPage;
