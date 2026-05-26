import { useState } from 'react';
import { Post, User } from '../types';
import { X, Image, MapPin, Sparkles, Loader2 } from 'lucide-react';

interface CreatePostModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (content: string, image?: string, location?: string) => void;
}

export default function CreatePostModal({
  currentUser,
  isOpen,
  onClose,
  onSubmitPost,
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState(currentUser.location.split(',')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Curated elegant visual backdrops for posts if desired (Indonesia scenic visuals)
  const imagePresets = [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80', // bali
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80', // wooden umkm
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80', // gadget/iphone
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', // sports bike
  ];

  const handleSubmit = () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitPost(content, selectedImage, location);
      setContent('');
      setSelectedImage(undefined);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1e293b] border border-gray-150 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800 mb-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-blue-500" />
            Buat Postingan Baru
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card row info */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.displayName} 
            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
          />
          <div className="text-left">
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">{currentUser.displayName}</h4>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-gray-450 dark:text-slate-450">
              <MapPin className="h-3 w-3 text-blue-500" />
              {location}
            </span>
          </div>
        </div>

        {/* Text Input area */}
        <div className="space-y-4">
          <textarea
            placeholder="Bagikan ide bagus atau apa saja yang sedang kamu pikirkan hari ini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={350}
            className="w-full border-0 focus:ring-0 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 bg-gray-50/50 dark:bg-slate-900 p-4 rounded-2xl focus:outline-hidden leading-relaxed"
          />
          <div className="text-right text-[10px] text-gray-400">
            {content.length}/350 karakter
          </div>

          {/* Location tagger override */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pilih Wilayah:</span>
            {['Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya', 'Bali'].map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                  location === loc
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-150'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Quick picture insertion presets */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Sematkan Ilustrasi Gambar (Opsional):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {imagePresets.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(selectedImage === img ? undefined : img)}
                  className={`h-14 rounded-xl overflow-hidden border cursor-pointer group relative ${
                    selectedImage === img ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="Attach" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  {selectedImage === img && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
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
