import React, { useState, useRef, useEffect } from 'react';
import { Friend, Message } from '../types';
import { Send, MapPin, CheckCheck, Loader2, Sparkles, AlertCircle, Phone, Video, Search, ChevronLeft, MessageSquare } from 'lucide-react';

interface MessageChatBoxProps {
  currentUserId: string;
  friends: Friend[];
  messages: Message[];
  onSendMessage: (senderId: string, receiverId: string, content: string) => void;
  onSimulateReply: (senderId: string, text: string) => void;
  activeChatFriendId: string | null;
  setActiveChatFriendId: (id: string | null) => void;
}

export default function MessageChatBox({
  currentUserId,
  friends,
  messages,
  onSendMessage,
  onSimulateReply,
  activeChatFriendId,
  setActiveChatFriendId,
}: MessageChatBoxProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedFriend = friends.find(f => f.id === activeChatFriendId);

  // Auto-scrolling to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatFriendId]);

  // Filter messages for current thread
  const activeThreadMessages = activeChatFriendId
    ? messages.filter(
        m =>
          (m.senderId === currentUserId && m.receiverId === activeChatFriendId) ||
          (m.senderId === activeChatFriendId && m.receiverId === currentUserId)
      )
    : [];

  const handleSend = () => {
    if (!inputText.trim() || !activeChatFriendId) return;

    // Send original message
    onSendMessage(currentUserId, activeChatFriendId, inputText);
    const sentText = inputText;
    setInputText('');

    // Trigger typing simulation
    setIsTyping(true);

    // List of Indonesian smart replies matching local social context
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

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xs h-[550px] flex">
      
      {/* List Column: visible if no chat selected or on large screens */}
      <div className={`w-full md:w-80 border-r border-gray-150 dark:border-neutral-800 flex flex-col shrink-0 ${
        activeChatFriendId ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Search header container */}
        <div className="p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/45 dark:bg-neutral-900/40">
          <h2 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2">Pesan Obrolan</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kontak teman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-750 pl-9 pr-3 py-1.5 text-xs text-gray-950 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Contacts scrolling body */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-neutral-800/60 scrollbar-thin">
          {filteredFriends.map((f) => {
            // Find last message
            const thread = messages.filter(
              m => (m.senderId === currentUserId && m.receiverId === f.id) || (m.senderId === f.id && m.receiverId === currentUserId)
            );
            const lastMsg = thread[thread.length - 1];
            const hasUnread = thread.some(m => m.senderId === f.id && !m.isRead);

            return (
              <button
                key={f.id}
                onClick={() => setActiveChatFriendId(f.id)}
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
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-350 dark:bg-neutral-600 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{f.displayName}</h4>
                    {lastMsg && <span className="text-[9px] text-gray-400 shrink-0">{lastMsg.createdAt}</span>}
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${hasUnread ? 'text-gray-900 dark:text-white font-extrabold' : 'text-gray-500'}`}>
                    {lastMsg ? lastMsg.content : 'Mulai percakapan aman...'}
                  </p>
                </div>

                {hasUnread && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
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

      {/* Chat Conversation pane: visible if activeChatFriendId or on large screens */}
      {activeChatFriendId && selectedFriend ? (
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30 dark:bg-neutral-900/10">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-150 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Back button for mobile */}
              <button
                onClick={() => setActiveChatFriendId(null)}
                className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 cursor-pointer focus:outline-hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <img src={selectedFriend.avatar} alt={selectedFriend.displayName} className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500" />
              <div className="text-left leading-tight min-w-0">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{selectedFriend.displayName}</h4>
                <p className="text-[10px] text-emerald-500 font-semibold">{selectedFriend.isOnline ? 'Online • Aktif' : `Aktif ${selectedFriend.lastActive || 'Lalu'}`}</p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-1 text-gray-400">
              <button className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-emerald-500 transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-emerald-500 transition-colors">
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conversation scrolling list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {activeThreadMessages.length === 0 && (
              <div className="text-center py-10 space-y-1">
                <p className="text-xs font-semibold text-gray-500">Mulai Kirim Pesan Aman</p>
                <p className="text-[10px] text-gray-400">Pesan dienkripsi secara aman melalui database terdistribusi.</p>
              </div>
            )}

            {activeThreadMessages.map((msg) => {
              const fromMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs space-y-0.5 shadow-xs ${
                      fromMe
                        ? 'bg-emerald-500 text-white rounded-br-none'
                        : 'bg-slate-700 dark:bg-neutral-805 text-white rounded-bl-none border-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <div className="flex justify-end items-center gap-1">
                      <span className={`text-[8px] ${fromMe ? 'text-emerald-100' : 'text-slate-300 dark:text-gray-400'}`}>
                        {msg.createdAt}
                      </span>
                      {fromMe && <CheckCheck className="h-3 w-3 text-emerald-100" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulation Friend Typing Indicator state */}
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

          {/* Chat input form sticked */}
          <div className="p-4 border-t border-gray-150 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex gap-2">
            <input
              type="text"
              placeholder="Tulis pesan aman Anda..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 text-xs border border-gray-200 dark:border-neutral-750 focus:border-emerald-500 focus:outline-hidden"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-emerald-500 select-none hover:bg-emerald-600 rounded-xl text-white transition-colors cursor-pointer"
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

    </div>
  );
}
