import React, { useMemo } from 'react';
import { useDatabase } from '../../../contexts/DatabaseContext';
// FIX: Import `ClipboardListIcon` to resolve reference error.
import { PackageIcon, ShoppingCartIcon, UserIcon, ClipboardListIcon } from '../../../components/icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center space-x-4 space-x-reverse">
        <div className="bg-amber-500/20 text-amber-300 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const StatsOverviewWidget: React.FC = () => {
    const { orders, products, users, isLoading } = useDatabase();

    const stats = useMemo(() => {
        const totalSales = orders
            .filter(o => o.status === 'تم التوصيل')
            .reduce((sum, o) => sum + (o.total || 0), 0);
        
        return [
            { title: "إجمالي المبيعات", value: `${totalSales.toLocaleString()} ل.س`, icon: <ShoppingCartIcon className="w-6 h-6" /> },
            { title: "إجمالي الطلبات", value: orders.length.toString(), icon: <ClipboardListIcon className="w-6 h-6" /> },
            { title: "إجمالي المستخدمين", value: users.length.toString(), icon: <UserIcon className="w-6 h-6" /> },
            { title: "المنتجات المتاحة", value: products.filter(p => p.isAvailable).length.toString(), icon: <PackageIcon className="w-6 h-6" /> },
        ];
    }, [orders, products, users]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse">
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="bg-amber-500/10 p-3 rounded-full w-12 h-12"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-24"></div>
                                <div className="h-6 bg-white/10 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>
    );
};

export default StatsOverviewWidget;