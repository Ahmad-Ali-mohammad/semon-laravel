
import React, { useMemo } from 'react';
import { useDatabase } from '../../../contexts/DatabaseContext';
import { Order } from '../../../types';

const getStatusPill = (status: Order['status']) => {
    const baseClasses = 'px-2 py-1 text-xs font-bold rounded-full';
    switch (status) {
        case 'تم التوصيل': return `${baseClasses} bg-green-500/20 text-green-300`;
        case 'تم الشحن': return `${baseClasses} bg-blue-500/20 text-blue-300`;
        case 'قيد المعالجة': return `${baseClasses} bg-yellow-500/20 text-yellow-300`;
        case 'تم التأكيد': return `${baseClasses} bg-indigo-500/20 text-indigo-300`;
        default: return `${baseClasses} bg-gray-500/20 text-gray-300`;
    }
}

const RecentOrdersWidget: React.FC = () => {
    const { orders } = useDatabase();
    
    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [orders]);

    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full">
            <h2 className="text-xl font-bold mb-4">الطلبات الحديثة</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-2">رقم الطلب</th>
                            <th className="p-2">التاريخ</th>
                            <th className="p-2">الحالة</th>
                            <th className="p-2">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id} className="border-b border-white/5 last:border-0">
                                <td className="p-2 font-poppins">{order.id}</td>
                                <td className="p-2">{order.date}</td>
                                <td className="p-2"><span className={getStatusPill(order.status)}>{order.status}</span></td>
                                <td className="p-2 font-poppins">${order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersWidget;
