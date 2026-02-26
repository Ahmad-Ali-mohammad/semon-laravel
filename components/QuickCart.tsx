
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Page } from '../App';
import { ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon, ChevronLeftIcon } from './icons';

interface QuickCartProps {
    setPage: (page: Page) => void;
}

const QuickCart: React.FC<QuickCartProps> = ({ setPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const total = getCartTotal();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = () => {
        setIsOpen(false);
        setPage('cart');
    };

    return (
        <>
            <div 
                className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900/50 backdrop-filter backdrop-blur-lg border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 flex justify-between items-center border-b border-white/10">
                        <h2 className="text-xl font-bold">سلة التسوق</h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:text-amber-400" aria-label="إغلاق سلة التسوق">
                            <ChevronLeftIcon className="w-6 h-6 rotate-180" />
                        </button>
                    </div>

                    {cart.length > 0 ? (
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-400 font-poppins">${Number(item.price || 0).toFixed(2)}</p>
                                        <div className="flex items-center bg-white/10 rounded-full mt-1 w-fit">
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-amber-400" aria-label="زيادة الكمية"><PlusIcon className="w-3 h-3" /></button>
                                            <span className="px-2 text-sm font-bold font-poppins">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-amber-400" aria-label="تقليل الكمية"><MinusIcon className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-500 hover:text-red-500" aria-label="حذف من السلة"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <p>سلتك فارغة.</p>
                        </div>
                    )}

                    <div className="p-4 border-t border-white/10 space-y-4">
                         <div className="flex justify-between text-lg">
                            <span className="font-bold">الإجمالي:</span>
                            <span className="font-black text-amber-400 font-poppins">${total.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            إتمام الطلب
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-amber-500 text-gray-900 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-40"
            >
                <ShoppingCartIcon className="w-8 h-8" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 block h-6 w-6 rounded-full bg-red-600 text-white text-xs font-bold ring-2 ring-amber-500 flex items-center justify-center">{totalItems}</span>
                )}
            </button>
        </>
    );
};

export default QuickCart;
