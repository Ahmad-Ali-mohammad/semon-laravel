
import React, { useState, useRef } from 'react';
import { PromotionalCard } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, TagIcon, CalendarIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ConfirmationModal';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';
import { useDatabase } from '../../contexts/DatabaseContext';
import { api } from '../../services/api';

const OffersManagementPage: React.FC = () => {
    const { promotions, addPromotion, deletePromotion, togglePromotionVisibility } = useDatabase();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Partial<PromotionalCard> | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | number | null }>({
        isOpen: false,
        id: null
    });
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const normalizeOffer = (offer: any): PromotionalCard => ({
        id: offer.id,
        title: offer.title,
        description: offer.description || '',
        imageUrl: offer.imageUrl || offer.image_url,
        discountPercentage: offer.discountPercentage ?? offer.discount_percentage,
        startDate: offer.startDate || offer.start_date,
        endDate: offer.endDate || offer.end_date,
        startTime: offer.startTime || offer.start_time,
        endTime: offer.endTime || offer.end_time,
        isActive: offer.isActive ?? offer.is_active ?? true,
        targetCategory: offer.targetCategory || offer.target_category,
        buttonText: offer.buttonText || offer.button_text,
        buttonLink: offer.buttonLink || offer.button_link
    });

    const offers = promotions.map(normalizeOffer);

    const getOfferDateTime = (offer: PromotionalCard, isEnd: boolean) => {
        const dateValue = isEnd ? offer.endDate : offer.startDate;
        const timeValue = (isEnd ? offer.endTime : offer.startTime) || (isEnd ? '23:59' : '00:00');
        const parsed = new Date(`${dateValue}T${timeValue}:00`);
        if (Number.isNaN(parsed.getTime())) {
            return new Date(dateValue);
        }
        return parsed;
    };

    const handleOpenModal = (offer?: PromotionalCard) => {
        setSelectedImageFile(null);
        if (offer) {
            setEditingOffer({ ...offer });
        } else {
            setEditingOffer({
                title: '',
                description: '',
                imageUrl: '',
                discountPercentage: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '00:00',
                endTime: '23:59',
                isActive: true,
                targetCategory: 'all',
                buttonText: 'تسوق الآن',
                buttonLink: ''
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
            setEditingOffer(prev => ({ ...prev, imageUrl: previewUrl }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOffer) {
            if (!editingOffer.title || (!editingOffer.imageUrl && !selectedImageFile) || !editingOffer.startDate || !editingOffer.endDate) {
                alert('يرجى ملء جميع الحقول المطلوبة ورفع صورة');
                return;
            }

            let imageUrlToSave = editingOffer.imageUrl || '';

            try {
                if (selectedImageFile) {
                    setIsImageProcessing(true);
                    const uploaded = await api.uploadMedia(selectedImageFile);
                    imageUrlToSave = uploaded.url;
                    setIsImageProcessing(false);
                }

                const payload = {
                    ...(editingOffer.id ? { id: editingOffer.id } : {}),
                    title: editingOffer.title,
                    description: editingOffer.description || '',
                    imageUrl: imageUrlToSave,
                    discountPercentage: Number(editingOffer.discountPercentage) || 0,
                    startDate: editingOffer.startDate,
                    endDate: editingOffer.endDate,
                    startTime: editingOffer.startTime || '00:00',
                    endTime: editingOffer.endTime || '23:59',
                    isActive: editingOffer.isActive ?? true,
                    targetCategory: editingOffer.targetCategory || 'all',
                    buttonText: editingOffer.buttonText || 'تسوق الآن',
                    buttonLink: editingOffer.buttonLink || ''
                };

                await addPromotion(payload as PromotionalCard);
                setIsModalOpen(false);
                setEditingOffer(null);
                setSelectedImageFile(null);
            } catch (error) {
                setIsImageProcessing(false);
                const reason = error instanceof Error ? error.message : 'خطأ غير معروف';
                alert(`تعذر حفظ العرض: ${reason}`);
            }
        }
    };

    const handleDeleteClick = (id: string | number) => {
        setConfirmDelete({ isOpen: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id) {
            deletePromotion(confirmDelete.id);
        }
        setConfirmDelete({ isOpen: false, id: null });
    };

    const toggleOfferStatus = (id: string | number) => {
        togglePromotionVisibility(id);
    };

    const isOfferActive = (offer: PromotionalCard) => {
        if (!offer.isActive) return false;
        const now = new Date();
        const start = getOfferDateTime(offer, false);
        const end = getOfferDateTime(offer, true);
        return now >= start && now <= end;
    };

    const getOfferBorderClass = (active: boolean, expired: boolean): string => {
        if (active) return 'border-green-500/30';
        if (expired) return 'border-gray-500/30';
        return 'border-white/10';
    };

    const getOfferStatusBadgeClass = (active: boolean, scheduled: boolean): string => {
        if (active) return 'bg-green-500/10 text-green-400 border-green-500/20';
        if (scheduled) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    const getOfferStatusLabel = (active: boolean, scheduled: boolean): string => {
        if (active) return '🟢 نشط';
        if (scheduled) return '🔵 مجدول';
        return '⚫ منتهي';
    };

    const activeOffers = offers.filter(isOfferActive);
    const scheduledOffers = offers.filter(o => o.isActive && getOfferDateTime(o, false) > new Date());
    const expiredOffers = offers.filter(o => getOfferDateTime(o, true) < new Date());

    return (
        <div className="animate-fade-in relative space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">إدارة العروض الترويجية</h1>
                    <p className="text-gray-400">تحكم في بطاقات العروض والتوقيت</p>
                </div>
                <div className="flex gap-3">
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 bg-amber-500 text-gray-900 font-black py-3.5 px-8 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة عرض جديد</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-1">العروض النشطة</p>
                            <p className="text-3xl font-black text-green-400 font-poppins">{activeOffers.length}</p>
                        </div>
                        <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl">
                            <TagIcon className="w-8 h-8" />
                        </div>
                    </div>
                </div>
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-1">العروض المجدولة</p>
                            <p className="text-3xl font-black text-blue-400 font-poppins">{scheduledOffers.length}</p>
                        </div>
                        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
                            <CalendarIcon className="w-8 h-8" />
                        </div>
                    </div>
                </div>
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-bold mb-1">العروض المنتهية</p>
                            <p className="text-3xl font-black text-gray-500 font-poppins">{expiredOffers.length}</p>
                        </div>
                        <div className="p-4 bg-gray-500/10 text-gray-500 rounded-2xl">
                            <CalendarIcon className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Offers List */}
            <div className="space-y-6">
                {offers.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 font-bold border-2 border-dashed border-white/5 rounded-[2rem] glass-medium">
                        <TagIcon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                        <p>لا توجد عروض ترويجية. ابدأ بإضافة عرضك الأول!</p>
                    </div>
                ) : (
                    offers.map(offer => {
                        const active = isOfferActive(offer);
                        const scheduled = offer.isActive && getOfferDateTime(offer, false) > new Date();
                        const expired = getOfferDateTime(offer, true) < new Date();

                        return (
                            <div
                                key={offer.id}
                                className={`glass-dark border rounded-[2rem] p-6 group hover:border-amber-500/30 transition-all shadow-xl ${
                                    getOfferBorderClass(active, expired)
                                }`}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                        <img
                                            src={offer.imageUrl}
                                            alt={offer.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-black mb-2 group-hover:text-amber-400 transition-colors">
                                                    {offer.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm">{offer.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(offer)}
                                                    className="p-3 bg-white/5 text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all border border-white/5"
                                                    aria-label={`تعديل ${offer.title}`}
                                                >
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(offer.id)}
                                                    className="p-3 bg-red-500/5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-red-500/10"
                                                    aria-label={`حذف ${offer.title}`}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {offer.discountPercentage && offer.discountPercentage > 0 && (
                                                <span className="px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-black">
                                                    خصم {offer.discountPercentage}%
                                                </span>
                                            )}
                                            <span className="px-4 py-1.5 bg-white/5 text-gray-300 border border-white/5 rounded-xl text-sm font-bold">
                                                {offer.targetCategory === 'all' ? 'جميع الفئات' : offer.targetCategory}
                                            </span>
                                            <span
                                                className={`px-4 py-1.5 rounded-xl text-sm font-black border ${
                                                    getOfferStatusBadgeClass(active, scheduled)
                                                }`}
                                            >
                                                {getOfferStatusLabel(active, scheduled)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>من: {offer.startDate}{offer.startTime ? ` ${offer.startTime}` : ''}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>إلى: {offer.endDate}{offer.endTime ? ` ${offer.endTime}` : ''}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => toggleOfferStatus(offer.id)}
                                                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                                                    offer.isActive
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20'
                                                }`}
                                            >
                                                {offer.isActive ? '✓ مفعل' : '✗ معطل'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذا العرض الترويجي؟ لا يمكن التراجع عن هذه العملية."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
            />

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="إغلاق نافذة العرض"
                    />
                    <form
                        onSubmit={handleSave}
                        className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0f1117]"
                    >
                        <h2 className="text-4xl font-black mb-10 text-white tracking-tighter">
                            {editingOffer?.id && offers.some(o => o.id === editingOffer.id) ? 'تحديث العرض الترويجي' : 'إضافة عرض ترويجي جديد'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-right">
                            {/* Image Upload */}
                            <div className="md:col-span-1 space-y-6">
                                <label htmlFor="offer-image-upload" className="block text-xs font-black text-amber-500 uppercase tracking-widest">صورة العرض</label>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    aria-label="رفع صورة العرض"
                                    className="relative aspect-square w-full rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-all overflow-hidden group"
                                >
                                    {editingOffer?.imageUrl ? (
                                        <img src={editingOffer.imageUrl} alt={editingOffer.title || 'صورة العرض'} className="w-full h-full object-cover" />
                                    ) : (
                                        <PlusIcon className="w-12 h-12 text-gray-600" />
                                    )}
                                    {isImageProcessing && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
                                        </div>
                                    )}
                                </button>
                                <input id="offer-image-upload" type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} aria-label="اختيار صورة العرض" />
                            </div>

                            {/* Form Fields */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <label htmlFor="offer-title" className="text-xs font-black text-amber-500 uppercase mb-2 block">عنوان العرض <span className="text-red-500">*</span></label>
                                    <input
                                        id="offer-title"
                                        required
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                        value={editingOffer?.title || ''}
                                        onChange={e => setEditingOffer({ ...editingOffer, title: e.target.value })}
                                        placeholder="مثلاً: خصم 50% على جميع الثعابين"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="offer-description" className="text-xs font-black text-amber-500 uppercase mb-2 block">الوصف</label>
                                    <textarea
                                        id="offer-description"
                                        rows={3}
                                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white resize-none"
                                        value={editingOffer?.description || ''}
                                        onChange={e => setEditingOffer({ ...editingOffer, description: e.target.value })}
                                        placeholder="اكتب وصفاً تفصيلياً للعرض..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="offer-discount" className="text-xs font-black text-amber-500 uppercase mb-2 block">نسبة الخصم (%)</label>
                                        <input
                                            id="offer-discount"
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                            value={editingOffer?.discountPercentage || 0}
                                            onChange={e => setEditingOffer({ ...editingOffer, discountPercentage: Number(e.target.value) })}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="offer-target-category" className="text-xs font-black text-amber-500 uppercase mb-2 block">الفئة المستهدفة</label>
                                        <input
                                            id="offer-target-category"
                                            type="text"
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                            value={editingOffer?.targetCategory || 'all'}
                                            onChange={e => setEditingOffer({ ...editingOffer, targetCategory: e.target.value })}
                                            placeholder="all, snake, lizard, turtle"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="offer-start-date" className="text-xs font-black text-amber-500 uppercase mb-2 block">تاريخ البداية <span className="text-red-500">*</span></label>
                                        <input
                                            id="offer-start-date"
                                            type="date"
                                            required
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                            value={editingOffer?.startDate || ''}
                                            onChange={e => setEditingOffer({ ...editingOffer, startDate: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="offer-end-date" className="text-xs font-black text-amber-500 uppercase mb-2 block">تاريخ الانتهاء <span className="text-red-500">*</span></label>
                                        <input
                                            id="offer-end-date"
                                            type="date"
                                            required
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                            value={editingOffer?.endDate || ''}
                                            onChange={e => setEditingOffer({ ...editingOffer, endDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="offer-start-time" className="text-xs font-black text-amber-500 uppercase mb-2 block">Start time</label>
                                        <input
                                            id="offer-start-time"
                                            type="time"
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                            value={editingOffer?.startTime || ''}
                                            onChange={e => setEditingOffer({ ...editingOffer, startTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="offer-end-time" className="text-xs font-black text-amber-500 uppercase mb-2 block">End time</label>
                                        <input
                                            id="offer-end-time"
                                            type="time"
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                            value={editingOffer?.endTime || ''}
                                            onChange={e => setEditingOffer({ ...editingOffer, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="offer-button-text" className="text-xs font-black text-amber-500 uppercase mb-2 block">نص الزر</label>
                                        <input
                                            id="offer-button-text"
                                            type="text"
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                            value={editingOffer?.buttonText || ''}
                                            onChange={e => setEditingOffer({ ...editingOffer, buttonText: e.target.value })}
                                            placeholder="تسوق الآن"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="offer-button-link" className="text-xs font-black text-amber-500 uppercase mb-2 block">رابط الزر</label>
                                        <input
                                            id="offer-button-link"
                                            type="text"
                                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                            value={editingOffer?.buttonLink || ''}
                                            onChange={e => setEditingOffer({ ...editingOffer, buttonLink: e.target.value })}
                                            placeholder="/showcase"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingOffer?.isActive !== false}
                                            onChange={e => setEditingOffer({ ...editingOffer, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/20 bg-transparent text-amber-500 focus:ring-amber-500"
                                        />
                                        <span className="text-white font-bold">تفعيل العرض</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-12">
                            <button type="submit" className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-amber-400 shadow-2xl text-lg">
                                حفظ العرض
                            </button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-white/5 text-gray-400 font-black rounded-[1.5rem] border border-white/5">
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.offers.title}
                sections={helpContent.offers.sections}
            />
        </div>
    );
};

export default OffersManagementPage;





