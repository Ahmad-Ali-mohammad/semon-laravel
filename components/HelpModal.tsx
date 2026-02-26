
import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sections: {
    title: string;
    content: string | string[];
    icon?: string;
  }[];
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, sections }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        role="presentation"
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1a1c23] border border-white/20 rounded-[2rem] max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-l from-amber-500/20 to-transparent p-8 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{title}</h2>
                <p className="text-sm text-gray-400 font-bold">دليل الاستخدام والتعليمات</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="إغلاق نافذة المساعدة"
              className="p-3 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)] scrollbar-hide space-y-8">
          {sections.map((section, index) => (
            <div key={`${section.title}-${index}`} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {section.icon && (
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                )}
                <h3 className="text-xl font-black text-amber-400">{section.title}</h3>
              </div>

              {Array.isArray(section.content) ? (
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={`${section.title}-item-${idx}`} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                      <span className="text-amber-500 font-black mt-1 flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {section.content}
                </p>
              )}
            </div>
          ))}

          {/* Tips Section */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h4 className="text-lg font-black text-blue-400">نصائح مهمة</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>تأكد من حفظ التغييرات قبل مغادرة الصفحة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>يمكنك معاينة التغييرات على الموقع مباشرة بعد الحفظ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>استخدم زر "إلغاء" للعودة دون حفظ التعديلات</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#0a0c10]/50 backdrop-blur-md">
          <button
            onClick={onClose}
            className="w-full bg-amber-500 text-gray-900 font-black py-4 rounded-xl hover:bg-amber-400 transition-all shadow-lg"
          >
            فهمت، شكراً!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
