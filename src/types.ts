export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bannerPosition: number; // percentage alignment e.g. 50%
  bio: string;
  location: string; // Indonesian location
  joinedDate: string;
  followersCount: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: string[]; // lists of userIds
  comments: Comment[];
  createdAt: string;
  location?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Friend {
  id: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastActive?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  title: string;
  description: string;
  price: number; // in IDR (Rupiah)
  image: string;
  category: string;
  location: string; // Indonesian region e.g. Jakarta Selatan, Surabaya, Sleman
  condition: 'Baru' | 'Bekas';
  isSold: boolean;
}

export interface AppNotification {
  id: string;
  type: 'friend_request' | 'message' | 'like' | 'comment' | 'marketplace' | 'system';
  title: string;
  content: string;
  senderId?: string;
  senderAvatar?: string;
  targetId?: string; // post ID or item ID or message thread ID
  isRead: boolean;
  createdAt: string;
}

export interface TrackingStepLog {
  time: string;
  statusText: string;
  note: string;
}

export interface EscrowTransaction {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  itemImage: string;
  buyerId: string;
  buyerName: string;
  paymentMethod: 'qris' | 'gopay' | 'ovo' | 'va_bca';
  paymentStatus: 'pending_payment' | 'escrow_secured' | 'shipped_transit' | 'delivered' | 'cancelled';
  expedition: 'JNE Express' | 'J&T Express' | 'SiCepat Ekspres' | 'Pos Indonesia' | 'GoSend Instant';
  receiptNumber: string; // Indonesian No Resi
  currentTrackingStepIndex: number;
  trackingLogs: TrackingStepLog[];
  createdAt: string;
}

