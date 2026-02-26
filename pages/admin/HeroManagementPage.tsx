
import React, { useRef, useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { HeroSlide } from '../../types';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';
import { api } from '../../services/api';

const HeroManagementPage: React.FC = () => {
    const { heroSlides, saveHeroSlide, deleteHeroSlide } = useDatabase();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenModal = (slide?: HeroSlide) => {
        setSelectedImageFile(null);
        if (slide) {
            setEditingSlide({ ...slide });
        } else {
            setEditingSlide({
                id: '',
                title: '',
                subtitle: '',
                image: '',
                buttonText: 'اكتشف المزيد',
                link: 'showcase',
                active: true
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

            const previewUrl = URL.createObjectURL(file);
            setSelectedImageFile(file);
            setEditingSlide(prev => ({ ...prev, image: previewUrl }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSlide) {
            if (!editingSlide.title || !editingSlide.subtitle || (!editingSlide.image && !selectedImageFile)) {
                alert('يرجى ملء جميع الحقول المطلوبة ورفع صورة');
                return;
            }

            let imageToSave = editingSlide.image || '';

            try {
                if (selectedImageFile) {
                    setIsImageProcessing(true);
                    const uploaded = await api.uploadMedia(selectedImageFile);
                    imageToSave = uploaded.url;
                    setIsImageProcessing(false);
                }

                const payload: HeroSlide = {
                    id: editingSlide.id || '',
                    title: editingSlide.title,
                    subtitle: editingSlide.subtitle,
                    image: imageToSave,
                    buttonText: editingSlide.buttonText || 'اكتشف المزيد',
                    link: editingSlide.link || 'showcase',
                    active: editingSlide.active ?? true,
                };

                await saveHeroSlide(payload);
                setIsModalOpen(false);
                setEditingSlide(null);
                setSelectedImageFile(null);
            } catch (error) {
                setIsImageProcessing(false);
                const reason = error instanceof Error ? error.message : 'خطأ غير معروف';
                alert(`تعذر حفظ الشريحة: ${reason}`);
            }
        }
    };

    return (
        <div className="animate-fade-in space-y-10 text-right pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">إدارة واجهة الموقع</h1>
                    <p className="text-gray-400">تحكم في الصور والعناوين التي تظهر في الواجهة الرئيسية</p>
                </div>
                <div className="flex gap-3">
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-amber-500 text-gray-900 font-black px-10 py-4 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-3 shadow-xl shadow-amber-500/20 active:scale-95"
                    >
                        <PlusIcon className="w-6 h-6" />
                        شريحة عرض جديدة
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {heroSlides.map(slide => (
                    <div key={slide.id} className="glass-medium rounded-[3rem] overflow-hidden border border-white/10 group transition-all duration-500 hover:border-amber-500/30 flex flex-col">
                        <div className="relative aspect-video">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            <div className="absolute top-6 right-6 flex gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${slide.active ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                    {slide.active ? 'نشط الآن' : 'غير مفعل'}
                                </span>
                            </div>
                        </div>
                        <div className="p-10 flex-1 space-y-6">
                            <h3 className="text-3xl font-black text-white leading-tight">{slide.title}</h3>
                            <p className="text-gray-400 font-bold leading-relaxed">{slide.subtitle}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="text-xs font-black text-amber-500 uppercase tracking-widest bg-amber-500/5 px-4 py-2 rounded-xl">
                                    {slide.buttonText} → {slide.link}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleOpenModal(slide)} className="p-3 bg-white/5 text-amber-500 rounded-xl hover:bg-white/10 transition-all" aria-label="تعديل الشريحة"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => deleteHeroSlide(slide.id)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all" aria-label="حذف الشريحة"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-default"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="إغلاق النافذة"
                    />
                    <form onSubmit={handleSave} className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3.5rem] p-12 space-y-8 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-4xl font-black tracking-tighter">{editingSlide?.id ? 'تعديل الشريحة' : 'شريحة عرض جديدة'}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="hero-slide-title" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">عنوان الشريحة</label>
                                    <input id="hero-slide-title" required className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white font-bold" value={editingSlide?.title || ''} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="hero-slide-subtitle" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">النص الوصفي</label>
                                    <textarea id="hero-slide-subtitle" rows={3} required className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white font-bold resize-none" value={editingSlide?.subtitle || ''} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="hero-slide-image-upload" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">صورة الشريحة</label>
                                    <div className="space-y-3">
                                        <div className="w-full h-40 rounded-2xl border border-white/10 bg-[#1a1c23] overflow-hidden flex items-center justify-center">
                                            {editingSlide?.image ? (
                                                <img src={editingSlide.image} alt={editingSlide.title || 'صورة الشريحة'} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-500 text-sm">لم يتم اختيار صورة</span>
                                            )}
                                        </div>
                                        <input id="hero-slide-image-upload" type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} aria-label="اختيار صورة الشريحة" />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-black hover:bg-white/10 transition-all"
                                        >
                                            {editingSlide?.image ? 'تغيير الصورة' : 'اختيار صورة'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="hero-slide-button-text" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">نص الزر</label>
                                    <input id="hero-slide-button-text" required className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white font-bold" value={editingSlide?.buttonText || ''} onChange={e => setEditingSlide({...editingSlide, buttonText: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="hero-slide-link" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">الرابط</label>
                                    <select id="hero-slide-link" className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white font-bold" value={editingSlide?.link || 'showcase'} onChange={e => setEditingSlide({...editingSlide, link: e.target.value})}>
                                        <option value="showcase">المعرض</option>
                                        <option value="services">الخدمات</option>
                                        <option value="blog">المدونة</option>
                                        <option value="contact">اتصل بنا</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-4 cursor-pointer p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <input type="checkbox" className="w-6 h-6 rounded-lg accent-amber-500" checked={editingSlide?.active || false} onChange={e => setEditingSlide({...editingSlide, active: e.target.checked})} />
                                    <span className="text-sm font-black text-gray-300">تفعيل في الصفحة الرئيسية</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <button type="submit" disabled={isImageProcessing} className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-2xl hover:bg-amber-400 transition-all text-xl disabled:opacity-50 disabled:cursor-not-allowed">{isImageProcessing ? 'جاري رفع الصورة...' : 'حفظ التغييرات'}</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-white/5 text-gray-400 font-bold rounded-2xl border border-white/10">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.hero_mgmt.title}
                sections={helpContent.hero_mgmt.sections}
            />
        </div>
    );
};

export default HeroManagementPage;
