
import React from 'react';
import { Page } from '../App';
import { CheckCircleIcon } from '../components/icons';
import { useDatabase } from '../contexts/DatabaseContext';

interface OrderTrackingPageProps {
    setPage: (page: Page) => void;
    orderId: string;
}

const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ setPage, orderId }) => {
    const { orders } = useDatabase();
    const order = orders.find(o => o.id === orderId) || orders.find(o => o.status === 'O?U. OU,O?O?U?USO_');
    
    const statuses = ['تم التأكيد', 'قيد المعالجة', 'تم الشحن', 'تم التوصيل'];
    const currentStatusIndex = order ? statuses.indexOf(order.status) : 0;

    if (!order) {
         return (
             <div className="text-center py-20">
                <h2 className="text-2xl font-bold">لم يتم العثور على الطلب.</h2>
            </div>
         );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">تتبع الطلب</h1>
            <p className="text-center text-lg text-amber-400 font-bold font-poppins mb-12">#{order.id}</p>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-white/10 rounded-full"></div>

                {statuses.map((status, index) => (
                    <div key={status} className="relative mb-12 flex items-center justify-center">
                        <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 ${index <= currentStatusIndex ? 'border-amber-400 bg-amber-400/20' : 'border-gray-600 bg-gray-700'}`}>
                            {index <= currentStatusIndex && <CheckCircleIcon className="w-8 h-8 text-amber-300" />}
                        </div>
                        <div className={`absolute w-2/5 ${index % 2 === 0 ? 'left-4' : 'right-4'}`}>
                            <div className={`p-4 rounded-xl shadow-lg text-center ${index % 2 === 0 ? 'text-left' : 'text-right'} ${index <= currentStatusIndex ? 'bg-white/10 border border-white/20' : 'bg-black/20 border border-transparent'}`}>
                                <h3 className={`font-bold text-lg ${index <= currentStatusIndex ? 'text-white' : 'text-gray-500'}`}>{status}</h3>
                                {index === 0 && <p className="text-sm text-gray-400">{order.date}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="text-center mt-8">
                <button 
                    onClick={() => setPage('home')}
                    className="bg-white/10 text-white font-bold py-2 px-6 rounded-lg hover:bg-white/20 transition-colors"
                >
                    العودة للتسوق
                </button>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
