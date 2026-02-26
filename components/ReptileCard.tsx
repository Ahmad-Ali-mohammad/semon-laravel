
import React, { useState } from 'react';
import { Reptile } from '../types';
import { StarIcon, HeartIconOutline, HeartIconSolid, ShoppingCartIcon } from './icons';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export type CardVariant = 'grid' | 'list' | 'featured';

interface ReptileCardProps {
    reptile: Reptile;
    index?: number;
    variant?: CardVariant;
    setPage?: (page: string) => void;
}

const ReptileCard: React.FC<ReptileCardProps> = ({ reptile, index = 0, variant = 'grid', setPage }) => {
    const { user } = useAuth();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const isWishlisted = wishlist.includes(reptile.id);
    const ratingValue = Number.isFinite(Number(reptile.rating)) ? Number(reptile.rating) : 0;

    const navigateToDetails = () => {
        if (setPage) setPage(`product/${reptile.id}`);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { alert('يرجى تسجيل الدخول أولاً للمتابعة'); return; }
        if (isWishlisted) {
            removeFromWishlist(reptile.id);
        } else {
            addToWishlist(reptile.id);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            addToCart(reptile); // This will trigger the alert in CartContext
            return;
        }
        addToCart(reptile);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const getStatusColor = (status: Reptile['status']) => {
        switch (status) {
            case 'متوفر': return 'bg-green-500 text-white';
            case 'قيد الحجز': return 'bg-amber-500 text-gray-900';
            case 'غير متوفر': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    if (variant === 'list') {
        return (
            <div
                onClick={navigateToDetails}
                className="glass-medium rounded-3xl flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 gap-4 sm:gap-0 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 group border border-white/5 cursor-pointer relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl relative z-10">
                    <img src={reptile.imageUrl} alt={reptile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1 sm:px-8 text-right relative z-10 w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight group-hover:text-amber-400 transition-colors">{reptile.name}</h3>
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(reptile.status)}`}>{reptile.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-bold">{reptile.species}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <StarIcon className="w-4 h-4 text-amber-500" />
                        <span className="font-poppins font-black text-sm">{ratingValue.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 relative z-10 w-full sm:w-auto">
                    <p className="text-2xl sm:text-3xl font-black text-amber-500 font-poppins">${reptile.price}</p>
                    <button
                        onClick={handleAddToCart}
                        disabled={reptile.status === 'غير متوفر' || isAdded}
                        aria-label={`إضافة ${reptile.name} إلى السلة`}
                        className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-xl active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${isAdded ? 'bg-green-500 text-white' : 'bg-amber-500 text-gray-900 hover:bg-amber-400'}`}
                    >
                        {isAdded ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <ShoppingCartIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Default Grid Card
    return (
        <div
            onClick={navigateToDetails}
            className="glass-medium rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] hover:-translate-y-4 hover:border-amber-500/50 group cursor-pointer relative"
        >
            {/* Dynamic Glow Effect on Hover */}
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="relative aspect-[1/1] overflow-hidden">
                <img
                    src={reptile.imageUrl}
                    alt={reptile.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:brightness-110"
                />

                {/* Hover Overlay with Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-amber-500 text-gray-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                        التفاصيل الكاملة
                    </div>
                </div>

                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-black/40 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl text-white hover:text-amber-400 hover:scale-110 transition-all duration-300 z-10 border border-white/10 shadow-xl"
                >
                    {isWishlisted ? <HeartIconSolid className="w-5 h-5 text-amber-400" /> : <HeartIconOutline className="w-5 h-5" />}
                </button>

                <div className={`absolute top-4 sm:top-6 right-4 sm:right-6 ${getStatusColor(reptile.status)} shadow-2xl text-[9px] font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-widest z-10`}>
                    {reptile.status}
                </div>

                <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex items-center gap-2 glass-dark px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 z-10">
                    <StarIcon className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-white text-xs font-black font-poppins">{ratingValue.toFixed(1)}</span>
                </div>
            </div>

            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tighter group-hover:text-amber-400 transition-colors leading-none">{reptile.name}</h3>
                        <p className="text-gray-500 text-xs font-bold font-poppins uppercase tracking-widest">{reptile.species}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-2xl sm:text-3xl font-black text-amber-400 font-poppins tracking-tighter">${reptile.price}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={reptile.status === 'غير متوفر' || isAdded}
                        className={`flex-1 font-black py-3.5 sm:py-4.5 px-5 sm:px-6 rounded-2xl transition-all duration-500 transform active:scale-95 shadow-2xl disabled:bg-gray-800/50 disabled:cursor-not-allowed disabled:text-gray-600 border border-transparent hover:border-white/10 ${isAdded ? 'bg-green-500 text-white' : 'bg-amber-500 text-gray-900 hover:bg-amber-400'}`}
                    >
                        {isAdded ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                تمت الإضافة
                            </span>
                        ) : (reptile.status === 'غير متوفر' ? 'غير متوفر حالياً' : 'أضف للسلة')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReptileCard;
