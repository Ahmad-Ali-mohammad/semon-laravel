
import React, { useState } from 'react';
import { Order } from '../types';

interface PaymentVerificationModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onVerify: (orderId: string, status: Order['paymentVerificationStatus'], reason?: string) => void;
}

const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({ isOpen, order, onClose, onVerify }) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !order) return null;

  const handleAccept = () => {
    onVerify(order.id, 'مقبول');
    setShowRejectInput(false);
    setRejectionReason('');
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (!rejectionReason.trim()) {
      alert('يرجى إدخال سبب الرفض');
      return;
    }

    onVerify(order.id, 'مرفوض', rejectionReason);
    setShowRejectInput(false);
    setRejectionReason('');
  };

  const handleClose = () => {
    setShowRejectInput(false);
    setRejectionReason('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const getStatusBadgeClasses = (status: Order['paymentVerificationStatus']) => {
    switch (status) {
      case 'مقبول':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'مرفوض':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'قيد المراجعة':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: Order['paymentVerificationStatus']) => {
    switch (status) {
      case 'مقبول':
        return '✓';
      case 'مرفوض':
        return '✗';
      case 'قيد المراجعة':
        return '⏳';
      default:
        return '?';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onKeyDown={handleKeyDown}>
      {/* خلفية داكنة مع blur */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        aria-label="إغلاق النافذة"
      />

      {/* محتوى Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-heavy rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
        {/* رأس Modal */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">التحقق من صورة الدفع</h2>
            <p className="text-gray-400">الطلب رقم: <span className="font-poppins font-bold text-amber-500">#{order.id}</span></p>
          </div>
          <button
            onClick={handleClose}
            aria-label="إغلاق نافذة التحقق من الدفع"
            className="p-3 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* معلومات الطلب */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* حالة التحقق الحالية */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-3">حالة التحقق</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${getStatusBadgeClasses(order.paymentVerificationStatus)}`}>
              <span className="text-lg">{getStatusIcon(order.paymentVerificationStatus)}</span>
              {order.paymentVerificationStatus}
            </div>
          </div>

          {/* طريقة الدفع */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-3">طريقة الدفع</p>
            <p className="text-white font-bold text-lg">
              {order.paymentMethod === 'shamcash' ? 'شام كاش' : 'بطاقة ائتمانية'}
            </p>
          </div>

          {/* إجمالي المبلغ */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-3">إجمالي المبلغ</p>
            <p className="text-amber-500 font-poppins font-black text-2xl">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* سبب الرفض (إذا كان موجود) */}
        {order.paymentVerificationStatus === 'مرفوض' && order.rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              سبب الرفض
            </h4>
            <p className="text-gray-300 leading-relaxed">{order.rejectionReason}</p>
          </div>
        )}

        {/* صورة تأكيد الدفع */}
        {order.paymentConfirmationImage && (
          <div className="mb-8">
            <h4 className="font-bold text-white mb-4 text-lg">صورة تأكيد الدفع</h4>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
              <img
                src={order.paymentConfirmationImage}
                alt="صورة تأكيد الدفع"
                className="w-full h-auto rounded-xl object-contain max-h-[500px] mx-auto"
              />
            </div>
          </div>
        )}

        {/* حقل سبب الرفض */}
        {showRejectInput && (
          <div className="mb-8 animate-fade-in">
            <label htmlFor="rejection-reason" className="block text-white font-bold mb-3">سبب رفض الدفع</label>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="يرجى إدخال السبب التفصيلي لرفض صورة الدفع..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
            />
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex gap-4 flex-wrap">
          {/* زر القبول */}
          <button
            onClick={handleAccept}
            disabled={order.paymentVerificationStatus === 'مقبول'}
            className={`flex-1 min-w-[200px] py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
              order.paymentVerificationStatus === 'مقبول'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            قبول الدفع
          </button>

          {/* زر الرفض */}
          <button
            onClick={handleReject}
            className="flex-1 min-w-[200px] py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-400"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {showRejectInput ? 'تأكيد الرفض' : 'رفض الدفع'}
          </button>

          {/* زر الإغلاق */}
          <button
            onClick={handleClose}
            className="flex-1 min-w-[200px] py-4 px-6 rounded-xl font-bold text-lg transition-all bg-white/5 text-gray-300 hover:bg white/10 border border-white/10"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationModal;
