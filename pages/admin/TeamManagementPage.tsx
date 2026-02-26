
import React, { useState, useMemo, useRef } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { SearchIcon, UserIcon, TrashIcon, PlusIcon, EditIcon, ImageIcon, CheckIcon, XIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ConfirmationModal';
import { TeamMember } from '../../types';

const TeamManagementPage: React.FC = () => {
    const { teamMembers, addTeamMember, deleteTeamMember, toggleTeamMemberVisibility, resolveMediaUrl } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [memberForm, setMemberForm] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        bio: '',
        isActive: true
    });

    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    });

    const filteredMembers = useMemo(() => {
        return teamMembers.filter(m => 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            m.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teamMembers, searchTerm]);

    const handleOpenModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setMemberForm({ ...member });
            setImagePreview(member.imageUrl ? resolveMediaUrl(member.imageUrl) : null);
        } else {
            setEditingMember(null);
            setMemberForm({
                name: '',
                role: '',
                bio: '',
                isActive: true
            });
            setImagePreview(null);
        }
        setSelectedImage(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberForm.name || !memberForm.role) {
            alert('يرجى تعبئة الاسم والدور الوظيفي');
            return;
        }

        try {
            setIsSaving(true);
            await addTeamMember(memberForm as TeamMember, selectedImage || undefined);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('فشل حفظ البيانات');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (id: string | number) => {
        setConfirmDelete({ isOpen: true, id: Number(id) });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id) {
            deleteTeamMember(confirmDelete.id);
        }
        setConfirmDelete({ isOpen: false, id: null });
    };

    return (
        <div className="space-y-8 animate-fade-in text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 text-white">إدارة فريق العمل</h1>
                    <p className="text-gray-500 font-bold">إدارة أعضاء الفريق الذين يظهرون في صفحة "عن المتجر"</p>
                </div>
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="ابحث عن عضو فريق..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 ps-14 outline-none focus:ring-2 focus:ring-amber-500/50 text-white transition-all shadow-inner"
                    />
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-500 text-gray-900 font-black px-8 py-4 rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    إضافة عضو جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map(member => (
                    <div key={member.id} className="glass-dark rounded-[2rem] border border-white/10 overflow-hidden group">
                        <div className="aspect-[4/5] relative overflow-hidden">
                            <img 
                                src={resolveMediaUrl(member.imageUrl)} 
                                alt={member.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                            
                            <div className="absolute top-4 left-4 flex gap-2">
                                <button 
                                    onClick={() => handleOpenModal(member)}
                                    title="تعديل"
                                    aria-label="تعديل بيانات العضو"
                                    className="p-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-amber-500 hover:text-black transition-all border border-white/10"
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(member.id)}
                                    title="حذف"
                                    aria-label="حذف العضو"
                                    className="p-3 bg-red-500/10 backdrop-blur-md text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={() => toggleTeamMemberVisibility(Number(member.id))}
                                title={member.isActive ? 'إخفاء' : 'إظهار'}
                                aria-label={member.isActive ? 'إخفاء العضو' : 'إظهار العضو'}
                                className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase backdrop-blur-md border transition-all ${member.isActive 
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}
                            >
                                {member.isActive ? 'نشط' : 'مخفي'}
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-black text-white mb-1">{member.name}</h3>
                            <p className="text-amber-500 text-sm font-bold mb-4">{member.role}</p>
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{member.bio || 'لا يوجد نبذة تعريفية...'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                    <UserIcon className="w-16 h-16 text-gray-700 mb-4 opacity-20" />
                    <p className="text-gray-500 font-bold italic">لا يوجد أعضاء فريق يطابقون بحثك</p>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                title="حذف عضو فريق"
                message="هل أنت متأكد من حذف هذا العضو؟ سيتم إزالته من الموقع فوراً."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <button
                        type="button"
                        title="إغلاق"
                        aria-label="إغلاق الخلفية"
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl glass-dark border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-6 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-black">{editingMember ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}</h2>
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                title="إغلاق"
                                aria-label="إغلاق النافذة"
                                className="text-gray-500 hover:text-white transition-all"
                            >
                                <XIcon className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="group relative">
                                    <label htmlFor="team-image-file" className="text-[10px] font-black text-amber-500 uppercase mb-2 block tracking-widest">الصورة الشخصية</label>
                                    <button 
                                        type="button"
                                        id="team-image-file-trigger"
                                        onClick={() => fileInputRef.current?.click()}
                                        title="رفع صورة"
                                        aria-label="رفع صورة العضو"
                                        className="w-full aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-amber-500/50 transition-all overflow-hidden relative"
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <EditIcon className="w-8 h-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <ImageIcon className="w-12 h-12 text-gray-600 mb-4 mx-auto" />
                                                <p className="text-xs text-gray-500 font-bold">انقر لرفع صورة</p>
                                            </div>
                                        )}
                                    </button>
                                    <input 
                                        type="file" 
                                        id="team-image-file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden" 
                                        accept="image/*"
                                        title="ملف الصورة"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="member-name" className="text-[10px] font-black text-amber-500 uppercase mb-2 block tracking-widest">الاسم الكامل</label>
                                    <input 
                                        id="member-name"
                                        required 
                                        value={memberForm.name} 
                                        onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))} 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                                        placeholder="مثال: أحمد محمد"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="member-role" className="text-[10px] font-black text-amber-500 uppercase mb-2 block tracking-widest">المسمى الوظيفي</label>
                                    <input 
                                        id="member-role"
                                        required 
                                        value={memberForm.role} 
                                        onChange={(e) => setMemberForm(prev => ({ ...prev, role: e.target.value }))} 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                                        placeholder="مثال: مدير الإنتاج"
                                    />
                                </div>
                                <div className="flex items-center gap-4 py-2">
                                    <label htmlFor="team-member-active" className="text-[10px] font-black text-amber-500 uppercase tracking-widest">حالة النشاط</label>
                                    <button
                                        type="button"
                                        id="team-member-active"
                                        onClick={() => setMemberForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                        title={memberForm.isActive ? 'تعطيل' : 'تفعيل'}
                                        aria-label={memberForm.isActive ? 'تعطيل العضو' : 'تفعيل العضو'}
                                        className={`w-14 h-7 rounded-full transition-all relative border ${memberForm.isActive ? 'bg-amber-500 border-amber-600' : 'bg-gray-800 border-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${memberForm.isActive ? 'right-7' : 'right-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="member-bio" className="text-[10px] font-black text-amber-500 uppercase mb-2 block tracking-widest">النبذة التعريفية</label>
                            <textarea 
                                id="member-bio"
                                value={memberForm.bio} 
                                onChange={(e) => setMemberForm(prev => ({ ...prev, bio: e.target.value }))} 
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold resize-none"
                                placeholder="اكتب هنا نبذة مختصرة عن العضو وإنجازاته..."
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex-1 bg-amber-500 text-gray-900 font-black py-5 rounded-[1.5rem] hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isSaving ? (
                                    <div className="w-6 h-6 border-4 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CheckIcon className="w-6 h-6" />
                                        <span>{editingMember ? 'تحديث البيانات' : 'إضافة العضو'}</span>
                                    </>
                                )}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-10 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold hover:bg-white/10 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeamManagementPage;
