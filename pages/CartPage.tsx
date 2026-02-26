
import React from 'react';
import { useCart } from '../hooks/useCart';
import { Page } from '../App';
import { TrashIcon, PlusIcon, MinusIcon } from '../components/icons';

interface CartPageProps {
    setPage: (page: Page) => void;
}

const CartPage: React.FC<CartPageProps> = ({ setPage }) => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const total = getCartTotal();

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-8">سلة التسوق</h1>

            {cart.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 space-x-reverse border-b border-white/10 pb-4 last:border-b-0">
                                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-gray-300 font-poppins">{item.species}</p>
                                </div>
                                <div className="flex items-center bg-white/10 rounded-full">
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-amber-400" aria-label="زيادة الكمية"><PlusIcon className="w-4 h-4" /></button>
                                    <span className="px-3 font-bold font-poppins">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-amber-400" aria-label="تقليل الكمية"><MinusIcon className="w-4 h-4" /></button>
                                </div>
                                <p className="font-bold text-lg font-poppins w-20 text-center">${(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500" aria-label="حذف من السلة"><TrashIcon /></button>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/3">
                        <div className="bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-6 sticky top-24 space-y-4">
                            <h2 className="text-2xl font-bold">ملخص الطلب</h2>
                            <div className="flex justify-between">
                                <span className="text-gray-300">المجموع الفرعي</span>
                                <span className="font-bold font-poppins">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">الشحن</span>
                                <span className="font-bold">مجاني</span>
                            </div>
                             <div className="border-t border-white/20"></div>
                             <div className="flex justify-between text-xl">
                                <span className="font-bold">الإجمالي</span>
                                <span className="font-black text-amber-400 font-poppins">${total.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={() => setPage('checkout')}
                                className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105"
                            >
                                المتابعة لإتمام الطلب
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl">
                    <h2 className="text-2xl font-bold">سلة التسوق فارغة.</h2>
                    <button onClick={() => setPage('showcase')} className="mt-4 text-amber-400 font-bold">
                        ابدأ التسوق
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
