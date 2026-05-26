import { useState, useEffect } from 'react';
import { User, Post, MarketplaceItem, Friend, FriendRequest, AppNotification, Message, EscrowTransaction } from './types';
import { motion, AnimatePresence } from 'motion/react';
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
  Truck,
  Settings,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Sliders,
  ClipboardList,
  Trash2,
  Smile,
  Image as ImageIcon
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
  const [marketSubTab, setMarketSubTab] = useState<'browse' | 'orders' | 'admin'>('browse');
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(() => {
    const cached = localStorage.getItem('idebagus_transactions');
    try {
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [viewListingId, setViewListingId] = useState<string | null>(null);
  
  // Custom states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarketCategory, setActiveMarketCategory] = useState<string>('Semua');
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [newCommentImage, setNewCommentImage] = useState<{ [postId: string]: string }>({});
  const [activeCommentEmojiBoxId, setActiveCommentEmojiBoxId] = useState<string | null>(null);
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

  // Lightbox view state for all images
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        // Exclude tiny icons if necessary, but "all images" means everything is showable!
        setLightboxSrc(img.src);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxSrc(null);
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    localStorage.setItem('idebagus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('idebagus_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Automatically mark messages as read when active chat thread is opened or on the chat tab
  useEffect(() => {
    if (activeTab === 'chat' && activeChatFriendId) {
      setMessages(prev => {
        const hasUnread = prev.some(m => m.senderId === activeChatFriendId && m.receiverId === currentUser.id && !m.isRead);
        if (!hasUnread) return prev;
        return prev.map(m =>
          m.senderId === activeChatFriendId && m.receiverId === currentUser.id && !m.isRead
            ? { ...m, isRead: true }
            : m
        );
      });
    }
  }, [activeTab, activeChatFriendId, currentUser.id]);

  // Handle Tab Switch Actions
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewListingId(null);
    if (tab === 'chat' && !activeChatFriendId && friends.length > 0) {
      setActiveChatFriendId(friends[0].id);
    }
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

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleCommentPost = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    const attachedImg = newCommentImage[postId];
    if (!text && !attachedImg) return;

    const newComment = {
      id: 'comm_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatar,
      content: text || '',
      image: attachedImg || undefined,
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
    setNewCommentImage(prev => ({ ...prev, [postId]: '' }));
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
  const handleSendMessage = (senderId: string, receiverId: string, content: string, image?: string, marketplaceContext?: any) => {
    const newMsg: Message = {
      id: 'm_' + Date.now(),
      senderId,
      receiverId,
      content,
      image,
      marketplaceContext,
      isRead: true,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const handleContactSeller = (item: MarketplaceItem) => {
    if (item.sellerId === currentUser.id) return;

    // Ensure seller is in friends state so they show up in inbox contacts list
    setFriends(prev => {
      const alreadyFriend = prev.some(f => f.id === item.sellerId);
      if (alreadyFriend) return prev;
      
      const newFriend: Friend = {
        id: item.sellerId,
        displayName: item.sellerName,
        avatar: item.sellerAvatar,
        isOnline: true
      };
      return [...prev, newFriend];
    });

    const formatPrice = (value: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value);
    };

    const textMessage = `Halo ${item.sellerName}, apakah unit "${item.title}" seharga ${formatPrice(item.price)} masih tersedia? Saya sangat tertarik membelinya.`;
    
    // Check if we already have queries under this marketplace item to avoid excessive duplicates
    const contextExists = messages.some(msg => msg.marketplaceContext?.itemId === item.id);
    
    if (!contextExists) {
      const newMsg: Message = {
        id: 'm_market_init_' + Date.now(),
        senderId: currentUser.id,
        receiverId: item.sellerId,
        content: textMessage,
        marketplaceContext: {
          itemId: item.id,
          itemTitle: item.title,
          itemPrice: item.price,
          itemImage: item.image
        },
        isRead: true,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);

      // Simulate a very quick realistic automatic seller reply!
      setTimeout(() => {
        const replyMsg: Message = {
          id: 'm_market_reply_' + Date.now(),
          senderId: item.sellerId,
          receiverId: currentUser.id,
          content: `Halo! Iya kak, "${item.title}" masih ada dan siap lho. Pembayaran bisa pakai Rekber Escrow di tab Marketplace juga biar aman 👍 Kapan ya rencana kakak ingin COD atau dikirim?`,
          marketplaceContext: {
            itemId: item.id,
            itemTitle: item.title,
            itemPrice: item.price,
            itemImage: item.image
          },
          isRead: false,
          createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1500);
    }

    // Direct redirection to Inbox
    setActiveChatFriendId(item.sellerId);
    setActiveTab('chat');
    setViewListingId(null);
  };

  const handleSimulateReply = (senderId: string, text: string, image?: string) => {
    const sender = friends.find(f => f.id === senderId);
    const newMsg: Message = {
      id: 'm_reply_' + Date.now(),
      senderId,
      receiverId: currentUser.id,
      content: text,
      image,
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

  const handleDeleteMessages = (messageIds: string[]) => {
    setMessages(prev => prev.filter(m => !messageIds.includes(m.id)));
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

  const handleCompletePaymentTransactionByBuyer = (
    itemId: string, 
    method: 'qris' | 'gopay' | 'ovo' | 'va_bca',
    selectedExpedition?: 'JNE Express' | 'J&T Express' | 'SiCepat Ekspres' | 'Pos Indonesia' | 'GoSend Instant' | 'Anteraja' | 'Shopee Xpress'
  ) => {
    // Modify status of bought item
    setMarketplaceItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, isSold: true } : it))
    );

    const boughtItem = marketplaceItems.find(i => i.id === itemId);
    if (!boughtItem) return;

    // Establish indonesian resi trace log
    const indonesianExpeditions: ('JNE Express' | 'J&T Express' | 'SiCepat Ekspres' | 'Pos Indonesia' | 'GoSend Instant' | 'Anteraja' | 'Shopee Xpress')[] = [
      'SiCepat Ekspres',
      'J&T Express',
      'JNE Express',
      'Pos Indonesia',
      'GoSend Instant',
      'Anteraja',
      'Shopee Xpress'
    ];
    // pick randomized initial expedition or manual choice
    const chosenExpedition = selectedExpedition || indonesianExpeditions[Math.floor(Math.random() * indonesianExpeditions.length)];
    const randomResi = 'IDN' + Math.floor(100000000000 + Math.random() * 900000000000);

    const initialLogs = [
      {
        time: 'Baru saja',
        statusText: 'Pembayaran Diverifikasi (Escrow Secured)',
        note: `Pembayaran via ${method.toUpperCase()} aman dikunci di Escrow Rekening Bersama idebagus.com.`
      },
      {
        time: 'Menunggu',
        statusText: 'Menunggu Pengiriman oleh Penjual',
        note: `Penjual (${boughtItem.sellerName}) sedang mengemas barang untuk diserahkan ke kurir ${chosenExpedition}.`
      }
    ];

    const newTxn: EscrowTransaction = {
      id: 'txn_' + Date.now(),
      itemId: boughtItem.id,
      itemTitle: boughtItem.title,
      itemPrice: boughtItem.price,
      itemImage: boughtItem.image,
      buyerId: currentUser.id,
      buyerName: currentUser.displayName,
      paymentMethod: method,
      paymentStatus: 'escrow_secured',
      expedition: chosenExpedition,
      receiptNumber: randomResi,
      currentTrackingStepIndex: 1, // index has advanced to awaiting shipper
      trackingLogs: initialLogs,
      createdAt: 'Baru saja'
    };

    setTransactions(prev => [newTxn, ...prev]);

    // System banner feedback notification
    const itemSuccessNotif: AppNotification = {
      id: 'notif_pay_' + Date.now(),
      type: 'marketplace',
      title: 'Sistem Escrow Aktif',
      content: `Pembayaran untuk "${boughtItem.title}" berhasil disetujui. Kurir ${chosenExpedition} siap menjemput paket Anda!`,
      isRead: false,
      createdAt: 'Baru saja'
    };

    setNotifications(prev => [itemSuccessNotif, ...prev]);
    
    // Switch directly to orders tracker inside marketplace tab!
    setMarketSubTab('orders');
    setViewListingId(null);
  };

  const [transitsProcessing, setTransitsProcessing] = useState<{ [id: string]: boolean }>({});

  const handleSimulateTransitProgress = (txnId: string) => {
    if (transitsProcessing[txnId]) return;

    setTransitsProcessing(prev => ({ ...prev, [txnId]: true }));

    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    const simulationSteps = [
      {
        statusText: 'Kurir Menjemput Paket (Pick Up Success)',
        note: `Kurir ekpedisi ${txn.expedition} telah datang menjemput barang di toko penjual lokal, sedang dipersiapkan untuk scan manifest.`
      },
      {
        statusText: 'Paket Diproses di Sorting Hub',
        note: `Paket disortir di Hub Transit Regional (Region asal ${txn.buyerId === '1' ? 'DKI Jakarta' : 'Surabaya'}).`
      },
      {
        statusText: 'Paket dalam Perjalanan Antar Kota (Transit)',
        note: `Paket sedang diterbangkan / dikirim via logistik darat ke Hub tujuan pengantaran regional Indonesia.`
      },
      {
        statusText: 'Kurir Sedang Mengantar Ke Alamat Anda (On Delivery)',
        note: `Kurir sedang membawa paket menuju alamat penerima dekat lokasi Anda. Silakan standby!`
      },
      {
        statusText: 'Paket Berhasil Diterima (Delivered)',
        note: `Paket berhasil diserahterimakan kepada Pembeli dengan aman dan utuh. Sistem jaminan escrow selesai sukses!`
      }
    ];

    let currentStepIndex = 0;

    const intervalId = setInterval(() => {
      // Find the latest state inside the interval
      setTransactions(prevTransactions => {
        const targetTxn = prevTransactions.find(t => t.id === txnId);
        if (!targetTxn) {
          clearInterval(intervalId);
          return prevTransactions;
        }

        if (currentStepIndex >= simulationSteps.length) {
          clearInterval(intervalId);
          setTransitsProcessing(prev => ({ ...prev, [txnId]: false }));

          const finalizedStep = simulationSteps[simulationSteps.length - 1];
          const now = new Date();
          const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

          // Push final notification
          const finalNotif: AppNotification = {
            id: 'notif_sim_final_' + Date.now(),
            type: 'marketplace',
            title: 'Paket Telah Sampai! 🎉',
            content: `Pesanan "${targetTxn.itemTitle}" via ${targetTxn.expedition} telah berhasil diterima di alamat tujuan. Escrow dilepas ke penjual.`,
            isRead: false,
            createdAt: 'Baru saja'
          };
          setNotifications(prev => [finalNotif, ...prev]);

          return prevTransactions.map(t => {
            if (t.id === txnId) {
              return {
                ...t,
                paymentStatus: 'delivered',
                currentTrackingStepIndex: 5,
                trackingLogs: [
                  ...t.trackingLogs,
                  {
                    time: `Pukul ${formattedTime}`,
                    statusText: finalizedStep.statusText,
                    note: finalizedStep.note
                  }
                ]
              };
            }
            return t;
          });
        }

        const currentLog = simulationSteps[currentStepIndex];
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Trigger notification
        const intermediateNotif: AppNotification = {
          id: 'notif_sim_step_' + Date.now() + '_' + currentStepIndex,
          type: 'marketplace',
          title: `Lacak Kurir ${targetTxn.expedition}`,
          content: `Pembaruan paket ${targetTxn.itemTitle}: ${currentLog.statusText}`,
          isRead: false,
          createdAt: 'Baru saja'
        };
        setNotifications(prev => [intermediateNotif, ...prev]);

        const updated = prevTransactions.map(t => {
          if (t.id === txnId) {
            const isLastStep = currentStepIndex === simulationSteps.length - 1;
            return {
              ...t,
              paymentStatus: isLastStep ? ('delivered' as const) : ('shipped_transit' as const),
              currentTrackingStepIndex: currentStepIndex + 2,
              trackingLogs: [
                ...t.trackingLogs,
                {
                  time: `Pukul ${formattedTime}`,
                  statusText: currentLog.statusText,
                  note: currentLog.note
                }
              ]
            };
          }
          return t;
        });

        currentStepIndex++;
        return updated;
      });
    }, 4500); // 4.5s simulation increments
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

      let foundCommentId = '';
      if (notif.type === 'comment') {
        const post = posts.find(p => p.id === matchedPostId);
        if (post && post.comments.length > 0) {
          const comment = post.comments.find(c => 
            c.content.includes(notif.content) || 
            (notif.senderId && c.userId === notif.senderId)
          );
          if (comment) {
            setHighlightedCommentId(comment.id);
            foundCommentId = comment.id;
          } else {
            setHighlightedCommentId(post.comments[0].id);
            foundCommentId = post.comments[0].id;
          }
        }
      } else {
        setHighlightedCommentId(null);
      }

      // Scroll smoothly to target comment or post with precision
      setTimeout(() => {
        const scrollerId = foundCommentId ? `comment-${foundCommentId}` : `post-${matchedPostId}`;
        const element = document.getElementById(scrollerId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const fallbackElement = document.getElementById(`post-${matchedPostId}`);
          if (fallbackElement) {
            fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 300);
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
        friends={friends}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveChatFriendId={setActiveChatFriendId}
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
            
            {/* Realtime Event Sim Trigger Box ( Indonesia Region Custom Simulator ) with silver styled text box */}
            <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-left">
              <div className="text-left space-y-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-sm tracking-wider border border-slate-600">
                  Simulasi Realtime
                </span>
                <p className="text-xs font-bold text-[#e2e8f0] dark:text-[#f1f5f9]">
                  Simulasikan Panggilan Sinyal Realtime?
                </p>
                <p className="text-[10px] text-slate-400">
                  Simulasikan pesan instan, kemajuan kurir, dan sinkronkan dengan database Idebagus di Indonesia secara instan.
                </p>
              </div>

              <button
                onClick={triggerSimulatedIncomingNotification}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-650 text-slate-200 hover:text-white border border-slate-600 text-[11px] font-extrabold rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition-all"
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

                {/* Main chronological posts list */}
                <div className="space-y-6">
                  {posts
                    .filter(p => !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase()) || (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())))
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

                            {/* Delete Post action button if post belongs to user */}
                            {post.userId === currentUser.id && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                                title="Hapus Postingan"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          {/* Content text */}
                          <div className="bg-slate-800 dark:bg-slate-950 text-white p-4 rounded-2xl shadow-xs border border-slate-700/50 dark:border-neutral-800 text-left">
                            <p className="text-xs sm:text-sm text-white leading-relaxed font-sans font-medium">
                              {post.content}
                            </p>
                          </div>

                          {/* Content image if has visual illustration */}
                          {post.image && (
                            <div 
                              onClick={() => setLightboxSrc(post.image)}
                              className="rounded-2xl overflow-hidden h-[250px] w-[250px] border border-gray-150 bg-gray-55 flex items-center justify-center cursor-zoom-in group shadow-xs hover:shadow-md transition-shadow select-none mx-auto sm:mx-0"
                            >
                              <img src={post.image} alt="Visual Attachment" className="w-[250px] h-[250px] object-cover duration-300 group-hover:scale-105 transition-transform" />
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
                                    id={`comment-${comment.id}`}
                                    className={`flex gap-2.5 items-start text-xs text-left p-1.5 rounded-xl transition-all ${
                                      isCommentHighlighted 
                                        ? 'animate-blink-custom border-l-4 border-emerald-500 shadow-lg scale-[1.02] ring-1 ring-emerald-400/30' 
                                        : ''
                                    }`}
                                  >
                                    <img src={comment.userAvatar} alt={comment.userName} className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5" />
                                    <div className={`flex-1 min-w-0 p-2 text-[11px] rounded-xl border ${
                                      isCommentHighlighted
                                        ? 'bg-white/80 dark:bg-neutral-900/95 border-emerald-500 text-gray-900 dark:text-white shadow-md'
                                        : 'bg-slate-700 text-white dark:bg-neutral-950 border-slate-600 dark:border-neutral-800'
                                    }`}>
                                      <div className="flex justify-between items-baseline mb-0.5">
                                        <span className={`font-bold flex items-center gap-1.5 ${
                                          isCommentHighlighted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-100 dark:text-slate-200'
                                        }`}>
                                          {comment.userName}
                                          {isCommentHighlighted && (
                                            <span className="text-[8px] bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full select-none animate-bounce shadow-xs">
                                              Sumber Notif ✨
                                            </span>
                                          )}
                                        </span>
                                        <span className={`text-[8px] ${isCommentHighlighted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{comment.createdAt}</span>
                                      </div>
                                      <p className={`text-xs leading-relaxed font-semibold block break-words ${
                                        isCommentHighlighted ? 'text-gray-950 dark:text-neutral-100' : 'text-white'
                                      }`}>{comment.content}</p>

                                      {/* Render comment image if attached */}
                                      {comment.image && (
                                        <div className="mt-2 rounded-xl overflow-hidden max-h-36 border border-white/10 dark:border-neutral-800 bg-neutral-950/40">
                                          <img src={comment.image} alt="Komentar Foto" className="w-[85%] object-cover cursor-pointer hover:opacity-95" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Write comments form with photo upload and emojis */}
                          <div className="space-y-2 mt-2 font-sans">
                            {/* Attached image preview for comment */}
                            {newCommentImage[post.id] && (
                              <div className="flex items-center gap-2.5 p-1.5 bg-gray-50 dark:bg-neutral-950 rounded-xl max-w-xs text-[10px] animate-fade-in border border-gray-150/50 dark:border-neutral-850">
                                <img src={newCommentImage[post.id]} className="h-8 w-8 object-cover rounded-md" />
                                <span className="text-gray-450 truncate">Foto komentar disematkan</span>
                                <button 
                                  onClick={() => setNewCommentImage(prev => ({ ...prev, [post.id]: '' }))}
                                  className="ml-auto text-rose-500 hover:text-rose-600"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}

                            {/* Quick emojis for post comment */}
                            {activeCommentEmojiBoxId === post.id && (
                              <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50 dark:bg-neutral-950 rounded-xl border border-gray-150 dark:border-neutral-800 animate-slide-in">
                                {['👍', '❤️', '😂', '😮', '😢', '😡', '✨', '🔥'].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => setNewCommentText(prev => ({ ...prev, [post.id]: (prev[post.id] || '') + emoji }))}
                                    className="hover:scale-125 transition-transform text-xs cursor-pointer"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                                <button 
                                  onClick={() => setActiveCommentEmojiBoxId(null)}
                                  className="text-[9px] text-gray-450 dark:text-neutral-550 uppercase font-black ml-auto"
                                >
                                  Tutup
                                </button>
                              </div>
                            )}

                            <div className="flex gap-2 items-center">
                              {/* Attach image trigger */}
                              <label className="p-2 bg-gray-100 hover:bg-gray-155 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-450 rounded-xl cursor-pointer transition-all shrink-0">
                                <ImageIcon className="h-4.5 w-4.5 text-emerald-500" />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      setNewCommentImage(prev => ({ ...prev, [post.id]: url }));
                                    }
                                  }}
                                />
                              </label>

                              {/* Emoji toggle */}
                              <button
                                onClick={() => setActiveCommentEmojiBoxId(activeCommentEmojiBoxId === post.id ? null : post.id)}
                                className="p-2 bg-gray-100 hover:bg-gray-155 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-455 rounded-xl cursor-pointer transition-all shrink-0"
                              >
                                <Smile className="h-4.5 w-4.5 text-amber-500" />
                              </button>

                              <input
                                type="text"
                                placeholder="Tulis opini terbaik Anda..."
                                value={newCommentText[post.id] || ''}
                                onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleCommentPost(post.id);
                                }}
                                className="flex-1 bg-gray-50 dark:bg-slate-900 rounded-xl px-4 py-2 border border-gray-200 dark:border-neutral-750 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-950 dark:text-gray-150 focus:outline-hidden"
                              />
                              <button
                                onClick={() => handleCommentPost(post.id)}
                                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                              >
                                Kirim
                              </button>
                            </div>
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
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                
                {/* Visual Sell Item banner: styled as silver text box and matching the custom colors */}
                <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-3xl border border-slate-705 text-[#cbd5e1] flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-left">
                  <div className="space-y-1">
                    <span className="bg-slate-700 text-[#f1f5f9] font-extrabold text-[9px] px-2.5 py-0.5 rounded-sm uppercase tracking-wider border border-slate-600">
                      PASAR NIAGA REGIONAL INDONESIA
                    </span>
                    <h3 className="text-base font-extrabold text-[#f1f5f9]">
                      Ingin Menjual Barang Milikmu?
                    </h3>
                    <p className="text-xs text-slate-450">
                      Pasang iklan gratis produk lokasimu dengan deskripsi lengkap sekarang di Idebagus.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSellModal(true)}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-650 text-white font-extrabold text-[#cbd5e1] text-xs rounded-xl shadow-xs shrink-0 cursor-pointer transition-colors border border-slate-600"
                  >
                    Mulai Berjualan (Pasang Iklan)
                  </button>
                </div>

                {/* Header title/filters: Silver styled textboxes */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-705 text-left">
                    <h3 className="font-extrabold text-sm text-[#cbd5e1] uppercase tracking-wider">
                      Katalog Barang Terbuka
                    </h3>
                    <p className="text-[10px] text-slate-450">
                      Pajangan iklan terlengkap dari berbagai penjual lokal di seluruh penjuru Indonesia
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowSellModal(true)}
                    className="text-[10.5px] bg-slate-700 hover:bg-slate-650 text-white border border-slate-600 font-extrabold px-3 py-2 rounded-xl shrink-0 cursor-pointer"
                  >
                    + Pasang Iklan Baru
                  </button>
                </div>

                {/* Search box & Category tabs */}
                <div className="space-y-3 text-left">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {['Semua', 'Elektronik', 'Mebel / Furnitur', 'Olahraga', 'Fashion'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveMarketCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                          activeMarketCategory === cat
                            ? 'bg-slate-700 text-[#cbd5e1] font-extrabold border border-indigo-500/10'
                            : 'bg-white dark:bg-neutral-900 text-gray-650 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-150 dark:border-neutral-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products list grid (Dynamic responsive side-by-side columns spanning full grid width) */}
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                  {marketplaceItems
                    .filter(
                      item =>
                        (activeMarketCategory === 'Semua' || item.category.toLowerCase().includes(activeMarketCategory.toLowerCase().split(' ')[0])) &&
                        (!searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setViewListingId(item.id)}
                        className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xs group hover:scale-[1.01] transition-all flex flex-col justify-between cursor-pointer text-left"
                      >
                        <div className="relative h-40 bg-gray-100 shrink-0">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover animate-fade-in" />
                          {item.isSold ? (
                            <span className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center text-xs font-black text-white uppercase tracking-wider">
                               SUDAH HABIS TERJUAL ✔️
                            </span>
                          ) : (
                            <span className="absolute top-2.5 left-2.5 bg-slate-800 border border-slate-700 text-[#cbd5e1] font-extrabold text-[8px] uppercase px-2 py-0.5 rounded-sm">
                              {item.condition}
                            </span>
                          )}
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[8px] font-black text-slate-450 uppercase tracking-widest">{item.category}</span>
                            <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate mt-0.5 group-hover:text-emerald-500 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm font-black text-slate-750 dark:text-[#f1f5f9] mt-1">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                          
                          <div className="pt-2.5 border-t border-gray-100 dark:border-neutral-850/60 flex items-center justify-between text-[9px] text-gray-400">
                            <span className="flex items-center gap-0.5 truncate max-w-[120px]">
                              <MapPin className="h-3 w-3 text-rose-500 shrink-0 inline animate-pulse" />
                              {item.location.split(',')[0]}
                            </span>
                            <span className="font-semibold text-emerald-500 truncate max-w-[90px]">{item.sellerName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {marketplaceItems.length === 0 && (
                  <div className="text-center py-10 text-neutral-405 text-xs">
                    Belum ada barang lokal yang dipajang.
                  </div>
                )}

                {/* Immersion Lightbox Modal detail popup overlay */}
                {viewListingId && (() => {
                  const targetProduct = marketplaceItems.find(i => i.id === viewListingId);
                  return targetProduct ? (
                    <MarketplaceDetail
                      item={targetProduct}
                      onClose={() => setViewListingId(null)}
                      onContactSeller={handleContactSeller}
                    />
                  ) : null;
                })()}

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
                onDeleteMessages={handleDeleteMessages}
              />
            )}

            {/* --- TAB: PROFILE SETTINGS SYNC --- */}
            {activeTab === 'profile' && (
              <ProfileEditTab
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
              />
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

      {/* Lightbox Modal Component */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 z-[9999]"
            onClick={() => setLightboxSrc(null)}
          >
            {/* Top Close bar */}
            <div className="absolute top-4 right-4 flex gap-4 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(lightboxSrc, '_blank');
                }}
                className="p-2.5 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-full border border-neutral-800 backdrop-blur-md cursor-pointer transition-transform"
                title="Buka di tab baru"
              >
                <ArrowRight className="h-4.5 w-4.5 -rotate-45" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxSrc(null);
                }}
                className="p-2.5 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-full border border-neutral-800 backdrop-blur-md cursor-pointer transition-transform font-sans font-bold"
                title="Tutup"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Inner Content image */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative max-w-full max-h-[85vh] flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxSrc}
                alt="Lightbox View"
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-box contain border border-neutral-800 cursor-zoom-out"
                onClick={() => setLightboxSrc(null)}
              />
            </motion.div>

            {/* Bottom info helper */}
            <div className="absolute bottom-4 bg-neutral-900/80 text-neutral-300 px-4 py-1.5 rounded-full text-[10.5px] border border-neutral-800 backdrop-blur-md pointer-events-none select-none">
              Klik di luar gambar atau tekan <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-white font-mono">Esc</kbd> untuk menutup
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
