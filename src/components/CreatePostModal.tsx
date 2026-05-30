import React, { useState, useRef } from 'react';
import { Post, User } from '../types';
import { X, Image as ImageIcon, Sparkles, Loader2, Smile, Trash2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface CreatePostModalProps {
  currentUser: User;
  friends?: any[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (content: string, images?: string[], location?: string) => void;
}

const POST_QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '✨', '🔥', '🎉', '🚀', '🙌', '💯'];

export default function CreatePostModal({
  currentUser,
  friends,
  isOpen,
  onClose,
  onSubmitPost,
 }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
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
          <div className="relative">
            <textarea
              placeholder="Bagikan ide bagus, berita daerah, atau apa saja yang sedang Anda pikirkan untuk dibaca oleh seluruh UMKM di Indonesia... ketik @ untuk menandai teman"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={500}
              className="w-full border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-500 bg-white p-4 rounded-2xl focus:outline-hidden leading-relaxed resize-none scrollbar-thin"
            />
            {/* Real-time Friend Mention suggestions dropdown list */}
            {(() => {
              const mentionMatch = content.match(/@([a-zA-Z0-9_]*)$/);
              if (mentionMatch && friends && friends.length > 0) {
                const query = mentionMatch[1].toLowerCase();
                const matchedFriends = friends.filter(friend => 
                  friend.displayName.toLowerCase().includes(query) ||
                  (friend.username && friend.username.toLowerCase().includes(query))
                );

                if (matchedFriends.length > 0) {
                  return (
                    <div className="absolute left-3 bottom-3 right-3 bg-white/95 border border-blue-200 shadow-xl rounded-2xl p-1.5 z-10 max-h-36 overflow-y-auto space-y-1 text-left animate-slide-in">
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">💡 PILIH TEMAN UNTUK HIT MENTIONS:</p>
                      {matchedFriends.map((friend) => {
                        const tagHandle = '@' + friend.displayName.replace(/[^a-zA-Z0-9]/g, '');
                        return (
                          <button
                            key={friend.id}
                            type="button"
                            onClick={() => {
                              setContent(prev => prev.replace(/@([a-zA-Z0-9_]*)$/, tagHandle + ' '));
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 text-gray-900 rounded-xl transition-all cursor-pointer text-left"
                          >
                            <img src={friend.avatar} className="w-5 h-5 rounded-full object-cover" />
                            <div>
                              <p className="text-[10px] font-bold text-gray-950">{friend.displayName}</p>
                              <p className="text-[7.5px] text-gray-400">@{friend.displayName.toLowerCase().replace(/\s+/g, '_')}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                }
              }
              return null;
            })()}
          </div>
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

          {/* Tag Selector drawer */}
          {showTagSelector && friends && friends.length > 0 && (
            <div className="p-3 bg-blue-50/40 rounded-2xl border border-blue-150 text-left animate-slide-in space-y-2 mt-2">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Pilih Rekan UMKM untuk ditandai:</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {friends.map((friend) => {
                  const tagHandle = '@' + friend.displayName.replace(/[^a-zA-Z0-9]/g, '');
                  return (
                    <button
                      key={friend.id}
                      onClick={() => {
                        setContent(prev => {
                          const spacing = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
                          return prev + spacing + tagHandle + ' ';
                        });
                        setShowTagSelector(false);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-blue-100 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-800 cursor-pointer transition-all"
                    >
                      <img src={friend.avatar} className="w-4 h-4 rounded-full object-cover shrink-0" />
                      <span>{friend.displayName}</span>
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setShowTagSelector(false)}
                className="text-[9px] font-bold text-blue-500 hover:underline uppercase block ml-auto"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Social posting upload action tools */}
          <div className="flex gap-2.5 border-t border-gray-100 pt-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* Custom Image Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-205 hover:border-emerald-500 rounded-xl text-xs text-gray-600 bg-white cursor-pointer hover:bg-emerald-50/20"
                title="Unggah Gambar Kustom"
              >
                <ImageIcon className="h-4.5 w-4.5 text-emerald-500" />
                <span className="font-bold text-[10px]">Gambar ({uploadedImages.length}/15)</span>
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

              {/* Tag Rekan activator */}
              {friends && friends.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTagSelector(!showTagSelector)}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs cursor-pointer transition-all ${
                    showTagSelector ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-gray-205 hover:border-blue-500 text-blue-600 bg-white hover:bg-blue-50/25'
                  }`}
                >
                  <span className="font-bold text-[10px]">🏷️ Tag Teman</span>
                </button>
              )}
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
