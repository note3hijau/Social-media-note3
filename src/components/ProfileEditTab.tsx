import React, { useState } from 'react';
import { User } from '../types';
import { Camera, RefreshCw, CheckCircle2, Sliders, MapPin, Calendar, Heart, Share2, Globe, HardDrive, Upload, Image } from 'lucide-react';

interface ProfileEditTabProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export default function ProfileEditTab({ currentUser, onUpdateUser }: ProfileEditTabProps) {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [banner, setBanner] = useState(currentUser.banner);
  const [bannerPosition, setBannerPosition] = useState(currentUser.bannerPosition || 50);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Semua pengaturan profil tersinkronisasi');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        const objectUrl = URL.createObjectURL(file);
        setBanner(objectUrl);
        setTimeout(() => {
          setUploadProgress(null);
        }, 1200);
      } else {
        setUploadProgress(progress);
      }
    }, 120);
  };

  // Multi-device sync handler
  const triggerSync = (updatedUser: User) => {
    setIsSyncing(true);
    setSyncMessage('SEDANG MENYINKRONKAN KE CLOUD DB...');
    onUpdateUser(updatedUser);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('PROFIL BERHASIL TERSINKRONKAN KE SELURUH PERANGKAT!');
    }, 1200);
  };

  const handleSave = () => {
    const updated: User = {
      ...currentUser,
      displayName,
      bio,
      location,
      avatar,
      banner,
      bannerPosition,
    };
    triggerSync(updated);
  };

  // Curated Indonesian scenic banners for instant editing
  const presets = [
    { name: 'Pantai Kuta Bali', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80' },
    { name: 'Candi Borobudur Magelang', url: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&auto=format&fit=crop&q=80' },
    { name: 'Gunung Bromo Jawa Timur', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
    { name: 'Hutan Hujan Kalimantan', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80' },
  ];

  // Curated minimalist avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Banner & Avatar Showcase Panel */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-gray-150 dark:border-neutral-800 shadow-sm relative">
        
        {/* Banner with adjustable Y alignment */}
        <div 
          className="relative h-48 md:h-60 bg-gray-200 dark:bg-neutral-800 transition-all duration-150 overflow-hidden"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundPosition: `50% ${bannerPosition}%`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />
          
          {/* Tag region */}
          <span className="absolute top-4 left-4 bg-emerald-500/90 text-white font-extrabold text-[9px] uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-sm">
            <Globe className="h-3 w-3" />
            REGIONAL INDONESIA
          </span>
        </div>

        {/* Profile Identity Details Card Offset */}
        <div className="px-6 pb-6 pt-1 flex flex-col items-center sm:items-start sm:flex-row gap-4 relative">
          
          {/* Large Avatar container */}
          <div className="-mt-16 sm:-mt-24 relative select-none shrink-0 group">
            <img 
              src={avatar} 
              alt={displayName} 
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shadow-xl"
            />
            <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex-1 mt-2 text-center sm:text-left min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white truncate flex items-center justify-center sm:justify-start gap-1.5">
              {displayName}
              <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
            </h1>
            <p className="text-xs text-gray-500 mb-2">@{currentUser.username} • {location}</p>
            
            <p className="text-xs text-gray-600 dark:text-neutral-300 max-w-lg mb-4 leading-relaxed italic">
              "{bio || 'Belum menulis bio apapun...'}"
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-gray-450 dark:text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Bergabung {currentUser.joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile settings fields form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Side: Custom Layout Adjustments */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-gray-450 dark:text-gray-400">
              Preset Galeri Tampilan
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-neutral-400 block mb-2">
                Pilih Banner Khas Indonesia
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBanner(p.url)}
                    className="group relative h-14 rounded-lg overflow-hidden border border-gray-200 select-none cursor-pointer hover:border-emerald-500"
                    title={p.name}
                  >
                    <img 
                      src={p.url} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-0.5 text-center text-[8px] text-white truncate">
                      {p.name.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-neutral-800/80 pt-4">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-neutral-400 block mb-2">
                Ganti Foto Profil (Avatar)
              </label>
              <div className="flex gap-2 font-sans">
                {avatarPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p)}
                    className={`h-10 w-10 rounded-full overflow-hidden border cursor-pointer hover:border-emerald-500 shrink-0 ${
                      avatar === p ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200'
                    }`}
                  >
                    <img src={p} alt="Preset avatar" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Core Input parameters */}
        <div className="md:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-gray-950 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-neutral-800 pb-3">
            Informasi Profil Dasar
          </h2>

          <div className="space-y-4">
            
            {/* Display name */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                Nama Lengkap
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all"
                placeholder="Nama Lengkap Kamu"
              />
            </div>

            {/* Custom Banner Image Upload with Progress Bar */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block">
                Unggah Custom Banner Image (Upload)
              </label>
              
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-neutral-805 rounded-2xl p-4 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-gray-50/50 dark:bg-neutral-950/20 group">
                  <div className="flex flex-col items-center justify-center space-y-1 text-center">
                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-[11px] font-bold text-gray-700 dark:text-neutral-350">
                      Pilih file gambar banner kamu
                    </p>
                    <p className="text-[9px] text-gray-400">
                      Format PNG, JPG, atau WEBP (Maksimal 5MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleBannerUpload}
                  />
                </label>

                {uploadProgress !== null && (
                  <div className="space-y-1.5 p-3 bg-gray-50 dark:bg-neutral-950 border border-gray-150 dark:border-neutral-850 rounded-2xl animate-pulse">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin text-emerald-500" />
                        Sedang Mengunggah Gambar...
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-150" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {banner && (
                  <div className="text-[10px] text-gray-400 flex items-center gap-1.5 truncate bg-gray-50/50 dark:bg-neutral-950/40 p-2 rounded-xl border border-gray-150/40 dark:border-neutral-850/40">
                    <Image className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">URL Aktif: {banner}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location (Indonesia focused region selector) */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                Lokasi Domisili (Indonesia Region Focus)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all"
              >
                <option value="Jakarta Selatan, DKI Jakarta">Jakarta Selatan, DKI Jakarta</option>
                <option value="Sleman, DI Yogyakarta">Sleman, DI Yogyakarta</option>
                <option value="Bandung, Jawa Barat">Bandung, Jawa Barat</option>
                <option value="Surabaya, Jawa Timur">Surabaya, Jawa Timur</option>
                <option value="Medan, Sumatera Utara">Medan, Sumatera Utara</option>
                <option value="Denpasar, Bali">Denpasar, Bali</option>
                <option value="Makassar, Sulawesi Selatan">Makassar, Sulawesi Selatan</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                Bio Singkat
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all leading-relaxed"
                placeholder="Tuliskan pengalaman bisnis, hobi, atau apa saja tentang dirimu..."
              />
              <span className="text-[10px] text-gray-400 mt-1 block text-right">
                Batas karakter: {bio.length}/200
              </span>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Simpan & Sinkronisasikan Sekarang
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
