
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Service } from '../../types';
import { EditIcon, TrashIcon, PlusIcon, SearchIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const ServicesManagementPage: React.FC = () => {
    const { services, addService, deleteService, toggleServiceVisibility } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const filteredServices = services
        .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.sortOrder - b.sortOrder);

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setEditingService({ ...service });
        } else {
            setEditingService({
                id: 0,
                title: '',
                description: '',
                icon: '',
                price: '',
                highlight: '',
                isActive: true,
                sortOrder: services.length + 1,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            addService(editingService as Service);
            setIsModalOpen(false);
            setEditingService(null);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            deleteService(id);
        }
    };

    return (
        <div className="animate-fade-in space-y-8 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">إدارة الخدمات</h1>
                    <p className="text-gray-400">تحكم في الخدمات المعروضة للعملاء مثل الإيواء والاستشارات والتدريب</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <input
                        type="text"
                        placeholder="بحث في الخدمات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-4 px-6 ps-14 text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-500 text-gray-900 font-black px-8 py-4 rounded-xl hover:bg-amber-400 flex items-center gap-2 shadow-xl shadow-amber-500/10 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    إضافة خدمة
                </button>
            </div>

            <div className="glass-medium rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <table className="w-full text-right">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <tr>
                            <th className="p-6">الخدمة</th>
                            <th className="p-6">السعر</th>
                            <th className="p-6">الترتيب</th>
                            <th className="p-6">الحالة</th>
                            <th className="p-6 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <div className="text-6xl mb-4">🔧</div>
                                    <p className="text-lg font-bold">لا توجد خدمات حالياً</p>
                                    <p className="text-sm mt-1">اضغط على "إضافة خدمة" لإنشاء خدمة جديدة</p>
                                </td>
                            </tr>
                        ) : filteredServices.map(service => (
                            <tr key={service.id} className="hover:bg-white/5 group transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        {service.icon && (
                                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shadow-lg">
                                                {service.icon}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-black text-lg text-white block">{service.title}</span>
                                            <span className="text-xs text-gray-500 line-clamp-1">{service.description}</span>
                                            {service.highlight && (
                                                <span className="text-[10px] text-amber-400 font-bold mt-1 block">{service.highlight}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="text-amber-400 font-black text-sm">{service.price || 'غير محدد'}</span>
                                </td>
                                <td className="p-6">
                                    <span className="text-gray-400 font-poppins text-sm">{service.sortOrder}</span>
                                </td>
                                <td className="p-6">
                                    <button
                                        onClick={() => toggleServiceVisibility(service.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all ${
                                            service.isActive
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}
                                    >
                                        {service.isActive ? 'نشط' : 'مخفي'}
                                    </button>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(service)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all" title="تعديل">
                                            <EditIcon className="w-5 h-5 text-amber-500" />
                                        </button>
                                        <button onClick={() => handleDelete(service.id)} className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="حذف">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl w-full h-full cursor-default"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="إغلاق النافذة"
                    ></button>
                    <form onSubmit={handleSave} className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[3rem] p-12 space-y-8 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-4xl font-black tracking-tighter">{editingService?.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h2>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="service-title" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">اسم الخدمة</label>
                                    <input id="service-title" required placeholder="مثال: خدمة الإيواء المؤقت..." className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-amber-500" value={editingService?.title || ''} onChange={e => setEditingService({...editingService, title: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="service-icon" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">أيقونة (إيموجي)</label>
                                    <input id="service-icon" placeholder="مثال: 🏠 أو 🩺 أو 📋..." className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500" value={editingService?.icon || ''} onChange={e => setEditingService({...editingService, icon: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="service-price" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">السعر (اختياري)</label>
                                    <input id="service-price" placeholder="مثال: 5,000 ل.س / يوم..." className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500" value={editingService?.price || ''} onChange={e => setEditingService({...editingService, price: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="service-highlight" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">نص مميز (اختياري)</label>
                                    <input id="service-highlight" placeholder="مثال: الأكثر طلباً..." className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500" value={editingService?.highlight || ''} onChange={e => setEditingService({...editingService, highlight: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="service-sort" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">ترتيب العرض</label>
                                    <input id="service-sort" type="number" min="1" required className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500" value={editingService?.sortOrder ?? 1} onChange={e => setEditingService({...editingService, sortOrder: Number.parseInt(e.target.value) || 1})} />
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <label htmlFor="service-active" className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="service-active"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={editingService?.isActive ?? true}
                                            onChange={e => setEditingService({...editingService, isActive: e.target.checked})}
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                        <span className="mr-3 text-sm font-bold text-gray-400">نشط ومرئي للعملاء</span>
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="service-description" className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">وصف الخدمة</label>
                                <textarea id="service-description" required rows={5} placeholder="اكتب وصفاً تفصيلياً للخدمة المقدمة..." className="w-full bg-[#1a1c23] border border-white/10 rounded-3xl p-6 text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-loose" value={editingService?.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="submit" className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 text-xl">حفظ الخدمة</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-white/5 rounded-2xl border border-white/10 font-bold hover:bg-white/10 transition-all">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={helpContent.services_mgmt?.title || 'إدارة الخدمات'}
                sections={helpContent.services_mgmt?.sections || []}
            />
        </div>
    );
};

export default ServicesManagementPage;
