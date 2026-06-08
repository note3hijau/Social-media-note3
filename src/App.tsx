import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { compressImage } from './utils/imageCompressor';
import { User, Post, Comment, MarketplaceItem, Friend, FriendRequest, AppNotification, Message, EscrowTransaction } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { translate, LANGUAGES } from './utils/translations';
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

// Firebase Integrations
import { 
  handleSubscribeCollection, 
  handleSetDoc, 
  handleUpdateDoc, 
  handleDeleteDoc, 
  auth 
} from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';

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
  ChevronLeft,
  ArrowRight,
  RefreshCw,
  Sliders,
  ClipboardList,
  Trash2,
  Edit2,
  FolderOpen,
  Smile,
  Image as ImageIcon
} from 'lucide-react';

const SUGGESTED_PEOPLE = [
  {
    id: 'user_1',
    displayName: 'Siti Rahma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Pecinta kuliner nusantara & perajin batik Jogja 🌸',
    isOnline: true,
  },
  {
    id: 'user_2',
    displayName: 'Ahmad Fauzi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Produsen kopi lokal & pegiat teknologi digital ☕💻',
    isOnline: true,
  },
  {
    id: 'user_3',
    displayName: 'Dewi Lestari',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    bio: 'Eksportir anyaman rotan & pembimbing UMKM kreatif 🇮🇩✈️',
    isOnline: false,
    lastActive: '2 jam lalu',
  },
  {
    id: 'user_4',
    displayName: 'Rian Hidayat',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Konsultan agribisnis dan peternak kambing modern 🚜',
    isOnline: false,
    lastActive: 'Kemarin',
  }
];

const COMPREHENSIVE_USER_DIRECTORY = [
  ...SUGGESTED_PEOPLE,
  {
    id: 'user_5',
    displayName: 'Budi Santoso',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Pemberdaya UMKM tempe & keripik singkong renyah Tasikmalaya 🍟💡',
    isOnline: true,
  },
  {
    id: 'user_6',
    displayName: 'Linda Wijaya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Desainer fashion tenun ikat Kupang & aksesoris nusantara modern 🧥👗',
    isOnline: false,
    lastActive: '3 jam lalu',
  },
  {
    id: 'user_7',
    displayName: 'Hendra Wijaya',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Distributor herbal alami pasak bumi Kalbar & minyak kelapa murni 🥥🌿',
    isOnline: true,
  },
  {
    id: 'user_8',
    displayName: 'Dian Pratama',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Petani organik hidroponik sayur mayur Bandung Barat 🥦🥬',
    isOnline: false,
    lastActive: '5 jam lalu',
  },
  {
    id: 'user_9',
    displayName: 'Maria Ulfa',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=80',
    bio: 'Produsen kosmetik organik ramah lingkungan lokal Jogja 💄🌱',
    isOnline: true,
  },
  {
    id: 'user_10',
    displayName: 'Yusuf Mansur',
    avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80',
    bio: 'Perajin kulit asli lipat Garut, sepatu & ikat pinggang garutan premium 👞💼',
    isOnline: true,
  }
];

const INDONESIA_REGIONS = [
  {
    provinsi: 'DKI Jakarta',
    kabupatens: ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara', 'Kepulauan Seribu']
  },
  {
    provinsi: 'Jawa Barat',
    kabupatens: ['Bandung', 'Bekasi', 'Depok', 'Bogor', 'Tasikmalaya', 'Cirebon', 'Cimahi', 'Sukabumi', 'Garut', 'Karawang', 'Subang', 'Sumedang']
  },
  {
    provinsi: 'Jawa Tengah & DIY',
    kabupatens: [
      'Temanggung', 'Semarang', 'Surakarta (Solo)', 'Yogyakarta', 'Sleman', 'Bantul', 'Magelang', 
      'Pekalongan', 'Salatiga', 'Tegal', 'Cilacap', 'Banyumas', 'Kudus', 'Kendal', 'Demak', 
      'Grobogan', 'Blora', 'Rembang', 'Pati', 'Jepara', 'Karanganyar', 'Sragen', 'Boyolali', 
      'Sukoharjo', 'Klaten', 'Wonogiri', 'Wonosobo', 'Purworejo', 'Kebumen', 'Banjarnegara', 
      'Purbalingga', 'Brebes', 'Pemalang', 'Batang', 'Gunungkidul', 'Kulon Progo'
    ]
  },
  {
    provinsi: 'Jawa Timur',
    kabupatens: ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Madiun', 'Kediri', 'Pasuruan', 'Probolinggo', 'Batu', 'Jember', 'Banyuwangi', 'Mojokerto']
  },
  {
    provinsi: 'Banten',
    kabupatens: ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon', 'Lebak', 'Pandeglang']
  },
  {
    provinsi: 'Sumatera Utara',
    kabupatens: ['Medan', 'Binjai', 'Tebing Tinggi', 'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Deli Serdang', 'Karo', 'Simalungun']
  },
  {
    provinsi: 'Sumatera Barat',
    kabupatens: ['Padang', 'Bukittinggi', 'Payakumbuh', 'Solok', 'Pariaman', 'Padang Panjang', 'Agam', 'Tanah Datar']
  },
  {
    provinsi: 'Sumatera Selatan',
    kabupatens: ['Palembang', 'Prabumulih', 'Lubuklinggau', 'Pagar Alam', 'Ogan Komering Ilir', 'Banyuasin', 'Muara Enim']
  },
  {
    provinsi: 'Riau & Kepri',
    kabupatens: ['Pekanbaru', 'Batam', 'Tanjungpinang', 'Dumai', 'Bengkalis', 'Kampar', 'Karimun', 'Bintan']
  },
  {
    provinsi: 'Bali',
    kabupatens: ['Denpasar', 'Badung', 'Gianyar', 'Buleleng', 'Tabanan', 'Klungkung', 'Karangasem', 'Jembrana', 'Bangli']
  },
  {
    provinsi: 'Nusa Tenggara',
    kabupatens: ['Mataram', 'Kupang', 'Lombok Barat', 'Lombok Timur', 'Sumbawa', 'Manggarai', 'Sikka', 'Ende']
  },
  {
    provinsi: 'Kalimantan',
    kabupatens: ['Pontianak', 'Banjarmasin', 'Balikpapan', 'Samarinda', 'Tarakan', 'Palangkaraya', 'Kutai Kartanegara', 'Banjar']
  },
  {
    provinsi: 'Sulawesi',
    kabupatens: ['Makassar', 'Manado', 'Palu', 'Kendari', 'Gorontalo', 'Bitung', 'Minahasa', 'Gowa', 'Maros']
  },
  {
    provinsi: 'Maluku & Papua',
    kabupatens: ['Ambon', 'Jayapura', 'Sorong', 'Ternate', 'Merauke', 'Manokwari', 'Mimika', 'Biak Numfor']
  }
];

const ENRICHED_CATEGORIES = [
  "Elektronik & Gadget (HP, Laptop, Kamera dll)",
  "Fashion & Aksesoris (Pakaian, Sepatu dll)",
  "Kendaraan Bermotor (Mobil, Motor dll)",
  "Perlengkapan Rumah & Mebel / Furnitur",
  "Olahraga, Kebugaran & Aktivitas Outdoor",
  "Buku, Alat Tulis & Pendidikan",
  "Hobi, Koleksi, Games & Mainan Anak",
  "Makanan, Minuman & Kuliner Nusantara",
  "Kerajinan Tangan & Produk Kreatif Daerah",
  "Kecantikan, Kesehatan & Herbal Organik",
  "Seni, Alat Musik & Barang Antik",
  "Ibu, Bayi, Perlengkapan Anak dan Mainan",
  "Properti (Rumah, Kontrakan, Ruko & Tanah)",
  "Jasa Profesional, Lowongan & Kemitraan"
];

