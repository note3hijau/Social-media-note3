import { User, Post, MarketplaceItem, Friend, FriendRequest, AppNotification, Message } from './types';

// Let's create an elegant initial Indonesian UI dataset

export const INITIAL_CURRENT_USER: User = {
  id: 'user_me',
  username: 'bagus_ide',
  displayName: 'Bagus Susanto',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  bannerPosition: 50,
  bio: '🎯 Content Creator & Tech Specialist di Jakarta. Suka berbagi ide bagus untuk bisnis digital lokal Indonesia!',
  location: 'Jakarta Selatan, DKI Jakarta',
  joinedDate: 'Mei 2024',
  followersCount: 1250,
};

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'user_1',
    displayName: 'Siti Rahma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
  },
  {
    id: 'user_2',
    displayName: 'Ahmad Fauzi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
  },
  {
    id: 'user_3',
    displayName: 'Dewi Lestari',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    lastActive: '2 jam lalu',
  },
  {
    id: 'user_4',
    displayName: 'Rian Hidayat',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    lastActive: 'Kemarin',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    userName: 'Siti Rahma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Ada rekomendasi kopi lokal di daerah Yogyakarta yang suasananya tenang buat laptopan seharian? ☕️💻 Share dong teman-teman idkanca!',
    createdAt: '15 menit lalu',
    likes: ['user_2', 'user_me'],
    comments: [
      {
        id: 'c1',
        userId: 'user_2',
        userName: 'Ahmad Fauzi',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Coba ke Space Coffee Roastery di Jakal km 8 kak, wifi-nya ngebut dan kopinya mantap poll!',
        createdAt: '10 menit lalu'
      }
    ],
    location: 'Sleman, DI Yogyakarta'
  },
  {
    id: 'post_2',
    userId: 'user_3',
    userName: 'Dewi Lestari',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    content: 'Wah, seneng banget deh hari ini! Produk kerajinan rotan lokal buatan UMKM binaan kami akhirnya bisa tembus pasar ekspor ke Jepang 🇮🇩✈️🇯🇵 Semangat terus UMKM Indonesia!',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80',
    createdAt: '2 jam lalu',
    likes: ['user_1', 'user_2', 'user_me'],
    comments: [
      {
        id: 'c2',
        userId: 'user_me',
        userName: 'Bagus Susanto',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Salut banget mba Dewi! Ini baru ide bagus yang berdampak nyata buat ekonomi kreatif lokal 👍',
        createdAt: '1 jam lalu'
      }
    ],
    location: 'Bandung, Jawa Barat'
  },
  {
    id: 'post_3',
    userId: 'user_4',
    userName: 'Rian Hidayat',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    content: 'Siapa yang setuju kalau martabak manis itu makanan penutup terbaik di malam hari? Apalagi tim keju susu tebal 🧀🥞 Tapi harganya sekarang lumayan ya haha.',
    createdAt: '1 hari lalu',
    likes: ['user_1'],
    comments: [],
    location: 'Jakarta Barat, DKI Jakarta'
  }
];

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'item_1',
    sellerId: 'user_2',
    sellerName: 'Ahmad Fauzi',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'iPhone 13 Pro Max 256GB - Blue Sierra',
    description: 'Kondisi mulus 98%, ex iBox resmi. Battery health 87%. Face ID aktif, True Tone nyala. Lengkap box ori dan kabel charger. Nego halus gan.',
    price: 13200000,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    category: 'Elektronik',
    location: 'Sleman, DI Yogyakarta',
    condition: 'Bekas',
    isSold: false
  },
  {
    id: 'item_2',
    sellerId: 'user_3',
    sellerName: 'Dewi Lestari',
    sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    title: 'Meja Rias Kayu Jati Minimalis',
    description: 'Meja rias cantik terbuat dari kayu jati asli Jepara. Sudah dipolish mulus, kaca tidak buram. Ada 3 laci penyimpanan lapang.',
    price: 1850000,
    image: 'https://images.unsplash.com/photo-1532372320978-9b4d1a358f4c?w=600&auto=format&fit=crop&q=80',
    category: 'Mebel / Furnitur',
    location: 'Bandung, Jawa Barat',
    condition: 'Baru',
    isSold: false
  },
  {
    id: 'item_3',
    sellerId: 'user_1',
    sellerName: 'Siti Rahma',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Sepeda Lipat Polygon Urbano 3',
    description: 'Edisi jarang dipakai, mending dijual saja. Rem cakram pakem, operan gigi Shimano Tourney 7-speed lancar jaya. Ban tebal.',
    price: 3400000,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    category: 'Olahraga',
    location: 'Surabaya, Jawa Timur',
    condition: 'Bekas',
    isSold: false
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'user_1',
    receiverId: 'user_me',
    content: 'Halo mas Bagus, postingan rotan tadi menarik sekali lho. Bisa minta nomer kontak pengrajinnya?',
    isRead: false,
    createdAt: '17:01'
  },
  {
    id: 'm2',
    senderId: 'user_me',
    receiverId: 'user_1',
    content: 'Tentu mba Siti! Nanti saya kirimkan kartu nama digitalnya ya.',
    isRead: true,
    createdAt: '17:02'
  },
  {
    id: 'm3',
    senderId: 'user_2',
    receiverId: 'user_me',
    content: 'Gan, iPhone 13 Pro Max yang ane jual di marketplace dapet tawaran menarik nih. Mau tawar?',
    isRead: false,
    createdAt: '16:45'
  }
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'req_1',
    senderId: 'user_x1',
    senderName: 'Budi Hartono',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: '1 jam lalu'
  },
  {
    id: 'req_2',
    senderId: 'user_x2',
    senderName: 'Lina Marlina',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: '3 jam lalu'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n_1',
    type: 'friend_request',
    title: 'Permintaan Pertemanan Baru',
    content: 'Budi Hartono mengirimkan Anda permintaan pertemenan.',
    senderId: 'user_x1',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isRead: false,
    createdAt: '1 jam lalu'
  },
  {
    id: 'n_2',
    type: 'message',
    title: 'Pesan Baru',
    content: 'Siti Rahma: "Halo mas Bagus, postingan rotan tadi menarik sekali..."',
    senderId: 'user_1',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    targetId: 'user_1',
    isRead: false,
    createdAt: '4 menit lalu'
  },
  {
    id: 'n_3',
    type: 'like',
    title: 'Postingan Anda Disukai',
    content: 'Ahmad Fauzi menyukai postingan Anda.',
    senderId: 'user_2',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isRead: true,
    createdAt: '2 jam lalu'
  }
];
