
import React, { useEffect, useState } from 'react';
import { AppMode, Page } from '../../App';
import Sidebar from './Sidebar';
import AdminDashboardPage from './AdminDashboardPage';
import ProductsManagementPage from './ProductsManagementPage';
import OrdersManagementPage from './OrdersManagementPage';
import AnalyticsPage from './AnalyticsPage';
import InventoryPage from './InventoryPage';
import ShippingPage from './ShippingPage';
import UsersManagementPage from './UsersManagementPage';
import CustomersManagementPage from './CustomersManagementPage';
import MediaLibraryPage from './MediaLibraryPage';
import BlogManagementPage from './BlogManagementPage';
import HeroManagementPage from './HeroManagementPage';
import TeamManagementPage from './TeamManagementPage';
import SettingsPage from './SettingsPage';
import ReportsPage from './ReportsPage';
import BackupPage from './BackupPage';
import ApiKeysPage from './ApiKeysPage';
import SuppliesManagementPage from './SuppliesManagementPage';
import ShamCashSettingsPage from './ShamCashSettingsPage';
import OffersManagementPage from './OffersManagementPage';
import PoliciesManagementPage from './PoliciesManagementPage';
import FiltersManagementPage from './FiltersManagementPage';
import CategoriesManagementPage from './CategoriesManagementPage';
import CompanyInfoManagementPage from './CompanyInfoManagementPage';
import ContactInfoManagementPage from './ContactInfoManagementPage';
import ServicesManagementPage from './ServicesManagementPage';
import SetupGuidePage from './SetupGuidePage';
import { MenuIcon } from '../../components/icons';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../hooks/useAuth';

export type DashboardPage = 'setup_guide' | 'dashboard' | 'analytics' | 'reports' | 'products' | 'supplies_mgmt' | 'inventory' | 'orders' | 'shipping' | 'users' | 'customers' | 'media' | 'blog_mgmt' | 'team_mgmt' | 'hero_mgmt' | 'offers' | 'policies' | 'filters' | 'company_info' | 'contact_info' | 'services_mgmt' | 'settings' | 'apikeys' | 'backup' | 'shamcash_settings';

