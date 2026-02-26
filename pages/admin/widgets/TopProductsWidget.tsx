
import React from 'react';
import { useDatabase } from '../../../contexts/DatabaseContext';

const TopProductsWidget: React.FC = () => {
    const { products } = useDatabase();
    const topProducts = products.filter(p => p.rating >= 4.8).slice(0, 5);

    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full">
            <h2 className="text-xl font-bold mb-4 text-right">المنتجات الأكثر مبيعاً</h2>
            <div className="space-y-3">
                {topProducts.map(product => (
                    <div key={product.id} className="flex items-center space-x-3 space-x-reverse">
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 text-right">
                            <p className="font-bold text-sm">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.species}</p>
                        </div>
                        <p className="font-bold font-poppins text-amber-500">${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopProductsWidget;
