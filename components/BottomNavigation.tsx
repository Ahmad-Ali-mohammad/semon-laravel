
import React from 'react';
import { Page } from '../App';
import { DashboardIcon, ShoppingCartIcon, HeartIconOutline, UserIcon, SnakeIcon } from './icons';
import { useCart } from '../hooks/useCart';

interface BottomNavigationProps {
  currentPage: string;
  setPage: (page: string) => void;
  user: any;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setPage, user }) => {
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: <DashboardIcon className="w-6 h-6" /> },
    { id: 'showcase', label: 'المعرض', icon: <SnakeIcon className="w-6 h-6" /> },
    { id: 'offers', label: 'عروض', icon: <DashboardIcon className="w-6 h-6" /> },
    { id: 'cart', label: 'السلة', icon: <ShoppingCartIcon className="w-6 h-6" />, badge: cartCount },
    { id: 'wishlist', label: 'المفضلة', icon: <HeartIconOutline className="w-6 h-6" /> },
    { id: user ? 'profile' : 'login', label: user ? 'حسابي' : 'دخول', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10 px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPage === item.id || (item.id === 'home' && currentPage === '');
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center justify-center w-full transition-all duration-300 relative ${isActive ? 'text-amber-400 -translate-y-1' : 'text-gray-400'
                }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-gray-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
