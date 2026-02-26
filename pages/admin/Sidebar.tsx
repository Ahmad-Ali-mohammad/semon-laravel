
import React, { useState } from 'react';
import { DashboardPage } from './DashboardLayout';
import { AppMode, Page } from '../../App';
import {
  DashboardIcon,
  AnalyticsIcon,
  PackageIcon,
  ClipboardListIcon,
  TruckIcon,
  ChevronDownIcon,
  LogoutIcon,
  SnakeIcon,
  UserIcon,
  ImageIcon,
  TagIcon,
  DocumentIcon
} from '../../components/icons';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activePage: DashboardPage;
  setActivePage: (page: DashboardPage) => void;
  setAppMode: (mode: AppMode) => void;
  setPage: (page: Page) => void;
}

const sidebarConfig = [
  {
    name: "البداية السريعة",
    items: [
      { name: "🚀 دليل الإعداد", page: 'setup_guide' as DashboardPage, icon: <DocumentIcon className="w-5 h-5" />, highlight: true }
    ]
  },
  {
    name: "نظرة عامة",
    items: [
      { name: "لوحة التحكم", page: 'dashboard' as DashboardPage, icon: <DashboardIcon className="w-5 h-5" /> },
      { name: "الإحصائيات", page: 'analytics' as DashboardPage, icon: <AnalyticsIcon className="w-5 h-5" /> },
      { name: "التقارير", page: 'reports' as DashboardPage, icon: <ClipboardListIcon className="w-5 h-5" /> }
    ]
  },
  {
    name: "المتجر والمنتجات",
    items: [
      { name: "جميع المنتجات", page: 'products' as DashboardPage, icon: <PackageIcon className="w-5 h-5" /> },
      { name: "الأقسام والفصائل", page: 'categories' as DashboardPage, icon: <TagIcon className="w-5 h-5" /> },
      { name: "المستلزمات", page: 'supplies_mgmt' as DashboardPage, icon: <PackageIcon className="w-5 h-5" /> },
      { name: "العروض الترويجية", page: 'offers' as DashboardPage, icon: <TagIcon className="w-5 h-5" /> },
      { name: "المخزون", page: 'inventory' as DashboardPage, icon: <ClipboardListIcon className="w-5 h-5" /> },
      { name: "مكتبة الوسائط", page: 'media' as DashboardPage, icon: <ImageIcon className="w-5 h-5" /> }
    ]
  },
  {
    name: "إدارة الواجهة",
    items: [
      { name: "الدولاب المتحرك", page: 'hero_mgmt' as DashboardPage, icon: <ImageIcon className="w-5 h-5" /> },
      { name: "الفلاتر الديناميكية", page: 'filters' as DashboardPage, icon: <TagIcon className="w-5 h-5" /> }
    ]
  },
  {
    name: "المحتوى والمدونة",
    items: [
      { name: "إدارة المقالات", page: 'blog_mgmt' as DashboardPage, icon: <ClipboardListIcon className="w-5 h-5" /> },
      { name: "فريق العمل", page: 'team_mgmt' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> },
      { name: "إدارة الخدمات", page: 'services_mgmt' as DashboardPage, icon: <ClipboardListIcon className="w-5 h-5" /> }
    ]
  },
  {
    name: "المبيعات",
    items: [
      { name: "الطلبات", page: 'orders' as DashboardPage, icon: <ClipboardListIcon className="w-5 h-5" /> },
      { name: "الشحن والتوصيل", page: 'shipping' as DashboardPage, icon: <TruckIcon className="w-5 h-5" /> }
    ]
  },
  {
    name: "العملاء",
    items: [
      { name: "المستخدمين", page: 'users' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> },
      { name: "إدارة العملاء", page: 'customers' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> }
    ]
  },
  {
    name: "الإدارة والنظام",
    items: [
      { name: "معلومات الشركة", page: 'company_info' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> },
      { name: "معلومات التواصل", page: 'contact_info' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> },
      { name: "الإعدادات", page: 'settings' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> },
      { name: "السياسات والضمانات", page: 'policies' as DashboardPage, icon: <DocumentIcon className="w-5 h-5" /> },
      { name: "إعدادات شام كاش", page: 'shamcash_settings' as DashboardPage, icon: <ClipboardListIcon className="w-5 h-5" /> },
      { name: "مفاتيح API", page: 'apikeys' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> },
      { name: "النسخ الاحتياطي", page: 'backup' as DashboardPage, icon: <UserIcon className="w-5 h-5" /> }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, setAppMode, setPage }) => {
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>(sidebarConfig.map(s => s.name));

  const toggleSection = (sectionName: string) => {
    setOpenSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const handleBackToSite = () => {
    setPage('home');
    setAppMode('user');
  };

  const handleNavigate = (page: DashboardPage) => {
    setActivePage(page);
    setPage(`dashboard/${page}` as any);
  };

  return (
    <aside className="w-72 h-full bg-gray-900/60 backdrop-blur-2xl border-l border-white/10 flex flex-col shadow-2xl">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
            <SnakeIcon className="w-7 h-7 text-gray-900" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-tight">إدارة المتجر</h1>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1">Reptile House</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide text-right">
        {sidebarConfig.map(section => (
          <div key={section.name} className="space-y-2">
            <button onClick={() => toggleSection(section.name)} className="w-full flex justify-between items-center px-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{section.name}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${openSections.includes(section.name) ? 'rotate-180' : ''}`} />
            </button>
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${openSections.includes(section.name) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {section.items.map(item => {
                const isActive = activePage === item.page;
                const isHighlighted = item.highlight;
                
                let buttonClass = 'flex items-center gap-3 w-full p-3.5 rounded-2xl transition-all ';
                if (isActive) {
                  buttonClass += 'bg-amber-500 text-gray-900 font-bold shadow-lg';
                } else if (isHighlighted) {
                  buttonClass += 'text-white bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 hover:from-amber-500/30 hover:to-amber-600/30';
                } else {
                  buttonClass += 'text-gray-400 hover:bg-white/5';
                }

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.page)}
                    className={buttonClass}
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 bg-white/5 border-t border-white/5">
        <button onClick={handleBackToSite} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-gray-400 hover:text-white mb-2">
          <DashboardIcon className="w-4 h-4 rotate-180" />
          <span className="text-xs font-bold">العودة للمتجر</span>
        </button>
        <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20">
          <LogoutIcon className="w-4 h-4" />
          <span className="text-xs font-bold">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
