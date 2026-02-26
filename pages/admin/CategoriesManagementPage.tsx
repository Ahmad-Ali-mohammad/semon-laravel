
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { PlusIcon, TrashIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ConfirmationModal';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const CategoriesManagementPage: React.FC = () => {
    const { 
        customCategories, 
        customSpecies, 
        addCustomCategory, 
        addCustomSpecies,
        deleteCustomCategory,
        deleteCustomSpecies
    } = useDatabase();

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'categories' | 'species'>('categories');
    
    const [newCategory, setNewCategory] = useState({ value: '', label: '' });
    const [newSpecies, setNewSpecies] = useState('');
    
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; type: 'category' | 'species'; id: number | null }>({
        isOpen: false,
        type: 'category',
        id: null
    });

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.value || !newCategory.label) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        addCustomCategory(newCategory);
        setNewCategory({ value: '', label: '' });
    };

    const handleAddSpecies = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSpecies) {
            alert('يرجى إدخال اسم الفصيلة');
            return;
        }
        addCustomSpecies(newSpecies);
        setNewSpecies('');
    };

    const handleDeleteClick = (type: 'category' | 'species', id: number) => {
        setConfirmDelete({ isOpen: true, type, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            if (confirmDelete.type === 'category') {
                deleteCustomCategory(confirmDelete.id);
            } else {
                deleteCustomSpecies(confirmDelete.id);
            }
        }
        setConfirmDelete({ isOpen: false, type: 'category', id: null });
    };

    return (
        <div className="space-y-8 animate-fade-in text-right">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black mb-2">إدارة التصنيفات والفصائل</h1>
                    <p className="text-gray-400">التحكم في تصنيفات المنتجات وأنواع الزواحف</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'categories' ? 'bg-amber-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                    📁 التصنيفات العامة
                </button>
                <button
                    onClick={() => setActiveTab('species')}
                    className={`px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'species' ? 'bg-amber-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                    🦎 الفصائل والأنواع
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
                {/* Add Form */}
                <div className="lg:col-span-1">
                    <div className="glass-medium p-8 rounded-[2.5rem] border border-white/10 sticky top-8">
                        <h2 className="text-2xl font-black mb-6">
                            {activeTab === 'categories' ? 'إضافة تصنيف جديد' : 'إضافة فصيلة جديدة'}
                        </h2>
                        
                        {activeTab === 'categories' ? (
                            <form onSubmit={handleAddCategory} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="cat_label" className="text-xs font-black text-gray-500 uppercase tracking-widest block">اسم التصنيف (بالعربي)</label>
                                    <input
                                        id="cat_label"
                                        type="text"
                                        value={newCategory.label}
                                        onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                                        placeholder="مثلاً: أفاعي"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="cat_value" className="text-xs font-black text-gray-500 uppercase tracking-widest block">المعرف (English ID)</label>
                                    <input
                                        id="cat_value"
                                        type="text"
                                        value={newCategory.value}
                                        onChange={e => setNewCategory({ ...newCategory, value: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold font-poppins"
                                        placeholder="e.g. snakes"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-amber-500 text-gray-900 font-black py-4 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    إضافة التصنيف
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAddSpecies} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="species_name" className="text-xs font-black text-gray-500 uppercase tracking-widest block">اسم الفصيلة</label>
                                    <input
                                        id="species_name"
                                        type="text"
                                        value={newSpecies}
                                        onChange={e => setNewSpecies(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                                        placeholder="مثلاً: بواء عاصرة"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-amber-500 text-gray-900 font-black py-4 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    إضافة الفصيلة
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* List Content */}
                <div className="lg:col-span-2">
                    <div className="glass-medium rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl bg-[#11141b]/60">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                    <th className="p-6">الاسم</th>
                                    <th className="p-6">{activeTab === 'categories' ? 'المعرف' : 'الرقم المرجعي'}</th>
                                    <th className="p-6 text-left">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activeTab === 'categories' ? (
                                    customCategories.map(cat => (
                                        <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-6 font-bold">{cat.label}</td>
                                            <td className="p-6 text-gray-400 font-poppins text-sm">{cat.value}</td>
                                            <td className="p-6">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteClick('category', cat.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        aria-label="حذف"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    customSpecies.map(spec => (
                                        <tr key={spec.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-6 font-bold">{spec.name}</td>
                                            <td className="p-6 text-gray-400 font-poppins text-sm">#{spec.id}</td>
                                            <td className="p-6">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteClick('species', spec.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        aria-label="حذف"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {((activeTab === 'categories' && customCategories.length === 0) || (activeTab === 'species' && customSpecies.length === 0)) && (
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center text-gray-500 italic">
                                            لا توجد بيانات مضافة حالياً
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من حذف هذا ${confirmDelete.type === 'category' ? 'التصنيف' : 'الفصيلة'}؟ قد يؤثر ذلك على تصفية المنتجات المرتبطة.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, type: 'category', id: null })}
            />

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.categories}
            />
        </div>
    );
};

export default CategoriesManagementPage;
