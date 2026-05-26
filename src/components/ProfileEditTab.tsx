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

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startPos, setStartPos] = useState(bannerPosition);

  // Drag handles
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('label') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setStartPos(bannerPosition);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    // Map vertical pixels dragged to 0%-100% position offsets
    const newPos = Math.max(0, Math.min(100, startPos - Math.round(deltaY / 2)));
    setBannerPosition(newPos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('label') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartPos(bannerPosition);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newPos = Math.max(0, Math.min(100, startPos - Math.round(deltaY / 2)));
    setBannerPosition(newPos);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        const objectUrl = URL.createObjectURL(file);
        setBanner(objectUrl);
        setTimeout(() => {
          setUploadProgress(null);
        }, 800);
      } else {
        setUploadProgress(progress);
      }
    }, 80);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        const objectUrl = URL.createObjectURL(file);
        setAvatar(objectUrl);
        setTimeout(() => {
          setUploadProgress(null);
        }, 800);
      } else {
        setUploadProgress(progress);
      }
    }, 80);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Banner & Avatar Showcase Panel */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-gray-150 dark:border-neutral-800 shadow-sm relative">
        
        {/* Banner with adjustable Y alignment */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="relative h-48 md:h-60 bg-gray-200 dark:bg-neutral-800 transition-all duration-75 overflow-hidden select-none"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundPosition: `50% ${bannerPosition}%`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          title="Geser gambar untuk atur tata letak"
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          
          {/* Tag region */}
          <span className="absolute top-4 left-4 bg-emerald-500/90 text-white font-extrabold text-[9px] uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-sm pointer-events-none">
            <Globe className="h-3 w-3" />
            REGIONAL INDONESIA
          </span>

          {/* Facebook-style layout adjustment advice */}
          <div className="absolute top-4 right-16 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-xs pointer-events-none select-none border border-white/5">
            <Sliders className="h-3 w-3 text-emerald-400" />
            <span>Tarik / geser manual foto untuk atur posisi sampul</span>
          </div>

          {/* Upload Banner Icon overlaid precisely over background cover */}
          <label className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/85 text-white p-2.5 rounded-full backdrop-blur-xs cursor-pointer transition-all z-10 flex items-center justify-center border border-white/10 shadow-lg" title="Ganti Foto Sampul (Banner)">
            <Camera className="h-4.5 w-4.5" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleBannerUpload}
            />
          </label>

          {/* Upload indicator */}
          {uploadProgress !== null && (
            <div className="absolute top-4 right-4 bg-emerald-600/90 text-white font-bold text-[10px] px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md pointer-events-none">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Mengunggah... {uploadProgress}%
            </div>
          )}
        </div>

        {/* Profile Identity Details Card Offset */}
        <div className="px-6 pb-6 pt-1 flex flex-col items-center sm:items-start sm:flex-row gap-4 relative">
          
          {/* Large Avatar container overlay */}
          <div className="-mt-16 sm:-mt-24 relative select-none shrink-0 group">
            <img 
              src={avatar} 
              alt={displayName} 
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shadow-xl"
            />
            {/* Fully working upload profile wrapper */}
            <label className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
              />
            </label>
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

      {/* Profile settings fields form taking full layout container */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-2xs space-y-4">
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

          {/* Location (Indonesia focused region selector) */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
              Lokasi Domisili (Indonesia Region Focus)
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all scrollbar-thin"
            >
              <optgroup label="Pulau Jawa">
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="DI Yogyakarta">DI Yogyakarta</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Banten">Banten</option>
              </optgroup>
              <optgroup label="Pulau Sumatera">
                <option value="Aceh">Aceh</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Sumatera Barat">Sumatera Barat</option>
                <option value="Riau">Riau</option>
                <option value="Kepulauan Riau">Kepulauan Riau</option>
                <option value="Jambi">Jambi</option>
                <option value="Sumatera Selatan">Sumatera Selatan</option>
                <option value="Kepulauan Bangka Belitung">Kepulauan Bangka Belitung</option>
                <option value="Bengkulu">Bengkulu</option>
                <option value="Lampung">Lampung</option>
              </optgroup>
              <optgroup label="Pulau Bali & Nusa Tenggara">
                <option value="Bali">Bali</option>
                <option value="Nusa Tenggara Barat (NTB)">Nusa Tenggara Barat (NTB)</option>
                <option value="Nusa Tenggara Timur (NTT)">Nusa Tenggara Timur (NTT)</option>
              </optgroup>
              <optgroup label="Pulau Kalimantan">
                <option value="Kalimantan Barat">Kalimantan Barat</option>
                <option value="Kalimantan Tengah">Kalimantan Tengah</option>
                <option value="Kalimantan Selatan">Kalimantan Selatan</option>
                <option value="Kalimantan Timur">Kalimantan Timur</option>
                <option value="Kalimantan Utara">Kalimantan Utara</option>
              </optgroup>
              <optgroup label="Pulau Sulawesi">
                <option value="Sulawesi Utara">Sulawesi Utara</option>
                <option value="Gorontalo">Gorontalo</option>
                <option value="Sulawesi Tengah">Sulawesi Tengah</option>
                <option value="Sulawesi Barat">Sulawesi Barat</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                <option value="Sulawesi Tenggara">Sulawesi Tenggara</option>
              </optgroup>
              <optgroup label="Kepulauan Maluku & Pulau Papua">
                <option value="Maluku">Maluku</option>
                <option value="Maluku Utara">Maluku Utara</option>
                <option value="Papua">Papua</option>
                <option value="Papua Barat">Papua Barat</option>
                <option value="Papua Selatan">Papua Selatan</option>
                <option value="Papua Tengah">Papua Tengah</option>
                <option value="Papua Pegunungan">Papua Pegunungan</option>
                <option value="Papua Barat Daya">Papua Barat Daya</option>
              </optgroup>
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
              className="flex items-center gap-1.5 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50 animate-fade-in"
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
  );
}
