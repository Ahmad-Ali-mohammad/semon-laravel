
import React, { useState, useEffect, useRef } from 'react';
import { mediaService } from '../../services/media';
import { MediaItem } from '../../types';
import { CloudUploadIcon, TrashIcon, SearchIcon, ImageIcon, CheckCircleIcon } from '../../components/icons';
import HelpButton from '../../components/HelpButton';
import HelpModal from '../../components/HelpModal';
import { helpContent } from '../../constants/helpContent';

const MediaLibraryPage: React.FC = () => {
    const [images, setImages] = useState<MediaItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        mediaService.getImages()
            .then(setImages)
            .catch(() => setImages([]));
    }, []);

    const processFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(file => mediaService.uploadImage(file));
            const newImgs = await Promise.all(uploadPromises);
            setImages(prev => [...newImgs, ...prev]);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => processFiles(e.target.files);

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleDelete = async (id: string) => {
        if (globalThis.confirm('U?U, O?U+O? U.O?O?U?O_ U.U+ O-O?U? U?O?U? OU,O?U^O?Oc U+U?OO?USOU<OY')) {
            try {
                await mediaService.deleteImage(id);
                setImages(prev => prev.filter(img => img.id !== id));
            } catch (error) {
                // Log error silently
            }
        }
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredImages = images.filter(img => 
        img.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in text-right pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black mb-2 text-white">مكتبة الوسائط</h1>
                        <p className="text-gray-500 font-bold">إدارة الصور والملفات المرئية للمتجر بالكامل.</p>
                    </div>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <input 
                            type="text" 
                            placeholder="بحث في الصور..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-4 px-6 ps-14 text-white outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Drop Zone */}
            <button
                type="button"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                aria-label="منطقة رفع الصور - اضغط لاختيار الملفات أو اسحب الصور هنا"
                className={`relative border-2 border-dashed rounded-[3rem] p-16 text-center transition-all duration-500 cursor-pointer group overflow-hidden ${
                    isDragging
                        ? 'border-amber-500 bg-amber-500/10 scale-[0.99]'
                        : 'border-white/10 bg-white/5 hover:border-amber-500/30'
                }`}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10 flex flex-col items-center space-y-6">
                    <div className={`p-6 rounded-3xl transition-all duration-500 ${isDragging ? 'bg-amber-500 text-gray-900 scale-110 rotate-12' : 'bg-white/5 text-amber-500'}`}>
                        <CloudUploadIcon className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white mb-2">اسحب الصور هنا أو اضغط للرفع</h2>
                        <p className="text-gray-500 font-bold">دقة عالية، حجم ملف لا يتجاوز 5MB (JPG, PNG, WebP)</p>
                    </div>
                    {isUploading && (
                        <div className="flex items-center gap-3 bg-gray-900/80 px-6 py-3 rounded-2xl border border-white/10 animate-pulse">
                            <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full" />
                            <span className="text-amber-500 font-black text-sm uppercase">جاري الرفع والمعالجة...</span>
                        </div>
                    )}
                </div>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleUpload} aria-label="رفع الصور" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {filteredImages.map(img => (
                    <div key={img.id} className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 hover:border-amber-500 transition-all shadow-xl animate-scale-in">
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-6 text-center space-y-4">
                            <p className="text-[10px] text-white font-black truncate w-full px-2">{img.name}</p>
                            <span className="text-[8px] text-gray-500 font-poppins">{img.size}</span>
                            
                            <div className="flex gap-2 w-full mt-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(img.url, img.id); }}
                                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${copiedId === img.id ? 'bg-green-500 text-white' : 'bg-amber-500 text-gray-900 hover:bg-amber-400'}`}
                                >
                                    {copiedId === img.id ? 'تم النسخ!' : 'رابط الصورة'}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                                    className="p-2.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                                    aria-label={`حذف ${img.name}`}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {copiedId === img.id && (
                            <div className="absolute top-4 left-4 text-green-400 bg-black/60 p-1.5 rounded-full backdrop-blur-md">
                                <CheckCircleIcon className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredImages.length === 0 && !isUploading && (
                <div className="py-24 glass-medium rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <ImageIcon className="w-16 h-16 text-gray-500" />
                    <p className="text-xl font-black">لا توجد صور في المكتبة بعد</p>
                </div>
            )}

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                content={helpContent.media}
            />
        </div>
    );
};

export default MediaLibraryPage;
