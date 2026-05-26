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
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[999]"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-scale-up"
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
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Area: Product Image Lightbox View */}
          <div className="relative h-64 md:h-[480px] bg-neutral-950 flex items-center justify-center overflow-hidden group">
            <img 
              src={item.image} 
              alt={item.title} 
              className="h-full w-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
            />
            {/* Tag region */}
            <span className="absolute bottom-4 left-4 bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md shadow-lg">
              Pasar Masyarakat Lokal 🇲🇨
            </span>
          </div>

          {/* Right Area: Product details - Simple Display only */}
          <div className="p-6 md:p-8 flex flex-col justify-between h-full md:max-h-[480px] overflow-y-auto scrollbar-thin text-left bg-gray-50 dark:bg-neutral-900">
            <div className="space-y-5">
              
              {/* Silver Styled Title Tag / Header Section */}
              <div className="p-2.5 rounded-xl bg-slate-700 dark:bg-slate-800 border border-slate-600 text-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e2e8f0]">
                  Kategori • {item.category}
                </span>
                <span className="text-[9px] font-black text-[#e2e8f0] bg-emerald-600 px-2 py-0.5 rounded">
                  KONDISI: {item.condition.toUpperCase()}
                </span>
              </div>

              {/* Title Header: styled with silver text as requested */}
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100">
                <h1 className="text-lg md:text-xl font-extrabold text-[#f1f5f9] tracking-tight leading-snug">
                  {item.title}
                </h1>
                <p className="text-xl md:text-2xl font-black text-emerald-400 mt-2">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-neutral-400 pl-1">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{item.location} • Indonesia</span>
              </div>

              {/* Description body / Isi Iklan */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                  Isi Deskripsi Iklan
                </h3>
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-gray-150 dark:border-neutral-800">
                  <p className="text-xs text-gray-700 dark:text-neutral-200 leading-relaxed whitespace-pre-line font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Seller info widget */}
              <div className="bg-white dark:bg-neutral-950 p-3.5 rounded-2xl flex items-center justify-between border border-gray-150 dark:border-neutral-805">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={item.sellerAvatar} 
                    alt={item.sellerName} 
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-gray-950 dark:text-white flex items-center gap-1">
                      {item.sellerName}
                      <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    </h4>
                    <p className="text-[9px] text-gray-500">Pemilik / Penjual Iklan</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 px-2 py-1 rounded-full shrink-0">
                  Respon Cepat ⚡
                </span>
              </div>

            </div>

             {/* Close & Action footer buttons */}
            <div className="pt-4 mt-6 border-t border-gray-150 dark:border-neutral-800 space-y-2">
              {onContactSeller && (
                <button 
                  onClick={() => onContactSeller(item)}
                  className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-md animate-pulse"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  Kirim Pesan Hubungi Saya (Inbox Marketplace)
                </button>
              )}
              
              <button 
                onClick={onClose}
                className="w-full py-2.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Kembali ke Daftar Iklan
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
