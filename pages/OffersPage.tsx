import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRightIcon } from '../components/icons';
import { Page } from '../App';
import { PromotionalCard } from '../types';
import { useDatabase } from '../contexts/DatabaseContext';

interface OffersPageProps {
    setPage: (page: Page) => void;
}

const OffersPage: React.FC<OffersPageProps> = ({ setPage }) => {
    const { promotions: rawPromotions } = useDatabase();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const normalizePromotion = (offer: any): PromotionalCard => ({
        id: offer.id,
        title: offer.title,
        description: offer.description || '',
        imageUrl: offer.imageUrl || offer.image_url,
        discountPercentage: offer.discountPercentage ?? offer.discount_percentage,
        startDate: offer.startDate || offer.start_date,
        endDate: offer.endDate || offer.end_date,
        startTime: offer.startTime || offer.start_time,
        endTime: offer.endTime || offer.end_time,
        isActive: offer.isActive ?? offer.is_active ?? true,
        targetCategory: offer.targetCategory || offer.target_category,
        buttonText: offer.buttonText || offer.button_text,
        buttonLink: offer.buttonLink || offer.button_link
    });

    const promotions = useMemo(() => rawPromotions.map(normalizePromotion), [rawPromotions]);

    const getOfferDateTime = (offer: PromotionalCard, isEnd: boolean) => {
        const dateValue = isEnd ? offer.endDate : offer.startDate;
        const timeValue = (isEnd ? offer.endTime : offer.startTime) || (isEnd ? '23:59' : '00:00');
        const parsed = new Date(`${dateValue}T${timeValue}:00`);
        if (Number.isNaN(parsed.getTime())) {
            return new Date(dateValue);
        }
        return parsed;
    };

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const active = promotions.filter((offer) => {
                if (!offer.isActive) return false;
                const start = getOfferDateTime(offer, false);
                const end = getOfferDateTime(offer, true);
                return now >= start && now <= end;
            });
            if (active.length === 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const nextEnd = Math.min(...active.map((offer) => getOfferDateTime(offer, true).getTime()));
            const diffMs = Math.max(0, nextEnd - now.getTime());
            const totalSeconds = Math.floor(diffMs / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [promotions]);



    const handlePromotionClick = (offer: PromotionalCard) => {
        const link = (offer.buttonLink || '').trim();
        if (!link) return;
        if (link.startsWith('http://') || link.startsWith('https://')) {
            window.location.href = link;
            return;
        }
        const normalized = link.replace(/^\/+/, '');
        setPage(normalized as Page);
    };

    const now = new Date();
    const activePromotions = promotions.filter((offer) => {
        if (!offer.isActive) return false;
        const start = getOfferDateTime(offer, false);
        const end = getOfferDateTime(offer, true);
        return now >= start && now <= end;
    });

    return (
        <div className="animate-fade-in max-w-6xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-block bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-pulse">
                    عرض محدود الوقت
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                    باقات<span className="text-amber-400"> الزواحف</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    احصل على كل ما تحتاجه في باقة واحدة بسعر مخفض. عروضنا محدودة وتنتهي قريبًا!
                </p>

                {/* Countdown Timer */}
                <div className="glass-medium rounded-2xl p-6 border border-white/10 inline-flex items-center gap-6 mb-8">
                    🕐
                    <div className="flex gap-4">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <div className="text-3xl font-black text-white">{String(value).padStart(2, '0')}</div>
                                <div className="text-xs text-gray-400 uppercase">
                                    {unit === 'days' ? 'يوم' : unit === 'hours' ? 'ساعة' : unit === 'minutes' ? 'دقيقة' : 'ثانية'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {activePromotions.length > 0 ? (
                <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {activePromotions.map((offer) => (
                            <div
                                key={offer.id}
                                className="glass-medium rounded-[3rem] border-2 border-white/10 p-6 transition-all hover:border-amber-500/50 group"
                            >
                                <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 mb-6">
                                    <img
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-2xl font-black mb-2 group-hover:text-amber-400 transition-colors">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">{offer.description}</p>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    {offer.discountPercentage ? (
                                        <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                                            -{offer.discountPercentage}%
                                        </span>
                                    ) : null}
                                    {offer.targetCategory ? (
                                        <span className="px-3 py-1 text-xs font-black rounded-full border border-white/10 text-gray-300">
                                            {offer.targetCategory}
                                        </span>
                                    ) : null}
                                </div>
                                <button
                                    onClick={() => handlePromotionClick(offer)}
                                    className="w-full bg-amber-500 text-gray-900 font-black py-3 px-6 rounded-2xl hover:bg-amber-400 transition-all"
                                >
                                    {offer.buttonText || 'Learn more'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-16 text-center text-gray-400 font-bold border-2 border-dashed border-white/10 rounded-[2rem] py-16 glass-medium">
                    لا توجد عروض ترويجية نشطة حالياً.
                </div>
            )}

            {/* Features Section */}
            <div className="glass-dark rounded-[3rem] p-12 border border-white/10 mb-16">
                <h2 className="text-3xl font-black text-center mb-12">لماذا تختار باقاتنا؟</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                            💰
                        </div>
                        <h3 className="text-xl font-black mb-3">توفير يصل إلى 27%</h3>
                        <p className="text-gray-400">احصل على جميع المستلزمات بسعر أقل من شرائها منفصلة</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                            🎯
                        </div>
                        <h3 className="text-xl font-black mb-3">مجموعات متوافقة</h3>
                        <p className="text-gray-400">جميع العناصر في الباقة مصممة لتعمل معًا بشكل مثالي</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                            🛡️
                        </div>
                        <h3 className="text-xl font-black mb-3">ضمان الجودة</h3>
                        <p className="text-gray-400">جميع المنتجات في الباقات معتمدة ومضمونة من Reptile House</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <h2 className="text-3xl font-black mb-4">لا تفوت هذه الفرصة!</h2>
                <p className="text-gray-300 mb-8">العروض تنتهي قريبًا. احصل على باقتك الآن قبل نفاد الكمية.</p>
                <button
                    onClick={() => setPage('showcase')}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-black px-12 py-4 rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-3 text-lg mx-auto active:scale-95"
                >
                    استكشف جميع المنتجات
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default OffersPage;
