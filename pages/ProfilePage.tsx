
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../App';
import { UserIcon, MapPinIcon, BellIcon } from '../components/icons';
import ProfileInfo from '../components/ProfileInfo';
import Addresses from '../components/Addresses';
import Notifications from '../components/Notifications';

type ProfileTab = 'info' | 'addresses' | 'notifications';

interface ProfilePageProps {
    setPage: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setPage }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">يرجى تسجيل الدخول لعرض ملفك الشخصي.</h2>
      </div>
    );
  }
  
  const renderTabContent = () => {
      switch (activeTab) {
          case 'addresses':
              return <Addresses />;
          case 'notifications':
              return <Notifications />;
          case 'info':
          default:
              return <ProfileInfo user={user} />;
      }
  }

  const tabs: { id: ProfileTab, name: string, icon: React.ReactNode }[] = [
      { id: 'info', name: 'المعلومات الشخصية', icon: <UserIcon className="w-5 h-5 me-2"/> },
      { id: 'addresses', name: 'العناوين', icon: <MapPinIcon className="w-5 h-5 me-2"/> },
      { id: 'notifications', name: 'الإشعارات', icon: <BellIcon className="w-5 h-5 me-2"/> },
  ];

  return (
    <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">إعدادات الحساب</h1>
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <div className="bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-4 sticky top-24">
                   <nav className="flex flex-row md:flex-col gap-2">
                       {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center w-full text-right p-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-amber-500/30 text-amber-300' : 'hover:bg-white/10'}`}
                            >
                                {tab.icon}
                                <span className="font-bold">{tab.name}</span>
                            </button>
                       ))}
                   </nav>
                </div>
            </aside>
            <main className="md:w-3/4">
                <div className="bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-8 min-h-[400px]">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    </div>
  );
};

export default ProfilePage;
