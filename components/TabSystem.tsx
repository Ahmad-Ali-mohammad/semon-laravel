
import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsSystemProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (id: string) => void;
}

const TabsSystem: React.FC<TabsSystemProps> = ({ tabs, activeTabId, onChange }) => {
  return (
    <div className="w-full mb-8">
      {/* 
        Responsive behavior based on JSON:
        Mobile: scrollable
        Tablet: fixed
        Desktop: full_width
      */}
      <div className="glass-light p-2 rounded-[2rem] flex items-center overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 lg:w-full border border-white/10 shadow-2xl">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center justify-center flex-shrink-0 px-8 py-4 rounded-2xl transition-all duration-500 relative group overflow-hidden ${
                isActive 
                  ? 'bg-amber-500 text-gray-900 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-100 z-10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10 scale-95 opacity-80'
              }`}
            >
              {tab.icon && <span className="me-3 text-2xl group-hover:scale-125 transition-transform duration-300">{tab.icon}</span>}
              <span className="font-black whitespace-nowrap text-sm tracking-wide">{tab.label}</span>
              
              {tab.badge !== undefined && (
                <span className={`ms-3 px-2.5 py-1 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-gray-900 text-amber-500' : 'bg-amber-500/30 text-amber-400'
                }`}>
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
              )}
              
              {/* Hover Glow Effect */}
              {!isActive && (
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabsSystem;
