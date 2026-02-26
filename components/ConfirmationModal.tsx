
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'تأكيد الحذف',
    cancelLabel = 'إلغاء',
    onConfirm,
    onCancel,
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const accentColor = type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500';
    const accentText = type === 'danger' ? 'text-red-400' : type === 'warning' ? 'text-amber-400' : 'text-indigo-400';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onCancel}></div>
            <div className="relative w-full max-w-md glass-dark border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-in bg-[#0f1117] text-right">
                <div className={`w-16 h-16 ${accentColor}/10 rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${accentText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                
                <h3 className="text-2xl font-black mb-3 text-white text-center">{title}</h3>
                <p className="text-gray-400 text-center leading-relaxed mb-8">
                    {message}
                </p>

                <div className="flex gap-4">
                    <button 
                        onClick={onConfirm}
                        className={`flex-1 ${accentColor} text-white font-black py-4 rounded-xl hover:opacity-90 transition-all shadow-xl active:scale-95`}
                    >
                        {confirmLabel}
                    </button>
                    <button 
                        onClick={onCancel}
                        className="flex-1 bg-white/5 text-gray-400 font-black py-4 rounded-xl hover:bg-white/10 border border-white/5 transition-all"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
