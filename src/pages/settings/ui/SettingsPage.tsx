import { 
  Moon, 
  Clock, 
  User, 
  Baby, 
  ChevronRight,
  LogOut,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useUserSettingsStore } from '@entities/user-settings';
import { useSessionStore } from '@entities/session';
import { useBabyStore } from '@entities/baby';
import { babyService } from '@entities/baby/api/babyService';
import { supabase } from '@shared/api/supabase';
import { Edit2 } from 'lucide-react';

export const SettingsPage = () => {
  const { babies, initializeBabies } = useBabyStore();
  const firstBabyId = babies[0]?.id;

  const { 
    feedingInterval, 
    muteDuringNight, 
    customCategories,
    setFeedingInterval, 
    setMuteDuringNight,
    addCustomType,
    removeCustomType
  } = useUserSettingsStore();

  const { user, signOut } = useSessionStore();

  const [newCategory, setNewCategory] = useState('');
  const [isAddBabyOpen, setIsAddBabyOpen] = useState(false);
  const [newBaby, setNewBaby] = useState({
    name: '',
    birthDate: new Date().toISOString().split('T')[0],
    gender: 'M' as 'M' | 'F',
    colorTheme: 'mint'
  });

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '양육자');

  const [activeCategory, setActiveCategory] = useState('SOLID');

  const handleAddType = () => {
    if (newCategory.trim()) {
      addCustomType(activeCategory, newCategory.trim(), firstBabyId);
      setNewCategory('');
    }
  };

  const handleAddBaby = async () => {
    if (!newBaby.name) return;
    try {
      await babyService.createBaby({
        name: newBaby.name,
        birthDate: new Date(newBaby.birthDate).toISOString(),
        gender: newBaby.gender,
        colorTheme: newBaby.colorTheme,
      });
      await initializeBabies();
      setIsAddBabyOpen(false);
      setNewBaby({
        name: '',
        birthDate: new Date().toISOString().split('T')[0],
        gender: 'M',
        colorTheme: 'mint'
      });
    } catch (err) {
      console.error('아기 등록 실패:', err);
    }
  };

  const handleUpdateName = async () => {
    if (!displayName.trim()) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName.trim() }
      });
      if (error) throw error;
      setIsEditNameOpen(false);
    } catch (err) {
      console.error('이름 수정 실패:', err);
    }
  };

  return (
    <div className="animate-ios-in space-y-8 pb-10">
      <h2 className="text-3xl font-black tracking-tight text-[#1C1C1E]">설정</h2>

      {/* Profile Section */}
      <div 
        onClick={() => setIsEditNameOpen(true)}
        className="ios-glass p-5 flex items-center justify-between border border-white active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#1C1C1E]">
              {user?.user_metadata?.display_name || '양육자'}님
            </h3>
            <p className="text-xs font-medium text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
          <Edit2 size={14} />
        </div>
      </div>

      {/* Baby Settings */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">아기 설정</span>
          <button 
            onClick={() => setIsAddBabyOpen(true)}
            className="text-xs font-bold text-blue-500 flex items-center space-x-1"
          >
            <Plus size={14} />
            <span>추가</span>
          </button>
        </div>
        
        <div className="ios-glass divide-y divide-gray-50 overflow-hidden border border-white">
          {babies.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-gray-300">등록된 아기가 없습니다.</p>
            </div>
          ) : (
            babies.map((baby) => (
              <div key={baby.id} className="p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: baby.colorTheme === 'mint' ? '#30D15815' : '#FF375F15' }}
                  >
                    <Baby 
                      size={22} 
                      color={baby.colorTheme === 'mint' ? '#30D158' : '#FF375F'} 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1C1E]">{baby.name}</p>
                    <p className="text-[11px] font-medium text-gray-400">
                      생후 {Math.floor((new Date().getTime() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24))}일
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-200" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification & Logic Settings */}
      {babies.length > 0 && (
        <div className="space-y-8">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block px-1">알림 및 기능</span>
            <div className="ios-glass p-6 space-y-6 border border-white">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <Clock size={18} />
                    </div>
                    <span className="text-sm font-bold text-[#1C1C1E]">수유 주기</span>
                  </div>
                  <span className="text-sm font-black text-blue-500">
                    {Math.floor(feedingInterval / 60)}시간 {feedingInterval % 60 > 0 ? `${feedingInterval % 60}분` : ''}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="300" 
                  step="15"
                  value={feedingInterval}
                  onChange={(e) => setFeedingInterval(parseInt(e.target.value), firstBabyId)}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="h-px bg-gray-50" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Moon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1C1E]">밤잠 모드 자동화</p>
                    <p className="text-[10px] font-medium text-gray-400">밤잠 중 수유 알림 무음 처리</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMuteDuringNight(!muteDuringNight, firstBabyId)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${
                    muteDuringNight ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-200 ${
                    muteDuringNight ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block px-1">기록 항목 설정</span>
            <div className="ios-glass p-6 space-y-6 border border-white">
              {/* Category Selector for Settings */}
              <div className="bg-gray-50 p-1 rounded-xl flex space-x-1 mb-4">
                {['SOLID', 'SNACK', 'ACTIVITY', 'CUSTOM'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                      activeCategory === cat ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    {cat === 'SOLID' ? '이유식' : cat === 'SNACK' ? '간식' : cat === 'ACTIVITY' ? '활동' : '기타'}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {(customCategories[activeCategory] || []).map((type) => (
                  <div 
                    key={type} 
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 animate-ios-in"
                  >
                    <span className="text-xs font-bold text-blue-700">{type}</span>
                    <button 
                      onClick={() => removeCustomType(activeCategory, type, firstBabyId)}
                      className="text-blue-300 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {(customCategories[activeCategory] || []).length === 0 && (
                  <p className="text-xs text-gray-300 py-2">추가된 항목이 없습니다.</p>
                )}
              </div>

              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder={`${activeCategory === 'SOLID' ? '이유식' : activeCategory === 'SNACK' ? '간식' : activeCategory === 'ACTIVITY' ? '활동' : '기타'} 종류 추가`} 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-100 text-[#1C1C1E]"
                />
                <button 
                  onClick={handleAddType}
                  className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      <div className="ios-glass overflow-hidden border border-white">
        <button 
          onClick={signOut}
          className="w-full flex items-center space-x-4 p-5 text-red-500 active:bg-red-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="text-sm font-bold">로그아웃</span>
        </button>
      </div>

      {/* Custom iOS Modal - Light */}
      {isAddBabyOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAddBabyOpen(false)} />
          <div className="w-full max-w-md p-6 relative animate-ios-in rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-[#1C1C1E]">새 아기 등록</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase ml-1">이름</label>
                <input 
                  type="text" 
                  value={newBaby.name}
                  onChange={(e) => setNewBaby({...newBaby, name: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-[#1C1C1E] outline-none border border-gray-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase ml-1">생년월일</label>
                <input 
                  type="date" 
                  value={newBaby.birthDate}
                  onChange={(e) => setNewBaby({...newBaby, birthDate: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-[#1C1C1E] outline-none border border-gray-100"
                />
              </div>
              <div className="flex space-x-6">
                <div className="flex-1 space-y-2">
                  <span className="text-[11px] font-black text-gray-400 uppercase ml-1">성별</span>
                  <div className="flex p-1 bg-gray-50 rounded-xl space-x-1">
                    <button 
                      onClick={() => setNewBaby({...newBaby, gender: 'M'})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newBaby.gender === 'M' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'}`}
                    >남아</button>
                    <button 
                      onClick={() => setNewBaby({...newBaby, gender: 'F'})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newBaby.gender === 'F' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'}`}
                    >여아</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black text-gray-400 uppercase ml-1">테마 색상</span>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setNewBaby({...newBaby, colorTheme: 'mint'})}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all ${newBaby.colorTheme === 'mint' ? 'border-[#30D158] bg-[#30D158]/5' : 'border-transparent bg-gray-50'}`}
                  >
                    <div className="w-full h-2 bg-[#30D158] rounded-full mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Mint (A)</span>
                  </button>
                  <button 
                    onClick={() => setNewBaby({...newBaby, colorTheme: 'coral'})}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all ${newBaby.colorTheme === 'coral' ? 'border-[#FF375F] bg-[#FF375F]/5' : 'border-transparent bg-gray-50'}`}
                  >
                    <div className="w-full h-2 bg-[#FF375F] rounded-full mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Coral (B)</span>
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 pt-6">
                <button 
                  onClick={() => setIsAddBabyOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-400"
                >취소</button>
                <button 
                  onClick={handleAddBaby}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20"
                >등록하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {isEditNameOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsEditNameOpen(false)} />
          <div className="w-full max-w-md p-6 relative animate-ios-in rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-[#1C1C1E]">이름 변경</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase ml-1">새 이름</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="사용하실 이름을 입력하세요"
                  className="w-full bg-gray-50 rounded-2xl p-4 text-[#1C1C1E] outline-none border border-gray-100"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setIsEditNameOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-400"
                >취소</button>
                <button 
                  onClick={handleUpdateName}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20"
                >저장하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] font-bold text-gray-300 text-center uppercase tracking-widest pt-6">
        Twinkle v1.0.0-beta
      </p>
    </div>
  );
};
