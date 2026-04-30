import { useState, useEffect } from 'react'
import { Activity, PieChart, Settings, Home } from 'lucide-react'
import { AddRecordForm } from '@features/add-record'
import { RecordTimeline } from '@widgets/record-timeline'
import { StatsPage } from '@pages/stats'
import { SettingsPage } from '@pages/settings'
import { Dashboard } from '@widgets/dashboard'
import { useRecordStore } from '@entities/record'
import { useBabyStore } from '@entities/baby'
import { useSessionStore } from '@entities/session'
import { useUserSettingsStore } from '@entities/user-settings'
import { LoginForm } from '@features/auth/ui/LoginForm'

type TabType = 'HOME' | 'RECORD' | 'STATS' | 'SETTINGS';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('HOME')
  const initializeRecords = useRecordStore((state) => state.initializeRecords);
  const { babies, initializeBabies, isLoading: isBabiesLoading } = useBabyStore();
  const initializeSettings = useUserSettingsStore((state) => state.initializeSettings);
  const { user, isLoading: isAuthLoading, initialize: initializeAuth } = useSessionStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleTabChange = (e: any) => {
      setActiveTab(e.detail as TabType);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  useEffect(() => {
    if (user) {
      initializeBabies();
    }
  }, [user, initializeBabies]);

  useEffect(() => {
    if (babies.length > 0) {
      const babyIds = babies.map(b => b.id);
      initializeRecords(babyIds);
      initializeSettings(babyIds[0]);
    }
  }, [babies, initializeRecords, initializeSettings]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F2F2F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/5 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!user ? (
        <div className="max-w-md mx-auto py-24 px-6 relative z-10">
          <div className="animate-ios-in text-center mb-16">
            <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-br from-black to-black/40 bg-clip-text text-transparent">
              Twinkle
            </h1>
            <p className="text-blue-500 font-black uppercase tracking-widest text-[10px]">
              Fresh Parenting Experience
            </p>
          </div>
          <LoginForm />
        </div>
      ) : (
        <div className="max-w-md mx-auto pt-10 pb-32 px-5 relative z-10 text-[#1C1C1E]">
          {/* Header */}
          <header className="animate-ios-in text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight mb-2">Twinkle ✨</h1>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full mx-auto" />
          </header>

          <main className="relative">
            {isBabiesLoading ? (
              <div className="py-24 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/5 border-t-blue-500 mx-auto mb-6" />
                <p className="text-gray-400 text-sm font-bold tracking-tight">정보를 동기화 중...</p>
              </div>
            ) : (
              <div className="animate-ios-in">
                {activeTab === 'HOME' && <Dashboard />}
                {activeTab === 'RECORD' && (
                  <div className="space-y-4">
                    <AddRecordForm />
                    <RecordTimeline />
                  </div>
                )}
                {activeTab === 'STATS' && <StatsPage />}
                {activeTab === 'SETTINGS' && <SettingsPage />}
              </div>
            )}
          </main>

          {/* Bottom Tab Bar */}
          <nav className="ios-nav fixed bottom-0 left-0 right-0 h-24 z-50">
            <div className="flex h-full justify-around pt-3 px-6 max-w-md mx-auto">
              {[
                { id: 'HOME', icon: <Home size={26} />, label: '요약' },
                { id: 'RECORD', icon: <Activity size={26} />, label: '기록' },
                { id: 'STATS', icon: <PieChart size={26} />, label: '통계' },
                { id: 'SETTINGS', icon: <Settings size={26} />, label: '설정' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex flex-col items-center min-w-[64px] transition-all duration-300 ${
                    activeTab === item.id ? 'text-blue-500 scale-110' : 'text-gray-400'
                  }`}
                >
                  <div className="mb-1.5 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-black tracking-tight ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`}>
                    {item.label}
                  </span>
                  {activeTab === item.id && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

export default App
