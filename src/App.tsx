import { useState, useEffect } from 'react';
import { User, Post, MarketplaceItem, Friend, FriendRequest, AppNotification, Message } from './types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_FRIENDS,
  INITIAL_POSTS,
  INITIAL_MARKETPLACE,
  INITIAL_MESSAGES,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';
import Header from './components/Header';
import BottomNavbar from './components/BottomNavbar';
import Sidebar from './components/Sidebar';
import ProfileEditTab from './components/ProfileEditTab';
import MarketplaceDetail from './components/MarketplaceDetail';
import MessageChatBox from './components/MessageChatBox';
import CreatePostModal from './components/CreatePostModal';

import {
  Heart,
  MessageCircle,
  Share2,
  PlusCircle,
  MapPin,
  Sparkles,
  ShoppingBag,
  Clock,
  Send,
  Search,
  CheckCircle2,
  HardDrive,
  Users,
  AlertCircle,
  BadgeAlert,
  HelpCircle,
  X,
} from 'lucide-react';

export default function App() {
  // --- Persistent Local States ---
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const cached = localStorage.getItem('idebagus_user');
    return cached ? JSON.parse(cached) : INITIAL_CURRENT_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const cached = localStorage.getItem('idebagus_posts');
    return cached ? JSON.parse(cached) : INITIAL_POSTS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const cached = localStorage.getItem('idebagus_marketplace');
    return cached ? JSON.parse(cached) : INITIAL_MARKETPLACE;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    const cached = localStorage.getItem('idebagus_friends');
    return cached ? JSON.parse(cached) : INITIAL_FRIENDS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const cached = localStorage.getItem('idebagus_messages');
    return cached ? JSON.parse(cached) : INITIAL_MESSAGES;
  });

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const cached = localStorage.getItem('idebagus_requests');
    return cached ? JSON.parse(cached) : INITIAL_FRIEND_REQUESTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const cached = localStorage.getItem('idebagus_notifications');
    return cached ? JSON.parse(cached) : INITIAL_NOTIFICATIONS;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const cached = localStorage.getItem('idebagus_theme');
    if (cached === 'dark' || cached === 'light') return cached;
    return 'light';
  });

  // --- Layout States ---
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [viewListingId, setViewListingId] = useState<string | null>(null);
  
  // Custom states
  const [postQuery, setPostQuery] = useState('');
  const [marketQuery, setMarketQuery] = useState('');
  const [activeMarketCategory, setActiveMarketCategory] = useState<string>('Semua');
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [showNotificationBadgeSplash, setShowNotificationBadgeSplash] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  
  // Marketplace item creation values
  const [newMarketTitle, setNewMarketTitle] = useState('');
  const [newMarketPrice, setNewMarketPrice] = useState('');
  const [newMarketDesc, setNewMarketDesc] = useState('');
  const [newMarketCategory, setNewMarketCategory] = useState('Elektronik');
  const [newMarketCondition, setNewMarketCondition] = useState<'Baru' | 'Bekas'>('Baru');
  const [newMarketImage, setNewMarketImage] = useState('https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80');
  const [showSellModal, setShowSellModal] = useState(false);

  // Chat tracking states
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('idebagus_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('idebagus_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('idebagus_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('idebagus_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('idebagus_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('idebagus_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem('idebagus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('idebagus_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Tab Switch Actions
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewListingId(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Real-Time Signal Simulators (for satisfying real-time feeds requirements) ---
  // Users can click this button to trigger simulated incoming friend request or message badges
  const triggerSimulatedIncomingNotification = () => {
    const randomSeed = Math.random();

    if (randomSeed < 0.33) {
      // Trigger a new Friend Request
      const newReqId = 'req_' + Date.now();
      const newRequest: FriendRequest = {
        id: newReqId,
        senderId: 'user_rand_' + Date.now(),
        senderName: 'Lina Rosalina',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'pending',
        createdAt: 'Baru saja'
      };

      const newNotif: AppNotification = {
        id: 'n_req_' + Date.now(),
        type: 'friend_request',
        title: 'Permintaan Pertemanan Baru',
        content: `Lina Rosalina mengajak Anda berteman di idebagus.com!`,
        senderId: newRequest.senderId,
        senderAvatar: newRequest.senderAvatar,
        isRead: false,
        createdAt: 'Baru saja'
      };

      setFriendRequests(prev => [newRequest, ...prev]);
      setNotifications(prev => [newNotif, ...prev]);

    } else if (randomSeed < 0.66) {
      // Trigger a Chat Message
      const activeFriend = friends[Math.floor(Math.random() * friends.length)] || friends[0];
      const newMsg: Message = {
        id: 'msg_' + Date.now(),
        senderId: activeFriend.id,
        receiverId: currentUser.id,
        content: `Halo Bagus! Kemarin saya lihat produk di marketplace kamu, apakah masih ada nego? 🤔`,
        isRead: false,
        createdAt: 'Baru saja'
      };

      const newNotif: AppNotification = {
        id: 'n_msg_' + Date.now(),
        type: 'message',
        title: `Pesan baru dari ${activeFriend.displayName}`,
        content: newMsg.content,
        senderId: activeFriend.id,
        senderAvatar: activeFriend.avatar,
        targetId: activeFriend.id,
        isRead: false,
        createdAt: 'Baru saja'
      };

      setMessages(prev => [...prev, newMsg]);
      setNotifications(prev => [newNotif, ...prev]);
      
    } else {
      // Trigger a social like/comment notification on your first post
      const firstPost = posts[0];
      const reviewer = friends[Math.floor(Math.random() * friends.length)] || friends[0];
      
      const newNotif: AppNotification = {
        id: 'n_like_' + Date.now(),
        type: 'like',
        title: `Postingan Anda Disukai`,
        content: `${reviewer.displayName} menyukai postingan Anda: "${firstPost ? firstPost.content.substring(0, 30) : ''}..."`,
        senderId: reviewer.id,
        senderAvatar: reviewer.avatar,
        isRead: false,
        createdAt: 'Baru saja'
      };

      setNotifications(prev => [newNotif, ...prev]);
    }

    // Flash a quick toast indicator
    setShowNotificationBadgeSplash(true);
    setTimeout(() => setShowNotificationBadgeSplash(false), 3000);
  };

  // --- Business logic: Social Actions ---
  const handleCreatePost = (content: string, image?: string, location?: string) => {
    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatar,
      content,
      image,
      location,
      likes: [],
      comments: [],
      createdAt: 'Baru saja'
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = p.likes.includes(currentUser.id);
          const updatedLikes = isLiked
            ? p.likes.filter(id => id !== currentUser.id)
            : [...p.likes, currentUser.id];
          return { ...p, likes: updatedLikes };
        }
        return p;
      })
    );
  };

  const handleCommentPost = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: 'comm_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatar,
      content: text,
      createdAt: 'Baru saja'
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  // --- Business logic: Friend Request responses ---
  const handleAcceptFriendRequest = (requestId: string, senderName: string) => {
    setFriendRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'accepted' as const } : r))
    );

    // Add to friend list
    const requestItem = friendRequests.find(r => r.id === requestId);
    if (requestItem) {
      const newFriend: Friend = {
        id: requestItem.senderId,
        displayName: requestItem.senderName,
        avatar: requestItem.senderAvatar,
        isOnline: true
      };
      setFriends(prev => [newFriend, ...prev]);
    }

    // Push notification
    const successNotif: AppNotification = {
      id: 'notif_acc_' + Date.now(),
      type: 'system',
      title: 'Pertemanan Diterima',
      content: `Anda sekarang berteman dengan ${senderName} di idebagus.com. Mulai kirim pesan obrolan aman!`,
      isRead: false,
      createdAt: 'Baru saja'
    };

    setNotifications(prev => [successNotif, ...prev]);
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    setFriendRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'declined' as const } : r))
    );
  };

  // --- Business logic: Chat Messaging replies ---
  const handleSendMessage = (senderId: string, receiverId: string, content: string) => {
    const newMsg: Message = {
      id: 'm_' + Date.now(),
      senderId,
      receiverId,
      content,
      isRead: true,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const handleSimulateReply = (senderId: string, text: string) => {
    const sender = friends.find(f => f.id === senderId);
    const newMsg: Message = {
      id: 'm_reply_' + Date.now(),
      senderId,
      receiverId: currentUser.id,
      content: text,
      isRead: activeTab === 'chat' && activeChatFriendId === senderId, // Is read if user is active in chat tab with this friend
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    // Push notification if user isn't actively looking at this chat
    if (activeTab !== 'chat' || activeChatFriendId !== senderId) {
      const msgNotif: AppNotification = {
        id: 'notif_msg_inst_' + Date.now(),
        type: 'message',
        title: `Pesan baru dari ${sender?.displayName || 'Teman'}`,
        content: text,
        senderId,
        senderAvatar: sender?.avatar,
        isRead: false,
        createdAt: 'Baru saja'
      };
      setNotifications(prev => [msgNotif, ...prev]);
    }
  };

  // --- Business logic: Marketplace checkout and selling ---
  const handleCreateMarketItem = () => {
    if (!newMarketTitle.trim() || !newMarketPrice.trim()) return;

    const newItem: MarketplaceItem = {
      id: 'item_' + Date.now(),
      sellerId: currentUser.id,
      sellerName: currentUser.displayName,
      sellerAvatar: currentUser.avatar,
      title: newMarketTitle,
      description: newMarketDesc,
      price: parseInt(newMarketPrice) || 0,
      image: newMarketImage,
      category: newMarketCategory,
      location: currentUser.location,
      condition: newMarketCondition,
      isSold: false
    };

    setMarketplaceItems(prev => [newItem, ...prev]);
    setShowSellModal(false);
    
    // Clear values
    setNewMarketTitle('');
    setNewMarketPrice('');
    setNewMarketDesc('');

    // Push System confirmation
    const sellNotif: AppNotification = {
      id: 'n_mkt_sell_' + Date.now(),
      type: 'marketplace',
      title: 'Barang Berhasil Diiklankan',
      content: `Produk "${newItem.title}" Anda berhasil ditayangkan di region ${currentUser.location.split(',')[0]}!`,
      isRead: false,
      createdAt: 'Baru saja'
    };
    setNotifications(prev => [sellNotif, ...prev]);
  };

  const handleCompletePaymentTransactionByBuyer = (itemId: string) => {
    // Modify status of bought item
    setMarketplaceItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, isSold: true } : it))
    );

    // Inform user of successful escrow setup
    const boughtItem = marketplaceItems.find(i => i.id === itemId);
    const itemSuccessNotif: AppNotification = {
      id: 'notif_pay_' + Date.now(),
      type: 'marketplace',
      title: 'Sistem Escrow Sukses',
      content: `Escrow untuk "${boughtItem ? boughtItem.title : 'Barang'}" disetujui. Silahkan menunggu pengiriman!`,
      isRead: false,
      createdAt: 'Baru saja'
    };

    setNotifications(prev => [itemSuccessNotif, ...prev]);
  };

  // --- Logout mock trigger ---
  const handleLogoutFlow = () => {
    // Simulate logging out by resetting local values and displaying confirmation feedback
    setCurrentUser(INITIAL_CURRENT_USER);
    setTheme('light');
    setActiveTab('feed');
    alert('Anda telah berhasil keluar dari idebagus.com. Sesi Anda diatur ulang ke mode penjelajah.');
  };

  // Counting outstanding notifications badges 
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length;
  const pendingRequestsCount = friendRequests.filter(r => r.status === 'pending').length;

  const handleMarkAllAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    if (notif.type === 'message') {
      setActiveTab('chat');
      const senderId = notif.senderId || notif.targetId;
      if (senderId) {
        setActiveChatFriendId(senderId);
      }
    } else if (notif.type === 'friend_request') {
      setActiveTab('feed');
    } else if (notif.type === 'like' || notif.type === 'comment') {
      setActiveTab('feed');
      let matchedPostId = notif.targetId;
      if (!matchedPostId) {
        // Try to identify from mock data contents
        const matchedPost = posts.find(p => p.comments.some(c => c.content.includes(notif.content)) || p.id === 'post_2');
        matchedPostId = matchedPost ? matchedPost.id : 'post_1';
      }

      setHighlightedPostId(matchedPostId);

      if (notif.type === 'comment') {
        const post = posts.find(p => p.id === matchedPostId);
        if (post && post.comments.length > 0) {
          const comment = post.comments.find(c => 
            c.content.includes(notif.content) || 
            (notif.senderId && c.userId === notif.senderId)
          );
          if (comment) {
            setHighlightedCommentId(comment.id);
          } else {
            setHighlightedCommentId(post.comments[0].id);
          }
        }
      } else {
        setHighlightedCommentId(null);
      }

      // Scroll smoothly to target post
      setTimeout(() => {
        const element = document.getElementById(`post-${matchedPostId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
    } else if (notif.type === 'marketplace') {
      setActiveTab('marketplace');
      if (notif.targetId) {
        setViewListingId(notif.targetId);
      }
    }
  };

  // Formatting currency helper for Feed items
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-neutral-950 text-gray-900 dark:text-neutral-150 transition-colors duration-200">
      
      {/* Real-time Toast Banner for incoming signals simulation */}
      {showNotificationBadgeSplash && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl animate-bounce border border-emerald-400 font-semibold text-xs flex items-center gap-2">
          <BadgeAlert className="h-4.5 w-4.5 animate-pulse text-white" />
          <span>Sinyal Realtime: Notifikasi & Badge Baru Diterima!</span>
        </div>
      )}

      {/* Main Premium Desktop / Responsive Header Navbar top */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        notifications={notifications}
        markAllNotificationsRead={handleMarkAllAllNotificationsRead}
        friendRequests={friendRequests}
        acceptRequest={handleAcceptFriendRequest}
        declineRequest={handleDeclineFriendRequest}
        unreadCount={unreadCount}
        unreadMessagesCount={unreadMessagesCount}
        onNotificationClick={handleNotificationClick}
      />

      {/* Body Core Content layout Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Column 1: Universal sidebar (Always visible on large desktops, togglable model drawer for phones) */}
          <div className="lg:col-span-1">
            <Sidebar
              currentUser={currentUser}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={handleLogoutFlow}
            />
          </div>

          {/* Column 2&3: Primary Tab Stream Panel (Feed, Marketplace, Chat, Profile) */}
          <main className="lg:col-span-3 space-y-6 pb-24 lg:pb-12 text-left">
            
            {/* Realtime Event Sim Trigger Box ( Indonesia Region Custom Simulator ) */}
            <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/20 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded-sm tracking-wider">
                  Real-time Simulate Control
                </span>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Simulasikan Panggilan Sinyal Realtime?
                </p>
                <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                  Klik tombol untuk mensimulasikan pesan instan, permintaan pertemanan, dan menyinkronkan badge notifikasi.
                </p>
              </div>

              <button
                onClick={triggerSimulatedIncomingNotification}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-extrabold rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition-all"
              >
                Kirim Sinyal Masuk Realtime ⚡
              </button>
            </div>

            {/* --- TAB: FEED --- */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                
                {/* Visual Quick Posting Entry Card with avatar */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-gray-150 dark:border-neutral-800 flex gap-3 items-center">
                  <img src={currentUser.avatar} alt="User Avatar" className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500" />
                  <button
                    onClick={() => setCreatePostModalOpen(true)}
                    className="flex-1 bg-gray-50 dark:bg-neutral-800 text-left text-xs font-semibold px-4 py-3 rounded-2xl text-gray-450 hover:bg-gray-100 dark:hover:bg-neutral-750 transition-colors cursor-pointer border border-transparent hover:border-emerald-500/10"
                  >
                    Bagikan ide bagus atau penawaran produk daerah sekarang...
                  </button>
                  <button
                    onClick={() => setCreatePostModalOpen(true)}
                    className="p-3 bg-emerald-500 text-white rounded-2xl cursor-pointer hover:bg-emerald-600 shadow-sm shrink-0"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>

                {/* Filter Search Social bar */}
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 dark:text-neutral-500"><Search className="h-4.5 w-4.5" /></span>
                  <input
                    type="text"
                    placeholder="Saring konten feed berdasarkan kata kunci..."
                    value={postQuery}
                    onChange={(e) => setPostQuery(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-gray-205 dark:border-neutral-800 rounded-2xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Main chronological posts list */}
                <div className="space-y-6">
                  {posts
                    .filter(p => !postQuery || p.content.toLowerCase().includes(postQuery.toLowerCase()) || (p.location && p.location.toLowerCase().includes(postQuery.toLowerCase())))
                    .map((post) => {
                      const hasLiked = post.likes.includes(currentUser.id);
                      return (
                        <article 
                          id={`post-${post.id}`}
                          key={post.id} 
                          className={`bg-white dark:bg-neutral-900 rounded-3xl p-5 border shadow-2xs space-y-4 transition-all duration-300 ${
                            post.id === highlightedPostId
                              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/5 dark:bg-blue-950/5'
                              : 'border-gray-150 dark:border-neutral-800'
                          }`}
                        >
                          {/* User authorship info */}
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <img src={post.userAvatar} alt={post.userName} className="h-10 w-10 rounded-full object-cover border border-emerald-500/10" />
                              <div className="text-left">
                                <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1">
                                  {post.userName}
                                  {post.userId === currentUser.id && <span className="text-[8px] bg-slate-100 dark:bg-neutral-800 text-slate-500 px-1 py-0.5 rounded-sm">Kamu</span>}
                                </h4>
                                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{post.createdAt}</span>
                                  {post.location && (
                                    <>
                                      <span>•</span>
                                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{post.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content text */}
                          <p className="text-xs text-gray-800 dark:text-neutral-250 leading-relaxed font-sans">
                            {post.content}
                          </p>

                          {/* Content image if has visual illustration */}
                          {post.image && (
                            <div className="rounded-2xl overflow-hidden max-h-80 border border-gray-150 bg-gray-55 flex items-center justify-center">
                              <img src={post.image} alt="Visual Attachment" className="w-full object-cover" />
                            </div>
                          )}

                          {/* Action Toolbar buttons */}
                          <div className="flex gap-6 pt-3 border-t border-gray-100 dark:border-neutral-850/70 text-gray-500 dark:text-neutral-450">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                                hasLiked ? 'text-rose-500' : 'hover:text-rose-500'
                              }`}
                            >
                              <Heart className={`h-4.5 w-4.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span>{post.likes.length} Suka</span>
                            </button>

                            <span className="flex items-center gap-1.5 text-xs font-semibold">
                              <MessageCircle className="h-4.5 w-4.5" />
                              <span>{post.comments.length} Komentar</span>
                            </span>
                          </div>

                          {/* Sub-Comments listings stack */}
                          {post.comments.length > 0 && (
                            <div className="bg-gray-50 dark:bg-neutral-950/40 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-neutral-800/60">
                              {post.comments.map((comment) => {
                                const isCommentHighlighted = comment.id === highlightedCommentId;
                                return (
                                  <div 
                                    key={comment.id} 
                                    className={`flex gap-2.5 items-start text-xs text-left p-1.5 rounded-xl transition-all ${
                                      isCommentHighlighted 
                                        ? 'bg-blue-50/90 dark:bg-blue-900/40 border-l-4 border-blue-500 shadow-sm animate-pulse scale-[1.01]' 
                                        : ''
                                    }`}
                                  >
                                    <img src={comment.userAvatar} alt={comment.userName} className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5" />
                                    <div className={`flex-1 min-w-0 p-2 text-[11px] rounded-xl border ${
                                      isCommentHighlighted
                                        ? 'bg-white dark:bg-slate-900 border-blue-400 shadow-inner'
                                        : 'bg-white dark:bg-neutral-900 border-gray-150 dark:border-neutral-800'
                                    }`}>
                                      <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                          {comment.userName}
                                          {isCommentHighlighted && (
                                            <span className="text-[8px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded-full select-none animate-bounce">
                                              Sumber Notif
                                            </span>
                                          )}
                                        </span>
                                        <span className="text-[8px] text-gray-400">{comment.createdAt}</span>
                                      </div>
                                      <p className="text-gray-700 dark:text-neutral-300 leading-relaxed font-semibold">{comment.content}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Write comments form */}
                          <div className="flex gap-2.5 items-center">
                            <input
                              type="text"
                              placeholder="Tulis opini terbaik Anda..."
                              value={newCommentText[post.id] || ''}
                              onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleCommentPost(post.id);
                              }}
                              className="flex-1 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-neutral-750 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-950 focus:outline-hidden"
                            />
                            <button
                              onClick={() => handleCommentPost(post.id)}
                              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                            >
                              Kirim
                            </button>
                          </div>

                        </article>
                      );
                    })}

                  {posts.length === 0 && (
                    <div className="text-center py-10 text-neutral-400">
                      Tidak ada postingan yang sesuai kata kunci pencarian.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* --- TAB: MARKETPLACE --- */}
            {activeTab === 'marketplace' && !viewListingId && (
              <div className="space-y-6">
                
                {/* Visual Sell Item trigger box banner */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="text-left space-y-1">
                    <span className="bg-white/20 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-sm">REGIONAL PASAR INDONESIA</span>
                    <h3 className="text-lg font-extrabold">Ingin Menjual Barang Lokal?</h3>
                    <p className="text-xs text-teal-100">Buka gerbang penjualan aman dan tawarkan barang daganganmu ke ribuan pembeli lokal.</p>
                  </div>
                  <button
                    onClick={() => setShowSellModal(true)}
                    className="px-5 py-3 bg-white hover:bg-neutral-50 text-teal-700 font-extrabold text-xs rounded-xl shadow-md shrink-0 cursor-pointer transition-transform active:scale-95"
                  >
                    Mulai Berjualan (Pasang Iklan)
                  </button>
                </div>

                {/* Categories filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {['Semua', 'Elektronik', 'Mebel / Furnitur', 'Olahraga', 'Fashion'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveMarketCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        activeMarketCategory === cat
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Keywords parameters sifter */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari barang, gawai, mebel, otomotif di marketplace..."
                    value={marketQuery}
                    onChange={(e) => setMarketQuery(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-gray-205 dark:border-neutral-850 rounded-2xl py-2.5 pl-4 pr-10 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3.5 top-3 text-gray-400"><Search className="h-4.5 w-4.5" /></span>
                </div>

                {/* Grid layout for catalog list items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceItems
                    .filter(
                      item =>
                        (activeMarketCategory === 'Semua' || item.category.toLowerCase().includes(activeMarketCategory.toLowerCase().split(' ')[0])) &&
                        (!marketQuery || item.title.toLowerCase().includes(marketQuery.toLowerCase()) || item.location.toLowerCase().includes(marketQuery.toLowerCase()))
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xs group hover:scale-[1.01] transition-transform flex flex-col justify-between"
                      >
                        {/* Image banner area */}
                        <div className="relative h-44 bg-gray-100 relative">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          {item.isSold ? (
                            <span className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center text-xs font-black text-white uppercase tracking-wider">
                              SUDAH TERJUAL CO ✔️
                            </span>
                          ) : (
                            <span className="absolute top-2.5 left-2.5 bg-teal-500 text-white font-extrabold text-[8px] uppercase px-2 py-0.5 rounded-sm">
                              {item.condition}
                            </span>
                          )}
                        </div>

                        {/* Title, cost details */}
                        <div className="p-4 flex-1 flex flex-col justify-between text-left space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                            <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate mt-0.5 group-hover:text-emerald-500 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400 mt-1">
                              {formatRupiah(item.price)}
                            </p>
                            <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-1.5">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-100 dark:border-neutral-850/60 flex items-center justify-between text-[10px] text-gray-400">
                            <span className="flex items-center gap-0.5 truncate max-w-[100px]">
                              <MapPin className="h-3 w-3 text-rose-500 inline shrink-0" />
                              {item.location.split(',')[0]}
                            </span>
                            <span className="font-semibold text-emerald-500">{item.sellerName.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Button triggers detailed portal modal view */}
                        <div className="px-4 pb-4">
                          <button
                            onClick={() => setViewListingId(item.id)}
                            className="w-full py-2 border border-gray-200 dark:border-neutral-700 hover:border-emerald-500 hover:text-emerald-500 font-extrabold text-xs rounded-xl text-gray-700 dark:text-neutral-300 transition-all cursor-pointer text-center block"
                          >
                            Lihat Rincian Detail
                          </button>
                        </div>

                      </div>
                    ))}
                </div>

                {marketplaceItems.length === 0 && (
                  <div className="text-center py-10 text-neutral-400">
                    Tidak ada barang niaga yang dipajang saat ini.
                  </div>
                )}

              </div>
            )}

            {/* --- TAB: CHAT MESSAGES PANEL --- */}
            {activeTab === 'chat' && (
              <MessageChatBox
                currentUserId={currentUser.id}
                friends={friends}
                messages={messages}
                onSendMessage={handleSendMessage}
                onSimulateReply={handleSimulateReply}
                activeChatFriendId={activeChatFriendId}
                setActiveChatFriendId={setActiveChatFriendId}
              />
            )}

            {/* --- TAB: PROFILE SETTINGS SYNC --- */}
            {activeTab === 'profile' && (
              <ProfileEditTab
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
              />
            )}

            {/* --- MULTI-VIEW PORTAL FOR SELECTED MARKETPLACE DETAIL --- */}
            {activeTab === 'marketplace' && viewListingId && (
              (() => {
                const targetProduct = marketplaceItems.find(i => i.id === viewListingId);
                return targetProduct ? (
                  <MarketplaceDetail
                    item={targetProduct}
                    onClose={() => setViewListingId(null)}
                    onBuySuccess={handleCompletePaymentTransactionByBuyer}
                  />
                ) : null;
              })()
            )}

          </main>

        </div>
      </div>

      {/* COMPACT FLOATING BOTTOM NAV BAR (For mobile responsivity compliance: please all not over the line) */}
      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadCount}
        friendRequestsCount={pendingRequestsCount}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* --- MODAL DIALOG: POST CREATOR FORM --- */}
      <CreatePostModal
        currentUser={currentUser}
        isOpen={createPostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />

      {/* --- SELL PRODUCT MODAL FOR PASANG IKLAN MALAH --- */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShoppingBag className="h-4.5 w-4.5 text-emerald-500" />
                Pasang Dagangan Baru
              </h3>
              <button onClick={() => setShowSellModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Nama Barang / Produk:</label>
                <input 
                  type="text"
                  value={newMarketTitle}
                  onChange={(e) => setNewMarketTitle(e.target.value)}
                  placeholder="Contoh: Sepeda Lipat Polygon S90"
                  className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Harga (Rupiah Rp):</label>
                  <input 
                    type="number"
                    value={newMarketPrice}
                    onChange={(e) => setNewMarketPrice(e.target.value)}
                    placeholder="3500000"
                    className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Kategori:</label>
                  <select 
                    value={newMarketCategory}
                    onChange={(e) => setNewMarketCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs"
                  >
                    <option value="Elektronik">Elektronik</option>
                    <option value="Mebel / Furnitur">Mebel / Furnitur</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Kondisi Barang:</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs">
                    <input type="radio" checked={newMarketCondition === 'Baru'} onChange={() => setNewMarketCondition('Baru')} className="accent-emerald-500" />
                    Baru (Segel)
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs">
                    <input type="radio" checked={newMarketCondition === 'Bekas'} onChange={() => setNewMarketCondition('Bekas')} className="accent-emerald-500" />
                    Bekas (Second)
                  </label>
                </div>
              </div>

              {/* Presets images helper */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Pilih Gambar Ilustrasi Produk:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80', // phone
                    'https://images.unsplash.com/photo-1532372320978-9b4d1a358f4c?w=600&auto=format&fit=crop&q=80', // wood furniture
                    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', // bike
                    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80'  // fashion shoes
                  ].map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewMarketImage(img)}
                      className={`h-11 rounded-lg overflow-hidden border ${
                        newMarketImage === img ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="Product preset" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Deskripsi Detail:</label>
                <textarea 
                  value={newMarketDesc}
                  onChange={(e) => setNewMarketDesc(e.target.value)}
                  rows={3}
                  placeholder="Tulis kelengkapan barang, minus fisik jika ada, garansi, dsb..."
                  className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={handleCreateMarketItem}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Terbitkan Iklan 🚀
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
