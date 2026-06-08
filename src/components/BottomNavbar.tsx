import { Home, ShoppingBag, MessageSquare, User, Menu, Bell } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  friendRequestsCount: number;
  toggleSidebar: () => void;
}

export default function BottomNavbar({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  unreadNotificationsCount,
  friendRequestsCount,
  toggleSidebar,
}: BottomNavbarProps) {
  const totalBadges = friendRequestsCount + unreadNotificationsCount;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 bg-linear-to-t from-black/5 via-transparent to-transparent pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-md shadow-2xl flex items-center justify-around py-2.5 px-2">
        
        {/* Home Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-transform duration-100 active:scale-90"
        >
          <Home
            className={`h-5 w-5 transition-colors ${
              activeTab === 'feed'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-110'
                : 'text-gray-400 dark:text-slate-400'
            }`}
          />
          <span
            className={`text-[9px] mt-0.5 font-medium transition-colors ${
              activeTab === 'feed'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-400 dark:text-slate-400'
            }`}
          >
            Feed
          </span>
        </button>

        {/* Marketplace */}
        <button
          onClick={() => setActiveTab('marketplace')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-transform duration-100 active:scale-90"
        >
          <ShoppingBag
            className={`h-5 w-5 transition-colors ${
              activeTab === 'marketplace'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-110'
                : 'text-gray-400 dark:text-slate-400'
            }`}
          />
          <span
            className={`text-[9px] mt-0.5 font-medium transition-colors ${
              activeTab === 'marketplace'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-400 dark:text-slate-400'
            }`}
          >
            Market
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-transform duration-100 active:scale-90"
        >
          <User
            className={`h-5 w-5 transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-110'
                : 'text-gray-400 dark:text-slate-400'
            }`}
          />
          <span
            className={`text-[9px] mt-0.5 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-400 dark:text-slate-400'
            }`}
          >
            Profil
          </span>
        </button>

        {/* Sidebar Trigger (Menu) */}
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-transform duration-100 active:scale-90 relative"
        >
          <Menu className="h-5 w-5 text-gray-450 dark:text-slate-400" />
          {totalBadges > 0 && (
            <span className="absolute top-0 right-4 flex h-2 w-2 items-center justify-center rounded-full bg-blue-500 ring-1 ring-white dark:ring-slate-900" />
          )}
          <span className="text-[9px] mt-0.5 font-medium text-gray-455 dark:text-slate-500">
            Menu
          </span>
        </button>

      </div>
    </div>
  );
}
