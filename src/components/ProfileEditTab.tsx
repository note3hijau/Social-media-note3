import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Camera, RefreshCw, CheckCircle2, Sliders, MapPin, Calendar, Heart, Share2, Globe, HardDrive, Upload, Image, MessageSquare, ArrowLeft } from 'lucide-react';
import { translate, LANGUAGES } from '../utils/translations';

interface ProfileEditTabProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  viewedUser?: User;
  onStartChat?: (userId: string) => void;
  onBackToMyProfile?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function ProfileEditTab({ 
  currentUser, 
  onUpdateUser, 
  viewedUser, 
  onStartChat, 
  onBackToMyProfile,
  language = 'id',
  onLanguageChange
}: ProfileEditTabProps) {
  const isOwnProfile = !viewedUser || viewedUser.id === currentUser.id;
  const activeUser = isOwnProfile ? currentUser : viewedUser!;

  const [displayName, setDisplayName] = useState(activeUser.displayName);
  const [username, setUsername] = useState(activeUser.username || '');
  const [bio, setBio] = useState(activeUser.bio);
  const [location, setLocation] = useState(activeUser.location);
  const [avatar, setAvatar] = useState(activeUser.avatar);
  const [banner, setBanner] = useState(activeUser.banner);
  const [bannerPosition, setBannerPosition] = useState(activeUser.bannerPosition || 50);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Semua pengaturan profil tersinkronisasi');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startPos, setStartPos] = useState(bannerPosition);

  // Sync state values on active user change
  useEffect(() => {
    setDisplayName(activeUser.displayName);
    setUsername(activeUser.username || '');
    setBio(activeUser.bio);
    setLocation(activeUser.location);
    setAvatar(activeUser.avatar);
    setBanner(activeUser.banner);
    setBannerPosition(activeUser.bannerPosition || 50);
  }, [viewedUser, currentUser]);

  // Drag handles
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOwnProfile) return;
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('label') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setStartPos(bannerPosition);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !isOwnProfile) return;
    const deltaY = e.clientY - startY;
    const newPos = Math.max(0, Math.min(100, startPos - Math.round(deltaY / 2)));
    setBannerPosition(newPos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isOwnProfile) return;
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('label') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartPos(bannerPosition);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !isOwnProfile) return;
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
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      alert('Username wajib diisi dan hanya boleh berupa huruf, angka, atau garis bawah (_)!');
      return;
    }
    const updated: User = {
      ...currentUser,
      displayName,
      username: cleanUsername,
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
      
      {/* Back button when viewing a custom profile */}
      {!isOwnProfile && onBackToMyProfile && (
        <button
          onClick={onBackToMyProfile}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors uppercase cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Profil Saya</span>
        </button>
      )}

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
            cursor: isDragging && isOwnProfile ? 'grabbing' : isOwnProfile ? 'grab' : 'default',
          }}
          title={isOwnProfile ? "Geser gambar untuk atur tata letak" : undefined}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          
          {/* Tag region */}
          <span className="absolute top-4 left-4 bg-blue-500/90 text-white font-extrabold text-[9px] uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-sm pointer-events-none">
            <Globe className="h-3 w-3" />
            REGIONAL INDONESIA
          </span>

          {/* Facebook-style layout adjustment advice */}
          {isOwnProfile && (
            <div className="absolute top-4 right-16 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-xs pointer-events-none select-none border border-white/5">
              <Sliders className="h-3 w-3 text-blue-400" />
              <span>Tarik / geser manual foto untuk atur posisi sampul</span>
            </div>
          )}

          {/* Upload Banner Icon overlaid precisely over background cover */}
          {isOwnProfile && (
            <label className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/85 text-white p-2.5 rounded-full backdrop-blur-xs cursor-pointer transition-all z-10 flex items-center justify-center border border-white/10 shadow-lg" title="Ganti Foto Sampul (Banner)">
              <Camera className="h-4.5 w-4.5" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleBannerUpload}
              />
            </label>
          )}

          {/* Upload indicator */}
          {uploadProgress !== null && (
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white font-bold text-[10px] px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md pointer-events-none">
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
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shadow-xl border border-gray-100"
            />
            {/* Fully working upload profile wrapper */}
            {isOwnProfile && (
              <label className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </label>
            )}
          </div>

          <div className="flex-1 mt-2 text-center sm:text-left min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white truncate flex items-center justify-center sm:justify-start gap-1.5">
              {displayName}
              <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-50" />
            </h1>
            <p className="text-xs text-gray-500 mb-2">@{activeUser.username} • {location}</p>
            
            <p className="text-xs text-gray-650 dark:text-neutral-300 max-w-lg mb-4 leading-relaxed italic">
              "{bio || 'Belum menulis bio apapun...'}"
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-gray-450 dark:text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Bergabung {activeUser.joinedDate || 'Baru-baru ini'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile settings fields form taking full layout container */}
      {isOwnProfile ? (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-gray-950 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-neutral-800 pb-3">
            {translate('editProfileTitle', language)}
          </h2>

          <div className="space-y-4">
            
            {/* Display name */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                {translate('fullName', language)}
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all font-bold"
                placeholder="Nama Lengkap Kamu"
              />
            </div>

            {/* Unique Username Creator (Required) */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                🆔 Username Unik (Wajib untuk Profil Publik)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-xs text-gray-400 font-bold select-none">
                  idkanca.id/u/
                </span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                    setUsername(val);
                  }}
                  maxLength={30}
                  className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-26 pr-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all font-mono font-bold"
                  placeholder="username_anda"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block leading-relaxed">
                * Username ini digunakan oleh masyarakat umum untuk mengakses profil toko bisnis UMKM Anda langsung dari internet. Hanya boleh mengandung huruf kecil, angka, dan garis bawah.
              </span>
            </div>

            {/* Public Profile URL sharing block */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/20 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">⭐ LINK WEBSITE PUBLIK ANDA</span>
                  <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 mt-1">
                    https://idkanca.id/u/{username || 'username_anda'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!username) {
                      alert('Isi username terlebih dahulu!');
                      return;
                    }
                    navigator.clipboard.writeText(`https://ais-pre-zcauwn4p6s44n2fvu5ngww-185981148918.europe-west2.run.app/u/${username}`);
                    alert('✓ Link profil publik berhasil disalin ke clipboard!');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
                >
                  Salin Link
                </button>
              </div>
              <p className="text-[9.5px] text-gray-600 dark:text-neutral-400 leading-relaxed">
                Gunakan tautan profesional ini di brosur toko, kartu nama, atau deskripsi WhatsApp Anda agar calon pembeli dan investor lokal bisa langsung berinteraksi dengan produk UMKM Anda secara transparan.
              </p>
            </div>

            {/* Location (Indonesia focused region selector) */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                {translate('location', language)}
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all scrollbar-thin"
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
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all leading-relaxed"
                placeholder="Tuliskan pengalaman bisnis, hobi, atau apa saja tentang dirimu..."
              />
              <span className="text-[10px] text-gray-400 mt-1 block text-right">
                Batas karakter: {bio.length}/200
              </span>
            </div>

            {/* Language Settings block */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-neutral-800 space-y-3">
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block">
                🌐 {translate('settingsLanguage', language)}
              </label>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-550 dark:text-gray-400 block mb-1">
                  {translate('selectLanguage', language)}
                </span>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all scrollbar-thin font-bold"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50 animate-fade-in"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {translate('saveProfile', language)}
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-2xs space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-4">
            <div>
              <h2 className="text-sm font-extrabold text-gray-950 dark:text-white uppercase tracking-wider">
                Kartu Bisnis Terverifikasi
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Pengguna portal idkanca Regional Indonesia</p>
            </div>
            {onStartChat && (
              <button
                onClick={() => onStartChat(activeUser.id)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Kirim Pesan Obrolan</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-850 space-y-2">
              <p className="font-extrabold uppercase tracking-wide text-gray-400 text-[10px]">TENTANG PROFIL</p>
              <p className="text-gray-650 dark:text-gray-300 leading-relaxed">
                {activeUser.bio || `${activeUser.displayName} belum melengkapi biodatanya.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-850 space-y-3">
              <p className="font-extrabold uppercase tracking-wide text-gray-400 text-[10px]">STATUS KONEKSI</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-neutral-850">
                  <span className="text-gray-400">Domisili</span>
                  <span className="font-bold text-gray-900 dark:text-white">{activeUser.location}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-neutral-850">
                  <span className="text-gray-400">Terdaftar Sejak</span>
                  <span className="font-medium text-gray-700 dark:text-neutral-300">{activeUser.joinedDate || 'Mei 2024'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400">Pengikut</span>
                  <span className="font-bold text-blue-650 dark:text-blue-400">{activeUser.followersCount || 120} Orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
