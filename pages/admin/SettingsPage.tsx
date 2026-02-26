import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import { 
    SettingsIcon, 
    StoreIcon, 
    BellIcon, 
    LockIcon, 
    PaletteIcon, 
    SaveIcon, 
    RefreshIcon
} from '../../components/icons';

const SettingsPage: React.FC = () => {
    const { prefs, updateAllPrefs } = usePreferences();
    const { companyInfo, contactInfo, updateCompanyInfo, updateContactInfo } = useDatabase();
    const [activeTab, setActiveTab ] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    
    // Local state for the form to avoid too many context updates while typing
    const [settings, setSettings] = useState({
        storeName: '',
        storeEmail: '',
        storePhone: '',
        storeAddress: '',
        storeCurrency: 'USD',
        storeLanguage: 'ar',
        enableNotifications: true,
        maintenanceMode: false,
        allowGuestCheckout: false,
        requireEmailVerification: true,
        defaultUserRole: 'user',
        taxRate: 10,
        shippingFee: 15,
        freeShippingThreshold: 100,
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
        },
        theme: 'dark' as 'dark' | 'light'
    });

    useEffect(() => {
        setSettings({
            storeName: companyInfo?.name || '',
            storeEmail: contactInfo?.email || '',
            storePhone: contactInfo?.phone || '',
            storeAddress: contactInfo?.address || '',
            storeCurrency: prefs.currency,
            storeLanguage: prefs.language,
            enableNotifications: prefs.notificationsEnabled,
            maintenanceMode: prefs.maintenanceMode,
            allowGuestCheckout: prefs.allowGuestCheckout,
            requireEmailVerification: prefs.requireEmailVerification,
            defaultUserRole: prefs.defaultUserRole,
            taxRate: prefs.taxRate,
            shippingFee: prefs.shippingFee,
            freeShippingThreshold: prefs.freeShippingThreshold,
            socialLinks: {
                facebook: contactInfo?.socialMedia?.facebook || '',
                instagram: contactInfo?.socialMedia?.instagram || '',
                twitter: (contactInfo?.socialMedia as any)?.twitter || '',
                youtube: (contactInfo?.socialMedia as any)?.youtube || ''
            },
            theme: prefs.theme
        });
    }, [companyInfo, contactInfo, prefs]);

    const tabs = [
        { id: 'general', label: 'إعدادات المتجر', icon: <StoreIcon className="w-5 h-5" /> },
        { id: 'notifications', label: 'الإشعارات', icon: <BellIcon className="w-5 h-5" /> },
        { id: 'security', label: 'الأمان والنظام', icon: <LockIcon className="w-5 h-5" /> },
        { id: 'appearance', label: 'المظهر', icon: <PaletteIcon className="w-5 h-5" /> }
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Update Company Info (Name)
            if (companyInfo) {
                await updateCompanyInfo({ ...companyInfo, name: settings.storeName });
            }

            // 2. Update Contact Info
            if (contactInfo) {
                await updateContactInfo({
                    ...contactInfo,
                    email: settings.storeEmail,
                    phone: settings.storePhone,
                    address: settings.storeAddress,
                    socialMedia: {
                        ...contactInfo.socialMedia,
                        facebook: settings.socialLinks.facebook,
                        instagram: settings.socialLinks.instagram,
                        whatsapp: (contactInfo.socialMedia as any).whatsapp,
                        telegram: (contactInfo.socialMedia as any).telegram,
                    }
                });
            }

            // 3. Update Preferences
            await updateAllPrefs({
                ...prefs,
                language: settings.storeLanguage as 'ar' | 'en',
                theme: settings.theme,
                notificationsEnabled: settings.enableNotifications,
                currency: settings.storeCurrency,
                taxRate: settings.taxRate,
                shippingFee: settings.shippingFee,
                freeShippingThreshold: settings.freeShippingThreshold,
                maintenanceMode: settings.maintenanceMode,
                allowGuestCheckout: settings.allowGuestCheckout,
                requireEmailVerification: settings.requireEmailVerification,
                defaultUserRole: settings.defaultUserRole
            });

            alert('تم حفظ الإعدادات بنجاح');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('حدث خطأ أثناء حفظ الإعدادات');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (globalThis.confirm('هل أنت متأكد من إعادة تعيين التغييرات الحالية')) {
            // Restore from context
            setSettings({
                storeName: companyInfo?.name || '',
                storeEmail: contactInfo?.email || '',
                storePhone: contactInfo?.phone || '',
                storeAddress: contactInfo?.address || '',
                storeCurrency: prefs.currency,
                storeLanguage: prefs.language,
                enableNotifications: prefs.notificationsEnabled,
                maintenanceMode: prefs.maintenanceMode,
                allowGuestCheckout: prefs.allowGuestCheckout,
                requireEmailVerification: prefs.requireEmailVerification,
                defaultUserRole: prefs.defaultUserRole,
                taxRate: prefs.taxRate,
                shippingFee: prefs.shippingFee,
                freeShippingThreshold: prefs.freeShippingThreshold,
                socialLinks: {
                    facebook: contactInfo?.socialMedia?.facebook || '',
                    instagram: contactInfo?.socialMedia?.instagram || '',
                    twitter: (contactInfo?.socialMedia as any)?.twitter || '',
                    youtube: (contactInfo?.socialMedia as any)?.youtube || ''
                },
                theme: prefs.theme
            });
        }
    };

    const renderGeneralTab = () => (
        <div className="space-y-10 animate-fade-in">
            <section aria-labelledby="basic-info-heading">
                <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2" id="basic-info-heading">
                    <span className="w-8 h-[2px] bg-amber-500/30"></span>
                    {' '}البيانات الأساسية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="store-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">اسم المتجر</label>
                        <input
                            id="store-name"
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                            placeholder="اسم المتجر"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="store-email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">البريد الإلكتروني للاتصال</label>
                        <input
                            id="store-email"
                            type="email"
                            value={settings.storeEmail}
                            onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>
            </section>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-10 animate-fade-in">
            <section aria-labelledby="notif-prefs-heading">
                <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2" id="notif-prefs-heading">
                    <span className="w-8 h-[2px] bg-amber-500/30"></span>
                    {' '}تفضيلات التنبيهات
                </h3>
                <div className="space-y-6">
                    <button 
                        type="button"
                        className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group text-right"
                        onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}>
                        <div>
                            <h4 className="font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">تفعيل الإشعارات العامة</h4>
                            <p className="text-xs text-gray-500 font-bold">استلام تنبيهات حول الطلبات والرسائل الجديدة</p>
                        </div>
                        <div
                            aria-label={settings.enableNotifications ? 'تعطيل الإشعارات' : 'تفعيل الإشعارات'}
                            className={`w-14 h-7 rounded-full transition-all relative border ${settings.enableNotifications ? 'bg-amber-500 border-amber-600' : 'bg-gray-800 border-gray-700'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${settings.enableNotifications ? 'right-7' : 'right-1'}`} />
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-10 animate-fade-in">
            <section aria-labelledby="system-status-heading">
                <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2" id="system-status-heading">
                    <span className="w-8 h-[2px] bg-amber-500/30"></span>
                    {' '}حالة النظام
                </h3>
                <div className="space-y-6">
                    <button 
                        type="button"
                        className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group text-right"
                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}>
                        <div>
                            <h4 className="font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">وضع الصيانة</h4>
                            <p className="text-xs text-gray-500 font-bold">إيقاف الموقع مؤقتا لأعمال التطوير</p>
                        </div>
                        <div
                            aria-label={settings.maintenanceMode ? 'إيقاف وضع الصيانة' : 'تفعيل وضع الصيانة'}
                            className={`w-14 h-7 rounded-full transition-all relative border ${settings.maintenanceMode ? 'bg-amber-500 border-amber-600' : 'bg-gray-800 border-gray-700'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'right-7' : 'right-1'}`} />
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className="space-y-10 animate-fade-in">
            <section aria-labelledby="appearance-custom-heading">
                <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2" id="appearance-custom-heading">
                    <span className="w-8 h-[2px] bg-amber-500/30"></span>
                    {' '}تخصيص المظهر
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">سمة الألوان</span>
                        <div className="flex items-center gap-6">
                            <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                                className={`flex-1 p-6 rounded-3xl border-2 transition-all group ${settings.theme === 'dark' ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gray-900 mb-4 mx-auto flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full border-2 border-amber-500"></div>
                                </div>
                                <span className="font-bold text-xs uppercase block">الوضع الداكن</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, theme: 'light' })}
                                className={`flex-1 p-6 rounded-3xl border-2 transition-all group ${settings.theme === 'light' ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white mb-4 mx-auto flex items-center justify-center shadow-lg">
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-900"></div>
                                </div>
                                <span className="font-bold text-xs uppercase block">الوضع الفاتح</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneralTab();
            case 'notifications': return renderNotificationsTab();
            case 'security': return renderSecurityTab();
            case 'appearance': return renderAppearanceTab();
            default: return null;
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-black text-white flex items-center gap-4">
                        <div className="p-3 bg-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            <SettingsIcon className="w-8 h-8 text-gray-900" />
                        </div>
                        إعدادات النظام
                    </h2>
                    <p className="text-gray-500 font-bold mt-2 mr-16">تحكم في هوية المتجر القواعد الضريبية وتفضيلات العرض.</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        type="button"
                        onClick={handleReset}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black px-8 py-4 rounded-2xl transition-all border border-white/5"
                    >
                        <RefreshIcon className="w-5 h-5" />
                        إلغاء التعديلات
                    </button>
                    <button 
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 font-black px-10 py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <SaveIcon className="w-5 h-5" />
                        )}
                        حفظ جميع الإعدادات
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10">
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 h-fit sticky top-10">
                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all text-right group ${
                                    activeTab === tab.id 
                                    ? 'bg-amber-500 text-gray-900 font-black shadow-lg translate-x-[-10px]' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className={`${activeTab === tab.id ? 'text-gray-900' : 'text-amber-500'} transition-colors`}>
                                    {tab.icon}
                                </span>
                                <span className="flex-1 text-sm font-bold uppercase tracking-wider">{tab.label}</span>
                                {activeTab === tab.id && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-10 pt-6 border-t border-white/5">
                        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">إصدار النظام</h4>
                            <p className="text-xl font-black text-white font-poppins">v2.4.0 <span className="text-[8px] opacity-30">PRO</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-16">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
