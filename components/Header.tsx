
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, MenuIcon, UserIcon, HeartIconOutline, LogoutIcon, BoxIcon, ShoppingCartIcon, DashboardIcon, SnakeIcon, ChevronDownIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { Page, AppMode } from '../App';

interface HeaderProps {
  setPage: (page: Page) => void;
  setAppMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ setPage, setAppMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'الرئيسية', page: 'home' as Page },
    { name: 'المعرض', page: 'showcase' as Page },
    { name: 'المستلزمات', page: 'supplies' as Page },
    { name: 'الخدمات', page: 'services' as Page },
    { name: 'العروض', page: 'offers' as Page },
    { name: 'المدونة', page: 'blog' as Page },
    { name: 'عنا', page: 'about' as Page },
    { name: 'اتصل بنا', page: 'contact' as Page }
  ];

  const handleLinkClick = (e: React.MouseEvent, page: Page) => {
    e.preventDefault();
    setPage(page);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <a href="#" onClick={(e) => handleLinkClick(e, 'home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-white/5">
              <img src="/assets/photo_2026-02-04_07-13-35.jpg" alt="Reptile House" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-amber-400 leading-none">Reptile</span>
              <span className="text-sm font-bold text-white leading-none mt-1">HOUSE</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a key={link.name} href="#" onClick={(e) => handleLinkClick(e, link.page)} className="text-gray-300 hover:text-white font-black text-sm transition-colors">{link.name}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={(e) => handleLinkClick(e, 'cart')} className="relative p-2 text-gray-300 hover:text-white">
              <ShoppingCartIcon className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-gray-900 text-[10px] font-black rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-500 text-gray-900 rounded-lg flex items-center justify-center font-black text-xs">{(user.name?.trim()?.charAt(0) || '?')}</div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute start-0 mt-2 w-52 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                    <a href="#" onClick={(e) => { handleLinkClick(e, 'profile'); setIsUserMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5"><UserIcon className="w-4 h-4 me-3 text-amber-500" /> الملف الشخصي</a>
                    {(user.role === 'admin' || user.role === 'manager') && (
                      <a href="#" onClick={(e) => { handleLinkClick(e, 'dashboard'); setIsUserMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-amber-400 font-black hover:bg-amber-500/10"><DashboardIcon className="w-4 h-4 me-3" /> لوحة الإدارة</a>
                    )}
                    <button onClick={(e) => { e.preventDefault(); logout(); setPage('home'); setIsUserMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/5"><LogoutIcon className="w-4 h-4 me-3" /> خروج</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={(e) => handleLinkClick(e, 'login')} className="bg-amber-500 text-gray-900 px-6 py-2 rounded-xl font-black text-sm">دخول</button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
