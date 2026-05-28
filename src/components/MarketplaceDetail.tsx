import React, { useState } from 'react';
import { MarketplaceItem, User } from '../types';
import { X, MapPin, BadgeCheck, MessageSquare, ChevronLeft, ChevronRight, Edit2, Trash2, Check, RotateCcw } from 'lucide-react';

interface MarketplaceDetailProps {
  item: MarketplaceItem;
  currentUser: User;
  onClose: () => void;
  onContactSeller?: (item: MarketplaceItem) => void;
  onDeleteListing: (itemId: string) => void;
  onEditListing: (updatedItem: MarketplaceItem) => void;
}

export default function MarketplaceDetail({ 
  item, 
  currentUser, 
  onClose, 
  onContactSeller,
  onDeleteListing,
  onEditListing
}: MarketplaceDetailProps) {
  // Setup slides gallery list (falls back to item.image)
  const slides = item.images && item.images.length > 0 ? item.images : [item.image];
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // States for Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editPrice, setEditPrice] = useState(item.price);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editCondition, setEditCondition] = useState(item.condition);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editLocation, setEditLocation] = useState(item.location);

  const isOwner = item.sellerId === currentUser.id || currentUser.role === 'admin' || currentUser.email === 'note3hijau@gmail.com';

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus iklan dagangan ini secara permanen?')) {
      onDeleteListing(item.id);
      onClose();
    }
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert('Judul dan Deskripsi iklan tidak boleh kosong!');
      return;
    }
    
    const updated: MarketplaceItem = {
      ...item,
      title: editTitle,
      price: Number(editPrice),
      category: editCategory,
      condition: editCondition,
      description: editDescription,
      location: editLocation,
    };

    onEditListing(updated);
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[999] animate-fade-in"
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
          <div className="flex flex-col bg-black p-5 justify-between border-b md:border-b-0 md:border-r border-neutral-800 min-h-[350px] md:h-[550px] overflow-y-auto">
            <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-neutral-900/60 rounded-2xl p-2 min-h-[220px] md:min-h-0">
              
              {/* Image viewport */}
              <div className="w-full h-full flex items-center justify-center relative group">
                <img 
                  src={slides[activeSlideIndex]} 
                  alt={`${item.title} - Foto ${activeSlideIndex + 1}`} 
                  className="max-h-[200px] sm:max-h-[220px] md:max-h-[280px] max-w-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Left slider */}
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    className="absolute left-2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer hover:scale-110 active:scale-95"
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Right slider */}
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    className="absolute right-2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer hover:scale-110 active:scale-95"
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                {/* Count badge */}
                {slides.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/75 px-2.5 py-1 rounded-sm text-[10px] text-white font-black tracking-widest uppercase shadow-sm">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                )}
              </div>

              {/* Slider miniature thumbnails */}
              {slides.length > 1 && (
                <div className="w-full mt-3 shrink-0">
                  <div className="flex gap-1.5 justify-center overflow-x-auto p-1 max-w-full scrollbar-none">
                    {slides.map((picUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          idx === activeSlideIndex 
                            ? 'border-blue-500 scale-105 shadow-md' 
                            : 'border-transparent border-neutral-700/60 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={picUrl} alt="Mini Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Changed & Moved buttons of the advertisement right here directly underneath the image */}
            <div className="mt-4 space-y-2 shrink-0">
              {isOwner && (
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 text-left">
                  <p className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider">Kelola Iklan Anda ⚙️</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      {isEditing ? 'Batal Edit' : 'Edit Iklan'}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-600/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus Iklan
                    </button>
                  </div>
                </div>
              )}

              {onContactSeller && !isOwner && (
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

          {/* Right Area: Product details or Edit Form */}
          <div className="p-6 md:p-8 flex flex-col justify-start md:h-[550px] overflow-y-auto scrollbar-thin text-left bg-[#171717] dark:bg-neutral-900">
            {isEditing ? (
              /* Editable Inline Form Section */
              <div className="space-y-4 animate-fade-in text-neutral-200">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs font-bold text-amber-400">Mode Modifikasi Aktif</p>
                  <p className="text-[10px] text-neutral-450 mt-0.5">Edit detil produk Anda secara langsung di bawah ini lalu tekan simpan.</p>
                </div>

                {/* Edit Title */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Judul Dagangan</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-800 bg-[#0c0c0c] text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                {/* Edit Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Harga (Rp)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-800 bg-[#0c0c0c] text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Edit Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Kategori</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-800 bg-[#0c0c0c] text-white focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="Gadget & Elektronik">📱 Gadget & Elektronik</option>
                      <option value="Motor & Otomotif">🏍️ Motor & Otomotif</option>
                      <option value="Fashion & Aksesoris">👕 Fashion & Aksesoris</option>
                      <option value="Jasa & Lowongan">💼 Jasa & Lowongan</option>
                      <option value="Rumah Tangga & Hobi">🏠 Rumah Tangga & Hobi</option>
                      <option value="Kuliner Daerah">🍲 Kuliner Daerah</option>
                    </select>
                  </div>

                  {/* Edit Condition */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Kondisi</label>
                    <select
                      value={editCondition}
                      onChange={(e) => setEditCondition(e.target.value as 'Baru' | 'Bekas')}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-800 bg-[#0c0c0c] text-white focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="Baru">Baru</option>
                      <option value="Bekas">Bekas</option>
                    </select>
                  </div>
                </div>

                {/* Edit Location */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Lokasi / Domisili Kota</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-800 bg-[#0c0c0c] text-white focus:outline-hidden focus:border-amber-500"
                    placeholder="Contoh: Jakarta Selatan, Sleman"
                  />
                </div>

                {/* Edit Description */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Isi Deskripsi / Keterangan</label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-800 bg-[#0c0c0c] text-white focus:outline-hidden focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Edit Actions buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Simpan Perubahan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(item.title);
                      setEditPrice(item.price);
                      setEditCategory(item.category);
                      setEditCondition(item.condition);
                      setEditDescription(item.description);
                      setEditLocation(item.location);
                    }}
                    className="px-4 py-3 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-xl text-xs font-bold border border-neutral-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              /* Non-editable normal Details Display Section */
              <div className="space-y-5">
                
                {/* Silver Styled Title Tag / Header Section */}
                <div className="p-2.5 rounded-xl bg-[#262626] border border-neutral-800 text-neutral-200 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
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
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0 animate-pulse" />
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
                      <p className="text-[10px] text-white font-extrabold uppercase tracking-wide">Pemilik / Penjual Iklan</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-blue-400 bg-blue-950/40 px-2 py-1 rounded-full shrink-0">
                    Respon Cepat ⚡
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
