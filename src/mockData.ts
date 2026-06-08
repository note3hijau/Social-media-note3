import { User, Post, MarketplaceItem, Friend, FriendRequest, AppNotification, Message } from './types';

export const INITIAL_CURRENT_USER: User = {
  id: '',
  username: '',
  displayName: '',
  avatar: '',
  banner: '',
  bannerPosition: 50,
  bio: '',
  location: '',
  joinedDate: '',
  followersCount: 0,
};

export const INITIAL_FRIENDS: Friend[] = [];
export const INITIAL_POSTS: Post[] = [];
export const INITIAL_MARKETPLACE: MarketplaceItem[] = [];
export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
