
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { TruckIcon, PackageIcon, CheckCircleIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';
import { Order } from '../../types';

const ShippingPage: React.FC = () => {
    const { orders, updateOrder } = useDatabase();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    
    const shippingOrders = orders.filter(o => o.status !== 'تم التوصيل');

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black">الشحن والتوصيل</h1>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-medium p-8 rounded-[2rem] flex items-center justify-between border border-white/10">
                    <div>
                        <p className="text-gray-400 font-bold mb-1">في انتظار الشحن</p>
                        <p className="text-3xl font-black font-poppins">{orders.filter(o => o.status === 'قيد المعالجة' || o.status === 'تم التأكيد').length}</p>
                    </div>
                    <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl"><PackageIcon className="w-8 h-8" /></div>
                </div>
                <div className="glass-medium p-8 rounded-[2rem] flex items-center justify-between border border-white/10">
                    <div>
                        <p className="text-gray-400 font-bold mb-1">قيد التوصيل الآن</p>
                        <p className="text-3xl font-black font-poppins">{orders.filter(o => o.status === 'تم الشحن').length}</p>
                    </div>
                    <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl"><TruckIcon className="w-8 h-8" /></div>
                </div>
                <div className="glass-medium p-8 rounded-[2rem] flex items-center justify-between border border-white/10">
                    <div>
                        <p className="text-gray-400 font-bold mb-1">تم إنجازها اليوم</p>
                        <p className="text-3xl font-black font-poppins">3</p>
                    </div>
                    <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl"><CheckCircleIcon className="w-8 h-8" /></div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-black px-2">الطلبات النشطة للشحن</h3>
                {shippingOrders.map(order => (
                    <div key={order.id} className="glass-dark border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-amber-500/30 transition-all shadow-xl">
                        <div className="flex -space-x-4 space-x-reverse">
                            {order.items.map((item) => (
                                <img 
                                    key={item.reptileId} 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    className="w-16 h-16 rounded-2xl border-4 border-[#0a0c10] object-cover shadow-2xl" 
                                />
                            ))}
                        </div>
                        
                        <div className="flex-1 text-center md:text-right">
                            <p className="text-xs text-gray-500 font-black mb-1 uppercase tracking-widest">رقم الطلب</p>
                            <h4 className="text-2xl font-black font-poppins">#{order.id}</h4>
                        </div>

                        <div className="flex-1 text-center md:text-right">
                            <p className="text-xs text-gray-500 font-black mb-1 uppercase tracking-widest">تاريخ الطلب</p>
                            <p className="font-bold text-gray-300">{order.date}</p>
                        </div>

                        <div className="w-full md:w-64">
                            <label htmlFor={`order-status-${order.id}`} className="text-[10px] text-amber-500/60 font-black uppercase tracking-widest mb-2 block">تحديث حالة التوصيل</label>
                            <select 
                                id={`order-status-${order.id}`}
                                value={order.status}
                                onChange={(e) => updateOrder(order.id, e.target.value as Order['status'])}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none text-center cursor-pointer"
                            >
                                <option value="تم التأكيد">تم التأكيد</option>
                                <option value="قيد المعالجة">قيد المعالجة</option>
                                <option value="تم الشحن">تم الشحن (خارج للتوصيل)</option>
                                <option value="تم التوصيل">تم التوصيل بنجاح</option>
                            </select>
                        </div>
                        
                        <div className="px-6 py-3 bg-amber-500 text-gray-900 rounded-xl font-black text-xs font-poppins shadow-lg">
                            ${order.total}
                        </div>
                    </div>
                ))}
                {shippingOrders.length === 0 && (
                    <div className="text-center py-20 text-gray-600 font-bold border-2 border-dashed border-white/5 rounded-[2rem]">
                        لا توجد طلبات شحن نشطة حالياً.
                    </div>
                )}
            </div>

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.shipping}
            />
        </div>
    );
};

export default ShippingPage;
