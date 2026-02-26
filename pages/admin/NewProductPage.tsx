
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Reptile } from '../../types';
import { PlusIcon, StarIcon } from '../../components/icons';
import { DashboardPage } from './DashboardLayout';
import { defaultCategories, defaultSpecies } from '../../constants';
import { api } from '../../services/api';

interface NewProductPageProps {
    setActivePage: (page: DashboardPage) => void;
}

const NewProductPage: React.FC<NewProductPageProps> = ({ setActivePage }) => {
    const { addProduct, products, customCategories, customSpecies, addCustomCategory, addCustomSpecies } = useDatabase();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [customCategoriesList, setCustomCategoriesList] = useState<any[]>([]);
    const [customSpeciesList, setCustomSpeciesList] = useState<string[]>([]);

    useEffect(() => {
        setCustomCategoriesList(customCategories || []);
        setCustomSpeciesList((customSpecies || []).map((s) => s.name));
    }, [customCategories, customSpecies]);

    const existingCategories = useMemo(() => {
        const cats = new Set<string>(products.map(p => p.category));
        const combined = [...defaultCategories, ...customCategoriesList];
        for (const c of cats) {
            if (!combined.some(dc => dc.value === c)) {
                combined.push({ value: c, label: c });
            }
        }
        return combined;
    }, [products, customCategoriesList]);

    const existingSpecies = useMemo(() => {
        const allSpecies = [...defaultSpecies, ...customSpeciesList, ...products.map(p => p.species)];
        const specSet = new Set<string>(allSpecies);
        return Array.from(specSet).sort((a, b) => a.localeCompare(b, 'ar'));
    }, [products, customSpeciesList]);

    const [formData, setFormData] = useState<Partial<Reptile>>({
        name: '',
        species: existingSpecies[0] || '',
        price: 0,
        imageUrl: '',
        category: 'snake',
        status: 'متوفر',
        isAvailable: true,
        rating: 5,
        description: ''
    });

    const [isNewCategory, setIsNewCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [isNewSpecies, setIsNewSpecies] = useState(false);
    const [customSpeciesInput, setCustomSpeciesInput] = useState('');

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        const finalCategory = isNewCategory ? customCategory : formData.category;
        const finalSpecies = isNewSpecies ? customSpeciesInput : formData.species;

        if (!formData.name?.trim()) errors.name = 'الاسم مطلوب';
        if (!formData.imageUrl && !selectedImageFile) errors.image = 'الصورة مطلوبة';
        if (!formData.price || formData.price <= 0) errors.price = 'السعر يجب أن يكون أكبر من صفر';
        if (!finalSpecies) errors.species = 'الفصيلة مطلوبة';
        if (!finalCategory) errors.category = 'الفئة مطلوبة';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('حجم الصورة كبير جداً. الحد الأقصى 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('يرجى رفع صورة فقط');
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setSelectedImageFile(file);
        setPreviewImageUrl(localPreview);
        setValidationErrors(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const finalCategory = isNewCategory ? customCategory : formData.category;
        const finalSpecies = isNewSpecies ? customSpeciesInput : formData.species;
        let uploadedImageUrl = formData.imageUrl;

        // Save custom category/species to persistent storage
        if (isNewCategory && customCategory) {
            addCustomCategory({ value: customCategory, label: customCategory });
        }
        if (isNewSpecies && customSpeciesInput) {
            addCustomSpecies(customSpeciesInput);
        }

        try {
            if (selectedImageFile) {
                setIsImageProcessing(true);
                const uploaded = await api.uploadMedia(selectedImageFile);
                uploadedImageUrl = uploaded.url;
                setIsImageProcessing(false);
            }

            const newProduct: Reptile = {
                ...formData as Reptile,
                category: finalCategory,
                species: finalSpecies,
                imageUrl: uploadedImageUrl || ''
            };
            await addProduct(newProduct);

            // Show success
            setShowSuccess(true);

            setTimeout(() => {
                setIsSubmitting(false);
                setActivePage('products');
            }, 1500);
        } catch (error) {
            setIsSubmitting(false);
            setIsImageProcessing(false);
            const reason = error instanceof Error ? error.message : 'خطأ غير معروف';
            alert(`فشل حفظ المنتج: ${reason}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            {/* Success Message */}
            {showSuccess && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in z-50">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="font-bold">تم إضافة المنتج بنجاح!</p>
                    </div>
                </div>
            )}

            <h1 className="text-4xl font-black mb-10 text-white">إضافة مخلوق جديد</h1>
            
            <form onSubmit={handleSubmit} className="glass-dark border border-white/10 rounded-[2.5rem] p-10 space-y-10 shadow-2xl bg-[#11141b]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Image Upload Zone */}
                    <div className="md:col-span-1 space-y-4">
                        <label htmlFor="image-upload-button" className="text-xs font-black text-amber-500 uppercase tracking-widest block">
                            صورة المخلوق <span className="text-red-500">*</span>
                        </label>
                        <button
                            id="image-upload-button"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`aspect-square w-full rounded-3xl border-2 border-dashed ${validationErrors.image ? 'border-red-500/50' : 'border-white/10'} bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all overflow-hidden relative group`}
                        >
                            {isImageProcessing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl z-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                                </div>
                            )}
                            {(previewImageUrl || formData.imageUrl) ? (
                                <>
                                    <img src={previewImageUrl || formData.imageUrl} alt={formData.name || "صورة المنتج"} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white text-xs font-black bg-amber-500 px-4 py-2 rounded-xl">تغيير الصورة</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <PlusIcon className="w-10 h-10 mx-auto text-gray-500 mb-2" />
                                    <p className="text-xs text-gray-400 font-bold">اضغط للرفع</p>
                                    <p className="text-[10px] text-gray-500 mt-1">الحد الأقصى: 5MB</p>
                                </div>
                            )}
                        </button>
                        {validationErrors.image && (
                            <p className="text-red-400 text-xs mt-1">{validationErrors.image}</p>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            id="product-image-upload"
                            aria-label="رفع صورة المنتج"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                            <label htmlFor="product-rating" className="text-xs font-black text-gray-500 uppercase block">تقييم مبدئي</label>
                            <div className="flex items-center gap-4">
                                <input
                                    id="product-rating"
                                    type="range" min="1" max="5" step="0.1"
                                    value={formData.rating}
                                    onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                                    className="flex-1 accent-amber-500"
                                    aria-label="تقييم المنتج"
                                />
                                <span className="font-poppins font-black text-amber-500 flex items-center gap-1">
                                    {formData.rating?.toFixed(1)} <StarIcon className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Fields */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label htmlFor="product-name" className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 block">
                                اسم المخلوق <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="product-name"
                                required
                                type="text"
                                className={`w-full bg-[#1a1c23] border ${validationErrors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 text-white`}
                                value={formData.name}
                                onChange={e => {
                                    setFormData({...formData, name: e.target.value});
                                    setValidationErrors(prev => ({ ...prev, name: '' }));
                                }}
                                placeholder="مثلاً: لونا، التنين الأحمر"
                            />
                            {validationErrors.name && (
                                <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                            )}
                        </div>

                        {/* Species Select */}
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="product-species" className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 block">
                                الفصيلة <span className="text-red-500">*</span>
                            </label>
                            {isNewSpecies ? (
                                <div className="flex gap-2">
                                    <input 
                                        autoFocus
                                        type="text"
                                        placeholder="اكتب اسم الفصيلة..."
                                        className="flex-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 text-white"
                                        value={customSpeciesInput}
                                        onChange={e => setCustomSpeciesInput(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setIsNewSpecies(false)}
                                        className="p-4 bg-white/5 rounded-xl text-gray-400 hover:text-white"
                                    >✕</button>
                                </div>
                            ) : (
                                <select
                                    id="product-species"
                                    className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer text-white"
                                    value={formData.species}
                                    onChange={e => {
                                        if (e.target.value === 'add_new') {
                                            setIsNewSpecies(true);
                                        } else {
                                            setFormData({...formData, species: e.target.value});
                                        }
                                    }}
                                >
                                    {existingSpecies.map(s => <option key={s} value={s}>{s}</option>)}
                                    <option value="add_new" className="text-amber-500 font-bold">+ إضافة فصيلة جديدة...</option>
                                </select>
                            )}
                        </div>

                        {/* Category Select */}
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="product-category" className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 block">الفئة</label>
                            {isNewCategory ? (
                                <div className="flex gap-2">
                                    <input 
                                        autoFocus
                                        type="text"
                                        placeholder="اسم الفئة..."
                                        className="flex-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 text-white"
                                        value={customCategory}
                                        onChange={e => setCustomCategory(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setIsNewCategory(false)}
                                        className="p-4 bg-white/5 rounded-xl text-gray-400 hover:text-white"
                                    >✕</button>
                                </div>
                            ) : (
                                <select
                                    id="product-category"
                                    className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer text-white"
                                    value={formData.category}
                                    onChange={e => {
                                        if (e.target.value === 'add_new') {
                                            setIsNewCategory(true);
                                        } else {
                                            setFormData({...formData, category: e.target.value});
                                        }
                                    }}
                                >
                                    {existingCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    <option value="add_new" className="text-amber-500 font-bold">+ إضافة فئة جديدة...</option>
                                </select>
                            )}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="product-price" className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 block">السعر الأساسي ($)</label>
                            <input
                                id="product-price"
                                required
                                type="number"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 font-poppins font-black text-white"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            />
                        </div>
                        
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="product-status" className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 block">حالة التوفر</label>
                            <select
                                id="product-status"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer text-white"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value, isAvailable: e.target.value === 'متوفر'})}
                            >
                                <option value="متوفر">متوفر للبيع</option>
                                <option value="قيد الحجز">قيد الحجز لعميل</option>
                                <option value="غير متوفر">غير متوفر حالياً</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="product-description" className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 block">وصف تفصيلي</label>
                            <textarea
                                id="product-description"
                                rows={5}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500/50 resize-none text-white"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="اكتب تفاصيل عن صحة الزاحف..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                    >
                        {isSubmitting ? 'جاري الإضافة...' : 'اعتماد وإدراج في المتجر'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActivePage('products')}
                        className="px-10 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewProductPage;
