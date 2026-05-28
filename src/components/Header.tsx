import { Bell, MessageSquare, Search, Sun, Moon, Users, ShoppingBag, Plus, Sparkles, Check } from 'lucide-react';
import { User, AppNotification, FriendRequest, Friend, Message } from '../types';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  friendRequests: FriendRequest[];
  acceptRequest: (id: string, name: string) => void;
  declineRequest: (id: string) => void;
  unreadCount: number;
  unreadMessagesCount: number;
  onNotificationClick: (notif: AppNotification) => void;
  friends: Friend[];
  messages: Message[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveChatFriendId: (id: string | null) => void;
  customLogoUrl?: string;
}

export default function Header({
  theme,
  toggleTheme,
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  markAllNotificationsRead,
  friendRequests,
  acceptRequest,
  declineRequest,
  unreadCount,
  unreadMessagesCount,
  onNotificationClick,
  friends,
  messages,
  searchQuery,
  setSearchQuery,
  setActiveChatFriendId,
  customLogoUrl,
}: HeaderProps) {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);

  const requestsDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        requestsDropdownRef.current &&
        !requestsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRequestsDropdown(false);
      }
      if (
        messagesDropdownRef.current &&
        !messagesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMessagesDropdown(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotificationsDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const pendingRequests = friendRequests.filter(r => r.status === 'pending');

  const conversationList = friends
    .map(friend => {
      const thread = messages.filter(
        m =>
          (m.senderId === currentUser.id && m.receiverId === friend.id) ||
          (m.senderId === friend.id && m.receiverId === currentUser.id)
      );
      const lastMsg = thread[thread.length - 1];
      const unreadCount = thread.filter(m => m.senderId === friend.id && !m.isRead).length;
      const isMarketplaceThread = thread.some(m => m.marketplaceContext !== undefined);
      return {
        friend,
        lastMsg,
        unreadCount,
        isMarketplaceThread,
      };
    })
    .filter(c => c.lastMsg !== undefined)
    .sort((a, b) => b.lastMsg.id.localeCompare(a.lastMsg.id));

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 shadow-lg glass-aqua-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Search bar */}
        <div className="flex items-center gap-4 flex-1 sm:flex-initial">
          <button 
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-hidden group"
          >
            {customLogoUrl ? (
              <img 
                src={customLogoUrl} 
                alt="IdeBagus Logo" 
                className="h-10 w-10 rounded-xl object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-all duration-200" 
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 text-white font-black text-xl shadow-md cursor-pointer group-hover:scale-105 transition-all duration-200">
                iB
              </div>
            )}
            <div className="hidden sm:block text-left">
              <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                idebagus
              </span>
              <span className="text-[10px] font-black tracking-widest text-[#f59e0b] uppercase block -mt-1.5 font-mono drop-shadow-sm">
                .com ✨
              </span>
            </div>
          </button>

          {/* Search bar desktop */}
          <div className="relative hidden md:block w-72 ml-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari ide, barang, & teman..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestionsDropdown(true);
              }}
              onFocus={() => setShowSuggestionsDropdown(true)}
              className="w-full rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-900 py-1.5 pl-10 pr-4 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all"
            />

            {/* Suggestions list popup */}
            {showSuggestionsDropdown && searchQuery.trim().length > 0 && (() => {
              const matches = friends.filter(f => 
                f.displayName.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (matches.length === 0) return null;
              return (
                <div className="absolute top-11 left-0 w-full bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden text-left py-1 animate-slide-in">
                  <div className="px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 bg-gray-50/40 dark:bg-neutral-900/40 border-b border-gray-100 dark:border-neutral-800">
                    Saran Pengguna (Nama yang anda ketik)
                  </div>
                  {matches.slice(0, 5).map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSearchQuery(f.displayName);
                        setActiveTab('chat');
                        setActiveChatFriendId(f.id);
                        setShowSuggestionsDropdown(false);
                      }}
                      className="w-full px-3.5 py-2 hover:bg-emerald-50/20 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          <img src={f.avatar} alt={f.displayName} className="h-7 w-7 rounded-full object-cover border border-emerald-500/10" />
                          <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ${f.isOnline ? 'bg-emerald-500' : 'bg-gray-400'} ring-1 ring-white dark:ring-neutral-900`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 dark:text-gray-100 truncate">{f.displayName}</p>
                          <p className="text-[10px] text-gray-450 truncate">ID: {f.id}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase text-center px-2 py-0.5 rounded-sm shrink-0 ${
                        f.isOnline ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-gray-50 text-gray-400 dark:bg-neutral-800/40'
                      }`}>
                        {f.isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Tab navigation for Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'text-gray-650 dark:text-slate-300 hover:bg-gray-150/50 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Feed Sosial
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'marketplace'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'text-gray-650 dark:text-slate-300 hover:bg-gray-150/50 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Marketplace Lokal
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'chat'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'text-gray-650 dark:text-slate-300 hover:bg-gray-150/50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Obrolan Chat
            {unreadMessagesCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action icons / badgeless quick menu */}
        <div className="flex items-center gap-3">
          
          {/* Friend Requests Badge Dropdown */}
          <div ref={requestsDropdownRef} className="relative">
            <button
              onClick={() => {
                setShowRequestsDropdown(!showRequestsDropdown);
                setShowNotificationsDropdown(false);
                setShowMessagesDropdown(false);
              }}
              className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative ${
                showRequestsDropdown ? 'bg-gray-100 dark:bg-slate-800' : ''
              }`}
            >
              <Users className="h-5 w-5 text-gray-650 dark:text-slate-300" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            {/* Friend requests list dropdown */}
            {showRequestsDropdown && (
              <div className="absolute right-[-4.5rem] sm:right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 dark:border-neutral-850 bg-white dark:bg-neutral-900 p-2 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    Permintaan Pertemanan
                  </h3>
                  <span className="text-xs text-neutral-500">Indonesia</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2 py-1 scrollbar-thin">
                  {pendingRequests.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                      Tidak ada permintaan baru saat ini
                    </div>
                  ) : (
                    pendingRequests.map((req) => (
                      <div key={req.id} className="p-2 rounded-lg bg-gray-50/50 dark:bg-neutral-800/40 flex items-start gap-3">
                        <img 
                          src={req.senderAvatar} 
                          alt={req.senderName} 
                          className="h-10 w-10 rounded-full object-cover border border-blue-500/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 dark:text-white truncate">
                            {req.senderName}
                          </p>
                          <p className="text-[10px] text-neutral-500">Mengajak berteman • {req.createdAt}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                acceptRequest(req.id, req.senderName);
                                setShowRequestsDropdown(false);
                              }}
                              className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              Terima
                            </button>
                            <button
                              onClick={() => {
                                declineRequest(req.id);
                              }}
                              className="px-2.5 py-1 rounded-md bg-gray-200 dark:bg-neutral-700 hover:bg-gray-350 dark:hover:bg-neutral-600 text-gray-700 dark:text-neutral-300 text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages Dropdown Badge Icon */}
          <div ref={messagesDropdownRef} className="relative">
            <button
              id="messages-dropdown-trigger-btn"
              onClick={() => {
                setShowMessagesDropdown(!showMessagesDropdown);
                setShowNotificationsDropdown(false);
                setShowRequestsDropdown(false);
              }}
              className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer relative ${
                showMessagesDropdown ? 'bg-gray-100 dark:bg-neutral-800' : ''
              }`}
            >
              <MessageSquare className="h-5 w-5 text-gray-650 dark:text-slate-300" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Messages Dropdown List Content */}
            {showMessagesDropdown && (
              <div id="messages-header-dropdown" className="absolute right-[-4.5rem] sm:right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 dark:border-neutral-850 bg-white dark:bg-neutral-900 p-2 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    Pesan Masuk (Inbox)
                  </h3>
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      setActiveChatFriendId(null);
                      setShowMessagesDropdown(false);
                    }}
                    className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Buka Semua Obrolan
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-1 py-1 scrollbar-thin">
                  {conversationList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                      Belum ada obrolan pesan masuk
                    </div>
                  ) : (
                    conversationList.map(({ friend, lastMsg, unreadCount, isMarketplaceThread }) => (
                      <div
                        key={friend.id}
                        onClick={() => {
                          setActiveChatFriendId(friend.id);
                          setActiveTab('chat');
                          setShowMessagesDropdown(false);
                        }}
                        className={`p-2.5 rounded-xl transition-all flex gap-3 items-start text-left cursor-pointer ${
                          unreadCount > 0 
                            ? 'bg-blue-55/10 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/60 dark:hover:bg-blue-950/30' 
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800/20'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={friend.avatar}
                            alt={friend.displayName}
                            className="h-9 w-9 rounded-full object-cover border border-gray-100 dark:border-neutral-800"
                          />
                          {friend.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className={`text-xs truncate pr-2 ${unreadCount > 0 ? 'font-extrabold text-[#111] dark:text-white' : 'font-semibold text-gray-900 dark:text-neutral-200'}`}>
                              {friend.displayName}
                            </span>
                            <span className="text-[9px] text-neutral-450 shrink-0">
                              {lastMsg.createdAt}
                            </span>
                          </div>
                          
                          <p className={`text-[11px] truncate ${unreadCount > 0 ? 'text-gray-900 dark:text-neutral-100 font-medium' : 'text-gray-500 dark:text-neutral-400'}`}>
                            {lastMsg.content || '[Gambar / Lampiran]'}
                          </p>

                          {/* INBOX INDICATION SEPARATORS */}
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            {isMarketplaceThread ? (
                              <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/45 px-1.5 py-0.5 rounded border border-amber-200/50">
                                MARKETPLACE 🛒
                              </span>
                            ) : (
                              <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-55/10 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200/40">
                                PERSONAL 💬
                              </span>
                            )}
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0 mt-3 animate-pulse" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Global Notification Badge Dropdown */}
          <div ref={notificationsDropdownRef} className="relative">
            <button
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setShowRequestsDropdown(false);
                setShowMessagesDropdown(false);
                if (!showNotificationsDropdown) {
                  markAllNotificationsRead();
                }
              }}
              className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer relative ${
                showNotificationsDropdown ? 'bg-gray-100 dark:bg-neutral-800' : ''
              }`}
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications List */}
            {showNotificationsDropdown && (
              <div className="absolute right-[-4.5rem] sm:right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    Notifikasi Terbaru
                  </h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto space-y-1 py-1 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                      Belum ada notifikasi baru untuk Anda
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setShowNotificationsDropdown(false);
                        }}
                        className={`p-2.5 rounded-xl transition-all flex gap-3 items-start text-left cursor-pointer ${
                          notif.isRead 
                            ? 'hover:bg-gray-50 dark:hover:bg-neutral-800/20' 
                            : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/60 dark:hover:bg-blue-950/30'
                        }`}
                      >
                        {notif.senderAvatar ? (
                          <img
                            src={notif.senderAvatar}
                            alt="Sender"
                            className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-neutral-800"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                            iB
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[11px] text-gray-900 dark:text-neutral-200">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-gray-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {notif.content}
                          </p>
                          <span className="text-[9px] text-neutral-450 mt-1 block">
                            {notif.createdAt}
                          </span>
                        </div>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User Quick Avatar click -> profile tab */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden cursor-pointer border border-transparent hover:border-blue-500/10"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
            />
            <span className="hidden md:inline text-xs font-semibold text-gray-700 dark:text-gray-300">
              {currentUser.displayName.split(' ')[0]}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}
