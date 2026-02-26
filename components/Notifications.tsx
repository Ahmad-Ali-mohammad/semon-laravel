
import React, { useState } from 'react';
import { mockNotificationSettings } from '../constants';
import { NotificationSettings as SettingsType } from '../types';

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <div
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${enabled ? 'bg-amber-500' : 'bg-gray-600'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
);


const Notifications: React.FC = () => {
    const [settings, setSettings] = useState<SettingsType>(mockNotificationSettings);

    const handleToggle = (key: keyof SettingsType) => {
        setSettings(prev => ({...prev, [key]: !prev[key]}));
    };
    
    const notificationItems = [
        { key: 'orders' as keyof SettingsType, title: 'تحديثات الطلبات', description: 'تلقي إشعارات حول حالة طلباتك.' },
        { key: 'promotions' as keyof SettingsType, title: 'العروض والتخفيضات', description: 'كن أول من يعرف عن عروضنا الخاصة.' },
        { key: 'system' as keyof SettingsType, title: 'إشعارات النظام', description: 'إشعارات هامة حول حسابك أو خدماتنا.' },
        { key: 'messages' as keyof SettingsType, title: 'الرسائل الجديدة', description: 'تلقي تنبيهات عند وصول رسائل جديدة.' },
    ];

    return (
        <div>
             <h2 className="text-3xl font-bold mb-6">إعدادات الإشعارات</h2>
             <div className="space-y-4">
                {notificationItems.map(item => (
                    <div key={item.key} className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                        <Toggle enabled={settings[item.key]} onChange={() => handleToggle(item.key)} />
                    </div>
                ))}
             </div>
        </div>
    );
};

export default Notifications;