interface DashboardLayoutProps {
    setAppMode: (mode: AppMode) => void;
    setPage: (page: Page) => void;
    initialPage: DashboardPage;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ setAppMode, setPage, initialPage }) => {
    const [activePage, setActivePage] = useState<DashboardPage>(initialPage || 'dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { loadAdminData, loadArticles, loadTeamMembers } = useDatabase();
    const { user, isAuthReady, isAuthenticated } = useAuth();

    useEffect(() => {
        if (initialPage && initialPage !== activePage) setActivePage(initialPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPage]);

    useEffect(() => {
        // حمل بيانات الإدارة عند فتح صفحات تحتاج بيانات ثقيلة لتخفيف التحميل الأولي
        if (!isAuthReady || !isAuthenticated) return;
        if (!user || (user.role !== 'admin' && user.role !== 'manager')) return;
        const heavyPages: DashboardPage[] = [
            'orders', 'users', 'customers', 'inventory', 'reports', 'analytics',
            'products', 'supplies_mgmt', 'shipping', 'media', 'blog_mgmt', 'hero_mgmt',
            'offers', 'policies', 'filters', 'company_info', 'contact_info',
            'services_mgmt', 'apikeys', 'backup', 'shamcash_settings'
        ];
        if (heavyPages.includes(activePage)) {
            loadAdminData().catch(() => undefined);
        }
    }, [activePage, loadAdminData, user, isAuthReady, isAuthenticated]);

    useEffect(() => {
        if (!isAuthReady || !isAuthenticated) return;
        if (!user || (user.role !== 'admin' && user.role !== 'manager')) return;

        if (activePage === 'blog_mgmt' || activePage === 'setup_guide') {
            loadArticles().catch(() => undefined);
        }

        if (activePage === 'setup_guide') {
            loadTeamMembers().catch(() => undefined);
        }
    }, [activePage, loadArticles, loadTeamMembers, user, isAuthReady, isAuthenticated]);

    const renderContent = () => {
        switch (activePage) {
            case 'setup_guide': return <SetupGuidePage />;
            case 'analytics': return <AnalyticsPage />;
            case 'reports': return <ReportsPage />;
            case 'products': return <ProductsManagementPage />;
            case 'supplies_mgmt': return <SuppliesManagementPage />;
            case 'inventory': return <InventoryPage />;
            case 'orders': return <OrdersManagementPage />;
            case 'shipping': return <ShippingPage />;
            case 'users': return <UsersManagementPage />;
            case 'customers': return <CustomersManagementPage />;
            case 'media': return <MediaLibraryPage />;
            case 'blog_mgmt': return <BlogManagementPage />;
            case 'team_mgmt': return <TeamManagementPage />;
            case 'hero_mgmt': return <HeroManagementPage />;
            case 'offers': return <OffersManagementPage />;
            case 'policies': return <PoliciesManagementPage />;
            case 'filters': return <FiltersManagementPage />;
            case 'categories': return <CategoriesManagementPage />;
            case 'company_info': return <CompanyInfoManagementPage />;
            case 'contact_info': return <ContactInfoManagementPage />;
            case 'services_mgmt': return <ServicesManagementPage />;
            case 'settings': return <SettingsPage />;
            case 'apikeys': return <ApiKeysPage />;
            case 'backup': return <BackupPage />;
            case 'shamcash_settings': return <ShamCashSettingsPage setPage={setActivePage as any} />;
            case 'dashboard':
            default: return <AdminDashboardPage />;
        }
    };

    const getPageTitle = () => {
        switch (activePage) {
            case 'setup_guide': return '🚀 دليل الإعداد الأولي';
            case 'analytics': return 'الإحصائيات والتحليلات';
            case 'products': return 'إدارة المنتجات';
            case 'supplies_mgmt': return 'إدارة المستلزمات';
            case 'inventory': return 'إدارة المخزون';
            case 'orders': return 'إدارة الطلبات';
            case 'shipping': return 'الشحن والتوصيل';
            case 'categories': return 'إدارة الأقسام والفصائل';
            case 'users': return 'إدارة المستخدمين';
            case 'media': return 'مكتبة الوسائط';
            case 'blog_mgmt': return 'إدارة المدونة والمحتوى';
            case 'team_mgmt': return 'إدارة فريق العمل';
            case 'hero_mgmt': return 'إدارة واجهة الموقع الرئيسية';
            case 'offers': return 'إدارة العروض الترويجية';
            case 'policies': return 'السياسات والضمانات';
            case 'filters': return 'إدارة الفلاتر الديناميكية';
            case 'company_info': return 'معلومات الشركة';
            case 'contact_info': return 'معلومات التواصل';
            case 'services_mgmt': return 'إدارة الخدمات';
            case 'shamcash_settings': return 'إعدادات شام كاش';
            default: return 'لوحة التحكم الرئيسية';
        }
    }

    return (
        <div className="relative z-50 flex h-screen bg-[#0a0c10] overflow-hidden text-right" dir="rtl">
            {isSidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden cursor-default"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="إغلاق القائمة الجانبية"
                />
            )}

            <div className={`fixed inset-y-0 right-0 z-[70] transform transition-transform duration-500 ease-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <Sidebar activePage={activePage} setActivePage={(p) => { setActivePage(p); setIsSidebarOpen(false); }} setAppMode={setAppMode} setPage={setPage} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="flex items-center justify-between p-6 bg-gray-900/40 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-3 bg-white/5 rounded-xl text-amber-500"
                            aria-label="فتح القائمة الجانبية"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <div className="hidden lg:block">
                            <h1 className="text-xl font-black text-white">{getPageTitle()}</h1>
                        </div>
                    </div>
                    <div className="text-sm font-bold text-gray-500 font-poppins">{new Date().toLocaleDateString('ar-SY')}</div>
                </header>

                <main className="flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide bg-gradient-to-b from-transparent to-gray-900/20">
                    <div className="max-w-6xl mx-auto animate-fade-in">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
