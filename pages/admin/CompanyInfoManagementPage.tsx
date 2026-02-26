
import React, { useState, useEffect } from 'react';
import { CompanyInfo } from '../../types';
import { useDatabase } from '../../contexts/DatabaseContext';
import { EditIcon, CheckCircleIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';
import { api } from '../../services/api';

const CompanyInfoManagementPage: React.FC = () => {
    const { companyInfo, updateCompanyInfo } = useDatabase();
    const [isEditing, setIsEditing] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [editedInfo, setEditedInfo] = useState<CompanyInfo>(companyInfo || {
        name: '',
        nameEnglish: '',
        description: '',
        foundedYear: 2026,
        mission: '',
        vision: '',
        story: '',
        logoUrl: '',
        mascotUrl: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isImageProcessing, setIsImageProcessing] = useState<{ logo: boolean; mascot: boolean }>({
        logo: false,
        mascot: false
    });
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const [selectedMascotFile, setSelectedMascotFile] = useState<File | null>(null);

    useEffect(() => {
        if (companyInfo) {
            setEditedInfo(companyInfo);
            setSelectedLogoFile(null);
            setSelectedMascotFile(null);
        }
    }, [companyInfo]);

    const handleImageChange = (type: 'logo' | 'mascot', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('حجم الصورة كبير جداً. الحد الأقصى 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('يرجى رفع صورة فقط');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        if (type === 'logo') {
            setSelectedLogoFile(file);
            setEditedInfo(prev => ({ ...prev, logoUrl: previewUrl }));
        } else {
            setSelectedMascotFile(file);
            setEditedInfo(prev => ({ ...prev, mascotUrl: previewUrl }));
        }
    };

    const handleSave = async () => {
        if (!editedInfo.name || !editedInfo.nameEnglish || !editedInfo.description) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        setIsSaving(true);
        try {
            let logoUrl = editedInfo.logoUrl;
            let mascotUrl = editedInfo.mascotUrl;

            if (selectedLogoFile) {
                setIsImageProcessing(prev => ({ ...prev, logo: true }));
                const uploadedLogo = await api.uploadMedia(selectedLogoFile);
                logoUrl = uploadedLogo.url;
                setIsImageProcessing(prev => ({ ...prev, logo: false }));
            }

            if (selectedMascotFile) {
                setIsImageProcessing(prev => ({ ...prev, mascot: true }));
                const uploadedMascot = await api.uploadMedia(selectedMascotFile);
                mascotUrl = uploadedMascot.url;
                setIsImageProcessing(prev => ({ ...prev, mascot: false }));
            }

            await updateCompanyInfo({ ...editedInfo, logoUrl, mascotUrl });
            setIsEditing(false);
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            setIsSaving(false);
            setIsImageProcessing({ logo: false, mascot: false });
            const reason = error instanceof Error ? error.message : 'خطأ غير معروف';
            alert(`تعذر حفظ معلومات الشركة: ${reason}`);
        }
    };

    const handleCancel = () => {
        if (companyInfo) setEditedInfo(companyInfo);
        setSelectedLogoFile(null);
        setSelectedMascotFile(null);
        setIsEditing(false);
    };

    if (!isEditing) {
        if (!companyInfo) return <div className="p-8 text-center text-gray-500">جاري تحميل المعلومات...</div>;
        return (
            <div className="animate-fade-in relative space-y-8 text-right">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">معلومات الشركة</h1>
                        <p className="text-gray-400">إدارة معلومات الشركة والعلامة التجارية</p>
                    </div>
                    <div className="flex gap-3">
                        <HelpButton onClick={() => setIsHelpOpen(true)} />
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-3 bg-amber-500 text-gray-900 font-black py-3.5 px-8 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                        >
                            <EditIcon className="w-5 h-5" />
                            <span>تعديل المعلومات</span>
                        </button>
                    </div>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-6 text-amber-400">معلومات أساسية</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">الاسم بالعربية</p>
                                <p className="text-white font-bold text-lg">{companyInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">الاسم بالإنجليزية</p>
                                <p className="text-white font-bold text-lg font-poppins">{companyInfo.nameEnglish}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">سنة التأسيس</p>
                                <p className="text-white font-bold text-lg font-poppins">{companyInfo.foundedYear}</p>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-6 text-amber-400">الصور والشعارات</h3>
                        <div className="space-y-4">
                            {companyInfo.logoUrl && (
                                <div>
                                    <p className="text-gray-500 text-sm mb-2">الشعار (Logo)</p>
                                    <img src={companyInfo.logoUrl} alt="Logo" className="w-32 h-32 object-contain bg-white/5 rounded-xl p-4" />
                                </div>
                            )}
                            {companyInfo.mascotUrl && (
                                <div>
                                    <p className="text-gray-500 text-sm mb-2">الماسكوت</p>
                                    <img src={companyInfo.mascotUrl} alt="Mascot" className="w-full h-40 object-cover rounded-xl" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Width Cards */}
                <div className="space-y-6">
                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">وصف الشركة</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.description}</p>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">الرسالة</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.mission}</p>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">الرؤية</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.vision}</p>
                    </div>

                    <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 text-amber-400">قصتنا</h3>
                        <p className="text-gray-300 leading-relaxed">{companyInfo.story}</p>
                    </div>
                </div>

                {/* Help Modal */}
                <HelpModal
                    isOpen={isHelpOpen}
                    onClose={() => setIsHelpOpen(false)}
                    title={helpContent.company_info.title}
                    sections={helpContent.company_info.sections}
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in relative space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">تعديل معلومات الشركة</h1>
                    <p className="text-gray-400">قم بتحديث معلومات الشركة وحفظ التغييرات</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>

            {showSuccess && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in z-50">
                    <div className="flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6" />
                        <p className="font-bold">تم حفظ المعلومات بنجاح!</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">معلومات أساسية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="company-name-ar" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                اسم الشركة (عربي) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="company-name-ar"
                                type="text"
                                required
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold"
                                value={editedInfo.name}
                                onChange={e => setEditedInfo({ ...editedInfo, name: e.target.value })}
                                placeholder="بيت الزواحف"
                            />
                        </div>
                        <div>
                            <label htmlFor="company-name-en" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                اسم الشركة (إنجليزي) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="company-name-en"
                                type="text"
                                required
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                value={editedInfo.nameEnglish}
                                onChange={e => setEditedInfo({ ...editedInfo, nameEnglish: e.target.value })}
                                placeholder="Reptile House"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="company-founded-year" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                سنة التأسيس
                            </label>
                            <input
                                id="company-founded-year"
                                type="number"
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold font-poppins"
                                value={editedInfo.foundedYear}
                                onChange={e => setEditedInfo({ ...editedInfo, foundedYear: Number(e.target.value) })}
                                placeholder="2020"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">الصور والشعارات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo */}
                        <div>
                            <label htmlFor="company-logo-upload" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                شعار الشركة (Logo)
                            </label>
                            <div className="relative">
                                {editedInfo.logoUrl ? (
                                    <div className="relative w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                        <img src={editedInfo.logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                                        {isImageProcessing.logo && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">لا توجد صورة</p>
                                    </div>
                                )}
                                <input
                                    id="company-logo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleImageChange('logo', e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="رفع شعار الشركة"
                                />
                            </div>
                        </div>

                        {/* Mascot */}
                        <div>
                            <label htmlFor="company-mascot-upload" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                الماسكوت
                            </label>
                            <div className="relative">
                                {editedInfo.mascotUrl ? (
                                    <div className="relative w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                        <img src={editedInfo.mascotUrl} alt="Mascot" className="w-full h-full object-cover" />
                                        {isImageProcessing.mascot && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">لا توجد صورة</p>
                                    </div>
                                )}
                                <input
                                    id="company-mascot-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleImageChange('mascot', e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    aria-label="رفع صورة الماسكوت"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Fields */}
                <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xl font-black mb-6 text-amber-400">النصوص والمحتوى</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="company-description" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                وصف الشركة <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="company-description"
                                required
                                rows={3}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.description}
                                onChange={e => setEditedInfo({ ...editedInfo, description: e.target.value })}
                                placeholder="نحن أكثر من مجرد متجر..."
                            />
                        </div>

                        <div>
                            <label htmlFor="company-mission" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                رسالتنا
                            </label>
                            <textarea
                                id="company-mission"
                                rows={4}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.mission}
                                onChange={e => setEditedInfo({ ...editedInfo, mission: e.target.value })}
                                placeholder="توفير زواحف صحية..."
                            />
                        </div>

                        <div>
                            <label htmlFor="company-vision" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                رؤيتنا
                            </label>
                            <textarea
                                id="company-vision"
                                rows={4}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.vision}
                                onChange={e => setEditedInfo({ ...editedInfo, vision: e.target.value })}
                                placeholder="أن نكون المركز الإقليمي الأول..."
                            />
                        </div>

                        <div>
                            <label htmlFor="company-story" className="text-xs font-black text-gray-400 uppercase mb-2 block">
                                قصتنا
                            </label>
                            <textarea
                                id="company-story"
                                rows={6}
                                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 text-white leading-relaxed resize-none"
                                value={editedInfo.story}
                                onChange={e => setEditedInfo({ ...editedInfo, story: e.target.value })}
                                placeholder="تأسس Reptile House عام..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 sticky bottom-6 bg-gradient-to-t from-[#0a0c10] pt-8 pb-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-amber-400 shadow-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-10 bg-white/5 text-gray-400 font-black rounded-[1.5rem] border border-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    إلغاء
                </button>
            </div>

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.company_info.title}
                sections={helpContent.company_info.sections}
            />
        </div>
    );
};

export default CompanyInfoManagementPage;
