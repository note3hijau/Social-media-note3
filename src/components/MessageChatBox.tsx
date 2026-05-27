import React, { useState, useRef, useEffect } from 'react';
import { Friend, Message } from '../types';
import { 
  Send, MapPin, CheckCheck, Loader2, Sparkles, AlertCircle, Phone, Video, Search, 
  ChevronLeft, MessageSquare, Trash2, Camera, Smile, X, Mic, MicOff, VideoOff, 
  PhoneOff, Volume2, Plus, Image as ImageIcon, CircleCheck, CornerUpLeft, ShoppingBag 
} from 'lucide-react';

interface MessageChatBoxProps {
  currentUserId: string;
  friends: Friend[];
  messages: Message[];
  onSendMessage: (senderId: string, receiverId: string, content: string, image?: string, marketplaceContext?: any, replyTo?: any) => void;
  onSimulateReply: (senderId: string, text: string, image?: string) => void;
  activeChatFriendId: string | null;
  setActiveChatFriendId: (id: string | null) => void;
  onDeleteMessages: (messageIds: string[]) => void;
  onViewProfile: (userId: string) => void;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '✨', '🔥', '🎉', '🌟', '🙌', '👏', '🙏', '💯', '🚀'];

export default function MessageChatBox({
  currentUserId,
  friends,
  messages,
  onSendMessage,
  onSimulateReply,
  activeChatFriendId,
  setActiveChatFriendId,
  onDeleteMessages,
  onViewProfile,
}: MessageChatBoxProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatCategory, setChatCategory] = useState<'general' | 'marketplace'>('general');
  
  // Custom multi-delete and attachments features state
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [confirmDeleteThread, setConfirmDeleteThread] = useState(false);

  // Call simulation states
  const [activeCall, setActiveCall] = useState<{
    type: 'audio' | 'video';
    status: 'ringing' | 'connected' | 'ended';
    duration: number;
    isMuted: boolean;
    isCamOff: boolean;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFriend = friends.find(f => f.id === activeChatFriendId);

  // Auto-scrolling on new messages or chat switches
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatFriendId]);

  // Sync tab folder based on current chat thread type so it is immediately visible
  useEffect(() => {
    if (activeChatFriendId) {
      const thread = messages.filter(
        m => (m.senderId === currentUserId && m.receiverId === activeChatFriendId) || 
             (m.senderId === activeChatFriendId && m.receiverId === currentUserId)
      );
      const isMarketplaceThread = thread.some(m => m.marketplaceContext !== undefined);
      if (isMarketplaceThread) {
        setChatCategory('marketplace');
      } else {
        setChatCategory('general');
      }
    }
  }, [activeChatFriendId, messages, currentUserId]);

  // Handle auto-connecting of call ringing simulator
  useEffect(() => {
    if (activeCall && activeCall.status === 'ringing') {
      const ringTimer = setTimeout(() => {
        setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
      }, 3000);
      return () => clearTimeout(ringTimer);
    }
  }, [activeCall]);

  // Upcount timer for Call Duration tracking
  useEffect(() => {
    let durationTimer: NodeJS.Timeout;
    if (activeCall && activeCall.status === 'connected') {
      durationTimer = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(durationTimer);
  }, [activeCall]);

  // Filter messages for selected friend conversation thread
  const activeThreadMessages = activeChatFriendId
    ? messages.filter(
        m =>
          (m.senderId === currentUserId && m.receiverId === activeChatFriendId) ||
          (m.senderId === activeChatFriendId && m.receiverId === currentUserId)
      )
    : [];

  const lastMarketplaceMsg = [...activeThreadMessages].reverse().find(m => m.marketplaceContext !== undefined);
  const marketplaceContext = lastMarketplaceMsg?.marketplaceContext;

  const handleSend = () => {
    if ((!inputText.trim() && !attachedImage) || !activeChatFriendId) return;

    // Send core message with optional attached image and reply payload
    const replyPayload = replyingToMessage ? {
      id: replyingToMessage.id,
      senderName: replyingToMessage.senderId === currentUserId ? 'Anda' : (selectedFriend?.displayName || 'Teman'),
      content: replyingToMessage.content
    } : undefined;

    onSendMessage(currentUserId, activeChatFriendId, inputText, attachedImage || undefined, undefined, replyPayload);
    
    setInputText('');
    setAttachedImage(null);
    setReplyingToMessage(null);
    setShowEmojiPicker(false);

    // Trigger typing responder simulation
    setIsTyping(true);

    const indonesianReplies = [
      'Siap mas! Makasih respon cepatnya ya, ditunggu infonya. 👍',
      'Waduh mantap djiwa gan! Nanti malem ane kabarin kelanjutannya ya.',
      'Boleh banget mba Sish, ketemuan di daerah Kemang atau Tebet enaknya?',
      'Sepertinya menarik lho. Langsung ane transfer aman lewat QRIS idebagus sekarang.',
      'Oke siaap, jangan lupa bantu up dagangan ane di feed ya mas Bagus!',
      'Siap meluncur bos! Hehe.'
    ];

    const randomReply = indonesianReplies[Math.floor(Math.random() * indonesianReplies.length)];

    setTimeout(() => {
      setIsTyping(false);
      onSimulateReply(activeChatFriendId, randomReply);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAttachedImage(objectUrl);
  };

  const toggleSelectMessage = (msgId: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(msgId)
        ? prev.filter(id => id !== msgId)
        : [...prev, msgId]
    );
  };

  const handleExecuteDelete = () => {
    if (selectedMessageIds.length === 0) return;
    onDeleteMessages(selectedMessageIds);
    setSelectedMessageIds([]);
    setIsDeleteMode(false);
  };

  const handleStartCall = (callType: 'audio' | 'video') => {
    setActiveCall({
      type: callType,
      status: 'ringing',
      duration: 0,
      isMuted: false,
      isCamOff: false,
    });
  };

  const formatDurationHelper = (sec: number) => {
    const min = Math.floor(sec / 60).toString().padStart(2, '0');
    const remSec = (sec % 60).toString().padStart(2, '0');
    return `${min}:${remSec}`;
  };

  const filteredFriends = friends.filter(friend => {
    // Cross reference messages for marketplace context tag
    const thread = messages.filter(
      m => (m.senderId === currentUserId && m.receiverId === friend.id) || (m.senderId === friend.id && m.receiverId === currentUserId)
    );
    const isMarketplaceThread = thread.some(m => m.marketplaceContext !== undefined);

    if (chatCategory === 'marketplace') {
      return isMarketplaceThread;
    } else {
      return !isMarketplaceThread;
    }
  });

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xs h-[580px] flex relative font-sans">
      
      {/* Contact List Column */}
      <div className={`w-full md:w-80 border-r border-gray-150 dark:border-neutral-800 flex flex-col shrink-0 ${
        activeChatFriendId ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Search header container */}
        <div className="p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/45 dark:bg-neutral-900/40 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-sm text-gray-900 dark:text-white">Pesan Obrolan</h2>
            <span className="text-[9px] font-mono text-emerald-500 font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">● Enkripsi</span>
          </div>
          
          {/* Facebook Marketplace and General Category Tabs */}
          <div className="flex bg-gray-100 dark:bg-neutral-950 p-1 rounded-xl border border-gray-200/40 dark:border-neutral-850">
            <button
              onClick={() => setChatCategory('general')}
              className={`flex-1 py-2 px-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                chatCategory === 'general'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              <MessageSquare className="h-3 w-3 shrink-0" />
              Personal
            </button>
            <button
              onClick={() => setChatCategory('marketplace')}
              className={`flex-1 py-2 px-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                chatCategory === 'marketplace'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              <ShoppingBag className="h-3 w-3 shrink-0" />
              Pasar 🛒
            </button>
          </div>
        </div>

        {/* Contacts list scrolling */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-neutral-800/60 scrollbar-thin">
          {filteredFriends.map((f) => {
            const thread = messages.filter(
              m => (m.senderId === currentUserId && m.receiverId === f.id) || (m.senderId === f.id && m.receiverId === currentUserId)
            );
            const lastMsg = thread[thread.length - 1];
            // Identify unread chat messages matching the criterion
            const hasUnread = thread.some(m => m.senderId === f.id && !m.isRead);

            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveChatFriendId(f.id);
                  setIsDeleteMode(false);
                  setSelectedMessageIds([]);
                }}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeChatFriendId === f.id
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'hover:bg-gray-50/80 dark:hover:bg-neutral-800/30'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={f.avatar} alt={f.displayName} className="h-11 w-11 rounded-full object-cover border border-emerald-500/10" />
                  {f.isOnline ? (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                  ) : (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-neutral-400 ring-2 ring-white dark:ring-neutral-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{f.displayName}</h4>
                      <span className={`text-[8px] font-extrabold uppercase px-1 py-0.5 rounded-sm border ${
                        f.isOnline 
                          ? 'text-emerald-500 bg-emerald-500/10 border-emerald-250/20' 
                          : 'text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-300/30'
                      }`}>
                        {f.isOnline ? 'Online' : 'Offline'}
                      </span>
                      {thread.some(m => m.marketplaceContext !== undefined) && (
                        <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded-sm border border-amber-200/50 shrink-0">
                          PASAR 🛒
                        </span>
                      )}
                    </div>
                    {lastMsg && <span className="text-[9px] text-gray-400 shrink-0">{lastMsg.createdAt}</span>}
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${hasUnread ? 'text-emerald-500 font-extrabold' : 'text-gray-500 dark:text-neutral-400'}`}>
                    {lastMsg ? lastMsg.content : 'Mulai percakapan aman...'}
                  </p>
                </div>

                {/* Show unread green identifier is online or unread messages */}
                {hasUnread && (
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-xs" />
                )}
              </button>
            );
          })}

          {filteredFriends.length === 0 && (
            <div className="p-8 text-center text-xs text-neutral-400">
              Tidak ada kontak yang cocok
            </div>
          )}
        </div>
      </div>

      {/* Chat Conversation Pane */}
      {activeChatFriendId && selectedFriend ? (
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30 dark:bg-neutral-900/10">
          
          {/* Conversation header panel */}
          <div className="p-4 border-b border-gray-150 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => {
                  setActiveChatFriendId(null);
                  setIsDeleteMode(false);
                }}
                className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div 
                onClick={() => onViewProfile(selectedFriend.id)}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
                title="Klik untuk melihat profil terverifikasi"
              >
                <div className="relative shrink-0">
                  <img 
                    src={selectedFriend.avatar} 
                    alt={selectedFriend.displayName} 
                    className={`h-9 w-9 rounded-full object-cover ring-2 ${
                      selectedFriend.isOnline ? 'ring-blue-500' : 'ring-neutral-350 dark:ring-neutral-700'
                    }`} 
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-neutral-900 ${
                    selectedFriend.isOnline ? 'bg-blue-500' : 'bg-neutral-400'
                  }`} />
                </div>

                <div className="text-left leading-tight min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate flex items-center gap-1">
                    {selectedFriend.displayName}
                  </h4>
                  <p className={`text-[10px] font-bold ${
                    selectedFriend.isOnline ? 'text-blue-500' : 'text-neutral-400 dark:text-neutral-500'
                  }`}>
                    {selectedFriend.isOnline ? 'Online • Aktif Sekarang' : `Offline • Aktif ${selectedFriend.lastActive || 'Kemarin'}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Calling Options & Mass-delete triggers */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setConfirmDeleteThread(!confirmDeleteThread)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 px-2.5 py-1.5 text-[10.5px] font-bold ${
                  confirmDeleteThread 
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-450' 
                    : 'bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-450'
                }`}
                title="Hapus Seluruh Obrolan"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Hapus Obrolan</span>
              </button>

              <button 
                onClick={() => setIsDeleteMode(!isDeleteMode)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDeleteMode 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-850 hover:text-emerald-500'
                }`}
                title="Kelola Banyak Pesan (Pilih/Hapus)"
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <button 
                onClick={() => handleStartCall('audio')}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-850 hover:text-emerald-500 transition-colors cursor-pointer"
                title="Panggilan Suara"
              >
                <Phone className="h-4 w-4" />
              </button>
              
              <button 
                onClick={() => handleStartCall('video')}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-850 hover:text-emerald-500 transition-colors cursor-pointer"
                title="Panggilan Video"
              >
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Entire thread clear confirmation bar */}
          {confirmDeleteThread && (
            <div className="bg-rose-50 dark:bg-rose-950/30 px-4 py-3 border-b border-rose-150 dark:border-rose-900/40 flex items-center justify-between text-xs animate-slide-in text-left">
              <div className="text-left font-sans">
                <p className="font-extrabold text-rose-700 dark:text-rose-450 text-[11px]">Hapus Seluruh Obrolan?</p>
                <p className="text-[10px] text-gray-500 dark:text-neutral-400 mt-0.5">Semua riwayat pengiriman pesan dengan {selectedFriend.displayName} akan terhapus permanen.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => setConfirmDeleteThread(false)}
                  className="px-2.5 py-1.5 text-[10.5px] bg-white border border-gray-205 dark:bg-neutral-800 dark:border-neutral-700 text-gray-750 dark:text-gray-300 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    const allIds = activeThreadMessages.map(m => m.id);
                    onDeleteMessages(allIds);
                    setConfirmDeleteThread(false);
                  }}
                  className="px-2.5 py-1.5 text-[10.5px] bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-lg cursor-pointer transition-colors"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </div>
          )}

          {/* Mass action delete tray */}
          {isDeleteMode && (
            <div className="bg-rose-500 text-white px-4 py-2 flex items-center justify-between text-xs animate-slide-in">
              <span>{selectedMessageIds.length} pesan terpilih untuk dihapus</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setIsDeleteMode(false);
                    setSelectedMessageIds([]);
                  }}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/35 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleExecuteDelete}
                  disabled={selectedMessageIds.length === 0}
                  className="px-2.5 py-1 bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  Hapus ({selectedMessageIds.length})
                </button>
              </div>
            </div>
          )}

          {/* Facebook Marketplace Special context header ribbon */}
          {marketplaceContext && (
            <div className="bg-amber-500/10 dark:bg-amber-500/5 py-3 px-4 border-b border-amber-500/20 flex items-center justify-between gap-3 text-left animate-slide-in font-sans">
              <div className="flex items-center gap-3 shrink min-w-0">
                <img 
                  src={marketplaceContext.itemImage} 
                  alt={marketplaceContext.itemTitle} 
                  className="h-10 w-10 object-cover rounded-xl border border-amber-500/10 shrink-0 shadow-xs" 
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 bg-amber-500/20 dark:text-amber-300 px-1.5 py-0.5 rounded-sm shrink-0">
                      Grup Marketplace 🛒
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 dark:text-gray-100 truncate max-w-[150px] md:max-w-[280px]">
                      {marketplaceContext.itemTitle}
                    </h5>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-extrabold mt-0.5">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(marketplaceContext.itemPrice)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black animate-pulse bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  Nego Facebook
                </span>
              </div>
            </div>
          )}

          {/* Conversation listing board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {activeThreadMessages.length === 0 && (
              <div className="text-center py-12 space-y-1">
                <p className="text-xs font-semibold text-gray-500">Mulai Kirim Pesan Aman</p>
                <p className="text-[10px] text-gray-400">Pesan dienkripsi secara aman melalui database terdistribusi.</p>
              </div>
            )}

            {activeThreadMessages.map((msg) => {
              const fromMe = msg.senderId === currentUserId;
              const isSelected = selectedMessageIds.includes(msg.id);
              
              return (
                <div
                  key={msg.id}
                  onClick={() => isDeleteMode && toggleSelectMessage(msg.id)}
                  className={`flex items-start gap-2.5 ${fromMe ? 'justify-end' : 'justify-start'} ${
                    isDeleteMode ? 'cursor-pointer hover:bg-neutral-100/10 p-1 rounded-xl transition-all' : ''
                  }`}
                >
                  {isDeleteMode && (
                    <div className="pt-2">
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-rose-600 border-rose-600 text-white' 
                          : 'border-gray-300 dark:border-neutral-600'
                      }`}>
                        {isSelected && <CheckCheck className="h-3 w-3" />}
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs space-y-2.5 shadow-xs relative group ${
                      fromMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-700 dark:bg-[#1e293b] text-white rounded-bl-none border-none'
                    }`}
                  >
                    {/* Reply tag overlay trigger */}
                    {!isDeleteMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyingToMessage(msg);
                        }}
                        className={`absolute -top-3.5 ${fromMe ? '-left-2' : '-right-2'} bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center gap-1 z-10`}
                        title="Balas pesan ini"
                      >
                        <CornerUpLeft className="h-2.5 w-2.5" />
                        <span>Balas</span>
                      </button>
                    )}

                    {/* Rendering quoted parent reply message similar to Facebook */}
                    {msg.replyTo && (
                      <div className="mb-2 p-2 bg-black/20 rounded-lg text-left border-l-2 border-blue-400 text-[10.5px] text-gray-250 block truncate pointer-events-none">
                        <p className="font-extrabold text-[9px] text-blue-300">Membalas {msg.replyTo.senderName}:</p>
                        <p className="italic opacity-85 truncate mt-0.5">{msg.replyTo.content}</p>
                      </div>
                    )}

                    {/* Render message media if there is an image */}
                    {msg.image && (
                      <div className="rounded-xl overflow-hidden max-h-48 border border-white/10 dark:border-neutral-800 bg-neutral-900/40">
                        <img 
                          src={msg.image} 
                          alt="Attachment" 
                          className="w-full object-cover select-none cursor-pointer" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {msg.content && <p className="leading-relaxed text-left break-words">{msg.content}</p>}

                    <div className="flex justify-end items-center gap-1.5">
                      <span className={`text-[8px] ${fromMe ? 'text-blue-100' : 'text-slate-300 dark:text-neutral-400'}`}>
                        {msg.createdAt}
                      </span>
                      {fromMe && <CheckCheck className="h-3 w-3 text-blue-100" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-neutral-800 border border-gray-150 dark:border-neutral-750 px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 rounded-bl-none text-gray-400">
                  <span className="font-semibold text-gray-500">{selectedFriend.displayName.split(' ')[0]}</span> sedang mengetik
                  <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick inline Emojis selection drawer */}
          {showEmojiPicker && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap gap-2 animate-fade-in z-20">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setInputText(prev => prev + emoji)}
                  className="p-1 text-base hover:scale-125 transition-transform duration-100 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
              <button 
                onClick={() => setShowEmojiPicker(false)}
                className="p-1 px-2.5 ml-auto text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Attached image file preview panel */}
          {attachedImage && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                <img src={attachedImage} alt="Attachment" className="h-full w-full object-cover" />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <span className="text-[10px] text-gray-400">Gambar siap dikirim dengan pesan obrolan</span>
            </div>
          )}

          {/* Replying banner UI similar to Facebook */}
          {replyingToMessage && (
            <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-950 border-t border-gray-150 dark:border-neutral-800 flex items-center justify-between text-xs animate-fade-in text-left">
              <div className="flex items-center gap-2 border-l-2 border-blue-500 pl-2.5 min-w-0">
                <div className="min-w-0">
                  <p className="font-extrabold text-[10px] text-blue-500 uppercase tracking-wide">Membalas pesan {replyingToMessage.senderId === currentUserId ? 'Anda' : selectedFriend?.displayName}:</p>
                  <p className="text-gray-500 dark:text-neutral-400 truncate text-[11px] max-w-xl italic mt-0.5">
                    {replyingToMessage.content || '[Gambar / Attachment]'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReplyingToMessage(null)}
                className="p-1 px-2 text-gray-400 hover:text-rose-500 transition-colors uppercase cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Chat input form attached */}
          <div className="p-4 border-t border-gray-150 dark:border-neutral-800 bg-white dark:bg-neutral-900/95 flex gap-2 relative">
            
            {/* Image attachment file trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gray-100 hover:bg-gray-150 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-500 dark:text-neutral-400 rounded-xl transition-colors cursor-pointer"
              title="Kirim Foto"
            >
              <ImageIcon className="h-4.5 w-4.5" />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageAttach} 
            />

            {/* Quick emoji pop toggle */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 bg-gray-100 hover:bg-gray-150 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-gray-500 dark:text-neutral-400 rounded-xl transition-colors cursor-pointer"
              title="Masukkan Emoji"
            >
              <Smile className="h-4.5 w-4.5" />
            </button>

            <input
              type="text"
              placeholder="Tulis pesan aman Anda..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 text-xs text-gray-900 dark:text-gray-150 border border-gray-200 dark:border-neutral-750 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
            
            <button
              onClick={handleSend}
              className="p-3 bg-blue-600 select-none hover:bg-blue-700 rounded-xl text-white transition-colors cursor-pointer shadow-xs"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center space-y-3 bg-gray-50/20 dark:bg-neutral-950/20">
          <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
            <MessageSquare className="h-8 w-8" />
          </div>
          <p className="text-xs font-bold text-gray-700 dark:text-neutral-400">Pilih Percakapan</p>
          <p className="text-[10px] text-gray-400 text-center max-w-xs">Pilih salah satu teman online di sisi kiri untuk mulai saling berkomunikasi aman dengan auto-sync di Indonesia.</p>
        </div>
      )}

      {/* CALL MODAL OVERLAY PORTAL */}
      {activeCall && (
        <div className="absolute inset-0 bg-neutral-950/95 z-50 flex flex-col items-center justify-between p-8 text-white select-none animate-fade-in font-sans">
          
          {/* Header */}
          <div className="flex w-full justify-between items-center text-xs text-neutral-400 pt-4">
            <span className="flex items-center gap-1 bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-emerald-400">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Sinyal Terenkripsi End-To-End
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              {activeCall.type === 'video' ? 'Panggilan Video' : 'Panggilan Suara'}
            </span>
          </div>

          {/* Caller Profile Body Display */}
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Rotating pulsing ring */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping" />
              <img 
                src={selectedFriend?.avatar} 
                alt={selectedFriend?.displayName} 
                className="h-24 w-24 rounded-full object-cover ring-4 ring-emerald-500 relative z-10 shadow-2xl animate-pulse"
              />
              {activeCall.type === 'video' && !activeCall.isCamOff && activeCall.status === 'connected' && (
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-extrabold z-20 text-white">
                  CAM
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-extrabold tracking-wide">{selectedFriend?.displayName}</h2>
              <p className="text-xs font-semibold text-neutral-400">
                {activeCall.status === 'ringing' && 'Menghubungkan sinyal aman dilingkungan RI...'}
                {activeCall.status === 'connected' && 'Panggilan Terhubung!'}
                {activeCall.status === 'ended' && 'Panggilan Diakhiri'}
              </p>
              {activeCall.status === 'connected' && (
                <div className="text-lg font-mono text-emerald-400 tracking-wide font-extrabold pt-1">
                  {formatDurationHelper(activeCall.duration)}
                </div>
              )}
            </div>

            {/* Video Feed simulation boxes */}
            {activeCall.type === 'video' && activeCall.status === 'connected' && (
              <div className="w-64 h-40 rounded-xl bg-neutral-800 border border-white/20 relative overflow-hidden mt-4 shadow-xl flex items-center justify-center">
                {activeCall.isCamOff ? (
                  <div className="text-center text-xs text-neutral-500 space-y-1">
                    <VideoOff className="h-5 w-5 mx-auto text-neutral-600" />
                    <p>Kamera Anda Dinonaktifkan</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    {/* User forward simulated cam fallback */}
                    <span className="text-[10px] font-semibold text-neutral-400 z-10">Kamera Depan Anda (Aktif)</span>
                    <div className="absolute inset-0 bg-[#0f172a] opacity-[0.45] pointer-events-none" />
                  </div>
                )}
                {/* Peer mock picture in picture video stream */}
                <div className="absolute bottom-2 right-2 w-16 h-20 rounded-lg bg-neutral-950 overflow-hidden border border-white/10 shadow-md">
                  <img src={selectedFriend?.avatar} alt="peer video" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            
            {/* Audio wave ringer anim representation */}
            {activeCall.status === 'ringing' && (
              <div className="flex gap-1.5 justify-center items-center pt-2">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
              </div>
            )}
          </div>

          {/* Lower Action bar Controls */}
          <div className="w-full max-w-sm bg-neutral-900/40 p-5 rounded-3xl border border-white/5 flex justify-around items-center mb-6">
            
            {/* Mute toggle button */}
            <button 
              onClick={() => setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null)}
              className={`p-4 rounded-full transition-colors cursor-pointer ${
                activeCall.isMuted 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-neutral-200'
              }`}
              title={activeCall.isMuted ? 'Nyalakan Mikrofon' : 'Mute Mikrofon'}
            >
              {activeCall.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            {/* End Call connection button (Diconnect) */}
            <button 
              onClick={() => {
                // Log simulated text inside conversation history
                const callDurText = formatDurationHelper(activeCall.duration);
                const callTypeName = activeCall.type === 'video' ? 'Video' : 'Suara';
                onSendMessage(
                  currentUserId, 
                  activeChatFriendId, 
                  `📞 Panggilan ${callTypeName} Berakhir. Durasi panggilan: ${callDurText}`
                );
                setActiveCall(null);
              }}
              className="p-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-110 shadow-lg cursor-pointer flex items-center justify-center border-2 border-white/20"
              title="Tutup Panggilan"
            >
              <PhoneOff className="h-6 w-6" />
            </button>

            {/* Video feed shut off toggle button */}
            <button 
              onClick={() => setActiveCall(prev => prev ? { ...prev, isCamOff: !prev.isCamOff } : null)}
              className={`p-4 rounded-full transition-colors cursor-pointer ${
                activeCall.isCamOff 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-neutral-200'
              }`}
              title={activeCall.isCamOff ? 'Aktifkan Kamera' : 'Sembunyikan Kamera'}
              disabled={activeCall.type !== 'video'}
            >
              {activeCall.isCamOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
