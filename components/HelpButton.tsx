import React from 'react';

interface HelpButtonProps {
  onClick: () => void;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 font-black py-3.5 px-6 rounded-2xl hover:bg-blue-500/20 transition-all shadow-xl active:scale-95"
      title="تعليمات الاستخدام"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="hidden sm:inline">تعليمات الاستخدام</span>
    </button>
  );
};

export default HelpButton;
