import React, { useState, useRef } from 'react';
import { Post, User } from '../types';
import { X, Image as ImageIcon, Sparkles, Loader2, Smile, Trash2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface CreatePostModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (content: string, images?: string[], location?: string) => void;
}

const POST_QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '✨', '🔥', '🎉', '🚀', '🙌', '💯'];

export default function CreatePostModal({
  currentUser,
  isOpen,
  onClose,
  onSubmitPost,
 }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const maxRemaining = 15 - uploadedImages.length;
    if (maxRemaining <= 0) {
      alert("Hanya bisa mengunggah maksimal 15 foto.");
      return;
    }

    const filesToProcess = filesArray.slice(0, maxRemaining);
    let processedCount = 0;
    const loadedUrls: string[] = [];

    filesToProcess.forEach((file) => {
      compressImage(file as File)
        .then((compressedUrl) => {
          if (compressedUrl) {
            loadedUrls.push(compressedUrl);
          }
          processedCount++;
          if (processedCount === filesToProcess.length) {
            setUploadedImages(prev => [...prev, ...loadedUrls]);
          }
        })
        .catch((err) => {
          console.error("Compression failed:", err);
          processedCount++;
          if (processedCount === filesToProcess.length) {
            setUploadedImages(prev => [...prev, ...loadedUrls]);
          }
        });
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Submits post with home location dynamically matching user regional preference safely
      onSubmitPost(content, uploadedImages, (currentUser?.location || "Indonesia").split(',')[0]);
      setContent('');
      setUploadedImages([]);
      setShowEmojiSelector(false);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-white border border-gray-150 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-gray-900 flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-blue-500" />
            Buat Postingan Baru
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card row info */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.displayName} 
            className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500"
          />
          <div className="text-left">
            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-950">{currentUser.displayName}</h4>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
              {(currentUser?.location || "Indonesia").split(',')[0]}
            </span>
          </div>
        </div>

        {/* Text Input area - Taller rows for better readability */}
        <div className="space-y-4">
          <textarea
            placeholder="Bagikan ide bagus, berita daerah, atau apa saja yang sedang Anda pikirkan untuk dibaca oleh seluruh UMKM di Indonesia..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            maxLength={500}
            className="w-full border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-500 bg-white p-4 rounded-2xl focus:outline-hidden leading-relaxed resize-none scrollbar-thin"
          />
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Mendukung upload foto & penyisipan emoji</span>
            <span>{content.length}/500 karakter</span>
          </div>

          {/* Picture Attachment Preview */}
          {uploadedImages.length > 0 && (
            <div className="space-y-1.5 animate-fade-in text-left">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                <span>Kolase Foto Terpilih ({uploadedImages.length}/15)</span>
                <button 
                  onClick={() => setUploadedImages([])}
                  className="text-rose-500 hover:text-rose-600 transition-colors uppercase cursor-pointer text-[10px] font-black"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 bg-gray-50/50 dark:bg-neutral-50/5 p-2 rounded-2xl border border-gray-150 max-h-48 overflow-y-auto scrollbar-none">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 bg-neutral-900">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      title="Hapus foto ini"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 text-[8px] text-white text-center font-bold font-mono py-0.5">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick inline Emojis selection drawer */}
          {showEmojiSelector && (
            <div className="p-3 bg-white rounded-2xl border border-gray-150 flex flex-wrap gap-2.5 animate-slide-in">
              {POST_QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setContent(prev => prev + emoji)}
                  className="p-1.5 text-base hover:scale-125 transition-transform duration-100 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
              <button 
                onClick={() => setShowEmojiSelector(false)}
                className="p-1 px-2.5 ml-auto text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Social posting upload action tools */}
          <div className="flex gap-2.5 border-t border-gray-100 pt-4 items-center justify-between">
            <div className="flex gap-2">
              {/* Custom Image Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-205 hover:border-emerald-500 rounded-xl text-xs text-gray-600 bg-white cursor-pointer hover:bg-emerald-50/20"
                title="Unggah Gambar Kustom"
              >
                <ImageIcon className="h-4.5 w-4.5 text-emerald-500" />
                <span className="font-bold text-[10px]">Tambahkan Gambar ({uploadedImages.length}/15)</span>
              </button>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleImageUploadChange} 
              />

              {/* Emoji quick activator */}
              <button
                type="button"
                onClick={() => setShowEmojiSelector(!showEmojiSelector)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-205 hover:border-emerald-500 rounded-xl text-xs text-gray-600 bg-white cursor-pointer hover:bg-emerald-50/20"
              >
                <Smile className="h-4.5 w-4.5 text-amber-500" />
                <span className="font-bold text-[10px]">Emoji</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menerbitkan Ide...
                </>
              ) : (
                'Kirim Ke Feed'
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
