import { 
  Moon, 
  Clock, 
  User, 
  Baby, 
  ChevronRight,
  LogOut,
  Plus,
  Zap,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useUserSettingsStore } from '@entities/user-settings';
import { useSessionStore } from '@entities/session';
import { useBabyStore } from '@entities/baby';
import { useRecordStore } from '@entities/record';
import { babyService } from '@entities/baby/api/babyService';
import { supabase } from '@shared/api/supabase';
import { Edit2 } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';
import type { BabyProfile } from '@shared/types/record';

export const SettingsPage = () => {
  const { babies, initializeBabies, updateBaby, deleteBaby } = useBabyStore();
  const { records } = useRecordStore();
  const firstBabyId = babies[0]?.id;

  const { 
    feedingInterval, 
    autoFeedingInterval,
    muteDuringNight, 
    autoNightMode,
    nightStartTime,
    nightEndTime,
    updateSettings
  } = useUserSettingsStore();

  const { user, signOut } = useSessionStore();

  const [isAddBabyOpen, setIsAddBabyOpen] = useState(false);
  const [isEditBabyOpen, setIsEditBabyOpen] = useState(false);
  const [editingBabyId, setEditingBabyId] = useState<string | null>(null);

  const [babyForm, setBabyForm] = useState({
    name: '',
    birthDate: new Date().toISOString().split('T')[0],
    gender: 'M' as 'M' | 'F',
    colorTheme: '#30D158'
  });

  const PRESET_COLORS = [
    { name: 'Mint', hex: '#30D158' },
    { name: 'Coral', hex: '#FF375F' },
    { name: 'Blue', hex: '#007AFF' },
    { name: 'Indigo', hex: '#5856D6' },
    { name: 'Orange', hex: '#FF9500' },
    { name: 'Teal', hex: '#64D2FF' },
    { name: 'Purple', hex: '#BF5AF2' },
    { name: 'Pink', hex: '#FF2D55' },
    { name: 'Yellow', hex: '#FFD60A' },
  ];

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '양육자');

  // Calculate Auto Feeding Interval
  const calculatedInterval = useMemo(() => {
    if (!firstBabyId) return 180;
    const feedingRecords = records
      .filter(r => r.babyId === firstBabyId && r.category === 'FEEDING')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 11); // Need 11 to get 10 intervals

    if (feedingRecords.length < 3) return 180;

    const intervals = [];
    for (let i = 0; i < feedingRecords.length - 1; i++) {
      const diff = differenceInMinutes(new Date(feedingRecords[i].startTime), new Date(feedingRecords[i+1].startTime));
      if (diff > 60 && diff < 420) { // Valid interval between 1h and 7h
        intervals.push(diff);
      }
    }

    if (intervals.length === 0) return 180;
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(avg / 10) * 10; // Round to 10 mins
  }, [records, firstBabyId]);

  const handleOpenAddBaby = () => {
    setBabyForm({
      name: '',
      birthDate: new Date().toISOString().split('T')[0],
      gender: 'M',
      colorTheme: '#30D158'
    });
    setIsAddBabyOpen(true);
  };

  const handleOpenEditBaby = (baby: BabyProfile) => {
    setEditingBabyId(baby.id);
    setBabyForm({
      name: baby.name,
      birthDate: new Date(baby.birthDate).toISOString().split('T')[0],
      gender: baby.gender,
      colorTheme: baby.colorTheme
    });
    setIsEditBabyOpen(true);
  };

  const handleAddBaby = async () => {
    if (!babyForm.name) return;
    try {
      await babyService.createBaby({
        name: babyForm.name,
        birthDate: new Date(babyForm.birthDate).toISOString(),
        gender: babyForm.gender,
        colorTheme: babyForm.colorTheme,
      });
      await initializeBabies();
      setIsAddBabyOpen(false);
    } catch (err) {
      console.error('아기 등록 실패:', err);
    }
  };

  const handleUpdateBaby = async () => {
    if (!editingBabyId || !babyForm.name) return;
    try {
      await updateBaby(editingBabyId, {
        name: babyForm.name,
        birthDate: new Date(babyForm.birthDate).toISOString(),
        gender: babyForm.gender,
        colorTheme: babyForm.colorTheme,
      });
      setIsEditBabyOpen(false);
    } catch (err) {
      console.error('아기 수정 실패:', err);
    }
  };

  const handleDeleteBaby = async () => {
    if (!editingBabyId || !window.confirm('정말 삭제하시겠습니까? 관련 기록이 모두 삭제됩니다.')) return;
    try {
      await deleteBaby(editingBabyId);
      setIsEditBabyOpen(false);
    } catch (err) {
      console.error('아기 삭제 실패:', err);
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

  const currentFeedingInterval = autoFeedingInterval ? calculatedInterval : feedingInterval;

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
            onClick={handleOpenAddBaby}
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
              <div 
                key={baby.id} 
                onClick={() => handleOpenEditBaby(baby)}
                className="p-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${baby.colorTheme}15` }}
                  >
                    <Baby 
                      size={22} 
                      color={baby.colorTheme} 
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
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block px-1">스마트 수유 설정</span>
            <div className="ios-glass p-6 space-y-6 border border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1C1E]">수유 주기 자동 계산</p>
                    <p className="text-[10px] font-medium text-gray-400">최근 패턴 분석 기반 제안</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateSettings(firstBabyId, { autoFeedingInterval: !autoFeedingInterval })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${
                    autoFeedingInterval ? 'bg-orange-500' : 'bg-gray-100'
                  }`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-200 ${
                    autoFeedingInterval ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className={`space-y-5 transition-opacity ${autoFeedingInterval ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <Clock size={18} />
                    </div>
                    <span className="text-sm font-bold text-[#1C1C1E]">권장 주기</span>
                  </div>
                  <span className="text-sm font-black text-blue-500">
                    {Math.floor(currentFeedingInterval / 60)}시간 {currentFeedingInterval % 60 > 0 ? `${currentFeedingInterval % 60}분` : ''}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="300" 
                  step="15"
                  disabled={autoFeedingInterval}
                  value={feedingInterval}
                  onChange={(e) => updateSettings(firstBabyId, { feedingInterval: parseInt(e.target.value) })}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              {autoFeedingInterval && (
                <div className="bg-orange-50/50 p-3 rounded-xl flex items-center space-x-2 border border-orange-100 animate-ios-in">
                  <Sparkles size={14} className="text-orange-500" />
                  <p className="text-[11px] font-bold text-orange-600">최근 패턴을 분석하여 {Math.floor(calculatedInterval / 60)}시간 {calculatedInterval % 60}분으로 설정되었습니다.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block px-1">밤잠 모드 최적화</span>
            <div className="ios-glass p-6 space-y-6 border border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Moon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1C1E]">밤잠 중 알림 무음</p>
                    <p className="text-[10px] font-medium text-gray-400">수유 알림 소리 끄기</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateSettings(firstBabyId, { muteDuringNight: !muteDuringNight })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${
                    muteDuringNight ? 'bg-indigo-500' : 'bg-gray-100'
                  }`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-200 ${
                    muteDuringNight ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="h-px bg-gray-50" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1C1E]">밤잠 구간 설정</span>
                  <div className="flex p-1 bg-gray-50 rounded-xl space-x-1">
                    <button 
                      onClick={() => updateSettings(firstBabyId, { autoNightMode: false })}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${!autoNightMode ? 'bg-white text-indigo-500 shadow-sm' : 'text-gray-400'}`}
                    >수동</button>
                    <button 
                      onClick={() => updateSettings(firstBabyId, { autoNightMode: true })}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${autoNightMode ? 'bg-white text-indigo-500 shadow-sm' : 'text-gray-400'}`}
                    >자동 감지</button>
                  </div>
                </div>

                {!autoNightMode ? (
                  <div className="flex items-center space-x-2 animate-ios-in">
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">시작</p>
                      <input 
                        type="time" 
                        value={nightStartTime}
                        onChange={(e) => updateSettings(firstBabyId, { nightStartTime: e.target.value })}
                        className="bg-transparent text-sm font-black text-[#1C1C1E] outline-none"
                      />
                    </div>
                    <div className="w-4 h-px bg-gray-200" />
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">종료</p>
                      <input 
                        type="time" 
                        value={nightEndTime}
                        onChange={(e) => updateSettings(firstBabyId, { nightEndTime: e.target.value })}
                        className="bg-transparent text-sm font-black text-[#1C1C1E] outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 animate-ios-in">
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles size={14} className="text-indigo-500" />
                      <p className="text-xs font-black text-indigo-600">지능형 밤잠 감지 중</p>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-400 leading-relaxed">
                      8시간 이상의 연속 수면 패턴이 감지되면 자동으로 밤잠 모드로 전환됩니다.
                    </p>
                  </div>
                )}
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

      {/* Add/Edit Baby Modal */}
      {(isAddBabyOpen || isEditBabyOpen) && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setIsAddBabyOpen(false); setIsEditBabyOpen(false); }} />
          <div className="w-full max-w-md p-6 relative animate-ios-in rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#1C1C1E]">
                {isAddBabyOpen ? '새 아기 등록' : '아기 정보 수정'}
              </h3>
              {isEditBabyOpen && (
                <button 
                  onClick={handleDeleteBaby}
                  className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase ml-1">이름</label>
                <input 
                  type="text" 
                  value={babyForm.name}
                  onChange={(e) => setBabyForm({...babyForm, name: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-[#1C1C1E] outline-none border border-gray-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase ml-1">생년월일</label>
                <input 
                  type="date" 
                  value={babyForm.birthDate}
                  onChange={(e) => setBabyForm({...babyForm, birthDate: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-[#1C1C1E] outline-none border border-gray-100"
                />
              </div>
              <div className="flex space-x-6">
                <div className="flex-1 space-y-2">
                  <span className="text-[11px] font-black text-gray-400 uppercase ml-1">성별</span>
                  <div className="flex p-1 bg-gray-50 rounded-xl space-x-1">
                    <button 
                      onClick={() => setBabyForm({...babyForm, gender: 'M'})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${babyForm.gender === 'M' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'}`}
                    >남아</button>
                    <button 
                      onClick={() => setBabyForm({...babyForm, gender: 'F'})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${babyForm.gender === 'F' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'}`}
                    >여아</button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-black text-gray-400 uppercase ml-1">테마 색상</span>
                <div className="grid grid-cols-5 gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setBabyForm({ ...babyForm, colorTheme: color.hex })}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center border-2 ${
                        babyForm.colorTheme === color.hex ? 'border-gray-200 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {babyForm.colorTheme === color.hex && (
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-6">
                <button 
                  onClick={() => { setIsAddBabyOpen(false); setIsEditBabyOpen(false); }}
                  className="flex-1 py-4 font-bold text-gray-400"
                >취소</button>
                <button 
                  onClick={isAddBabyOpen ? handleAddBaby : handleUpdateBaby}
                  className="flex-1 py-4 text-white font-black rounded-2xl shadow-xl transition-all"
                  style={{ 
                    backgroundColor: babyForm.colorTheme,
                    boxShadow: `0 10px 25px ${babyForm.colorTheme}40`
                  }}
                >
                  {isAddBabyOpen ? '등록하기' : '저장하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {isEditNameOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 sm:p-4">
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
