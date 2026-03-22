
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import ShowcasePage from './pages/ShowcasePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import WarrantyPage from './pages/WarrantyPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import BlogPage from './pages/BlogPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import OffersPage from './pages/OffersPage';
import ServicesPage from './pages/ServicesPage';
import SuppliesPage from './pages/SuppliesPage';
import QuickCart from './components/QuickCart';
import BottomNavigation from './components/BottomNavigation';
import DashboardLayout, { DashboardPage } from './pages/admin/DashboardLayout';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { useAuth } from './hooks/useAuth';

export type Page = 'home' | 'login' | 'register' | 'profile' | 'wishlist' | 'showcase' | 'orders' | 'cart' | 'checkout' | 'orderConfirmation' | 'orderTracking' | 'forgotPassword' | 'resetPassword' | 'about' | 'contact' | 'shippingPolicy' | 'returnPolicy' | 'warranty' | 'privacy' | 'terms' | 'dashboard' | 'blog' | 'services' | 'offers' | 'supplies';
export type AppMode = 'user' | 'dashboard';

const resolveInitialPage = (): string => {
    if (typeof window === 'undefined') return 'home';

    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get('page');
    if (pageParam) return pageParam;

    const rawHash = window.location.hash.replace('#', '');
    const hashPath = rawHash.startsWith('/') ? rawHash.slice(1) : rawHash;
    if (hashPath) {
        return hashPath.split('?')[0] || 'home';
    }

    return 'home';
};

const PageRenderer: React.FC<{
    currentPage: string;
    setPage: (page: string) => void;
    setLastOrderId: (id: string | null) => void;
    lastOrderId: string | null;
}> = ({ currentPage, setPage, setLastOrderId, lastOrderId }) => {
    if (currentPage.startsWith('product/')) {
        const id = Number.parseInt(currentPage.split('/')[1]);
        return <ProductDetailsPage productId={id} setPage={setPage} />;
    }
    if (currentPage.startsWith('article/')) {
        const id = Number.parseInt(currentPage.split('/')[1]);
        return <ArticleDetailsPage articleId={id} setPage={setPage} />;
    }

    switch (currentPage) {
        case 'login': return <LoginPage setPage={setPage} />;
        case 'register': return <RegisterPage setPage={setPage} />;
        case 'profile': return <ProfilePage setPage={setPage} />;
        case 'wishlist': return <WishlistPage setPage={setPage} />;
        case 'showcase': return <ShowcasePage setPage={setPage} />;
        case 'orders': return <OrdersHistoryPage setPage={setPage} />;
        case 'cart': return <CartPage setPage={setPage} />;
        case 'checkout': return <CheckoutPage setPage={setPage} setLastOrderId={setLastOrderId} />;
        case 'orderConfirmation': return <OrderConfirmationPage setPage={setPage} orderId={lastOrderId} />;
        case 'orderTracking': return <OrderTrackingPage setPage={setPage} orderId={lastOrderId || 'RH-1025'} />;
        case 'forgotPassword': return <ForgotPasswordPage setPage={setPage} />;
        case 'resetPassword': return <ResetPasswordPage setPage={setPage} />;
        case 'about': return <AboutPage />;
        case 'contact': return <ContactPage />;
        case 'shippingPolicy': return <ShippingPolicyPage />;
        case 'returnPolicy': return <ReturnPolicyPage />;
        case 'warranty': return <WarrantyPage />;
        case 'privacy': return <PrivacyPage />;
        case 'terms': return <TermsPage />;
        case 'blog': return <BlogPage setPage={setPage} />;
        case 'services': return <ServicesPage />;
        case 'offers': return <OffersPage setPage={setPage} />;
        case 'supplies': return <SuppliesPage setPage={setPage} />;
        case 'home':
        default: return <HomePage setPage={setPage} />;
    }
};

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<string>(() => resolveInitialPage());
    const [appMode, setAppMode] = useState<AppMode>('user');
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const { user } = useAuth();

    const dashboardInitialPage = (currentPage.startsWith('dashboard/')
        ? currentPage.replace('dashboard/', '')
        : 'dashboard');

    const setPage = (page: string) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleNavigation = () => {
            setCurrentPage(resolveInitialPage());
        };

        window.addEventListener('popstate', handleNavigation);
        return () => window.removeEventListener('popstate', handleNavigation);
    }, []);

    useEffect(() => {
        const isAdminRoute = currentPage.startsWith('dashboard');
        if (isAdminRoute) {
            if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
                setPage('home');
                setAppMode('user');
            } else {
                setAppMode('dashboard');
            }
        } else {
            setAppMode('user');
        }
    }, [currentPage, user]);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col pb-20 md:pb-0 relative">
            <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40 -z-10 main-bg-image"></div>

            {appMode === 'dashboard' ? (
                <DashboardLayout setAppMode={setAppMode} setPage={setPage} initialPage={dashboardInitialPage as DashboardPage} />
            ) : (
                <>
                    <Header setPage={setPage} setAppMode={setAppMode} />
                    <main className="container mx-auto px-4 py-8 flex-grow relative z-10">
                        <PageRenderer 
                            currentPage={currentPage}
                            setPage={setPage}
                            setLastOrderId={setLastOrderId}
                            lastOrderId={lastOrderId}
                        />
                    </main>
                    <Footer setPage={setPage} />
                    <QuickCart setPage={setPage} />
                    <BottomNavigation currentPage={currentPage} setPage={setPage} user={user} />
                </>
            )}
        </div>
    );
};

const App: React.FC = () => (
    <PreferencesProvider>
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    </PreferencesProvider>
);

export default App;
