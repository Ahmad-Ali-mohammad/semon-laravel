
import React from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useDatabase } from '../contexts/DatabaseContext';
import ReptileCard from '../components/ReptileCard';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../App';

interface WishlistPageProps {
    setPage: (page: Page) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ setPage }) => {
    const { user } = useAuth();
    const { wishlist } = useWishlist();
    const { products } = useDatabase();
    const wishlistedReptiles = products.filter(reptile => wishlist.includes(reptile.id));

    if (!user) {
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">يرجى تسجيل الدخول لعرض قائمة رغباتك.</h2>
          </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-8">قائمة الرغبات</h1>
            {wishlistedReptiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlistedReptiles.map((reptile) => (
                        <ReptileCard key={reptile.id} reptile={reptile} setPage={setPage} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl">
                    <h2 className="text-2xl font-bold">قائمة رغباتك فارغة.</h2>
                    <p className="text-gray-300 mt-4">أضف بعض الزواحف الرائعة لتراها هنا!</p>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
