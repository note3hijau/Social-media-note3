import { LogOut, Settings, Award, Layers, ShieldCheck, HelpCircle, HardDrive, Smartphone, Sparkles, MessageSquare, ShoppingBag, X, Moon, Sun, MonitorDot } from 'lucide-react';
import { User } from '../types';
import { useState } from 'react';

interface SidebarProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  currentUser,
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onLogout,
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Quick info about the simulated scaling database architecture
  const serverStat = {
    provider: 'Cloud SQL / PostgreSQL (Highly Scalable)',
    latency: '8ms',
    replicas: '3 Active Node Shards',
    status: 'OPTIMAL'
  };

  const navItems = [
    { id: 'feed', name: 'Feed Utama', icon: Sparkles },
    { id: 'marketplace', name: 'Pasar Lokal', icon: ShoppingBag },
    { id: 'chat', name: 'Obrolan Chat', icon: MessageSquare },
  ];

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-[#1e293b] border-r border-gray-150 dark:border-slate-800/80 z-50 transform lg:transform-none transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:rounded-2xl lg:-mt-2 lg:mb-4`}
      >
        {/* Mobile Header in side menu */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">iB</div>
            <span className="font-extrabold text-gray-900 dark:text-slate-150">Menu Utama</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.displayName} 
              className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {currentUser.displayName}
              </h4>
              <p className="text-[10px] text-gray-500 truncate">@{currentUser.username}</p>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-white bg-blue-600 px-1.5 py-0.5 rounded-full shadow-xs w-fit">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Seller
                </span>
                <span className="text-[8px] text-neutral-550 dark:text-gray-400 font-bold">
                  ✓ Aktif {(() => {
                    const joinedDateStr = currentUser.joinedDate || 'Mei 2024';
                    const parts = joinedDateStr.trim().split(' ');
                    if (parts.length < 2) return joinedDateStr;
                    const monthStr = parts[0].toLowerCase();
                    const year = parseInt(parts[1], 10);
                    if (isNaN(year)) return joinedDateStr;

                    const indonesianMonths = [
                      'januari', 'februari', 'maret', 'april', 'mei', 'juni',
                      'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
                    ];
                    const monthShorts = [
                      'jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'
                    ];

                    let monthIndex = indonesianMonths.indexOf(monthStr);
                    if (monthIndex === -1) {
                      monthIndex = monthShorts.indexOf(monthStr);
                    }
                    if (monthIndex === -1) monthIndex = 4; // fallback Mei 

                    const targetYear = 2026;
                    const targetMonth = 4; // May

                    const diffMonths = (targetYear - year) * 12 + (targetMonth - monthIndex);
                    if (diffMonths <= 0) return 'Bulan ini';
                    const years = Math.floor(diffMonths / 12);
                    const months = diffMonths % 12;

                    if (years > 0) {
                      return `${years} Tahun${months > 0 ? ` ${months} Bulan` : ''}`;
                    }
                    return `${diffMonths} Bulan`;
                  })()} (Sejak {currentUser.joinedDate || 'Mei 2024'})
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-xl text-[10px] text-gray-500">
            <span className="font-bold">Lokasi Toko</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{(currentUser?.location || "Indonesia").split(',')[0]}</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="p-4 space-y-1 block lg:hidden border-b border-gray-100 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-2 mb-2">
            Navigasi Cepat
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Standard side categories */}
        <div className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-2 mb-2">
            Kategori Terpopuler
          </p>
          <button 
            onClick={() => { setActiveTab('marketplace'); onClose(); }} 
            className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center justify-between"
          >
            <span>📱 Gadget & Elektronik</span>
            <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full">New</span>
          </button>
          <button 
            onClick={() => { setActiveTab('marketplace'); onClose(); }} 
            className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center justify-between"
          >
            <span>🏍️ Motor & Otomotif</span>
          </button>
          <button 
            onClick={() => { setActiveTab('marketplace'); onClose(); }} 
            className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center justify-between"
          >
            <span>👕 Fashion & Aksesoris</span>
          </button>
          <button 
            onClick={() => { setActiveTab('marketplace'); onClose(); }} 
            className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center justify-between"
          >
            <span>🍔 Makanan & Minuman Kuliner</span>
          </button>
        </div>

        {/* Sidebar Footer menu - Easily accessible LOGOUT */}
        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 space-y-2 bg-gray-50/50 dark:bg-neutral-900/40">
          
          {(currentUser.role === 'admin' || currentUser.email === 'note3hijau@gmail.com') && (
            <button
              onClick={() => {
                setActiveTab('admin');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-left ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/25'
                  : 'text-amber-500 hover:bg-amber-500/10'
              }`}
            >
              <Settings className="h-4 w-4 animate-spin-slow" />
              ⚙️ Panel Kontrol Admin
            </button>
          )}

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer text-left focus:outline-hidden"
          >
            <LogOut className="h-4 w-4" />
            Keluar (Logout)
          </button>
        </div>

        {/* Custom Logout Confirmation Dialog Overlay */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] border border-gray-150 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4 text-red-500">
                  <LogOut className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  Konfirmasi Keluar?
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-6">
                  Apakah Anda yakin ingin keluar dari <span className="font-semibold text-blue-500">idebagus.com</span>? Sesi Anda akan disimpan di sistem lokal secara aman.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      onLogout();
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-md"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </aside>
    </>
  );
}
