
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { SearchIcon, UserIcon, TrashIcon, PlusIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ConfirmationModal';
import { UserRole } from '../../types';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const UsersManagementPage: React.FC = () => {
    const { users, updateUser, createUser, deleteUser, toggleUserStatus } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as UserRole,
        status: 'active' as 'active' | 'inactive'
    });
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    const filteredUsers = useMemo(() => {
        return users.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (userToUpdate) {
            updateUser({ ...userToUpdate, role: newRole });
        }
    };

    const handleStatusToggle = (userId: string) => {
        toggleUserStatus(userId);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert('يرجى تعبئة الاسم والبريد وكلمة المرور');
            return;
        }
        try {
            setIsSaving(true);
            await createUser(newUser);
            setIsModalOpen(false);
            setNewUser({ name: '', email: '', password: '', role: 'user', status: 'active' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'فشل إنشاء المستخدم';
            alert(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setConfirmDelete({ isOpen: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id) {
            deleteUser(confirmDelete.id);
        }
        setConfirmDelete({ isOpen: false, id: null });
    };

    const getRoleBadgeClasses = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'manager': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'editor': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-green-500/10 text-green-400 border-green-500/20';
        }
    };

    const getRoleLabel = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'مسؤول نظام';
            case 'manager': return 'مدير متجر';
            case 'editor': return 'محرر محتوى';
            default: return 'عميل مسجل';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black mb-2 text-white">إدارة المستخدمين</h1>
                        <p className="text-gray-500 font-bold">إدارة حسابات الموظفين والعملاء وتحديد الصلاحيات</p>
                    </div>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                </div>
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="ابحث عن مستخدم بالاسم أو البريد..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 ps-14 outline-none focus:ring-2 focus:ring-amber-500/50 text-white transition-all shadow-inner"
                    />
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-500 text-gray-900 font-black px-8 py-4 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    إضافة مستخدم
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <p className="text-gray-400 text-sm font-bold mb-1">إجمالي الحسابات</p>
                    <p className="text-3xl font-black font-poppins">{users.length}</p>
                </div>
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <p className="text-gray-400 text-sm font-bold mb-1">المسؤولين والمدراء</p>
                    <p className="text-3xl font-black font-poppins text-amber-500">{users.filter(u => u.role !== 'user').length}</p>
                </div>
                <div className="glass-medium p-6 rounded-[2rem] border border-white/10">
                    <p className="text-gray-400 text-sm font-bold mb-1">العملاء النشطين</p>
                    <p className="text-3xl font-black font-poppins text-green-400">{users.filter(u => u.role === 'user').length}</p>
                </div>
            </div>

            <div className="glass-dark rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl bg-[#11141b]/60">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="p-6">المستخدم</th>
                                <th className="p-6">البريد الإلكتروني</th>
                                <th className="p-6 text-center">الرتبة الحالية</th>
                                <th className="p-6">تعديل الصلاحية</th>
                                <th className="p-6 text-center">الحالة</th>
                                <th className="p-6 text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-gray-800 shrink-0">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-amber-500 font-black text-xl">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-white">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 font-poppins uppercase tracking-widest">UID: {user.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-gray-400 font-poppins text-sm">{user.email}</td>
                                    <td className="p-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getRoleBadgeClasses(user.role)}`}>
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <select 
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            aria-label="تغيير رتبة المستخدم"
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer text-white appearance-none text-center min-w-[140px]"
                                        >
                                            <option value="user">عميل</option>
                                            <option value="editor">محرر</option>
                                            <option value="manager">مدير</option>
                                            <option value="admin">مسؤول</option>
                                        </select>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => handleStatusToggle(user.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${user.status === 'inactive'
                                                ? 'bg-gray-500/10 text-gray-300 border-gray-500/20'
                                                : 'bg-green-500/10 text-green-400 border-green-500/20'}`}
                                        >
                                            {user.status === 'inactive' ? 'غير نشط' : 'نشط'}
                                        </button>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-start opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleDeleteClick(user.id)}
                                                className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                                                title="حذف الحساب"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center">
                            <UserIcon className="w-16 h-16 text-gray-700 mb-4 opacity-20" />
                            <p className="text-gray-500 font-bold italic">لا يوجد مستخدمين يطابقون بحثك</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                title="حذف حساب مستخدم"
                message="هل أنت متأكد من حذف هذا الحساب نهائياً؟ سيتم فقدان كافة سجلات هذا المستخدم وعناوينه وطلباته المرتبطة."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
            />

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.users}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/90"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="إغلاق النافذة"
                    />
                    <form onSubmit={handleCreateUser} className="relative w-full max-w-xl glass-dark border border-white/10 rounded-[2rem] p-8 space-y-6">
                        <h2 className="text-2xl font-black">إضافة مستخدم جديد</h2>
                        <div>
                            <label htmlFor="new-user-name" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">الاسم</label>
                            <input id="new-user-name" required value={newUser.name} onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div>
                            <label htmlFor="new-user-email" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">البريد الإلكتروني</label>
                            <input id="new-user-email" type="email" required value={newUser.email} onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div>
                            <label htmlFor="new-user-password" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">كلمة المرور</label>
                            <input id="new-user-password" type="password" required minLength={8} value={newUser.password} onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="new-user-role" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">الدور</label>
                                <select id="new-user-role" value={newUser.role} onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-3 text-white">
                                    <option value="user">عميل</option>
                                    <option value="editor">محرر</option>
                                    <option value="manager">مدير</option>
                                    <option value="admin">مسؤول</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="new-user-status" className="text-[10px] font-black text-amber-500 uppercase mb-2 block">الحالة</label>
                                <select id="new-user-status" value={newUser.status} onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl p-3 text-white">
                                    <option value="active">نشط</option>
                                    <option value="inactive">غير نشط</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={isSaving} className="flex-1 bg-amber-500 text-gray-900 font-black py-3 rounded-xl disabled:opacity-50">
                                {isSaving ? 'جاري الحفظ...' : 'إنشاء المستخدم'}
                            </button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 bg-white/5 border border-white/10 rounded-xl">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UsersManagementPage;
