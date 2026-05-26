import { useState } from 'react';
import { User } from '../types';
import { Camera, RefreshCw, CheckCircle2, Sliders, MapPin, Calendar, Heart, Share2, Globe, HardDrive } from 'lucide-react';

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

          {/* Banner Spot Adjuster Floating overlay indicator */}
          <div className="absolute top-4 right-4 bg-black/55 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white/90 flex items-center gap-1">
            <Sliders className="h-3 w-3 text-emerald-400" />
            Banner Y-align: {bannerPosition}%
          </div>
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

        {/* Left Side: Custom Layout Adjustments (Banner Spotting / Image uploads) */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-500" />
              Adjust Banner Spot
            </h3>

            {/* Slider to adjust Y-offset coordinates */}
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-neutral-400 block mb-1">
                Vertikal Penyelarasan Banner
              </label>
              <input 
                type="range"
                min="0"
                max="100"
                value={bannerPosition}
                onChange={(e) => setBannerPosition(Number(e.target.value))}
                className="w-full accent-emerald-500 rounded-lg cursor-pointer h-2 bg-gray-100 dark:bg-neutral-800"
              />
              <span className="text-[10px] text-gray-400 mt-1 block text-right">
                Offset Y: {bannerPosition}%
              </span>
            </div>

            <div className="border-t border-gray-100 dark:border-neutral-800/80 pt-4">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-neutral-400 block mb-2">
                Pilih Banner Khas Indonesia
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
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
              <div className="flex gap-2">
                {avatarPresets.map((p, idx) => (
                  <button
                    key={idx}
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

          {/* Sync Stats Dashboard Widget showing fast device-sync state */}
          <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 p-4 rounded-3xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 dark:text-white">
              <HardDrive className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Database Sync Engine</span>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-neutral-500 leading-relaxed mb-3">
              Profil Anda didukung replikasi sharded instan. Setiap pembaruan akan langsung didistribusikan ke region node regional Indonesia.
            </p>

            <div className="flex items-center gap-2 bg-white dark:bg-neutral-800/60 p-2.5 rounded-xl border border-gray-150 dark:border-neutral-800">
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSyncing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </div>
              <span className={`text-[9px] font-bold tracking-wider uppercase truncate ${isSyncing ? 'text-amber-500' : 'text-emerald-500 dark:text-emerald-400'}`}>
                {syncMessage}
              </span>
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

            {/* Custom URL of banner if they want custom banner URL */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                Url Custom Banner Image
              </label>
              <input 
                type="text" 
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="w-full rounded-xl border border-gray-205 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all"
                placeholder="https://images.unsplash.com/..."
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
