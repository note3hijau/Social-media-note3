import React from 'react';
import { MarketplaceItem } from '../types';
import { X, MapPin, BadgeCheck, MessageSquare } from 'lucide-react';

interface MarketplaceDetailProps {
  item: MarketplaceItem;
  onClose: () => void;
  onContactSeller?: (item: MarketplaceItem) => void;
}

export default function MarketplaceDetail({ item, onClose, onContactSeller }: MarketplaceDetailProps) {
  // Formatting currency in Clean IDR (Indonesian Rupiah)
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[999]"
      onClick={onClose}
    >
      <div 
        className="bg-[#171717] dark:bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-[95vw] max-h-[95vh] sm:max-h-[85vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden shadow-2xl relative animate-scale-up flex flex-col scale-[0.95] origin-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-right close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
          title="Tutup Detail"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Responsive layout Grid split */}
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          
          {/* Left Area: Product Image Lightbox View + Active CTA buttons below image */}
          <div className="flex flex-col bg-black p-5 justify-between border-b md:border-b-0 md:border-r border-neutral-800 min-h-[350px] md:h-[500px]">
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-900/60 rounded-2xl p-2 min-h-[200px] md:min-h-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="max-h-[250px] md:max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Changed & Moved buttons of the advertisement right here directly underneath the image */}
            <div className="mt-4 space-y-2 shrink-0">
              {onContactSeller && (
                <button 
                  onClick={() => onContactSeller(item)}
                  className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  Kirim Pesan Hubungi Saya (Inbox Marketplace)
                </button>
              )}
              
              <button 
                onClick={onClose}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Kembali ke Daftar Iklan
              </button>
            </div>
          </div>

          {/* Right Area: Product details - Simple Scrollable Display only */}
          <div className="p-6 md:p-8 flex flex-col justify-start md:h-[500px] overflow-y-auto scrollbar-thin text-left bg-[#171717] dark:bg-neutral-900">
            <div className="space-y-5">
              
              {/* Silver Styled Title Tag / Header Section */}
              <div className="p-2.5 rounded-xl bg-[#262626] border border-neutral-800 text-neutral-200 flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#cbd5e1]">
                  Kategori • {item.category}
                </span>
                <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded">
                  KONDISI: {item.condition.toUpperCase()}
                </span>
              </div>

              {/* Title Header: styled with silver text as requested */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-slate-100">
                <h1 className="text-lg md:text-xl font-extrabold text-[#f1f5f9] tracking-tight leading-snug">
                  {item.title}
                </h1>
                <p className="text-xl md:text-2xl font-black text-blue-400 mt-2">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 pl-1">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{item.location} • Indonesia</span>
              </div>

              {/* Description body / Isi Iklan */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1">
                  Isi Deskripsi Iklan
                </h3>
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-line font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Seller info widget */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl flex items-center justify-between border border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={item.sellerAvatar} 
                    alt={item.sellerName} 
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white flex items-center gap-1">
                      {item.sellerName}
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                    </h4>
                    <p className="text-[9px] text-neutral-450">Pemilik / Penjual Iklan</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-blue-400 bg-blue-950/40 px-2 py-1 rounded-full shrink-0">
                  Respon Cepat ⚡
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