export default function App() {
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e: any) {
      console.warn(`[LocalStorage Error] Gagal menyimpan key "${key}":`, e);
      
      // Auto-remedy QuotaExceededError by pruning large Base64 images and old entries
      if (e.name === 'QuotaExceededError' || e.code === 22 || e.number === 0x8007000E) {
        try {
          // 1. Aggressively strip images on older posts: keep only the 2 latest intact
          const postsRaw = localStorage.getItem('idkanca_posts');
          if (postsRaw) {
            const parsed = JSON.parse(postsRaw);
            if (Array.isArray(parsed)) {
              const pruned = parsed.map((item, idx) => {
                if (idx > 1) {
                  return { ...item, image: undefined, images: [] };
                }
                return item;
              });
              localStorage.setItem('idkanca_posts', JSON.stringify(pruned));
            }
          }

          // 2. Aggressively strip images on older marketplace items: keep only the 2 latest intact
          const marketRaw = localStorage.getItem('idkanca_marketplace');
          if (marketRaw) {
            const parsed = JSON.parse(marketRaw);
            if (Array.isArray(parsed)) {
              const pruned = parsed.map((item, idx) => {
                if (idx > 1) {
                  return { ...item, image: undefined, images: [] };
                }
                return item;
              });
              localStorage.setItem('idkanca_marketplace', JSON.stringify(pruned));
            }
          }

          // 3. Clear non-essential large items
          localStorage.removeItem('idkanca_notifications');
          localStorage.removeItem('idkanca_transactions');

          // Retry the original safe writing task
          localStorage.setItem(key, value);
        } catch (innerError) {
          console.error("Deep cache cleanup retry failed:", innerError);
          // Drop non-essential long chat histories except the 15 latest entries
          try {
            const msgRaw = localStorage.getItem('idkanca_messages');
            if (msgRaw) {
              const parsed = JSON.parse(msgRaw);
              if (Array.isArray(parsed) && parsed.length > 15) {
                localStorage.setItem('idkanca_messages', JSON.stringify(parsed.slice(-15)));
              }
            }
            localStorage.setItem(key, value);
          } catch (_) {
            console.warn("Unable to clear enough storage space.");
          }
        }
      }
    }
  };

  const safeJsonParse = (key: string, fallback: any) => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : fallback;
    } catch (e) {
      console.error(`Invalid recovery cache for key ${key}:`, e);
      return fallback;
    }
  };

  // --- Persistent Local States ---
  const [currentUser, setCurrentUser] = useState<User>(() => safeJsonParse('idkanca_user', INITIAL_CURRENT_USER));
  const [posts, setPosts] = useState<Post[]>(() => safeJsonParse('idkanca_posts', INITIAL_POSTS));
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => safeJsonParse('idkanca_marketplace', INITIAL_MARKETPLACE));
  const [friends, setFriends] = useState<Friend[]>(() => safeJsonParse('idkanca_friends', INITIAL_FRIENDS));
  const [messages, setMessages] = useState<Message[]>(() => safeJsonParse('idkanca_messages', INITIAL_MESSAGES));
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => safeJsonParse('idkanca_requests', INITIAL_FRIEND_REQUESTS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => safeJsonParse('idkanca_notifications', INITIAL_NOTIFICATIONS));
  const [isFirebaseAuthed, setIsFirebaseAuthed] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [isWipingDatabase, setIsWipingDatabase] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('idkanca_language') || 'id');

  // --- Layout States ---
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [marketSubTab, setMarketSubTab] = useState<'browse' | 'orders' | 'admin'>('browse');
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(() => {
    const cached = localStorage.getItem('idkanca_transactions');
    try {
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [viewListingId, setViewListingId] = useState<string | null>(null);
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string | null>(null);
  const [postCommentsLimit, setPostCommentsLimit] = useState<Record<string, number>>({});
  
  // Nested comments replies & tagging states
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyImage, setReplyImage] = useState<Record<string, string>>({});
  const [showCommentTagBoxForPost, setShowCommentTagBoxForPost] = useState<string | null>(null);

  // Ref container for device push notifications de-duplication
  const lastProcessedNotificationIdRef = useRef<string | null>(null);

  // Suggested partners search click outside ref and effect
  const suggestedSearchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestedSearchRef.current && !suggestedSearchRef.current.contains(e.target as Node)) {
        setShowFriendSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const addToFriendHistory = (query: string) => {
    if (!query.trim()) return;
    setFriendSearchHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== query.trim().toLowerCase());
      const updated = [query.trim(), ...filtered.slice(0, 4)];
      localStorage.setItem('idkanca_friend_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const [bannedWords, setBannedWords] = useState<string>(() => localStorage.getItem('idkanca_banned_words') || 'anjing, babi, bangsat, biadab, kunyuk, keparat');

  useEffect(() => {
    localStorage.setItem('idkanca_banned_words', bannedWords);
  }, [bannedWords]);

  const censorContent = (text: string): string => {
    if (!text) return '';
    let censored = text;
    const words = bannedWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
    words.forEach(word => {
      try {
        // Simple word boundary censor or direct substring sensor
        const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedWord, 'gi');
        censored = censored.replace(regex, '*'.repeat(word.length));
      } catch (e) {
        let index = censored.toLowerCase().indexOf(word.toLowerCase());
        while (index !== -1) {
          censored = censored.substring(0, index) + '*'.repeat(word.length) + censored.substring(index + word.length);
          index = censored.toLowerCase().indexOf(word.toLowerCase());
        }
      }
    });
    return censored;
  };

  const renderFormattedContent = (text: string) => {
    if (!text) return '';
    const censoredText = censorContent(text);
    const parts = censoredText.split(/(@[a-zA-Z0-9_.-]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="inline-block bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-md text-[10px] border border-emerald-500/20 shadow-xs mx-0.5 select-all">
            {part}
          </span>
        );
      }
      return part;
    });
  };
  
  // Custom states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Friend search states (YouTube search style)
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [showFriendSuggestions, setShowFriendSuggestions] = useState(false);
  const [friendSearchHistory, setFriendSearchHistory] = useState<string[]>(() => 
    safeJsonParse('idkanca_friend_search_history', ['Dewi', 'Batik', 'Siti', 'Kopi', 'Bandung'])
  );

  const [activeMarketCategory, setActiveMarketCategory] = useState<string>('Semua');
  
  // Advanced Marketplace filtering states
  const [marketFilterCity, setMarketFilterCity] = useState('');
  const [marketFilterMinPrice, setMarketFilterMinPrice] = useState('');
  const [marketFilterMaxPrice, setMarketFilterMaxPrice] = useState('');

  // Customizable Home Banner, Maintenance toggle, Total users tracker, and marquee text states
  const [homepageBannerUrl, setHomepageBannerUrl] = useState(() => localStorage.getItem('idkanca_home_banner') || 'https://images.unsplash.com/photo-1542744094-2ab25be78b90?w=1000&auto=format&fit=crop&q=80');
  const [adminTotalUsers, setAdminTotalUsers] = useState(() => parseInt(localStorage.getItem('idkanca_total_users') || '1482'));
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(() => localStorage.getItem('idkanca_under_maintenance') === 'true');
  const [adminMarqueeText, setAdminMarqueeText] = useState(() => localStorage.getItem('idkanca_marquee_text') || '📢 Selamat datang di idkanca: idkanca.com sosial media & Pasar Niaga UMKM Lokal Indonesia. Belanja aman dengan sistem Rekber Terpercaya kami.');

  // Custom visual branding and splash customization states
  const [customLogoUrl, setCustomLogoUrl] = useState(() => localStorage.getItem('idkanca_custom_logo') || '');
  const [loginTitle, setLoginTitle] = useState(() => localStorage.getItem('idkanca_login_title') || 'IdKanca Digital');
  const [loginSubtitle, setLoginSubtitle] = useState(() => localStorage.getItem('idkanca_login_subtitle') || 'idkanca.com sosial media & Pasar Niaga UMKM Lokal Indonesia');
  const [loginOneTapTitle, setLoginOneTapTitle] = useState(() => localStorage.getItem('idkanca_login_onetap_title') || 'SINKRONISASI KEAMANAN');
  const [loginOneTapDesc, setLoginOneTapDesc] = useState(() => localStorage.getItem('idkanca_login_onetap_desc') || 'Untuk mendaftar & beriklan di IdKanca, silakan hubungkan akun Gmail Anda dengan 1-klik aman.');
  const [loginPageBg, setLoginPageBg] = useState(() => localStorage.getItem('idkanca_login_bg') || '#0b0f19');

  // One-click authentication with Google & mandatory email verification states
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('idkanca_logged_in') === 'true');
  const [isEmailVerified, setIsEmailVerified] = useState(() => localStorage.getItem('idkanca_email_verified') === 'true');
  const [tempGmailEmail, setTempGmailEmail] = useState('');
  const [setupDisplayName, setSetupDisplayName] = useState('');
  const [setupAvatar, setSetupAvatar] = useState('');
  const [setupLocation, setSetupLocation] = useState('DI Yogyakarta');
  const [setupBio, setSetupBio] = useState('');
  const [setupBanner, setSetupBanner] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80');
  const [tempOtpCode, setTempOtpCode] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [isNewUser, setIsNewUser] = useState(() => localStorage.getItem('idkanca_is_new_user') === 'true');
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('password');
  const [passwordError, setPasswordError] = useState('');
  const [authStage, setAuthStage] = useState<'gmail_one_tap' | 'email_confirmation'>('gmail_one_tap');
  const [authIsLoading, setAuthIsLoading] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');

  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [newCommentImage, setNewCommentImage] = useState<{ [postId: string]: string }>({});
  const [activeCommentEmojiBoxId, setActiveCommentEmojiBoxId] = useState<string | null>(null);
  const [showNotificationBadgeSplash, setShowNotificationBadgeSplash] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  const [newlyAddedCommentId, setNewlyAddedCommentId] = useState<string | null>(null);
  const [newlyAddedPostId, setNewlyAddedPostId] = useState<string | null>(null);
  
  // Marketplace item creation values
  const [newMarketTitle, setNewMarketTitle] = useState('');
  const [newMarketPrice, setNewMarketPrice] = useState('');
  const [newMarketDesc, setNewMarketDesc] = useState('');
  const [newMarketCategory, setNewMarketCategory] = useState('Elektronik & Gadget (HP, Laptop, Kamera dll)');
  const [newMarketCondition, setNewMarketCondition] = useState<'Baru' | 'Bekas'>('Baru');
  const [newMarketImage, setNewMarketImage] = useState('https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80');
  const [showSellModal, setShowSellModal] = useState(false);
  const [newMarketUploadedImages, setNewMarketUploadedImages] = useState<string[]>([]);
  const [marketUploadProgress, setMarketUploadProgress] = useState<number | null>(null);
  const [marketIsUploading, setMarketIsUploading] = useState(false);
  const [marketProvinsi, setMarketProvinsi] = useState('DKI Jakarta');
  const [marketKabupaten, setMarketKabupaten] = useState('Jakarta Selatan');

  // Personal listings batch management states
  const [marketViewMode, setMarketViewMode] = useState<'all' | 'my'>('all');
  const [selectedMyAds, setSelectedMyAds] = useState<string[]>([]);

  // Chat tracking states
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | null>(null);

  // Lightbox view state for all images
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const handlePrevLightbox = () => {
    if (lightboxImages.length <= 1) return;
    const nextIdx = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    setLightboxIndex(nextIdx);
    setLightboxSrc(lightboxImages[nextIdx]);
  };

  const handleNextLightbox = () => {
    if (lightboxImages.length <= 1) return;
    const nextIdx = (lightboxIndex + 1) % lightboxImages.length;
    setLightboxIndex(nextIdx);
    setLightboxSrc(lightboxImages[nextIdx]);
  };

  // --- REAL-TIME FIREBASE SYNCHRONISATION ---
  useEffect(() => {
    // Check or establish anonymous Auth Session so rules can evaluate successfully
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsFirebaseAuthed(false);
        signInAnonymously(auth).catch((err) => {
          console.warn("Firebase anonymous authentication failed:", err);
        });
      } else {
        console.log("Firebase Auth established with UID:", user.uid);
        setIsFirebaseAuthed(true);
      }
    });

    return () => {
      unsubAuth();
    };
  }, []);

  // Subscribe to real-time collections only after successful Firebase Authentication
  useEffect(() => {
    if (!isFirebaseAuthed) return;

    // 2. Real-time Subscription to Posts
    const unsubPosts = handleSubscribeCollection<Post>('posts', (remotePosts) => {
      if (remotePosts.length > 0) {
        setPosts(remotePosts);
      } else {
        // Bootstrap Firestore with local initial posts if remote is empty
        INITIAL_POSTS.forEach((p) => {
          handleSetDoc('posts', p.id, p);
        });
      }
    }, 'createdAt', 'desc');

    // 3. Real-time Subscription to Marketplace
    const unsubMarket = handleSubscribeCollection<MarketplaceItem>('marketplace_items', (remoteItems) => {
      if (remoteItems.length > 0) {
        setMarketplaceItems(remoteItems);
      } else {
        // Bootstrap Firestore with initial marketplace items
        INITIAL_MARKETPLACE.forEach((item) => {
          handleSetDoc('marketplace_items', item.id, item);
        });
      }
    });

    // 4. Real-time Subscription to Inbox Messages
    const unsubMessages = handleSubscribeCollection<Message>('messages', (remoteMsg) => {
      if (remoteMsg.length > 0) {
        setMessages(remoteMsg);
      } else {
        // Bootstrap initial messages
        INITIAL_MESSAGES.forEach((msg) => {
          handleSetDoc('messages', msg.id, msg);
        });
      }
    }, 'createdAt', 'asc');

    // 5. Real-time Subscription to Friend Requests
    const unsubRequests = handleSubscribeCollection<FriendRequest>('friend_requests', (remoteReq) => {
      if (remoteReq.length > 0) {
        setFriendRequests(remoteReq);
      } else {
        INITIAL_FRIEND_REQUESTS.forEach((req) => {
          handleSetDoc('friend_requests', req.id, req);
        });
      }
    });

    // 6. Real-time Subscription to Notifications
    const unsubNotifs = handleSubscribeCollection<AppNotification>('notifications', (remoteNotif) => {
      if (remoteNotif.length > 0) {
        setNotifications(remoteNotif);
      } else {
        INITIAL_NOTIFICATIONS.forEach((n) => {
          handleSetDoc('notifications', n.id, n);
        });
      }
    });

    // 7. Real-time Subscription to Escrow Transactions
    const unsubEscrow = handleSubscribeCollection<EscrowTransaction>('escrow_transactions', (remoteTrans) => {
      setTransactions(remoteTrans);
    }, 'createdAt', 'desc');

    // 8. Real-time Subscription to Registered Users Profile Synchronisation
    const unsubUsers = handleSubscribeCollection<User>('users', (remoteUsers) => {
      setRegisteredUsers(remoteUsers);
    });

    return () => {
      unsubPosts();
      unsubMarket();
      unsubMessages();
      unsubRequests();
      unsubNotifs();
      unsubEscrow();
      unsubUsers();
    };
  }, [isFirebaseAuthed]);

  // Listen to the active user's friends subcollection
  useEffect(() => {
    if (!isFirebaseAuthed || !currentUser || !currentUser.id) return;
    const unsubFriends = handleSubscribeCollection<Friend>(`users/${currentUser.id}/friends`, (remoteFriends) => {
      setFriends(remoteFriends || []);
    });

    return () => {
      unsubFriends();
    };
  }, [isFirebaseAuthed, currentUser?.id]);

  // Synchronise active user profile settings into top-level Firestore '/users' collection
  useEffect(() => {
    if (!isFirebaseAuthed || !currentUser || !currentUser.id) return;
    // Do not sync the offline dummy demo profile before any real email onboarding
    if (currentUser.id === 'user_me' && currentUser.displayName === 'Bagus Susanto') return;

    handleSetDoc('users', currentUser.id, currentUser).catch((err) => {
      console.warn("Could not synchronize user profile to top-level collection:", err);
    });
  }, [currentUser, isFirebaseAuthed]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        
        // Exclude navbar/profile images, headers, buttons, and marketplace listings
        if (
          img.closest('header') || 
          img.closest('nav') ||
          img.closest('button') ||
          img.closest('.glass-aqua-card') ||
          img.classList.contains('no-lightbox') ||
          img.closest('.no-lightbox')
        ) {
          return;
        }

        setLightboxSrc(img.src);
        setLightboxImages([img.src]);
        setLightboxIndex(0);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxSrc(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextLightbox();
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImages, lightboxIndex]);

  // Filter real-time registered users from Firestore excluding the current user themselves
  const combinedUserDirectory = React.useMemo(() => {
    return registeredUsers.filter((u) => u.id !== currentUser.id);
  }, [registeredUsers, currentUser.id]);

  // Sync to localStorage
  useEffect(() => {
    safeSetItem('idkanca_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    safeSetItem('idkanca_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    safeSetItem('idkanca_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    safeSetItem('idkanca_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    safeSetItem('idkanca_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    safeSetItem('idkanca_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    safeSetItem('idkanca_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeSetItem('idkanca_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    safeSetItem('idkanca_theme', 'dark');
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, [theme]);

  useEffect(() => {
    safeSetItem('idkanca_language', language);
  }, [language]);

  useEffect(() => {
    safeSetItem('idkanca_home_banner', homepageBannerUrl);
  }, [homepageBannerUrl]);

  useEffect(() => {
    safeSetItem('idkanca_total_users', adminTotalUsers.toString());
  }, [adminTotalUsers]);

  useEffect(() => {
    safeSetItem('idkanca_under_maintenance', isUnderMaintenance ? 'true' : 'false');
  }, [isUnderMaintenance]);

  useEffect(() => {
    safeSetItem('idkanca_marquee_text', adminMarqueeText);
  }, [adminMarqueeText]);

  useEffect(() => {
    safeSetItem('idkanca_custom_logo', customLogoUrl);
  }, [customLogoUrl]);

  useEffect(() => {
    safeSetItem('idkanca_login_title', loginTitle);
  }, [loginTitle]);

  useEffect(() => {
    safeSetItem('idkanca_login_subtitle', loginSubtitle);
  }, [loginSubtitle]);

  useEffect(() => {
    safeSetItem('idkanca_login_onetap_title', loginOneTapTitle);
  }, [loginOneTapTitle]);

  useEffect(() => {
    safeSetItem('idkanca_login_onetap_desc', loginOneTapDesc);
  }, [loginOneTapDesc]);

  useEffect(() => {
    safeSetItem('idkanca_login_bg', loginPageBg);
  }, [loginPageBg]);

  useEffect(() => {
    safeSetItem('idkanca_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    safeSetItem('idkanca_email_verified', isEmailVerified ? 'true' : 'false');
  }, [isEmailVerified]);

  // Real-time device/browser push notifications trigger & haptic vibration
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotif = notifications[0];
      if (!latestNotif.isRead && latestNotif.id !== lastProcessedNotificationIdRef.current) {
        lastProcessedNotificationIdRef.current = latestNotif.id;
        
        // Trigger standard browser Notification if permission is granted
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            const systemNotif = new Notification(latestNotif.title, {
              body: latestNotif.content,
              icon: latestNotif.senderAvatar || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=80&auto=format&fit=crop&q=60'
            });
            // Try to vibrate if on mobile device
            if ('vibrate' in navigator) {
              navigator.vibrate([250, 100, 250]);
            }
          } catch (e) {
            console.warn('Silent device notification dispatch fallback:', e);
          }
        }
      }
    }
  }, [notifications]);

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
    if (tab === 'chat') {
      setActiveChatFriendId(null); // Reset active chat friend so it shows all obrolan threads by default
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
        content: `Lina Rosalina mengajak Anda berteman di idkanca.com!`,
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
  const handleCreatePost = (content: string, images?: string | string[], location?: string) => {
    const imagesArray = Array.isArray(images)
      ? images
      : (images ? [images] : []);

    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatar,
      content,
      image: imagesArray[0] || undefined,
      images: imagesArray,
      location: location || '',
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    handleSetDoc('posts', newPost.id, newPost);
    setNewlyAddedPostId(newPost.id);
    setTimeout(() => {
      setNewlyAddedPostId(curr => curr === newPost.id ? null : curr);
    }, 4500);
  };

  const handleLikePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const likes = post.likes || [];
    const isLiked = likes.includes(currentUser.id);
    const updatedLikes = isLiked
      ? likes.filter(id => id !== currentUser.id)
      : [...likes, currentUser.id];
    
    handleUpdateDoc('posts', postId, { likes: updatedLikes });
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm(translate('deletePostConfirm', language))) {
      handleDeleteDoc('posts', postId);
    }
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
      createdAt: new Date().toISOString()
    };

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comments = post.comments || [];
    handleUpdateDoc('posts', postId, { comments: [...comments, newComment] });

    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
    setNewCommentImage(prev => ({ ...prev, [postId]: '' }));

    // Set new comment blink state & scroll to it smoothly
    setNewlyAddedCommentId(newComment.id);
    setTimeout(() => {
      setNewlyAddedCommentId(null);
    }, 5000);

    setTimeout(() => {
      const el = document.getElementById(`comment-${newComment.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  };

  const handleCommentReply = (postId: string, commentId: string) => {
    const text = replyText[commentId]?.trim();
    const image = replyImage[commentId];
    if (!text && !image) return;

    const newReply: Comment = {
      id: 'comm_reply_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatar,
      content: text || 'Mengirim foto 📸',
      image: image || undefined,
      createdAt: new Date().toISOString(),
      replies: []
    };

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comments = post.comments || [];
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    });

    handleUpdateDoc('posts', postId, { comments: updatedComments });

    setReplyText(prev => ({ ...prev, [commentId]: '' }));
    setReplyImage(prev => ({ ...prev, [commentId]: '' }));
    setReplyingToCommentId(null);

    // Set new reply blink state & scroll to it smoothly
    setNewlyAddedCommentId(newReply.id);
    setTimeout(() => {
      setNewlyAddedCommentId(null);
    }, 5000);

    setTimeout(() => {
      const el = document.getElementById(`reply-${newReply.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  };

  // --- Business logic: Friend Request responses ---
  const handleAcceptFriendRequest = (requestId: string, senderName: string) => {
    const requestItem = friendRequests.find(r => r.id === requestId);
    if (!requestItem) return;

    handleUpdateDoc('friend_requests', requestId, { status: 'accepted' });

    // Save friend under user's friends subcollection
    const newFriend: Friend = {
      id: requestItem.senderId,
      displayName: requestItem.senderName,
      avatar: requestItem.senderAvatar,
      isOnline: true
    };
    handleSetDoc(`users/${currentUser.id}/friends`, newFriend.id, newFriend);

    // Push notification
    const successNotif: AppNotification = {
      id: 'notif_acc_' + Date.now(),
      type: 'friend_request',
      title: 'Pertemanan Diterima',
      content: `Anda sekarang berteman dengan ${senderName} di idkanca.com. Klik untuk lihat profilnya!`,
      senderId: requestItem.senderId,
      targetId: requestItem.senderId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    handleSetDoc('notifications', successNotif.id, successNotif);
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    handleUpdateDoc('friend_requests', requestId, { status: 'declined' });
  };

  // --- Business logic: Chat Messaging replies ---
  const handleSendMessage = (senderId: string, receiverId: string, content: string, image?: string, marketplaceContext?: any, replyTo?: any) => {
    const newMsg: Message = {
      id: 'm_' + Date.now(),
      senderId,
      receiverId,
      content,
      image: image || '',
      marketplaceContext: marketplaceContext || null,
      replyTo: replyTo || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    handleSetDoc('messages', newMsg.id, newMsg);
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
        createdAt: new Date().toISOString()
      };
      handleSetDoc('messages', newMsg.id, newMsg);
    }

    // Direct redirection to Inbox
    setActiveChatFriendId(item.sellerId);
    setActiveTab('chat');
    setViewListingId(null);
  };

  const handleDeleteListing = (itemId: string) => {
    handleDeleteDoc('marketplace_items', itemId);
    setViewListingId(null);
    setSelectedMyAds(prev => prev.filter(id => id !== itemId));

    // Also send a nice real-time Toast confirmation representation
    setShowNotificationBadgeSplash(true);
    setTimeout(() => {
      setShowNotificationBadgeSplash(false);
    }, 3000);
  };

  const handleDeleteMultipleListings = (itemIds: string[]) => {
    itemIds.forEach((id) => {
      handleDeleteDoc('marketplace_items', id);
    });
    setSelectedMyAds([]);
    setViewListingId(null);

    setShowNotificationBadgeSplash(true);
    setTimeout(() => {
      setShowNotificationBadgeSplash(false);
    }, 3000);
  };

  const handleEditListing = (updatedResult: MarketplaceItem) => {
    handleSetDoc('marketplace_items', updatedResult.id, updatedResult);
    
    // Also show a brief confirmation response
    setShowNotificationBadgeSplash(true);
    setTimeout(() => {
      setShowNotificationBadgeSplash(false);
    }, 3000);
  };

  const handleSimulateReply = (senderId: string, text: string, image?: string) => {
    const sender = friends.find(f => f.id === senderId);
    const newMsg: Message = {
      id: 'm_reply_' + Date.now(),
      senderId,
      receiverId: currentUser.id,
      content: text,
      image: image || '',
      isRead: activeTab === 'chat' && activeChatFriendId === senderId, // Is read if user is active in chat tab with this friend
      createdAt: new Date().toISOString()
    };

    handleSetDoc('messages', newMsg.id, newMsg);

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
        createdAt: new Date().toISOString()
      };
      handleSetDoc('notifications', msgNotif.id, msgNotif);
    }
  };

  const handleDeleteMessages = (messageIds: string[]) => {
    messageIds.forEach((id) => {
      handleDeleteDoc('messages', id);
    });
  };

  const handleDeleteFriend = (friendId: string) => {
    // 1. Remove contact/friend
    handleDeleteDoc(`users/${currentUser.id}/friends`, friendId);
    
    // 2. Clear all messages with this contact completely
    messages.forEach((m) => {
      if (m.senderId === friendId || m.receiverId === friendId) {
        handleDeleteDoc('messages', m.id);
      }
    });
    
    // 3. Reset active chat if active
    setActiveChatFriendId(prev => prev === friendId ? null : prev);

    // Toast feedback
    setShowNotificationBadgeSplash(true);
    setTimeout(() => {
      setShowNotificationBadgeSplash(false);
    }, 3000);
  };

  const handleRenameFriend = (friendId: string, newNickname: string) => {
    handleUpdateDoc(`users/${currentUser.id}/friends`, friendId, { displayName: newNickname });
  };

  const handleWipeAllSimulationData = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua riwayat simulasi di database Firestore (seperti semua user terdaftar, semua postingan feed, barang jualan pasar, pesan, pertemanan, dll) dan mengembalikan website ke kondisi default baru? Sesi login Anda juga akan dibersihkan agar dapat mendaftar sebagai user baru bersih. Tindakan ini tidak dapat dibatalkan!")) {
      return;
    }
    
    setIsWipingDatabase(true);
    try {
      // 1. Delete all posts in database
      for (const p of posts) {
        await handleDeleteDoc('posts', p.id);
      }
      // 2. Delete all marketplace items in database
      for (const item of marketplaceItems) {
        await handleDeleteDoc('marketplace_items', item.id);
      }
      // 3. Delete all messages
      for (const msg of messages) {
        await handleDeleteDoc('messages', msg.id);
      }
      // 4. Delete all friend requests
      for (const req of friendRequests) {
        await handleDeleteDoc('friend_requests', req.id);
      }
      // 5. Delete all notifications
      for (const n of notifications) {
        await handleDeleteDoc('notifications', n.id);
      }
      // 6. Delete all registered users in database except our current logged-in admin user
      for (const u of registeredUsers) {
        if (u.id !== currentUser.id) {
          await handleDeleteDoc('users', u.id);
        }
      }
      // 7. Delete all friends of current user
      for (const f of friends) {
        await handleDeleteDoc(`users/${currentUser.id}/friends`, f.id);
      }
      
      // 8. Wipe browser storage keys
      localStorage.removeItem('idkanca_logged_in');
      localStorage.removeItem('idkanca_email_verified');
      localStorage.removeItem('idkanca_is_new_user');
      localStorage.removeItem('idkanca_user');
      localStorage.removeItem('idkanca_posts');
      localStorage.removeItem('idkanca_marketplace');
      localStorage.removeItem('idkanca_friends');
      localStorage.removeItem('idkanca_messages');
      localStorage.removeItem('idkanca_requests');
      localStorage.removeItem('idkanca_notifications');
      localStorage.removeItem('idkanca_custom_logo');
      localStorage.removeItem('idkanca_banned_words');
      
      alert("database Firestore & Sesi Lokal berhasil dibersihkan! Website akan dimuat ulang untuk mengembalikan default user baru.");
      window.location.reload();
    } catch (err: any) {
      console.error("Wiping error:", err);
      alert("Beberapa data berhasil dihapus. Gagal menghapus beberapa data lainnya akibat batas otorisasi. Halaman akan dimuat ulang.");
      window.location.reload();
    } finally {
      setIsWipingDatabase(false);
    }
  };

  // --- Business logic: Marketplace checkout and selling ---
  const handleCreateMarketItem = () => {
    if (!newMarketTitle.trim() || !newMarketPrice.trim()) return;

    const mainImage = newMarketUploadedImages.length > 0
      ? newMarketUploadedImages[0]
      : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80';

    const newItem: MarketplaceItem = {
      id: 'item_' + Date.now(),
      sellerId: currentUser.id,
      sellerName: currentUser.displayName,
      sellerAvatar: currentUser.avatar,
      title: newMarketTitle,
      description: newMarketDesc,
      price: parseInt(newMarketPrice) || 0,
      image: mainImage,
      images: newMarketUploadedImages,
      category: newMarketCategory,
      location: `${marketKabupaten}, ${marketProvinsi}`,
      condition: newMarketCondition,
      isSold: false
    };

    handleSetDoc('marketplace_items', newItem.id, newItem);
    setShowSellModal(false);
    
    // Clear values
    setNewMarketTitle('');
    setNewMarketPrice('');
    setNewMarketDesc('');
    setNewMarketUploadedImages([]);
    setMarketProvinsi('DKI Jakarta');
    setMarketKabupaten('Jakarta Selatan');

    // Push System confirmation
    const sellNotif: AppNotification = {
      id: 'n_mkt_sell_' + Date.now(),
      type: 'marketplace',
      title: 'Barang Berhasil Diiklankan',
      content: `Produk "${newItem.title}" Anda berhasil ditayangkan di region ${(newItem.location || '').split(',')[0]}!`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    handleSetDoc('notifications', sellNotif.id, sellNotif);
  };

  const handleMarketPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Check total limit
    const totalCurrent = newMarketUploadedImages.length;
    if (totalCurrent >= 15) {
      alert('Batas maksimal adalah 15 foto!');
      return;
    }
    
    const countToLoad = Math.min(files.length, 15 - totalCurrent);
    if (countToLoad <= 0) return;

    setMarketIsUploading(true);
    setMarketUploadProgress(10);

    // Simulate upload progress
    let progress = 10;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        setMarketUploadProgress(100);

        // Load files as base64 DataURLs with lightweight canvas compression
        const loadedUrls: string[] = [];
        let processedCount = 0;

        for (let i = 0; i < countToLoad; i++) {
          compressImage(files[i])
            .then((compressedUrl) => {
              if (compressedUrl) {
                loadedUrls.push(compressedUrl);
              }
              processedCount++;
              if (processedCount === countToLoad) {
                setNewMarketUploadedImages(prev => [...prev, ...loadedUrls].slice(0, 15));
                setMarketIsUploading(false);
                setMarketUploadProgress(null);
              }
            })
            .catch((err) => {
              console.error("Compression failed:", err);
              processedCount++;
              if (processedCount === countToLoad) {
                setNewMarketUploadedImages(prev => [...prev, ...loadedUrls].slice(0, 15));
                setMarketIsUploading(false);
                setMarketUploadProgress(null);
              }
            });
        }
      } else {
        setMarketUploadProgress(progress);
      }
    }, 200);
  };

  const handleCompletePaymentTransactionByBuyer = (
    itemId: string, 
    method: 'qris' | 'gopay' | 'ovo' | 'va_bca',
    selectedExpedition?: 'JNE Express' | 'J&T Express' | 'SiCepat Ekspres' | 'Pos Indonesia' | 'GoSend Instant' | 'Anteraja' | 'Shopee Xpress'
  ) => {
    // Modify status of bought item
    handleUpdateDoc('marketplace_items', itemId, { isSold: true });

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
        note: `Pembayaran via ${method.toUpperCase()} aman dikunci di Escrow Rekening Bersama idkanca.com.`
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
      createdAt: new Date().toISOString()
    };

    handleSetDoc('escrow_transactions', newTxn.id, newTxn);

    // System banner feedback notification
    const itemSuccessNotif: AppNotification = {
      id: 'notif_pay_' + Date.now(),
      type: 'marketplace',
      title: 'Sistem Escrow Aktif',
      content: `Pembayaran untuk "${boughtItem.title}" berhasil disetujui. Kurir ${chosenExpedition} siap menjemput paket Anda!`,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    handleSetDoc('notifications', itemSuccessNotif.id, itemSuccessNotif);
    
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
      const targetTxn = transactions.find(t => t.id === txnId);
      if (!targetTxn) {
        clearInterval(intervalId);
        setTransitsProcessing(prev => ({ ...prev, [txnId]: false }));
        return;
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
          createdAt: new Date().toISOString()
        };
        handleSetDoc('notifications', finalNotif.id, finalNotif);

        handleUpdateDoc('escrow_transactions', txnId, {
          paymentStatus: 'delivered',
          currentTrackingStepIndex: 5,
          trackingLogs: [
            ...targetTxn.trackingLogs,
            {
              time: `Pukul ${formattedTime}`,
              statusText: finalizedStep.statusText,
              note: finalizedStep.note
            }
          ]
        });
        return;
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
        createdAt: new Date().toISOString()
      };
      handleSetDoc('notifications', intermediateNotif.id, intermediateNotif);

      const isLastStep = currentStepIndex === simulationSteps.length - 1;
      handleUpdateDoc('escrow_transactions', txnId, {
        paymentStatus: isLastStep ? ('delivered' as const) : ('shipped_transit' as const),
        currentTrackingStepIndex: currentStepIndex + 2,
        trackingLogs: [
          ...targetTxn.trackingLogs,
          {
            time: `Pukul ${formattedTime}`,
            statusText: currentLog.statusText,
            note: currentLog.note
          }
        ]
      });

      currentStepIndex++;
    }, 4500); // 4.5s simulation increments
  };

  // --- Logout mock trigger ---
  const handleLogoutFlow = () => {
    setIsLoggedIn(false);
    setIsEmailVerified(false);
    setAuthStage('gmail_one_tap');
    setTempGmailEmail('');
    setTempOtpCode('');
    setVerificationCodeSent(null);
    setOtpError('');
    setActiveTab('feed');
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
      setActiveTab('profile');
      if (notif.senderId || notif.targetId) {
        setViewingProfileUserId(notif.senderId || notif.targetId || null);
      }
    } else if (notif.type === 'like' || notif.type === 'comment') {
      setActiveTab('feed');
      let matchedPostId = notif.targetId;
      if (!matchedPostId) {
        // Try to identify from mock data contents
        const matchedPost = posts.find(p => (p.comments || []).some(c => c.content.includes(notif.content)) || p.id === 'post_2');
        matchedPostId = matchedPost ? matchedPost.id : 'post_1';
      }

      setHighlightedPostId(matchedPostId);

      let foundCommentId = '';
      if (notif.type === 'comment') {
        const post = posts.find(p => p.id === matchedPostId);
        const postComments = post ? (post.comments || []) : [];
        if (post && postComments.length > 0) {
          const comment = postComments.find(c => 
            c.content.includes(notif.content) || 
            (notif.senderId && c.userId === notif.senderId)
          );
          if (comment) {
            setHighlightedCommentId(comment.id);
            foundCommentId = comment.id;
          } else {
            setHighlightedCommentId(postComments[0].id);
            foundCommentId = postComments[0].id;
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

  if (isUnderMaintenance) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 text-[#cbd5e1] font-sans">
        <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.07),transparent_50%)] pointer-events-none"></div>
        
        {/* Bypass Admin panel backdoor button */}
        <div className="absolute top-4 right-4 z-40">
          <button 
            onClick={() => {
              setIsUnderMaintenance(false);
              setActiveTab('admin');
            }} 
            className="text-[10px] font-bold text-amber-500 hover:text-white transition-colors bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Bypass & Buka Panel Admin ⚙️
          </button>
        </div>

        <div className="bg-[#111827] border border-neutral-800 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl text-center space-y-6 animate-scale-up">
          <div className="h-16 w-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl mx-auto animate-pulse">
            🔧
          </div>
          
          <div className="space-y-2">
            <span className="bg-amber-500 text-black font-extrabold text-[8px] px-2.5 py-1 rounded-sm uppercase tracking-widest w-fit mx-auto">
              PEMELIHARAAN SISTEM
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Dalam Maintenance</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Halo pembaca IdKanca, situs kami sedang ditingkatkan untuk dukungan performa query database sharding regional Indonesia yang lebih andal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 space-y-2 text-left">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-extrabold text-center text-neutral-400">STATUS PEMELIHARAAN</p>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500 font-medium">Node Cluster:</span>
              <span className="font-mono text-amber-400 font-bold">UMKM-CLOUD-ID-1</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-550 font-medium">Estimasi Selesai:</span>
              <span className="font-semibold text-emerald-400">Segera Kembali (Kurang dr 30 Menit)</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic">
            Mohon maaf atas ketidaknyamanan Anda. Hubungi kami jika ada keluhan mendesak.
          </p>
        </div>
      </div>
    );
  }

  if (isLoggedIn && currentUser && currentUser.isLocked) {
    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 text-[#cbd5e1] font-sans relative">
        <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1),transparent_60%)] pointer-events-none"></div>
        <div className="bg-[#111827] border-2 border-red-900/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl space-y-6 text-center animate-scale-up animate-pulse-slow">
          <div className="h-16 w-16 bg-red-950/40 border border-red-500/50 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
            🔒
          </div>
          <div className="space-y-2">
            <span className="bg-red-500 text-white font-extrabold text-[8px] px-2.5 py-1 rounded-sm uppercase tracking-widest w-fit mx-auto">
              AKUN SEDANG DITINJAU (UNDER REVIEW)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Akses Akun Ditangguhkan</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Halo <span className="font-extrabold text-neutral-200">{currentUser.displayName || `@${currentUser.username}`}</span>, akun Anda saat ini sedang dikunci dan berada di bawah peninjauan (Under Review) oleh Tim Admin demi kepatuhan siber platform.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 space-y-2 text-left">
            <p className="text-[10px] text-red-400 uppercase tracking-wider font-extrabold text-center">ALASAN PENANGGUHAN</p>
            <p className="text-xs text-neutral-300 leading-relaxed font-bold text-center">
              Aktivitas akun dalam tinjauan intensif atau memerlukan verifikasi dokumen tambahan secara manual. Silakan hubungi admin di instagram kami untuk permohonan pembukaan gembok kanca.
            </p>
          </div>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              setIsEmailVerified(false);
              localStorage.removeItem('idkanca_logged_in');
              localStorage.removeItem('idkanca_email_verified');
              window.location.reload();
            }}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center"
          >
            Keluar Dari Sesi Ini
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isEmailVerified) {
    const loginBgStyle = loginPageBg.startsWith('http') || loginPageBg.startsWith('data:')
      ? { backgroundImage: `url(${loginPageBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: loginPageBg };

    return (
      <div 
        style={loginBgStyle}
        className="min-h-screen flex items-center justify-center p-4 text-[#cbd5e1] font-sans relative"
      >
        <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none"></div>
        <div className="absolute top-4 right-4 z-40">
          <button 
            onClick={() => {
              setIsLoggedIn(true);
              setIsEmailVerified(true);
            }} 
            className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Bypass & Lihat Demo ↗
          </button>
        </div>

        <div className="bg-[#111827]/95 backdrop-blur-md border border-neutral-805 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl space-y-6 text-center animate-scale-up">
          <div className="space-y-2">
            {customLogoUrl ? (
              <img 
                src={customLogoUrl} 
                alt="IdKanca Logo" 
                className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-lg border border-white/10" 
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black mx-auto shadow-lg shadow-emerald-500/10">
                iK
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{loginTitle}</h1>
            <p className="text-xs text-neutral-400">{loginSubtitle}</p>
          </div>

          {/* Methods Swapping Tab Header */}
          <div className="flex border border-neutral-800 rounded-2xl p-1 bg-neutral-950/80 select-none">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setPasswordError('');
              }}
              className={`flex-1 py-2 text-[10.5px] font-black tracking-wider rounded-xl transition-all cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/25 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🔑 Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setOtpError('');
              }}
              className={`flex-1 py-2 text-[10.5px] font-black tracking-wider rounded-xl transition-all cursor-pointer ${
                authMethod === 'otp'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/25 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ✉️ Google Email OTP
            </button>
          </div>

          {authMethod === 'password' ? (
            <div className="space-y-4 text-left font-sans">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-neutral-450 tracking-wider">Alamat Email Terdaftar</label>
                <input
                  type="email"
                  placeholder="contoh: budisusanto@gmail.com"
                  value={loginEmailInput}
                  onChange={(e) => {
                    setLoginEmailInput(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-805 bg-[#171e2e] text-white placeholder-gray-500 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-neutral-455 tracking-wider">Kata Sandi Akun</label>
                <input
                  type="password"
                  placeholder="••••••"
                  value={loginPasswordInput}
                  onChange={(e) => {
                    setLoginPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-805 bg-[#171e2e] text-white placeholder-gray-550 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-red-400 font-bold text-center leading-relaxed">
                  ⚠ {passwordError}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!loginEmailInput.trim() || !loginPasswordInput.trim()) {
                    setPasswordError('Email dan Kata Sandi wajib diisi!');
                    return;
                  }
                  
                  const emailQuery = loginEmailInput.trim().toLowerCase();
                  const matchedUser = registeredUsers.find(u => u.email?.toLowerCase() === emailQuery);
                  
                  if (!matchedUser) {
                    setPasswordError('Akun dengan email tersebut tidak ditemukan. Silakan mendaftar terlebih dahulu menggunakan Google OTP!');
                    return;
                  }
                  
                  if (matchedUser.isLocked) {
                    setPasswordError('🚨 Akun Anda saat ini sedang dikunci/ditinjau oleh Admin (Under Review).');
                    return;
                  }
                  
                  if (matchedUser.password && matchedUser.password !== loginPasswordInput.trim()) {
                    setPasswordError('Kata Sandi salah! Harap coba lagi.');
                    return;
                  }

                  setAuthIsLoading(true);
                  setPasswordError('');
                  setTimeout(() => {
                    setAuthIsLoading(false);
                    setCurrentUser(matchedUser);
                    setIsLoggedIn(true);
                    setIsEmailVerified(true);
                    setIsNewUser(false);
                    localStorage.setItem('idkanca_is_new_user', 'false');
                  }, 800);
                }}
                disabled={authIsLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-black font-black text-xs rounded-xl shadow-md transition-all cursor-pointer text-center disabled:opacity-50"
              >
                {authIsLoading ? 'Masuk Komunitas...' : 'Masuk Komunitas 🔑'}
              </button>

              <p className="text-[9.5px] text-neutral-500 text-center leading-relaxed font-bold">
                Belum punya akun? Pilih tab <span className="text-neutral-400">✉️ Google Email OTP</span> di atas untuk mendaftar baru dan atur username & sandi Anda.
              </p>
            </div>
          ) : (
            authStage === 'gmail_one_tap' ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="inline-block bg-[#1e293b] border border-blue-500/25 text-blue-400 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded">
                  {loginOneTapTitle}
                </span>
                <p className="text-xs text-neutral-300">
                  {loginOneTapDesc}
                </p>
              </div>

              <button
                onClick={async () => {
                  setAuthIsLoading(true);
                  setTimeout(() => {
                    setAuthIsLoading(false);
                    setAuthStage('email_confirmation');
                  }, 1200);
                }}
                disabled={authIsLoading}
                className="w-full py-3.5 bg-white hover:bg-neutral-100 text-black font-extrabold rounded-2xl text-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-95 border border-neutral-200 group relative overflow-hidden"
              >
                {authIsLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-700 border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.61 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.37 7.6l3.87 3C6.21 7.54 8.87 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.82-.07-1.61-.21-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.71z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.24 14.6c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.37 7.6C.49 9.36 0 11.33 0 13.4s.49 4.04 1.37 5.8l3.87-3z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.04.7-2.41 1.13-4.23 1.13-3.13 0-5.79-2.5-6.76-5.56L1.37 15.8C3.37 19.72 7.35 23 12 23z"
                      />
                    </svg>
                    <span>Hubungkan dengan Akun Gmail</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-neutral-550 leading-relaxed">
                Informasi masuk dilindungi dengan Google OAuth SDK 2.0. Kami tidak pernah melihat password Anda.
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-left font-sans">
              <div className="space-y-1 text-center">
                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded">
                  VERIFIKASI EMAIL WAJIB
                </span>
                <p className="text-xs text-neutral-350">
                  Untuk mengaktifkan akun Anda secara resmi, silakan kirim kode konfirmasi ke email Gmail Anda.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-neutral-450">Alamat Email Gmail Anda</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="contoh: budisusanto@gmail.com"
                      value={tempGmailEmail}
                      onChange={(e) => {
                        setTempGmailEmail(e.target.value);
                        setOtpError('');
                      }}
                      className="flex-1 text-xs p-3 rounded-xl border border-neutral-800 bg-[#1f2937] text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500 text-left"
                    />
                    <button
                      onClick={() => {
                        if (!tempGmailEmail.trim() || !tempGmailEmail.includes('@')) {
                          setOtpError('Format email Gmail tidak valid!');
                          return;
                        }
                        setAuthIsLoading(true);
                        setTimeout(() => {
                          setAuthIsLoading(false);
                          const dynamicCode = Math.floor(100000 + Math.random() * 900000).toString();
                          
                          // Actual Real-time Client-Side AJAX Email Delivery utilizing FormSubmit dynamic gateway!
                          fetch(`https://formsubmit.co/ajax/${tempGmailEmail.trim()}`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Accept": "application/json"
                            },
                            body: JSON.stringify({
                              "_subject": `🔑 KODE OTP: ${dynamicCode} - Aktifkan Akun IdKanca`,
                              "name": "Portal IdKanca",
                              "email": tempGmailEmail.trim(),
                              "message": `Aktifkan akun Anda secara instan.\n\nMasukkan kode verifikasi 6 digit berikut:\n\n🔑 Kode OTP: ${dynamicCode}`
                            })
                          }).catch(err => {
                            console.warn("FormSubmit send notice err:", err);
                          });

                          setVerificationCodeSent(dynamicCode);
                          setOtpError('');
                        }, 1000);
                      }}
                      disabled={authIsLoading || !tempGmailEmail}
                      className="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-650 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Kirim Kode
                    </button>
                  </div>
                </div>

                {verificationCodeSent && (
                  <div className="space-y-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in text-center">
                    <p className="text-xs text-emerald-400 font-extrabold leading-relaxed flex items-center justify-center gap-1.5 animate-pulse">
                      <span>✓</span> Kode Verifikasi Berhasil Dikirim Langsung!
                    </p>
                    <p className="text-[10px] text-neutral-350 leading-relaxed font-semibold">
                      Harap segera memeriksa kotak masuk, promosi, atau folder spam email <span className="text-emerald-300 font-extrabold">{tempGmailEmail}</span> Anda untuk menyalin kode OTP verifikasi 6-digit.
                    </p>
                    <div className="bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800 text-[9.5px] text-amber-400 font-medium text-left leading-relaxed">
                      <p className="font-extrabold mb-1 text-[10px] text-amber-300">💡 ALUR PERTAMA KALI MENDAFTAR (PENTING):</p>
                      Jika alamat email ini baru pertama kali diuji di sistem kami, FormSubmit memerlukan konfirmasi manual anti-spam sekali saja. Silakan buka kotak masuk email/spam Anda, cari kiriman dari <span className="font-extrabold underline text-amber-300">FormSubmit</span> bergaya <span className="italic font-bold">"Action Required: Activate..."</span> lalu klik <span className="font-extrabold text-white underline">"Activate Form"</span>. Segera setelah itu, klik tombol <span className="font-extrabold text-[#cbd5e1] underline">"Kirim Kode"</span> kembali di halaman ini untuk mendapatkan OTP langsung dalam hitungan detik!
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-neutral-455">Isikan 6 digit Kode Verifikasi</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Masukkan 6-digit angka"
                    value={tempOtpCode}
                    onChange={(e) => {
                      setTempOtpCode(e.target.value);
                      setOtpError('');
                    }}
                    className="w-full text-center text-sm p-3 rounded-xl border border-neutral-800 bg-[#1f2937] text-white tracking-widest font-mono placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {otpError && (
                  <p className="text-[10px] text-red-400 font-semibold text-center">
                    ⚠ {otpError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAuthStage('gmail_one_tap');
                      setVerificationCodeSent(null);
                    }}
                    className="flex-1 py-3 border border-neutral-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => {
                      if (!verificationCodeSent) {
                        setOtpError('Silakan kirim kode verifikasi ke email dulu!');
                        return;
                      }
                      if (tempOtpCode.trim() !== verificationCodeSent) {
                        setOtpError('Kode OTP salah! Silakan periksa kembali email Anda untuk mendapatkan kode penandatanganan yang sesuai.');
                        return;
                      }
                      setAuthIsLoading(true);
                      setTimeout(() => {
                        setAuthIsLoading(false);
                        const cleanUsername = tempGmailEmail.split('@')[0];
                        const uniqueId = 'user_' + cleanUsername.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                        
                        const existingProfile = registeredUsers.find(u => u.id === uniqueId);
                        
                        if (existingProfile) {
                          setCurrentUser(existingProfile);
                          setIsNewUser(false);
                          localStorage.setItem('idkanca_is_new_user', 'false');
                        } else {
                          // Initialize a complete default user object so that it gets written cleanly and immediately into premium database
                          const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanUsername)}`;
                          const newUserObj: User = {
                            id: uniqueId,
                            username: cleanUsername,
                            displayName: cleanUsername, // Start with cleanUsername as display name
                            avatar: defaultAvatar,
                            email: tempGmailEmail,
                            joinedDate: 'Mei 2026',
                            location: 'DI Yogyakarta',
                            bio: '',
                            followersCount: 0,
                            banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
                            bannerPosition: 50,
                            password: 'sandi123'
                          };

                          setIsNewUser(true);
                          localStorage.setItem('idkanca_is_new_user', 'true');
                          setCurrentUser(newUserObj);

                          // Write to firestore database immediately during login OTP completion so it is always recorded!
                          handleSetDoc('users', newUserObj.id, newUserObj).catch((err) => {
                            console.warn("Could not write newly created user to Firestore during register:", err);
                          });
                        }
                        
                        // Enforce friends are completely 0 upon registration
                        setFriends([]);
                        safeSetItem('idkanca_friends', JSON.stringify([]));

                        setIsLoggedIn(true);
                        setIsEmailVerified(true);
                      }, 1000);
                    }}
                    disabled={authIsLoading || !tempOtpCode}
                    className="flex-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-650 hover:to-indigo-650 text-white font-extrabold rounded-xl text-xs transition-colors text-center cursor-pointer shadow-lg hover:shadow-blue-500/10"
                  >
                    {authIsLoading ? 'Aktivasi Akun...' : 'Konfirmasi & Masuk'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Marquee Notice Ticker visible ONLY on login & sign up screens */}
        {adminMarqueeText && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-b border-amber-500/15 py-2.5 z-40 shadow-xl overflow-hidden flex items-center gap-3">
            <div className="bg-amber-500 text-black font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-r-lg shadow-md shrink-0 relative z-10">
              INFO RESMI 📢
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="animate-marquee whitespace-nowrap text-[11px] font-bold text-amber-250 select-none">
                {adminMarqueeText} &nbsp;&bull;&nbsp; {adminMarqueeText} &nbsp;&bull;&nbsp; {adminMarqueeText}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isProfileIncomplete = isLoggedIn && isEmailVerified && (isNewUser || !currentUser.displayName || currentUser.displayName.trim() === "");

  if (isProfileIncomplete) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-[#cbd5e1] font-sans">
        <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none"></div>
        
        <div className="bg-[#111827] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-2xl space-y-6 text-center animate-scale-up">
          <div className="space-y-4">
            <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wider animate-pulse">
              PENGATURAN AKUN RESMI ⚠️
            </span>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isNewUser ? 'Selamat Datang di iB!' : 'Lengkapi Profil Akun Anda'}
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
                {isNewUser 
                  ? 'Sebagai pengguna baru, Anda wajib melengkapi nama lengkap, kata sandi, dan foto profil Anda agar platform tetap aman.'
                  : 'Selesaikan verifikasi identitas. Untuk pengguna lama, unggah foto profil bersifat opsional!'}
              </p>
            </div>
          </div>

          <div className="space-y-5 text-left">
            {/* Foto Profil */}
            <div className="space-y-1.5 flex flex-col items-center">
              <label className="text-[10px] font-extrabold uppercase text-neutral-450 tracking-wider">
                Foto Profil {isNewUser ? '(Wajib - Upload Gambar)' : '(Opsional)'}
              </label>
              
              <div className="relative group cursor-pointer block">
                {setupAvatar ? (
                  <div className="relative">
                    <img 
                      src={setupAvatar} 
                      alt="Avatar Preview" 
                      className="h-24 w-24 rounded-full object-cover border-4 border-emerald-500/3 overlay-blue shadow-xl transition-all" 
                    />
                    <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-[10px] font-bold">
                      Ganti Foto
                      <input 
                        id="setup-avatar-file-1"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressImage(file)
                              .then(setSetupAvatar)
                              .catch(err => console.error("Avatar compression failed:", err));
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <label htmlFor="setup-avatar-file-2" className="h-24 w-24 rounded-full border-3 border-dashed border-neutral-750 hover:border-emerald-500/50 bg-neutral-900 flex flex-col items-center justify-center text-center p-2.5 cursor-pointer hover:bg-neutral-850 transition-all select-none">
                    <span className="text-lg">📷</span>
                    <span className="text-[8px] font-extrabold text-neutral-400 mt-1 uppercase">Pilih Gambar</span>
                    {isNewUser ? (
                      <span className="text-[6px] text-red-400 font-extrabold mt-0.5 uppercase">Wajib Baru</span>
                    ) : (
                      <span className="text-[6px] text-gray-500 mt-0.5 uppercase">Boleh Kosong</span>
                    )}
                    <input 
                      id="setup-avatar-file-2"
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file)
                            .then(setSetupAvatar)
                            .catch(err => console.error("Avatar compression failed:", err));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              {isNewUser && !setupAvatar && (
                <p className="text-[10px] text-red-400 border border-red-500/20 bg-red-950/20 py-1 px-3 rounded-lg font-bold tracking-tight animate-pulse text-center mt-1">
                  ⚠ Pengguna baru wajib mengunggah foto profil asli Anda!
                </p>
              )}
            </div>

            {/* Nama Lengkap Wajib */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-455 tracking-wider">Nama Lengkap (Wajib)</label>
              <input 
                type="text"
                placeholder="Masukkan nama lengkap sesuai identitas..."
                value={setupDisplayName}
                onChange={(e) => setSetupDisplayName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-805 bg-[#171e2e] text-white placeholder-gray-550 focus:outline-hidden focus:border-emerald-500 text-left font-extrabold"
              />
              {!setupDisplayName.trim() && (
                <p className="text-[9px] text-red-450 font-semibold">⚠ Nama Lengkap belum diatur dan wajib diisi.</p>
              )}
            </div>

            {/* Password Wajib */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-455 tracking-wider">
                {isNewUser ? 'Atur Kata Sandi Login (Wajib - Min. 6 Karakter)' : 'Ubah / Atur Kata Sandi (Opsional)'}
              </label>
              <input 
                type="password"
                placeholder={isNewUser ? "Atur sandi rahasia minimal 6 karakter..." : "Boleh dikosongkan jika tidak ingin mengubah sandi..."}
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-805 bg-[#171e2e] text-white placeholder-gray-555 focus:outline-hidden focus:border-emerald-500 text-left font-extrabold"
              />
              {isNewUser && setupPassword.trim().length < 6 && (
                <p className="text-[9px] text-amber-500 font-extrabold">⚠ Sebagai anggota baru, Sandi wajib minimal 6 karakter untuk login.</p>
              )}
            </div>

            {/* Lokasi / Domisili */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-455 tracking-wider">Lokasi / Domisili Kota</label>
              <select
                value={setupLocation}
                onChange={(e) => setSetupLocation(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-805 bg-[#171e2e] text-white focus:outline-hidden focus:border-emerald-500 font-extrabold"
              >
                <option value="DI Yogyakarta">DI Yogyakarta</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Bali">Bali</option>
                <option value="Banten">Banten</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Sumatera Selatan">Sumatera Selatan</option>
                <option value="Kalimantan Timur">Kalimantan Timur</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                <option value="Papua">Papua</option>
              </select>
            </div>

            {/* Bio Singkat */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-455 tracking-wider">Bio Singkat Bisnis / Hobi</label>
              <textarea 
                rows={2}
                maxLength={100}
                placeholder="Tulis bidang wirausaha Anda atau deskripsi singkat..."
                value={setupBio}
                onChange={(e) => setSetupBio(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-805 bg-[#171e2e] text-white placeholder-gray-550 focus:outline-hidden focus:border-emerald-500 leading-relaxed font-bold"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setIsEmailVerified(false);
                setIsNewUser(false);
                localStorage.setItem('idkanca_logged_in', 'false');
                localStorage.setItem('idkanca_is_new_user', 'false');
              }}
              className="flex-1 py-3 border border-neutral-800 text-gray-400 hover:text-white rounded-xl text-xs font-black transition-all cursor-pointer text-center"
            >
              Keluar
            </button>
            <button
              onClick={() => {
                if (!setupDisplayName.trim()) return;

                const finalAvatar = setupAvatar || currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(setupDisplayName.trim())}`;
                const finalPassword = setupPassword.trim() || 'sandi123';
                
                const updatedUser = {
                  ...currentUser,
                  displayName: setupDisplayName.trim(),
                  avatar: finalAvatar,
                  location: setupLocation,
                  bio: setupBio,
                  banner: setupBanner,
                  bannerPosition: 50,
                  password: finalPassword,
                  isNewUser: false
                };

                setCurrentUser(updatedUser);
                setIsNewUser(false);
                localStorage.setItem('idkanca_is_new_user', 'false');

                // Write to firestore database immediately so that it is always recorded!
                handleSetDoc('users', updatedUser.id, updatedUser).catch((err) => {
                  console.warn("Could not save profile setup to Firestore:", err);
                });

                // Flash confirmation
                setShowNotificationBadgeSplash(true);
                setTimeout(() => {
                  setShowNotificationBadgeSplash(false);
                }, 3000);
              }}
              disabled={!setupDisplayName.trim()}
              className="flex-2 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 disabled:opacity-40 text-black font-black rounded-xl text-xs transition-transform hover:scale-[1.01] active:scale-95 text-center cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              Simpan & Masuk Komunitas 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-neutral-150 transition-colors duration-200">
      
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
        messages={messages}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveChatFriendId={setActiveChatFriendId}
        customLogoUrl={customLogoUrl}
      />

      {/* Body Core Content layout Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Column 1: Desktop-only sidebar to keep the layout grid perfect without gaps on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar
              currentUser={currentUser}
              isOpen={false}
              onClose={() => {}}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={handleLogoutFlow}
              language={language}
            />
          </div>

          {/* Column 2&3: Primary Tab Stream Panel (Feed, Marketplace, Chat, Profile) */}
          <main className="lg:col-span-3 space-y-6 pb-24 lg:pb-12 text-left">
            
            {/* --- TAB: FEED --- */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                
                {/* Visual Quick Posting Entry Card with avatar */}
                <div className="bg-white dark:bg-white border border-gray-150 p-4 rounded-3xl flex gap-3 items-center shadow-xs">
                  <img src={currentUser.avatar} alt="User Avatar" className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500" />
                  <button
                    onClick={() => setCreatePostModalOpen(true)}
                    className="flex-1 bg-gray-50 text-left text-xs font-semibold px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-emerald-500/10 animate-fade-in"
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

                {/* SUGGESTED PARTNERS WIDGET (Mandatory friend addition section with YouTube Style Search suggestions) */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl space-y-4 shadow-xl text-left text-[#cbd5e1] animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-0.5">
                      <span className="bg-amber-500 text-black font-black text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-sm">
                        REKOMENDASI MITRA BISNIS & WIRAUSAHA
                      </span>
                      <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5 mt-1">
                        🤝 Temukan Teman & Pengusaha Baru
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {friends.length === 0 
                          ? '👉 Anda belum memiliki teman (0 pertemanan). Cari & hubungkan sinergi UMKM untuk memulai ide bisnis!'
                          : 'Cari berdasarkan nama dan hubungkan sinergi UMKM untuk perluas ekspansi jaringan bisnis digital Anda.'
                        }
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0">
                      {friends.length} Teman Aktif
                    </span>
                  </div>

                  {/* YouTube style search input container */}
                  <div className="relative max-w-md w-full my-3" ref={suggestedSearchRef}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari nama pengusaha atau keahlian (contoh: Siti, Kopi, Batik)..."
                      value={friendSearchQuery}
                      onChange={(e) => {
                        setFriendSearchQuery(e.target.value);
                        setShowFriendSuggestions(true);
                      }}
                      onFocus={() => setShowFriendSuggestions(true)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-9 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all"
                    />
                    {friendSearchQuery && (
                      <button 
                        onClick={() => {
                          setFriendSearchQuery('');
                          setShowFriendSuggestions(false);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Autocomplete suggestions menu like YouTube search suggestions */}
                    {showFriendSuggestions && (() => {
                      const query = friendSearchQuery.trim().toLowerCase();
                      
                      // 1. If query is empty, show search history
                      if (query.length === 0) {
                        return friendSearchHistory.length > 0 ? (
                          <div className="absolute top-11 left-0 w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-left py-1.5 animate-slide-in">
                            <div className="flex justify-between items-center px-4 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-550 border-b border-slate-900 mb-1">
                              <span>Histori Pencarian (YouTube-Style)</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFriendSearchHistory([]);
                                  localStorage.setItem('idkanca_friend_search_history', JSON.stringify([]));
                                }}
                                className="text-red-500 hover:text-red-400 font-extrabold cursor-pointer uppercase text-[8px]"
                              >
                                Bersihkan Semua
                              </button>
                            </div>
                            {friendSearchHistory.map((hist, sIdx) => (
                              <div
                                key={sIdx}
                                onClick={() => {
                                  setFriendSearchQuery(hist);
                                  setShowFriendSuggestions(false);
                                  addToFriendHistory(hist);
                                }}
                                className="w-full px-4 py-2 hover:bg-[#1e293b]/50 flex items-center justify-between cursor-pointer group text-xs text-slate-350 hover:text-white"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate">{hist}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const filtered = friendSearchHistory.filter(h => h !== hist);
                                    setFriendSearchHistory(filtered);
                                    localStorage.setItem('idkanca_friend_search_history', JSON.stringify(filtered));
                                  }}
                                  className="text-[9px] text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Hapus
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      }

                      // 2. Query entered: show matched users suggestion
                      const matches = combinedUserDirectory.filter(u => 
                        u.displayName.toLowerCase().includes(query) || 
                        u.bio.toLowerCase().includes(query)
                      );

                      if (matches.length === 0) {
                        return (
                          <div className="absolute top-11 left-0 w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 text-center py-4 text-xs text-slate-500 animate-slide-in">
                            Tidak ada saran pengusaha ditemukan 🔍
                          </div>
                        );
                      }

                      return (
                        <div className="absolute top-11 left-0 w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-left py-1.5 animate-slide-in">
                          <div className="px-4 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-550 border-b border-slate-900 mb-1">
                            Prediksi Autocomplete (Ketik & Saring)
                          </div>
                          {matches.slice(0, 6).map((u) => {
                            const matchedIdx = u.displayName.toLowerCase().indexOf(query);
                            let before = u.displayName;
                            let matchPart = '';
                            let after = '';
                            
                            if (matchedIdx !== -1) {
                              before = u.displayName.slice(0, matchedIdx);
                              matchPart = u.displayName.slice(matchedIdx, matchedIdx + query.length);
                              after = u.displayName.slice(matchedIdx + query.length);
                            }

                            return (
                              <button
                                key={u.id}
                                onClick={() => {
                                  setFriendSearchQuery(u.displayName);
                                  setShowFriendSuggestions(false);
                                  addToFriendHistory(u.displayName);
                                }}
                                className="w-full px-4 py-2 hover:bg-[#1e293b]/50 flex items-center justify-between cursor-pointer gap-2 transition-colors text-left"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img src={u.avatar} alt={u.displayName} className="h-6 w-6 rounded-full object-cover border border-slate-850" />
                                  <p className="text-xs text-slate-300 truncate">
                                    {before}
                                    <span className="text-emerald-400 font-extrabold">{matchPart}</span>
                                    {after}
                                  </p>
                                </div>
                                <span className="text-[8px] font-semibold text-slate-500 uppercase truncate max-w-32">{u.bio.split(' ')[0]} {u.bio.split(' ')[1] || ''}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Render Results Grid */}
                  {(() => {
                    const query = friendSearchQuery.trim().toLowerCase();
                    const displayedUsers = query
                      ? combinedUserDirectory.filter(u => 
                          u.displayName.toLowerCase().includes(query) || 
                          u.bio.toLowerCase().includes(query)
                        )
                      : combinedUserDirectory.slice(0, 4);

                    if (displayedUsers.length === 0) {
                      return (
                        <div className="text-center py-8 bg-[#111827] border border-slate-800 rounded-2xl">
                          <p className="text-xs text-slate-400">
                            🔍 Tidak menemukan pengusaha bernama "<span className="text-red-400 font-bold">{friendSearchQuery}</span>"
                          </p>
                          <button 
                            onClick={() => setFriendSearchQuery('')}
                            className="mt-2 text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-1 rounded-lg animate-fade-in"
                          >
                            Reset Pencarian
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                        {displayedUsers.map((pep) => {
                          const isFriend = friends.some(f => f.id === pep.id);
                          return (
                            <div key={pep.id} className="bg-[#111827] border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between gap-3 text-center transition-all hover:border-neutral-750">
                              <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                  <img src={pep.avatar} alt={pep.displayName} className="h-14 w-14 rounded-full object-cover border-2 border-slate-700" />
                                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111827] ${pep.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                                </div>
                                <div className="text-center">
                                  <h4 className="font-bold text-xs text-white leading-tight">{pep.displayName}</h4>
                                  <p className="text-[8px] text-amber-500 font-extrabold uppercase tracking-tight mt-0.5">Wirausaha Aktif</p>
                                  <p className="text-[10px] text-slate-400 leading-normal mt-1.5 italic line-clamp-2">"{pep.bio}"</p>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  if (isFriend) {
                                    setFriends(prev => {
                                      const updated = prev.filter(f => f.id !== pep.id);
                                      safeSetItem('idkanca_friends', JSON.stringify(updated));
                                      return updated;
                                    });
                                    if (isFirebaseAuthed) {
                                      handleDeleteDoc(`users/${currentUser.id}/friends`, pep.id);
                                    }
                                  } else {
                                    const newFriend: Friend = {
                                      id: pep.id,
                                      displayName: pep.displayName,
                                      avatar: pep.avatar,
                                      isOnline: pep.isOnline,
                                      lastActive: pep.isOnline ? 'Aktif Sekarang' : (pep.id === 'user_3' ? '2 jam lalu' : 'Kemarin')
                                    };
                                    setFriends(prev => {
                                      const filtered = prev.filter(f => f.id !== pep.id);
                                      const updated = [...filtered, newFriend];
                                      safeSetItem('idkanca_friends', JSON.stringify(updated));
                                      return updated;
                                    });
                                    if (isFirebaseAuthed) {
                                      handleSetDoc(`users/${currentUser.id}/friends`, pep.id, newFriend);
                                    }
                                  }
                                }}
                                className={`w-full py-2 rounded-xl text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                                  isFriend 
                                    ? 'bg-[#1e293b] text-slate-400 border border-slate-800 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30' 
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                                }`}
                              >
                                {isFriend ? '✓ Berteman (Hapus)' : '➕ Tambah Teman'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Main chronological posts list */}
                <div className="space-y-6">
                  {posts
                    .filter(p => !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase()) || (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map((post) => {
                      const hasLiked = post.likes.includes(currentUser.id);
                      const isPostNewlyAdded = post.id === newlyAddedPostId;
                      return (
                        <article 
                          id={`post-${post.id}`}
                          key={post.id} 
                          className={`glass-aqua-card rounded-3xl p-5 space-y-4 transition-all duration-300 ${
                            isPostNewlyAdded
                              ? 'animate-blink-custom border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg scale-[1.01]'
                              : post.id === highlightedPostId
                                ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-md bg-cyan-50/10 dark:bg-cyan-950/20'
                                : ''
                          }`}
                        >
                          {/* User authorship info */}
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <img 
                                src={post.userAvatar} 
                                alt={post.userName} 
                                onClick={() => {
                                  setViewingProfileUserId(post.userId);
                                  setActiveTab('profile');
                                }}
                                className="h-10 w-10 rounded-full object-cover border border-emerald-500/10 cursor-pointer hover:opacity-85 transition-opacity" 
                              />
                              <div className="text-left">
                                <h4 className="font-bold text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap">
                                  {post.userName}
                                  {post.userId === currentUser.id && <span className="text-[8px] bg-slate-100 dark:bg-neutral-800 text-slate-500 px-1 py-0.5 rounded-sm">Kamu</span>}
                                  {isPostNewlyAdded && (
                                    <span className="text-[8px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black px-2 py-0.5 rounded-full select-none animate-pulse">
                                      Post baru sukses! ✨
                                    </span>
                                  )}
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
                              {renderFormattedContent(post.content)}
                            </p>
                          </div>

                          {/* Content image collage if has visual illustrations up to 15 images */}
                          {(() => {
                            const postImages = post.images && post.images.length > 0 
                              ? post.images 
                              : (post.image ? [post.image] : []);

                            if (postImages.length === 0) return null;

                            if (postImages.length === 1) {
                              return (
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImages(postImages);
                                    setLightboxIndex(0);
                                    setLightboxSrc(postImages[0]);
                                  }}
                                  className="rounded-3xl overflow-hidden max-h-[360px] border border-gray-150/70 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center cursor-zoom-in group shadow-xs hover:shadow-md transition-all select-none mx-auto sm:mx-0"
                                >
                                  <img src={postImages[0]} alt="Visual Attachment" className="w-full h-full max-h-[360px] object-cover duration-350 group-hover:scale-103 transition-transform" />
                                </div>
                              );
                            }

                            if (postImages.length === 2) {
                              return (
                                <div className="grid grid-cols-2 gap-2 h-64 rounded-3xl overflow-hidden border border-gray-150/70 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                                  {postImages.map((src, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxImages(postImages);
                                        setLightboxIndex(idx);
                                        setLightboxSrc(src);
                                      }}
                                      className="relative h-full overflow-hidden cursor-zoom-in group"
                                    >
                                      <img src={src} alt="Attachment Grid" className="w-full h-full object-cover duration-300 group-hover:scale-103 transition-transform" />
                                    </div>
                                  ))}
                                </div>
                              );
                            }

                            if (postImages.length === 3) {
                              return (
                                <div className="grid grid-cols-3 gap-2 h-72 rounded-3xl overflow-hidden border border-gray-150/70 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxImages(postImages);
                                      setLightboxIndex(0);
                                      setLightboxSrc(postImages[0]);
                                    }}
                                    className="col-span-2 relative h-full overflow-hidden cursor-zoom-in group border-r border-gray-150/50 dark:border-neutral-800/10"
                                  >
                                    <img src={postImages[0]} alt="Attachment Grid Main" className="w-full h-full object-cover duration-300 group-hover:scale-103 transition-all" />
                                  </div>
                                  <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                                    {postImages.slice(1, 3).map((src, idx) => (
                                      <div 
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxImages(postImages);
                                          setLightboxIndex(idx + 1);
                                          setLightboxSrc(src);
                                        }}
                                        className="relative h-full overflow-hidden cursor-zoom-in group"
                                      >
                                        <img src={src} alt="Attachment Grid Sub" className="w-full h-full object-cover duration-300 group-hover:scale-103 transition-all" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            if (postImages.length === 4) {
                              return (
                                <div className="grid grid-cols-2 gap-2 h-72 rounded-3xl overflow-hidden border border-gray-150/70 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                                  {postImages.map((src, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxImages(postImages);
                                        setLightboxIndex(idx);
                                        setLightboxSrc(src);
                                      }}
                                      className="relative h-full overflow-hidden cursor-zoom-in group"
                                    >
                                      <img src={src} alt="Attachment Grid item" className="w-full h-full object-cover duration-300 group-hover:scale-103 transition-all" />
                                    </div>
                                  ))}
                                </div>
                              );
                            }

                            // 5 or more images layout
                            return (
                              <div className="grid grid-cols-5 gap-2 h-80 rounded-3xl overflow-hidden border border-gray-150/70 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                                {/* Main Left Image (takes up 3 cols) */}
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImages(postImages);
                                    setLightboxIndex(0);
                                    setLightboxSrc(postImages[0]);
                                  }}
                                  className="col-span-3 relative h-full overflow-hidden cursor-zoom-in group"
                                >
                                  <img src={postImages[0]} alt="Grid item main" className="w-full h-full object-cover duration-300 group-hover:scale-103 transition-transform" />
                                </div>
                                
                                {/* Right grid (takes up 2 cols), with up to 4 items stacked */}
                                <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
                                  {postImages.slice(1, 5).map((src, idx) => {
                                    const imageIndex = idx + 1;
                                    const isLastOneShown = idx === 3;
                                    const totalRemaining = postImages.length - 5;
                                    
                                    return (
                                      <div 
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxImages(postImages);
                                          setLightboxIndex(imageIndex);
                                          setLightboxSrc(src);
                                        }}
                                        className="relative h-full overflow-hidden cursor-zoom-in group"
                                      >
                                        <img src={src} alt="Sub grid item" className="w-full h-full object-cover duration-350 group-hover:scale-103 transition-all" />
                                        {isLastOneShown && totalRemaining > 0 && (
                                          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
                                            <span className="text-sm font-black tracking-tight">{`+${totalRemaining + 1}`}</span>
                                            <span className="text-[7.5px] font-black uppercase tracking-wider text-neutral-300">Foto Lainnya</span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Action Toolbar buttons */}
                          <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-3 border-t border-gray-100 dark:border-neutral-850/70 text-gray-500 dark:text-neutral-450">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                                hasLiked ? 'text-rose-500' : 'hover:text-rose-500'
                              }`}
                            >
                              <Heart className={`h-4.5 w-4.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span>{(post.likes || []).length} Suka</span>
                            </button>

                            <button
                              onClick={() => {
                                const input = document.getElementById(`comment-input-${post.id}`);
                                if (input) {
                                  input.focus();
                                  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }}
                              className="flex items-center gap-1.5 text-xs font-semibold hover:text-emerald-500 cursor-pointer transition-colors"
                            >
                              <MessageCircle className="h-4.5 w-4.5" />
                              <span>{(post.comments || []).length} Komentar</span>
                            </button>
                            <button
                              onClick={() => {
                                const shareText = `Halo rekan UMKM, baca status dari ${post.userName} di IdKanca: "${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}"\nKunjungi: ${window.location.href}`;
                                const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                                window.open(waUrl, '_blank', 'noopener,noreferrer');
                              }}
                              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                              title="Bagikan ke WhatsApp Status"
                            >
                              <Share2 className="h-4.5 w-4.5" />
                              <span>Bagikan WA</span>
                            </button>
                          </div>

                          {/* Sub-Comments listings stack */}
                          {(post.comments || []).length > 0 && (() => {
                            const limit = postCommentsLimit[post.id] ?? 2;
                            const postComments = post.comments || [];
                            const commentsToShow = postComments.slice(-limit);
                            const hasMore = postComments.length > limit;

                            return (
                              <div className="bg-gray-50 dark:bg-neutral-950/40 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-neutral-800/60 mt-3">
                                {hasMore && (
                                  <button
                                    onClick={() => setPostCommentsLimit(prev => ({ ...prev, [post.id]: (prev[post.id] ?? 2) + 10 }))}
                                    className="w-full text-center py-2 text-xs font-black text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 flex items-center justify-center gap-1.5 focus:outline-hidden"
                                  >
                                    💬 Lihat Komentar Sebelumnya ({postComments.length - limit} komentar lagi)
                                  </button>
                                )}
                                {commentsToShow.map((comment) => {
                                  const isCommentHighlighted = comment.id === highlightedCommentId;
                                  const isNewlyAdded = comment.id === newlyAddedCommentId;
                                  const isBlinking = isCommentHighlighted || isNewlyAdded;
                                  return (
                                    <div 
                                      key={comment.id} 
                                      id={`comment-${comment.id}`}
                                      className="space-y-2 border-b border-gray-150/10 dark:border-neutral-800 pb-2.5 last:border-0"
                                    >
                                      <div className={`flex gap-2.5 items-start text-xs text-left p-1.5 rounded-xl transition-all ${
                                        isBlinking 
                                          ? 'animate-blink-custom border-l-4 border-emerald-500 shadow-lg scale-[1.02] ring-1 ring-emerald-400/30' 
                                          : ''
                                      }`}>
                                        <img src={comment.userAvatar} alt={comment.userName} className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5" />
                                        <div className={`flex-1 min-w-0 p-2 text-[11px] rounded-xl border ${
                                          isBlinking
                                            ? 'bg-neutral-900/90 dark:bg-neutral-950 border-emerald-500 text-white shadow-md'
                                            : 'bg-slate-700 text-white dark:bg-neutral-950 border-slate-600 dark:border-neutral-800'
                                        }`}>
                                          <div className="flex justify-between items-baseline mb-0.5 border-b border-white/5 pb-1">
                                            <span className={`font-bold flex items-center gap-1.5 ${
                                              isBlinking ? 'text-emerald-400' : 'text-slate-100 dark:text-slate-200'
                                            }`}>
                                              {comment.userName}
                                              {isBlinking && (
                                                <span className="text-[8px] bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full select-none animate-bounce shadow-xs">
                                                  {isNewlyAdded ? 'Komentar Baru ✨' : 'Sumber Notif ✨'}
                                                </span>
                                              )}
                                            </span>
                                            <span className={`text-[8px] ${isBlinking ? 'text-emerald-400' : 'text-slate-400'}`}>{comment.createdAt}</span>
                                          </div>
                                          <p className={`text-xs leading-relaxed font-semibold block break-words ${
                                            isCommentHighlighted ? 'text-gray-950 dark:text-neutral-100' : 'text-white'
                                          }`}>{renderFormattedContent(comment.content)}</p>

                                          {/* Render comment image if attached with custom lightbox integration */}
                                          {comment.image && (
                                            <div className="mt-2 rounded-xl overflow-hidden max-h-36 border border-white/10 dark:border-neutral-800 bg-neutral-950/40">
                                              <img 
                                                src={comment.image} 
                                                alt="Komentar Foto" 
                                                className="w-[85%] object-cover cursor-pointer hover:opacity-95" 
                                                onClick={() => {
                                                  setLightboxImages([comment.image!]);
                                                  setLightboxIndex(0);
                                                  setLightboxSrc(comment.image!);
                                                }}
                                              />
                                            </div>
                                          )}

                                          {/* Mini action triggers */}
                                          <div className={`flex gap-3 mt-2 pt-1 border-t border-dashed ${isCommentHighlighted ? 'border-gray-200 text-gray-600' : 'border-white/10 text-slate-300'} select-none`}>
                                            <button 
                                              onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
                                              className="hover:text-amber-400 font-bold text-[9px] transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                              💬 Balas Komentar
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Active Reply box */}
                                      {replyingToCommentId === comment.id && (
                                        <div className="ml-9 p-3 bg-neutral-900/90 dark:bg-black/95 rounded-xl border border-emerald-500/30 animate-slide-in space-y-2 text-left">
                                          <p className="text-[9px] font-extrabold text-amber-400">Balas komentar dari {comment.userName}:</p>
                                          
                                          {/* Selected reply image preview */}
                                          {replyImage[comment.id] && (
                                            <div className="relative inline-block mt-1 bg-black/40 rounded-lg p-1 border border-neutral-700">
                                              <img src={replyImage[comment.id]} className="max-h-20 max-w-xs object-contain rounded-md" />
                                              <button 
                                                onClick={() => setReplyImage(prev => ({ ...prev, [comment.id]: '' }))}
                                                className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full h-4 w-4 flex items-center justify-center text-[8px] cursor-pointer"
                                                type="button"
                                              >
                                                ✕
                                              </button>
                                            </div>
                                          )}

                                          <div className="flex gap-2 items-center relative">
                                            {/* File selector icon trigger */}
                                            <label className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 rounded-lg cursor-pointer transition-all shrink-0">
                                              <ImageIcon className="h-4 w-4" />
                                              <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    compressImage(file)
                                                      .then(base64 => {
                                                        setReplyImage(prev => ({ ...prev, [comment.id]: base64 }));
                                                      })
                                                      .catch(err => console.error("Reply photo compression error:", err));
                                                  }
                                                }}
                                              />
                                            </label>

                                            <div className="relative flex-1">
                                              <input 
                                                type="text"
                                                id={`reply-input-${comment.id}`}
                                                placeholder="Tulis balasan... ketik @ untuk tag"
                                                value={replyText[comment.id] || ''}
                                                onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                className="w-full rounded-lg border border-neutral-700 dark:border-neutral-800 bg-neutral-950/90 text-[11px] text-white px-3 py-1.5 focus:outline-hidden focus:border-emerald-500 font-medium font-sans"
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') handleCommentReply(post.id, comment.id);
                                                }}
                                              />
                                              {/* Auto-mention suggestions dropdown list for deep nested comments */}
                                              {(() => {
                                                const currentText = replyText[comment.id] || '';
                                                const match = currentText.match(/@([a-zA-Z0-9_]*)$/);
                                                if (match && friends && friends.length > 0) {
                                                  const query = match[1].toLowerCase();
                                                  const matchedFriends = friends.filter(friend => 
                                                    friend.displayName.toLowerCase().includes(query) ||
                                                    (friend.username && friend.username.toLowerCase().includes(query))
                                                  );
                                                  if (matchedFriends.length > 0) {
                                                    return (
                                                      <div className="absolute left-0 bottom-full mb-1 w-48 bg-neutral-950 border border-emerald-500/30 shadow-xl rounded-xl p-1.5 z-30 max-h-24 overflow-y-auto space-y-0.5 text-left text-white">
                                                        {matchedFriends.map((friend) => {
                                                          const tagHandle = '@' + friend.displayName.replace(/[^a-zA-Z0-9]/g, '');
                                                          return (
                                                            <button
                                                              key={friend.id}
                                                              type="button"
                                                              onClick={() => {
                                                                setReplyText(prev => {
                                                                  const text = prev[comment.id] || '';
                                                                  return { ...prev, [comment.id]: text.replace(/@([a-zA-Z0-9_]*)$/, tagHandle + ' ') };
                                                                });
                                                              }}
                                                              className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-neutral-800 rounded-lg text-left text-white"
                                                            >
                                                              <img src={friend.avatar} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                                                              <span className="text-[9px] font-bold truncate text-white">{friend.displayName}</span>
                                                            </button>
                                                          );
                                                        })}
                                                      </div>
                                                    );
                                                  }
                                                }
                                                return null;
                                              })()}
                                            </div>

                                            <button 
                                              onClick={() => handleCommentReply(post.id, comment.id)}
                                              className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer"
                                            >
                                              Balas
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Threaded nested replies mapping */}
                                      {comment.replies && comment.replies.length > 0 && (
                                        <div className="ml-9 pl-3.5 border-l-2 border-slate-500/25 space-y-2">
                                          {comment.replies.map((reply) => {
                                            const isReplyNewlyAdded = reply.id === newlyAddedCommentId;
                                            return (
                                              <div 
                                                key={reply.id} 
                                                id={`reply-${reply.id}`}
                                                className={`flex gap-2 items-start text-[10px] p-2 rounded-xl border text-left transition-all ${
                                                  isReplyNewlyAdded
                                                    ? 'animate-blink-custom border-emerald-500 ring-1 ring-emerald-400 max-w-full duration-1000'
                                                    : 'bg-slate-50 dark:bg-neutral-950/60 border-neutral-100 dark:border-neutral-900'
                                                }`}
                                              >
                                                <img src={reply.userAvatar} alt={reply.userName} className="h-5 w-5 rounded-full object-cover shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex justify-between items-baseline mb-0.5">
                                                    <span className={`font-extrabold ${isReplyNewlyAdded ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                                      {reply.userName}
                                                      {isReplyNewlyAdded && (
                                                        <span className="ml-1 text-[7px] bg-emerald-500 text-white font-extrabold px-1 py-0.2 rounded-full animate-pulse select-none">
                                                          Komentar Baru
                                                        </span>
                                                      )}
                                                    </span>
                                                    <span className="text-[7.5px] text-slate-400">{reply.createdAt}</span>
                                                  </div>
                                                  <p className="text-[10px] leading-relaxed text-gray-900 dark:text-neutral-100 font-medium break-words font-sans">
                                                    {renderFormattedContent(reply.content)}
                                                  </p>
                                                  {/* Display reply image with custom lightbox integration */}
                                                  {reply.image && (
                                                    <div className="mt-2 rounded-lg overflow-hidden max-h-28 border border-neutral-200 dark:border-neutral-800 bg-neutral-950/40">
                                                      <img 
                                                        src={reply.image} 
                                                        alt="Komentar Foto" 
                                                        className="max-w-[70%] object-cover cursor-pointer hover:opacity-95" 
                                                        onClick={() => {
                                                          setLightboxImages([reply.image!]);
                                                          setLightboxIndex(0);
                                                          setLightboxSrc(reply.image!);
                                                        }}
                                                      />
                                                    </div>
                                                  )}

                                                  {/* Action trigger to reply to this nested comment */}
                                                  <div className="flex gap-2 mt-1.5 text-[8.5px] font-extrabold text-slate-450 dark:text-neutral-500 select-none">
                                                    <button 
                                                      type="button"
                                                      onClick={() => {
                                                        setReplyingToCommentId(comment.id);
                                                        const tagText = `@${reply.userName.replace(/[^a-zA-Z0-9]/g, '')} `;
                                                        setReplyText(prev => ({ ...prev, [comment.id]: tagText }));
                                                        setTimeout(() => {
                                                          const el = document.getElementById(`reply-input-${comment.id}`);
                                                          if (el) el.focus();
                                                        }, 100);
                                                      }}
                                                      className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                                                    >
                                                      💬 Balas Komentar
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

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

                            {/* Comment Tag Friend Selector */}
                            {showCommentTagBoxForPost === post.id && friends && friends.length > 0 && (
                              <div className="p-2 bg-blue-50/50 dark:bg-neutral-900/60 rounded-xl border border-blue-200 dark:border-neutral-800/80 flex flex-wrap gap-1.5 animate-slide-in">
                                <span className="text-[9px] font-extrabold text-blue-700 dark:text-blue-400 uppercase block w-full text-left">Tandai rekan di komentar:</span>
                                {friends.map(friend => {
                                  const tagHandle = '@' + friend.displayName.replace(/[^a-zA-Z0-9]/g, '');
                                  return (
                                    <button
                                      key={friend.id}
                                      onClick={() => {
                                        setNewCommentText(prev => {
                                          const text = prev[post.id] || '';
                                          const spacing = text.length > 0 && !text.endsWith(' ') ? ' ' : '';
                                          return { ...prev, [post.id]: text + spacing + tagHandle + ' ' };
                                        });
                                        setShowCommentTagBoxForPost(null);
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-[9px] font-bold text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                    >
                                      <img src={friend.avatar} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                                      <span>{friend.displayName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                              <div className="flex gap-1.5 items-center shrink-0">
                                {/* Attach image trigger */}
                                <label className="p-2 bg-gray-100 hover:bg-gray-155 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-455 rounded-xl cursor-pointer transition-all shrink-0">
                                  <ImageIcon className="h-4 w-4 text-emerald-500 sm:h-4.5 sm:w-4.5" />
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        compressImage(file)
                                          .then(base64 => {
                                            setNewCommentImage(prev => ({ ...prev, [post.id]: base64 }));
                                          })
                                          .catch(err => console.error("Comment photo compression error:", err));
                                      }
                                    }}
                                  />
                                </label>

                                {/* Emoji toggle */}
                                <button
                                  onClick={() => setActiveCommentEmojiBoxId(activeCommentEmojiBoxId === post.id ? null : post.id)}
                                  className="p-2 bg-gray-100 hover:bg-gray-155 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-455 rounded-xl cursor-pointer transition-all shrink-0"
                                >
                                  <Smile className="h-4 w-4 text-amber-500 sm:h-4.5 sm:w-4.5" />
                                </button>

                                {/* Friend tag picker toggle */}
                                {friends && friends.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setShowCommentTagBoxForPost(showCommentTagBoxForPost === post.id ? null : post.id)}
                                    className={`p-2 rounded-xl cursor-pointer transition-all shrink-0 ${
                                      showCommentTagBoxForPost === post.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-gray-100 dark:bg-neutral-850 hover:bg-gray-155 text-blue-500'
                                    }`}
                                    title="Tandai Rekan"
                                  >
                                    🏷️
                                  </button>
                                )}
                              </div>

                              <div className="relative flex-1 min-w-[120px]">
                                <input
                                  id={`comment-input-${post.id}`}
                                  type="text"
                                  placeholder="Tulis opini terbaik Anda... ketik @ untuk tag"
                                  value={newCommentText[post.id] || ''}
                                  onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCommentPost(post.id);
                                  }}
                                  className="w-full bg-white rounded-xl px-4 py-2 border border-gray-200 text-xs focus:ring-1 focus:ring-emerald-500 text-gray-950 focus:outline-hidden placeholder-gray-500 font-medium"
                                />
                                {/* Main comment dropdown suggestions popup */}
                                {(() => {
                                  const currentText = newCommentText[post.id] || '';
                                  const match = currentText.match(/@([a-zA-Z0-9_]*)$/);
                                  if (match && friends && friends.length > 0) {
                                    const query = match[1].toLowerCase();
                                    const matchedFriends = friends.filter(friend => 
                                      friend.displayName.toLowerCase().includes(query) ||
                                      (friend.username && friend.username.toLowerCase().includes(query))
                                    );
                                    if (matchedFriends.length > 0) {
                                      return (
                                        <div className="absolute left-0 bottom-full mb-1 w-52 bg-white/95 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-20 max-h-32 overflow-y-auto space-y-0.5 text-left">
                                          <p className="text-[8px] font-extrabold text-blue-600 uppercase pb-1 border-b border-gray-100">💡 Klik rekan untuk menandai:</p>
                                          {matchedFriends.map((friend) => {
                                            const tagHandle = '@' + friend.displayName.replace(/[^a-zA-Z0-9]/g, '');
                                            return (
                                              <button
                                                key={friend.id}
                                                type="button"
                                                onClick={() => {
                                                  setNewCommentText(prev => {
                                                    const text = prev[post.id] || '';
                                                    return { ...prev, [post.id]: text.replace(/@([a-zA-Z0-9_]*)$/, tagHandle + ' ') };
                                                  });
                                                }}
                                                className="w-full flex items-center gap-1.5 px-2 py-1 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg text-left"
                                              >
                                                <img src={friend.avatar} className="w-4 h-4 rounded-full object-cover shrink-0" />
                                                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100 truncate">{friend.displayName}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      );
                                    }
                                  }
                                  return null;
                                })()}
                              </div>
                              <button
                                onClick={() => handleCommentPost(post.id)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
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
                      Pasang iklan gratis produk lokasimu dengan deskripsi lengkap sekarang di IdKanca.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSellModal(true)}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-650 text-white font-extrabold text-[#cbd5e1] text-xs rounded-xl shadow-xs shrink-0 cursor-pointer transition-colors border border-slate-600"
                  >
                    Mulai Berjualan (Pasang Iklan)
                  </button>
                </div>

                {/* Toggles and stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-neutral-800 pb-3">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setMarketViewMode('all')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider relative transition-all cursor-pointer ${
                        marketViewMode === 'all' 
                          ? 'text-emerald-500 border-b-2 border-emerald-500 font-bold' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      🛍️ Jelajah Pasar
                    </button>
                    <button 
                      onClick={() => setMarketViewMode('my')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider relative transition-all cursor-pointer ${
                        marketViewMode === 'my' 
                          ? 'text-emerald-500 border-b-2 border-emerald-500 font-bold' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      📋 Iklan Saya ({marketplaceItems.filter(i => i.sellerId === currentUser.id).length})
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowSellModal(true)}
                      className="text-[10.5px] bg-slate-700 hover:bg-slate-650 text-[#cbd5e1] border border-slate-600 font-extrabold px-3.5 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      + Pasang Iklan Baru
                    </button>
                  </div>
                </div>

                {/* --- MARKET MODE: ALL --- */}
                {marketViewMode === 'all' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Search box & Category tabs */}
                    <div className="space-y-3.5 text-left bg-white dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 p-4 rounded-3xl shadow-xs">
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-900 dark:text-white block mb-1.5">Kategori Produk</span>
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

                      {/* Grid layout for search by city and price filters */}
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
                        {/* Cari Kata Kunci */}
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-black uppercase text-gray-900 dark:text-white">Cari Kata Kunci</label>
                          <input 
                            type="text"
                            placeholder="Nama barang / kata kunci..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-150 dark:border-neutral-800 bg-gray-55 dark:bg-neutral-950 text-gray-900 dark:text-white placeholder-gray-500 font-medium"
                          />
                        </div>

                        {/* Filter Kota */}
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-black uppercase text-gray-900 dark:text-white">Kabupaten / Kota</label>
                          <input 
                            type="text"
                            placeholder="Nama Kota (e.g. Jakarta, Sleman)..."
                            value={marketFilterCity}
                            onChange={(e) => setMarketFilterCity(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-150 dark:border-neutral-800 bg-gray-55 dark:bg-neutral-950 text-gray-900 dark:text-white placeholder-gray-500 font-medium"
                          />
                        </div>

                        {/* Harga Terendah */}
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-black uppercase text-gray-900 dark:text-white">Harga Terendah</label>
                          <input 
                            type="number"
                            placeholder="Rp Min"
                            value={marketFilterMinPrice}
                            onChange={(e) => setMarketFilterMinPrice(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-150 dark:border-neutral-800 bg-gray-55 dark:bg-neutral-950 text-gray-900 dark:text-white placeholder-gray-500 font-medium"
                          />
                        </div>

                        {/* Harga Tertinggi */}
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-black uppercase text-gray-900 dark:text-white">Harga Tertinggi</label>
                          <input 
                            type="number"
                            placeholder="Rp Maks"
                            value={marketFilterMaxPrice}
                            onChange={(e) => setMarketFilterMaxPrice(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-150 dark:border-neutral-800 bg-gray-55 dark:bg-neutral-950 text-gray-900 dark:text-white placeholder-gray-500 font-medium"
                          />
                        </div>

                        {/* Actions button */}
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              setMarketFilterCity('');
                              setMarketFilterMinPrice('');
                              setMarketFilterMaxPrice('');
                              setSearchQuery('');
                              setActiveMarketCategory('Semua');
                            }}
                            className="w-full py-2.5 px-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-250 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
                          >
                            Hapus Filter 🔄
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Products list grid (Dynamic responsive side-by-side columns spanning full grid width) */}
                    <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                      {marketplaceItems
                        .filter(item => {
                          const matchCat = activeMarketCategory === 'Semua' || 
                            item.category.toLowerCase().includes((activeMarketCategory || 'Semua').toLowerCase().split(' ')[0]);
                          const matchSearch = !searchQuery || 
                            item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchCity = !marketFilterCity || 
                            item.location.toLowerCase().includes(marketFilterCity.toLowerCase());
                          
                          const minPrice = marketFilterMinPrice ? parseFloat(marketFilterMinPrice) : 0;
                          const maxPrice = marketFilterMaxPrice ? parseFloat(marketFilterMaxPrice) : Infinity;
                          const matchPrice = item.price >= minPrice && item.price <= maxPrice;

                          return matchCat && matchSearch && matchCity && matchPrice;
                        })
                        .map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setViewListingId(item.id)}
                            className="glass-aqua-card rounded-3xl overflow-hidden group hover:scale-[1.01] transition-all flex flex-col justify-between cursor-pointer text-left shadow-lg"
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
                                <span className="text-[9px] font-black text-white bg-slate-800 dark:bg-slate-900 border border-slate-700/60 uppercase tracking-widest px-2.5 py-0.5 rounded-md inline-block shadow-sm mb-1">{item.category}</span>
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
                                  {(item.location || "Indonesia").split(',')[0]}
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
                  </div>
                )}

                {/* --- MARKET MODE: MY LISTINGS --- */}
                {marketViewMode === 'my' && (() => {
                  const myListings = marketplaceItems.filter(item => item.sellerId === currentUser.id);
                  const selectedCount = selectedMyAds.length;
                  const isAllSelected = myListings.length > 0 && selectedCount === myListings.length;

                  return (
                    <div className="space-y-4 text-left animate-fade-in text-gray-900 dark:text-white">
                      {/* Stats and multi delete triggers */}
                      <div className="bg-gray-50 dark:bg-neutral-900/40 border border-gray-150 dark:border-neutral-800 p-4 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">Pengelola Iklan Mandiri 📋</h4>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                            Anda memiliki total <span className="font-extrabold text-emerald-500 text-sm">{myListings.length}</span> produk aktif tayang di regional Anda.
                          </p>
                        </div>
                        
                        {/* Multiple Delete / Selection toolbar */}
                        {myListings.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                            <button
                              onClick={() => {
                                if (isAllSelected) {
                                  setSelectedMyAds([]);
                                } else {
                                  setSelectedMyAds(myListings.map(l => l.id));
                                }
                              }}
                              className="px-3 py-1.5 border border-gray-200 dark:border-neutral-750 bg-white dark:bg-neutral-850 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              {isAllSelected ? 'Kosongkan Pilihan' : 'Pilih Semua'}
                            </button>
                            
                            <button
                              disabled={selectedCount === 0}
                              onClick={() => {
                                if (window.confirm(`Apakah Anda yakin ingin menghapus secara permanen ${selectedCount} iklan yang dipilih?`)) {
                                  handleDeleteMultipleListings(selectedMyAds);
                                }
                              }}
                              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 disabled:border-transparent text-white border border-rose-600 text-[11px] font-black rounded-xl cursor-pointer transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg inline-flex items-center gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Hapus Terpilih ({selectedCount})
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Listings list or empty state */}
                      {myListings.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 p-10 rounded-3xl text-center space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center text-neutral-400">
                            <FolderOpen className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Belum Ada Iklan Tayang</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                              Dapatkan pelanggan regional sekitarmu dengan mengunggah dan mengiklankan jualan UMKM milikmu sekarang juga gratis!
                            </p>
                          </div>
                          <button
                            onClick={() => setShowSellModal(true)}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-extrabold text-[#f1f5f9] text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
                          >
                            + Mulai Pasang Iklan Sekarang
                          </button>
                        </div>
                      ) : (
                        /* Listings visual list stack */
                        <div className="space-y-2.5">
                          {myListings.map((item) => {
                            const isSelected = selectedMyAds.includes(item.id);
                            return (
                              <div 
                                key={item.id}
                                className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                  isSelected 
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/60 shadow-md' 
                                    : 'bg-white dark:bg-neutral-900/40 border-neutral-200/50 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                                }`}
                              >
                                {/* Checkbox, photo preview and basic identifiers */}
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      setSelectedMyAds(prev => 
                                        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                                      );
                                    }}
                                    className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-400 border-gray-300 shrink-0 cursor-pointer accent-emerald-500"
                                  />
                                  
                                  <div 
                                    onClick={() => setViewListingId(item.id)}
                                    className="h-14 w-14 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-gray-150/60 dark:border-neutral-800 cursor-pointer"
                                  >
                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                  </div>
                                  
                                  <div className="min-w-0 text-left">
                                    <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm">
                                      {item.category}
                                    </span>
                                    <h4 
                                      onClick={() => setViewListingId(item.id)}
                                      className="font-bold text-xs text-gray-900 dark:text-white truncate mt-1 cursor-pointer hover:text-emerald-500 transition-colors"
                                    >
                                      {item.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-450">
                                        {formatRupiah(item.price)}
                                      </span>
                                      <span className="text-[8.5px] font-black uppercase text-gray-400 bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-sm">
                                        {item.condition}
                                      </span>
                                      {item.isSold && (
                                        <span className="text-[8.5px] font-black text-rose-500 bg-rose-55 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-sm">
                                          HABIS
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Manage action buttons for this individual listing */}
                                <div className="flex items-center gap-2 justify-end w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-neutral-800">
                                  <button
                                    onClick={() => setViewListingId(item.id)}
                                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-700 dark:text-gray-300 font-extrabold text-[11px] rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                                  >
                                    <Edit2 className="h-3 w-3 text-amber-500" />
                                    Lihat / Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Apakah Anda yakin ingin menghapus iklan dagangan ini secara permanen?')) {
                                        handleDeleteListing(item.id);
                                      }
                                    }}
                                    className="p-1.5 bg-rose-650/10 hover:bg-rose-550/20 text-rose-500 border border-rose-500/20 rounded-xl cursor-pointer transition-all"
                                    title="Hapus Iklan"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Immersion Lightbox Modal detail popup overlay */}
                {viewListingId && (() => {
                  const targetProduct = marketplaceItems.find(i => i.id === viewListingId);
                  return targetProduct ? (
                    <MarketplaceDetail
                      item={targetProduct}
                      currentUser={currentUser}
                      onClose={() => setViewListingId(null)}
                      onContactSeller={handleContactSeller}
                      onDeleteListing={handleDeleteListing}
                      onEditListing={handleEditListing}
                      onTriggerLightbox={(images, index) => {
                        setLightboxImages(images);
                        setLightboxIndex(index);
                        setLightboxSrc(images[index]);
                      }}
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
                onDeleteFriend={handleDeleteFriend}
                onRenameFriend={handleRenameFriend}
                onViewProfile={(userId) => {
                  setViewingProfileUserId(userId);
                  setActiveTab('profile');
                }}
              />
            )}

            {/* --- TAB: ADMIN PANEL --- */}
            {activeTab === 'admin' && (
              <div className="space-y-6 animate-fade-in text-left">
                {/* Silver / White Heading */}
                <div className="p-6 rounded-3xl bg-slate-800 dark:bg-slate-900 border border-slate-700 text-[#cbd5e1] space-y-1">
                  <span className="bg-amber-500 text-black font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest w-fit">
                    ADMIN MASTER CONSOLE
                  </span>
                  <h2 className="text-xl font-black text-[#f1f5f9]">⚙️ Panel Kontrol Admin Khusus</h2>
                  <p className="text-xs text-slate-400">
                    Gunakan panel ini untuk mengontrol konten halaman utama, mode pemeliharaan, jumlah anggota aktif, dan marquee pengumuman di website IdKanca.
                  </p>
                </div>

                {/* SYSTEM WIPE & INITIALIZATION RECOVERY */}
                <div className="p-6 bg-red-500/10 dark:bg-red-950/10 border border-red-500/25 rounded-3xl space-y-3.5 text-left">
                  <div>
                    <span className="bg-red-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest w-fit mb-1 inline-block">
                      🚨 DATABASE MAINTENANCE & FLUSH
                    </span>
                    <h3 className="text-sm font-black text-red-500 uppercase tracking-wider">
                      Pembersihan Total Riwayat Simulasi & Data Mock (Sesuai Regulasi Admin)
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-neutral-300 mt-1 leading-relaxed">
                      Klik tombol di bawah untuk menghapus seluruh user simulasi, riwayat postingan feed, barang jualan pasar, log pesanan, chat, pertemanan, dan notifikasi yang dilarang/tidak terpakai di sistem database ini. Sesi login akan dikosongkan agar Anda dapat menguji pendaftaran (registrasi) akun baru dari nol secara bersih dan aman.
                    </p>
                  </div>
                  <button
                    onClick={handleWipeAllSimulationData}
                    disabled={isWipingDatabase}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors border border-red-500/40"
                  >
                    {isWipingDatabase ? 'Sedang Membersihkan...' : '🧹 Bersihkan Semua Riwayat Simulasi & Reset Website ✓'}
                  </button>
                </div>

                {/* Grid Status Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs text-left">
                    <span className="text-[10px] uppercase font-black text-gray-400">Total User Terdaftar</span>
                    <p className="text-2xl font-black text-blue-500 mt-1">{adminTotalUsers}</p>
                    <p className="text-[9px] text-gray-500 mt-1">Status: Sinkron Terkendali</p>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs text-left">
                    <span className="text-[10px] uppercase font-black text-gray-400">Total Iklan Pasar</span>
                    <p className="text-2xl font-black text-emerald-500 mt-1">{marketplaceItems.length}</p>
                    <p className="text-[9px] text-gray-500 mt-1">Status: {marketplaceItems.filter(i => !i.isSold).length} Aktif</p>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs text-left">
                    <span className="text-[10px] uppercase font-black text-gray-400">Jumlah Postingan</span>
                    <p className="text-2xl font-black text-purple-500 mt-1">{posts.length}</p>
                    <p className="text-[9px] text-gray-500 mt-1">Total Interaksi Komentar</p>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-850 rounded-2xl shadow-xs text-left">
                    <span className="text-[10px] uppercase font-black text-gray-400 font-bold">Node Cluster</span>
                    <p className="text-2xl font-black text-rose-500 mt-1">3 Active</p>
                    <p className="text-[9px] text-gray-500 mt-1">Lembaga Satgas Siber</p>
                  </div>
                </div>

                {/* Left Form: Toggles and URL changer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left card */}
                  <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xs space-y-5 text-left">
                    <h3 className="text-xs font-black text-gray-850 dark:text-white uppercase tracking-widest border-b border-neutral-205 dark:border-neutral-800 pb-2">
                      Pengaturan Header & Banner Utama
                    </h3>

                    {/* Banner URL changer */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">URL Gambar Banner Utama</label>
                      <input 
                        type="text"
                        value={homepageBannerUrl}
                        onChange={(e) => setHomepageBannerUrl(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    {/* Suggest Banner Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Preset Banner Rekomendasi</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'Kemitraan UMKM', url: 'https://images.unsplash.com/photo-1542744094-2ab25be78b90?w=1000&auto=format&fit=crop&q=80' },
                          { name: 'Gudang Ekspor', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80' },
                          { name: 'Pasar Rakyat', url: 'https://images.unsplash.com/photo-1543083505-ac1f504caeb1?w=1000&auto=format&fit=crop&q=80' },
                          { name: 'Teknologi Digital', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&auto=format&fit=crop&q=80' }
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => setHomepageBannerUrl(p.url)}
                            className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[10px] text-gray-750 dark:text-gray-300 font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total user controller */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Total Pengguna Komunitas ({adminTotalUsers} Orang)</label>
                      <input 
                        type="range"
                        min="50"
                        max="10000"
                        value={adminTotalUsers}
                        onChange={(e) => setAdminTotalUsers(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[9px] text-gray-500">
                        <span>Min: 50</span>
                        <span>Max: 10,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Right card */}
                  <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xs space-y-5 text-left">
                    <h3 className="text-xs font-black text-gray-850 dark:text-white uppercase tracking-widest border-b border-neutral-205 dark:border-neutral-800 pb-2">
                      Maintenance & Banner Pengumuman
                    </h3>

                    {/* Maintenance toggle switch */}
                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 rounded-2xl">
                      <div className="space-y-0.5 text-left">
                        <span className="text-xs font-black text-gray-850 dark:text-white block">Situs Under Maintenance?</span>
                        <span className="text-[10px] text-gray-500 leading-relaxed block">
                          Jika diaktifkan, seluruh pengguna non-admin akan dialihkan ke layar pemeliharaan sistem.
                        </span>
                      </div>
                      <button
                        onClick={() => setIsUnderMaintenance(!isUnderMaintenance)}
                        className={`w-12 h-6.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                          isUnderMaintenance ? 'bg-amber-500' : 'bg-gray-350 dark:bg-neutral-800'
                        }`}
                      >
                        <div
                          className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                            isUnderMaintenance ? 'translate-x-5.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Marquee Text Notice configuration */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Marquee Pemberitahuan Footer (Halaman Utama)</label>
                      <textarea
                        rows={3}
                        value={adminMarqueeText}
                        onChange={(e) => setAdminMarqueeText(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white font-medium resize-none"
                        placeholder="📢 Ketik teks pengumuman berjalan anda..."
                      />
                    </div>

                    <button
                      onClick={() => {
                        alert('✓ Seluruh konfigurasi sistem berhasil disimpan!');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-xs rounded-xl shadow-xs cursor-pointer text-center"
                    >
                      Terapkan Perubahan Sistem ✓
                    </button>
                  </div>

                  {/* Dynamic Custom Welcome Page, Text Content & Logo Branding Panel */}
                  <div className="md:col-span-2 p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xs space-y-6 text-left">
                    <div>
                      <span className="bg-[#10b981] text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest w-fit mb-1.5 inline-block">
                        BRANDING & UTAMA CUSTOMIZATION
                      </span>
                      <h3 className="text-sm font-black text-gray-850 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-neutral-800">
                        Edit Logo & Tampilan Utama Halaman Login 1-Klik
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Satu pintu modifikasi branding. Saat logo diganti di sini, logo di halaman depan (Sign Up), halaman login, serta navigasi atas (Header) akan otomatis terupdate se-Indonesia!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Left: Custom App Logo branding upload */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-widest">
                          1. Atur Logo iB (Universal Branding)
                        </h4>

                        <div className="p-4 bg-gray-50 dark:bg-neutral-950 border border-gray-200/50 dark:border-neutral-850 rounded-2xl flex items-center gap-4">
                          <div className="shrink-0">
                            {customLogoUrl ? (
                              <div className="relative group">
                                <img 
                                  src={customLogoUrl} 
                                  alt="Logo Preview" 
                                  className="h-16 w-16 rounded-2xl object-cover border border-white/10 ring-4 ring-emerald-500/20" 
                                />
                                <button
                                  onClick={() => setCustomLogoUrl('')}
                                  className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md cursor-pointer"
                                  title="Reset Logo Default"
                                >
                                  ❌
                                </button>
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                iB
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-extrabold text-gray-400 block">Status Logo</span>
                            <p className="text-xs font-bold text-gray-850 dark:text-neutral-200">
                              {customLogoUrl ? '✓ Logo Kustom Aktif' : 'iB Default Logo'}
                            </p>
                            <p className="text-[9px] text-gray-550 leading-relaxed block">
                              Diterapkan otomatis ke seluruh component navigasi atas, footer, & profil.
                            </p>
                          </div>
                        </div>

                        {/* File Upload Trigger */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Upload Logo Baru (PNG/JPG):</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                compressImage(file)
                                  .then(setCustomLogoUrl)
                                  .catch(err => console.error("Admin logo compression failed:", err));
                              }
                            }}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                          />
                        </div>

                        {/* Paste Logo URL Option */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Atau Paste URL Gambar Logo Kustom:</label>
                          <input 
                            type="text"
                            value={customLogoUrl}
                            onChange={(e) => setCustomLogoUrl(e.target.value)}
                            placeholder="Contoh: https://i.imgur.com/your-logo.png"
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Right: Custom Welcome page text parameters */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-teal-500 uppercase tracking-widest">
                          2. Edit Informasi Halaman Depan (Login Card)
                        </h4>

                        {/* Judul Utama */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Judul Halaman Depan</label>
                          <input 
                            type="text"
                            value={loginTitle}
                            onChange={(e) => setLoginTitle(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white font-bold"
                          />
                        </div>

                        {/* Anak Judul / Deskripsi */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Deskripsi Pendek</label>
                          <textarea 
                            rows={2}
                            value={loginSubtitle}
                            onChange={(e) => setLoginSubtitle(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white resize-none leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* One-tap Header Title */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-gray-400 block">Badge Banner Google</label>
                            <input 
                              type="text"
                              value={loginOneTapTitle}
                              onChange={(e) => setLoginOneTapTitle(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white"
                            />
                          </div>

                          {/* Welcome page background selector */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-gray-400 block">Background (URL / Warna)</label>
                            <input 
                              type="text"
                              value={loginPageBg}
                              onChange={(e) => setLoginPageBg(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white font-mono"
                              placeholder="#0b0f19 atau URL"
                            />
                          </div>
                        </div>

                        {/* One-tap Desc */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black text-gray-400 block">Keterangan Sub Google One-Tap</label>
                          <textarea 
                            rows={2}
                            value={loginOneTapDesc}
                            onChange={(e) => setLoginOneTapDesc(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-gray-950 dark:text-white resize-none leading-relaxed"
                          />
                        </div>

                        {/* Presets backgrounds */}
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-gray-405 block">Pintas Preset Tema Background Halaman Login:</label>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: 'Obsidian Night 🖤', value: '#0b0f19' },
                              { label: 'Sinergi Ruko 🏡', value: 'https://images.unsplash.com/photo-1542744094-2ab25be78b90?w=1000' },
                              { label: 'Starlight Sky 🌌', value: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000' },
                              { label: 'Emerald Deep 💚', value: '#022c22' }
                            ].map((preset, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => setLoginPageBg(preset.value)}
                                className="px-2 py-1 text-[9px] font-extrabold bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-700 dark:text-neutral-350 rounded-lg cursor-pointer transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 flex justify-end">
                      <button
                        onClick={() => {
                          alert('✓ Seluruh branding kustom logo & teks welcome page utama berhasil diaktifkan secara dinamis se-Indonesia! Silakan Logout untuk melihat perubahannya.');
                        }}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                      >
                        Simpan Visual Branding Utama ✓
                      </button>
                    </div>
                  </div>

                  {/* --- NEW SECTION: 🛡️ PARENTAL CONTROL & SENSOR KATA KASAR --- */}
                  <div className="md:col-span-2 p-6 bg-white border border-neutral-200 rounded-3xl shadow-xs space-y-4 text-left">
                    <div>
                      <span className="bg-red-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest w-fit mb-1.5 inline-block">
                        🛡️ PARENTAL CONTROL SECURITY
                      </span>
                      <h3 className="text-sm font-black text-black uppercase tracking-wider pb-2 border-b border-gray-250">
                        Saringan Sensor Moral & Parental Control
                      </h3>
                      <p className="text-xs text-black mt-1 leading-relaxed">
                        Ketikkan kata-kata yang ingin Anda sensor pada postingan, komentar, dan chat di sistem IdKanca (pisahkan kata menggunakan koma). Seluruh kata yang terdaftar di textbox di bawah akan otomatis diganti menjadi tanda bintang (*) demi kenyamanan ramah anak (Parental Control).
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-black text-black block">Daftar Kata Kasar & Blokir:</label>
                      <textarea
                        rows={3}
                        value={bannedWords}
                        onChange={(e) => setBannedWords(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl bg-neutral-100 border-2 border-neutral-300 font-mono tracking-wide placeholder-gray-500 focus:outline-hidden focus:border-red-500 text-black font-extrabold"
                        placeholder="Contoh: kata1, kata2, asu, anjing..."
                      />
                      <span className="text-[9px] text-black font-bold italic block leading-relaxed">
                        * Catatan: Warna latar belakang textbox di atas diatur solid Abu-Abu (Grey) sesuai regulasi estetika instrumen Parental Control keamanan admin.
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          localStorage.setItem('idkanca_banned_words', bannedWords);
                          alert('✓ Daftar kata sensor Parental Control berhasil diperbarui dan diterapkan ke seluruh sistem!');
                        }}
                        className="px-6 py-2 bg-black hover:bg-neutral-900 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors border border-neutral-700"
                      >
                        Terapkan Sensor Parental Control ✓
                      </button>
                    </div>
                  </div>

                  {/* --- NEW SECTION: 👥 DAFTAR ANGGOTA TERREGISTRASI & LOCK ACCOUNT SYSTEM --- */}
                  <div className="md:col-span-2 p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xs space-y-4 text-left">
                    <div>
                      <span className="bg-blue-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest w-fit mb-1.5 inline-block">
                        👥 REGISTERED MEMBER DIRECTORY
                      </span>
                      <h3 className="text-sm font-black text-gray-850 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-neutral-800">
                        Manajemen Anggota Komunitas Terdaftar ({registeredUsers.length} Terdaftar)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Kelola seluruh akun pengguna terdaftar yang mendaftar ke sistem database. Admin dapat mengubah password pengguna secara instan atau melakukan status penguncian peninjauan (Account Lock under review) demi keamanan platform.
                      </p>
                    </div>

                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs font-semibold text-left text-neutral-500 dark:text-neutral-400">
                        <thead className="bg-neutral-50 dark:bg-neutral-955 text-neutral-400 uppercase text-[9px] tracking-widest">
                          <tr>
                            <th className="p-3">Nama & Username</th>
                            <th className="p-3">Email Terdaftar</th>
                            <th className="p-3 text-center">Status Akun</th>
                            <th className="p-3">Sandi Baru</th>
                            <th className="p-3 text-right">Aksi Moderasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                          {registeredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-gray-400">
                                Belum ada user terdaftar di database.
                              </td>
                            </tr>
                          ) : (
                            registeredUsers.map((user) => {
                              return (
                                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/20 transition-colors">
                                  <td className="p-3 flex items-center gap-3">
                                    <img 
                                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} 
                                      className="h-8 w-8 rounded-full border border-neutral-350 dark:border-neutral-800 object-cover shrink-0" 
                                      alt="Avatar" 
                                    />
                                    <div className="font-sans">
                                      <p className="font-extrabold text-neutral-800 dark:text-neutral-100 text-xs leading-none">
                                        {user.displayName || 'Unnamed User'}
                                      </p>
                                      <p className="font-mono text-[9px] text-gray-500 mt-1 text-left">
                                        @{user.username || user.id}
                                      </p>
                                    </div>
                                  </td>
                                  
                                  <td className="p-3 font-mono text-[10px] text-neutral-700 dark:text-neutral-300">
                                    {user.email || 'tanpa_email@domain.com'}
                                  </td>
                                  
                                  <td className="p-3 text-center">
                                    {user.isLocked ? (
                                      <span className="inline-block px-2.5 py-1 text-[8.5px] font-extrabold text-red-500 bg-red-500/10 border border-red-500/25 rounded-md uppercase tracking-wider animate-pulse">
                                        🔴 Dikunci (Review)
                                      </span>
                                    ) : (
                                      <span className="inline-block px-2.5 py-1 text-[8.5px] font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 rounded-md uppercase tracking-wider">
                                        🟢 Terverifikasi
                                      </span>
                                    )}
                                  </td>

                                  <td className="p-3">
                                    <div className="flex gap-1.5 items-center">
                                      <input 
                                        type="text"
                                        id={`pwd-admin-${user.id}`}
                                        placeholder="Sandi..."
                                        className="w-20 font-bold p-1.5 bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-white rounded border border-neutral-300 dark:border-neutral-800 text-[10px] focus:outline-hidden focus:border-blue-500"
                                      />
                                      <button
                                        onClick={() => {
                                          const el = document.getElementById(`pwd-admin-${user.id}`) as HTMLInputElement;
                                          if (!el || !el.value.trim()) {
                                            alert('Harap ketik sandi baru terlebih dahulu!');
                                            return;
                                          }
                                          const newPwd = el.value.trim();
                                          if (newPwd.length < 6) {
                                            alert('Sandi baru harus minimal 6 karakter!');
                                            return;
                                          }
                                          
                                          const updatedUser = { ...user, password: newPwd };
                                          // Local state update
                                          setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
                                          
                                          if (isFirebaseAuthed) {
                                            handleSetDoc('users', user.id, updatedUser).then(() => {
                                              alert(`✓ Password untuk user @${user.username} berhasil diubah secara permanen!`);
                                              el.value = '';
                                            }).catch((err) => {
                                              console.warn("Could not save user password update:", err);
                                            });
                                          } else {
                                            alert(`✓ Password untuk user @${user.username} berhasil diubah secara lokal!`);
                                            el.value = '';
                                          }
                                        }}
                                        title="Simpan Sandi Baru"
                                        className="p-1 px-2.5 text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer shrink-0 transition-colors"
                                      >
                                        Ubah
                                      </button>
                                    </div>
                                  </td>

                                  <td className="p-3 text-right">
                                    <button
                                      onClick={() => {
                                        const nextLock = !user.isLocked;
                                        const updatedUser = { ...user, isLocked: nextLock };
                                        
                                        // Update local representation
                                        setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
                                        
                                        if (isFirebaseAuthed) {
                                          handleSetDoc('users', user.id, updatedUser).then(() => {
                                            alert(`✓ Akun @${user.username} berhasil ${nextLock ? 'DIKUNCI (UNDER REVIEW)' : 'DIBUKA KUNCI'}!`);
                                          }).catch((err) => {
                                            console.warn("Could not save user lock state:", err);
                                          });
                                        } else {
                                          alert(`✓ Akun @${user.username} berhasil ${nextLock ? 'DIKUNCI (UNDER REVIEW)' : 'DIBUKA KUNCI'} secara lokal!`);
                                        }
                                      }}
                                      className={`px-3 py-1.5 font-bold text-[10px] rounded-lg cursor-pointer transition-colors ${
                                        user.isLocked 
                                          ? 'bg-emerald-500 hover:bg-emerald-600 text-black' 
                                          : 'bg-red-500/15 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20'
                                      }`}
                                    >
                                      {user.isLocked ? '🔓 Lepas Kunci' : '🔒 Kunci Akun'}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB: PROFILE SETTINGS SYNC --- */}
            {activeTab === 'profile' && (() => {
              const getProfileUser = (userId: string | null): User => {
                if (!userId || userId === currentUser.id) return currentUser;
                const matchedUser = combinedUserDirectory.find(u => u.id === userId);
                if (matchedUser) return matchedUser;
                const friend = friends.find(f => f.id === userId);
                if (friend) {
                  return {
                    id: friend.id,
                    username: friend.displayName.toLowerCase().replace(/\s+/g, '_'),
                    displayName: friend.displayName,
                    avatar: friend.avatar,
                    banner: 'https://images.unsplash.com/photo-1618011500743-7f9a42d9410a?w=1200',
                    bannerPosition: 50,
                    bio: `Halo, saya ${friend.displayName}. Senang berteman dengan Anda di Portal Hubungan idkanca Indonesia! Mari berkolaborasi mengembangkan produk daerah unggulan dan berdiskusi aman secara terdistribusi di sini.`,
                    location: 'Indonesia',
                    joinedDate: 'Mei 2024',
                    followersCount: 142
                  };
                }
                const reqItem = friendRequests.find(r => r.senderId === userId);
                if (reqItem) {
                  return {
                    id: reqItem.senderId,
                    username: reqItem.senderName.toLowerCase().replace(/\s+/g, '_'),
                    displayName: reqItem.senderName,
                    avatar: reqItem.senderAvatar,
                    banner: 'https://images.unsplash.com/photo-1618011500743-7f9a42d9410a?w=1200',
                    bannerPosition: 50,
                    bio: `Halo, saya ${reqItem.senderName}. Senang berteman dengan Anda di Portal Hubungan idkanca Indonesia! Mari berkolaborasi mengembangkan produk daerah unggulan dan berdiskusi aman secara terdistribusi di sini.`,
                    location: 'Indonesia',
                    joinedDate: 'Mei 2024',
                    followersCount: 88
                  };
                }
                return currentUser;
              };

              return (
                <ProfileEditTab
                  currentUser={currentUser}
                  onUpdateUser={setCurrentUser}
                  viewedUser={viewingProfileUserId ? getProfileUser(viewingProfileUserId) : undefined}
                  onStartChat={(userId) => {
                    setActiveChatFriendId(userId);
                    setActiveTab('chat');
                  }}
                  onBackToMyProfile={() => setViewingProfileUserId(null)}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              );
            })()}

          </main>

        </div>
      </div>

      {/* MOBILE DRAWER SIDE MENU OVERLAY */}
      <div className="lg:hidden">
        <Sidebar
          currentUser={currentUser}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogoutFlow}
          language={language}
        />
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
        friends={friends}
        isOpen={createPostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />

      {/* --- SELL PRODUCT MODAL FOR PASANG IKLAN MALAH --- */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShoppingBag className="h-4.5 w-4.5 text-blue-600" />
                Pasang Dagangan Baru
              </h3>
              <button 
                onClick={() => {
                  setShowSellModal(false);
                  setNewMarketUploadedImages([]);
                }} 
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400"
              >
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
                  className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs text-gray-900 bg-white dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Harga (Rupiah Rp):</label>
                  <input 
                    type="text"
                    value={newMarketPrice ? parseInt(newMarketPrice.replace(/\D/g, ''), 10).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      // Allow only numbers
                      const digits = e.target.value.replace(/\D/g, '');
                      setNewMarketPrice(digits);
                    }}
                    placeholder="Contoh: 3.500.000"
                    className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs text-gray-900 bg-white dark:bg-neutral-900 dark:text-white font-extrabold text-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Kategori:</label>
                  <select 
                    value={newMarketCategory}
                    onChange={(e) => setNewMarketCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs text-gray-900 bg-white dark:bg-neutral-900 dark:text-white"
                  >
                    {ENRICHED_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Kondisi Barang:</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <input 
                      type="radio" 
                      checked={newMarketCondition === 'Baru'} 
                      onChange={() => setNewMarketCondition('Baru')} 
                      className="accent-blue-600" 
                    />
                    Baru (Segel / New in Box)
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <input 
                      type="radio" 
                      checked={newMarketCondition === 'Bekas'} 
                      onChange={() => setNewMarketCondition('Bekas')} 
                      className="accent-blue-600" 
                    />
                    Bekas (Seken / Pernah Pakai)
                  </label>
                </div>
              </div>

              {/* DYNAMIC REGIONAL LOCATION OPTION (PROVINSI > KABUPATEN/KOTA) */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 dark:bg-neutral-950/40 rounded-2xl border border-neutral-150 dark:border-neutral-800">
                <div className="col-span-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Lokasi Penjualan (Indonesia)</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Pilih Provinsi:</label>
                  <select 
                    value={marketProvinsi}
                    onChange={(e) => {
                      const prov = e.target.value;
                      setMarketProvinsi(prov);
                      const match = INDONESIA_REGIONS.find(r => r.provinsi === prov);
                      if (match && match.kabupatens.length > 0) {
                        setMarketKabupaten(match.kabupatens[0]);
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-neutral-800 text-xs text-gray-900 bg-white dark:bg-neutral-900"
                  >
                    {INDONESIA_REGIONS.map((region) => (
                      <option key={region.provinsi} value={region.provinsi}>{region.provinsi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Pilih Kabupaten / Kota:</label>
                  <select 
                    value={marketKabupaten}
                    onChange={(e) => setMarketKabupaten(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-neutral-800 text-xs text-gray-900 bg-white dark:bg-neutral-900"
                  >
                    {(INDONESIA_REGIONS.find(r => r.provinsi === marketProvinsi)?.kabupatens || []).map((kab) => (
                      <option key={kab} value={kab}>{kab}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PHOTO UPLOAD CONTAINER SECTION (UP TO 15 PHOTOS) */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black text-gray-500 block">
                    FOTO PRODUK ({newMarketUploadedImages.length}/15)
                  </label>
                  {newMarketUploadedImages.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => setNewMarketUploadedImages([])}
                      className="text-[9px] font-extrabold text-rose-500 uppercase hover:underline cursor-pointer"
                    >
                      Hapus Semua Foto
                    </button>
                  )}
                </div>

                <div className="relative">
                  <label 
                    className={`border-2 border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      newMarketUploadedImages.length >= 15 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' 
                        : 'bg-blue-50/20 hover:bg-blue-50/40 border-blue-400 dark:border-neutral-700 dark:bg-neutral-950/20'
                    }`}
                  >
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      disabled={newMarketUploadedImages.length >= 15 || marketIsUploading}
                      onChange={handleMarketPhotoUpload}
                      className="hidden" 
                    />
                    <ImageIcon className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wide font-mono">Pilih / Upload Foto Produk</span>
                    <span className="text-[8.5px] text-gray-400 mt-0.5 font-mono">Maksimal 15 foto • Auto Cover Sampul</span>
                  </label>
                </div>

                {/* Simulated Progress bar upload item */}
                {marketIsUploading && marketUploadProgress !== null && (
                  <div className="space-y-1 bg-white dark:bg-neutral-950 p-2.5 rounded-xl border border-gray-150 dark:border-neutral-800 animate-pulse">
                    <div className="flex justify-between text-[10px] font-bold text-blue-600">
                      <span>Mengunggah Foto Produk...</span>
                      <span>{marketUploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300 rounded-full" 
                        style={{ width: `${marketUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Gallery List items list container */}
                {newMarketUploadedImages.length > 0 && (
                  <div className="grid grid-cols-5 gap-1.5 pt-1.5 max-h-[140px] overflow-y-auto scrollbar-thin p-1 bg-white dark:bg-neutral-950/60 rounded-xl border border-gray-150 dark:border-neutral-800">
                    {newMarketUploadedImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-850 group">
                        <img 
                          src={imgSrc} 
                          alt={`Uploaded ${idx}`} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        {/* COVER PREVIEW LOGO */}
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white font-extrabold text-[7px] text-center uppercase py-0.5 select-none scale-90">
                            SAMPUL
                          </span>
                        )}
                        {/* DELETER INDIVIDUAL FOTO */}
                        <button
                          type="button"
                          onClick={() => setNewMarketUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-rose-600 transition-colors text-white p-0.5 rounded-full shadow-md cursor-pointer"
                          title="Hapus foto ini"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Deskripsi Detail:</label>
                <textarea 
                  value={newMarketDesc}
                  onChange={(e) => setNewMarketDesc(e.target.value)}
                  rows={5}
                  placeholder="Tulis kelengkapan barang, minus fisik jika ada, garansi, dsb..."
                  className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-neutral-800 text-xs text-gray-900 bg-white dark:bg-neutral-900 dark:text-white"
                />
              </div>

              {/* Validation helper text */}
              {!(
                newMarketTitle.trim() &&
                newMarketPrice.trim() &&
                newMarketCategory.trim() &&
                newMarketCondition.trim() &&
                marketProvinsi.trim() &&
                marketKabupaten.trim() &&
                newMarketUploadedImages.length > 0 &&
                newMarketDesc.trim()
              ) && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[10px] font-semibold text-center mt-3 border border-amber-250/20 animate-pulse">
                  ⚠️ Peringatan: Semua kolom wajib diisi & unggah minimal 1 foto produk!
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2 items-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSellModal(false);
                    setNewMarketUploadedImages([]);
                  }}
                  className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateMarketItem}
                  disabled={
                    marketIsUploading ||
                    !(
                      newMarketTitle.trim() &&
                      newMarketPrice.trim() &&
                      newMarketCategory.trim() &&
                      newMarketCondition.trim() &&
                      marketProvinsi.trim() &&
                      marketKabupaten.trim() &&
                      newMarketUploadedImages.length > 0 &&
                      newMarketDesc.trim()
                    )
                  }
                  className="px-6 py-2.5 bg-white hover:bg-neutral-105 text-black border border-neutral-300 font-extrabold text-xs rounded-xl shadow-md cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed disabled:shadow-none transition-all"
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

            {/* Inner Content image with side controls */}
            <div className="relative flex items-center justify-center w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              
              {/* Prev Button */}
              {lightboxImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevLightbox();
                  }}
                  className="absolute left-2 sm:left-4 z-50 p-3 bg-neutral-900/70 hover:bg-neutral-850 text-white hover:text-emerald-400 rounded-full border border-neutral-800 backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg"
                  title="Foto Sebelumnya (Kiri)"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <motion.div
                key={lightboxIndex} // Force transition on photo slide
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.7, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="max-w-full max-h-[80vh] flex flex-col items-center justify-center p-2 select-none"
              >
                <img
                  src={lightboxSrc}
                  alt="Lightbox View"
                  className="max-w-full max-h-[72vh] rounded-2xl shadow-2xl object-contain border border-neutral-800 cursor-zoom-out"
                  onClick={() => setLightboxSrc(null)}
                />
                
                {/* Photo index indicators */}
                {lightboxImages.length > 1 && (
                  <div className="mt-3 bg-neutral-900/90 border border-neutral-800 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-300 tracking-wider">
                    Foto {lightboxIndex + 1} dari {lightboxImages.length}
                  </div>
                )}
              </motion.div>

              {/* Next Button */}
              {lightboxImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextLightbox();
                  }}
                  className="absolute right-2 sm:right-4 z-50 p-3 bg-neutral-900/70 hover:bg-neutral-850 text-white hover:text-emerald-400 rounded-full border border-neutral-800 backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg"
                  title="Foto Berikutnya (Kanan)"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Bottom info helper */}
            <div className="absolute bottom-4 bg-neutral-900/80 text-neutral-300 px-4 py-1.5 rounded-full text-[10.5px] border border-neutral-800 backdrop-blur-md pointer-events-none select-none">
              Navigasi dengan panah <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-xs text-white font-mono">←</kbd> <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-xs text-white font-mono">→</kbd> atau tekan <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-white font-mono">Esc</kbd> untuk menutup
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
