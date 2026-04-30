import { useState, useEffect } from 'react';
import { 
  Milk, 
  Moon, 
  Droplets, 
  Gamepad2,
  Stethoscope,
  Star,
  Utensils,
  Apple,
  Droplet,
  Clock,
  Plus,
  Minus,
  X,
  Scale,
  Ruler
} from 'lucide-react';
import { useRecordStore } from '@entities/record';
import { useBabyStore } from '@entities/baby';
import { useSessionStore } from '@entities/session';
import { useUserSettingsStore } from '@entities/user-settings';
import type { BabyId, RecordCategory } from '@shared/types/record';

const CATEGORIES = [
  { id: 'FEEDING', label: '수유', icon: <Milk size={20} />, color: '#007AFF' },
  { id: 'SOLID', label: '이유식', icon: <Utensils size={20} />, color: '#5856D6' },
  { id: 'SNACK', label: '간식', icon: <Apple size={20} />, color: '#FF9500' },
  { id: 'GROWTH', label: '성장', icon: <Scale size={20} />, color: '#FF2D55' },
  { id: 'WATER', label: '물', icon: <Droplet size={20} />, color: '#00BFFF' },
  { id: 'SLEEP', label: '수면', icon: <Moon size={20} />, color: '#AF52DE' },
  { id: 'DIAPER', label: '기저귀', icon: <Droplets size={20} />, color: '#FFCC00' },
  { id: 'ACTIVITY', label: '활동', icon: <Gamepad2 size={20} />, color: '#30D158' },
  { id: 'HEALTH', label: '건강', icon: <Stethoscope size={20} />, color: '#FF3B30' },
  { id: 'CUSTOM', label: '기타', icon: <Star size={20} />, color: '#8E8E93' },
];

const FEEDING_TYPES = ['분유', '모유', '유축'];
const SOLID_TYPES = ['미음', '소고기', '과일', '채소'];
const SNACK_TYPES = ['우유', '퓨레', '치즈'];
const GROWTH_TYPES = ['체중', '키'];
const SLEEP_TYPES = ['낮잠', '밤잠'];
const DIAPER_TYPES = ['소변', '대변'];
const ACTIVITY_TYPES = ['목욕', '터미타임', '놀이', '산책'];
const HEALTH_TYPES = ['병원', '체온', '약', '접종'];

const POO_COLORS = [
  { name: '노랑', color: '#F8D66D' },
  { name: '옅은갈색', color: '#D2B48C' },
  { name: '짙은갈색', color: '#8B4513' },
  { name: '녹색', color: '#556B2F' },
  { name: '붉은색', color: '#B22222' },
  { name: '흰색', color: '#FFFFFF' },
];

export const AddRecordForm = () => {
  const { babies } = useBabyStore();
  const { records, addRecord, addDualRecord } = useRecordStore();
  const user = useSessionStore((state) => state.user);
  const { customCategories, addCustomType } = useUserSettingsStore();

  const [targetBaby, setTargetBaby] = useState<BabyId | 'BOTH'>('');
  const [category, setCategory] = useState<RecordCategory>('FEEDING');
  const [subCategory, setSubCategory] = useState<string>('분유');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  
  const [startTime, setStartTime] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = useState('');
  const [pooColor, setPooColor] = useState('노랑');
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  // Initialize target baby
  useEffect(() => {
    if (babies.length > 0 && !targetBaby) {
      setTargetBaby(babies[0].id);
    }
  }, [babies, targetBaby]);

  // Load last record data and set defaults
  useEffect(() => {
    const lastRecord = records.find(r => r.category === category);
    
    if (lastRecord) {
      setSubCategory(lastRecord.subCategory);
      setAmount(lastRecord.value?.toString() || '');
    } else {
      if (category === 'FEEDING') setSubCategory('분유');
      else if (category === 'SOLID') setSubCategory('미음');
      else if (category === 'SNACK') setSubCategory('우유');
      else if (category === 'GROWTH') setSubCategory('체중');
      else if (category === 'SLEEP') setSubCategory('낮잠');
      else if (category === 'DIAPER') setSubCategory('소변');
      else if (category === 'ACTIVITY') setSubCategory('목욕');
      else if (category === 'HEALTH') setSubCategory('병원');
      else setSubCategory('기본');
      setAmount('');
    }
  }, [category, records]);

  const handleAdjustAmount = (delta: number) => {
    const current = parseFloat(amount) || 0;
    const next = Math.max(0, current + delta);
    // For weight/height, we might want decimal precision
    setAmount(category === 'GROWTH' ? next.toFixed(2).replace(/\.?0+$/, '') : next.toString());
  };

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    const firstBabyId = babies[0]?.id;
    await addCustomType(category, newTypeName.trim(), firstBabyId);
    setSubCategory(newTypeName.trim());
    setNewTypeName('');
    setIsAddingType(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetBaby) return;
    
    const baseRecord = {
      userId: user.id,
      category,
      subCategory: subCategory || '기본',
      value: amount ? parseFloat(amount) : undefined,
      startTime: new Date(startTime).toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
      note,
      metadata: category === 'DIAPER' && subCategory === '대변' ? { pooColor } : {},
      createdAt: new Date().toISOString(),
    };

    try {
      if (targetBaby === 'BOTH' && babies.length >= 2) {
        const recordA = { ...baseRecord, id: crypto.randomUUID(), babyId: babies[0].id, isDual: true, syncGroupId: crypto.randomUUID() };
        const recordB = { ...baseRecord, id: crypto.randomUUID(), babyId: babies[1].id, isDual: true, syncGroupId: recordA.syncGroupId };
        await addDualRecord(recordA, recordB);
      } else {
        await addRecord({ ...baseRecord, id: crypto.randomUUID(), babyId: targetBaby as BabyId } as any);
      }

      setNote('');
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return null;
    const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분 자는 중`;
  };

  const getSubCategories = () => {
    const base = category === 'FEEDING' ? FEEDING_TYPES : 
                 category === 'SOLID' ? SOLID_TYPES :
                 category === 'SNACK' ? SNACK_TYPES :
                 category === 'GROWTH' ? GROWTH_TYPES :
                 category === 'SLEEP' ? SLEEP_TYPES :
                 category === 'DIAPER' ? DIAPER_TYPES :
                 category === 'ACTIVITY' ? ACTIVITY_TYPES : 
                 category === 'HEALTH' ? HEALTH_TYPES : [];
    
    const custom = customCategories[category] || [];
    return [...base, ...custom];
  };

  const getUnit = () => {
    if (['FEEDING', 'SOLID', 'SNACK', 'WATER'].includes(category)) return 'ml';
    if (category === 'GROWTH') {
      return subCategory === '키' ? 'cm' : 'kg';
    }
    return '';
  };

  const currentBaby = babies.find(b => b.id === targetBaby) || babies[0];
  const themeColor = currentBaby?.colorTheme || '#30D158';

  if (babies.length === 0) return null;

  return (
    <div className="mb-10 animate-ios-in">
      <h2 className="text-3xl font-black tracking-tight mb-6 text-[#1C1C1E]">기록</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baby Selector */}
        <div className="bg-gray-100 p-1 rounded-2xl flex space-x-1">
          {babies.map((baby) => (
            <button
              key={baby.id}
              type="button"
              onClick={() => setTargetBaby(baby.id)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                targetBaby === baby.id ? 'bg-white shadow-sm' : 'text-gray-400'
              }`}
              style={{ color: targetBaby === baby.id ? themeColor : undefined }}
            >
              {baby.name}
            </button>
          ))}
          {babies.length === 2 && (
            <button
              type="button"
              onClick={() => setTargetBaby('BOTH')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                targetBaby === 'BOTH' ? 'bg-white shadow-sm' : 'text-gray-400'
              }`}
              style={{ color: targetBaby === 'BOTH' ? themeColor : undefined }}
            >
              둘 다
            </button>
          )}
        </div>

        {/* Category Grid */}
        <div className="ios-glass p-3 grid grid-cols-5 gap-1 border border-white">
          {CATEGORIES.map((item) => {
            const isActive = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id as RecordCategory)}
                className="flex flex-col items-center py-2 group"
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-all ${
                    isActive ? 'shadow-lg scale-110' : 'opacity-20 hover:opacity-40'
                  }`}
                  style={{ 
                    backgroundColor: isActive ? item.color : 'transparent',
                    boxShadow: isActive ? `0 8px 20px ${item.color}40` : 'none'
                  }}
                >
                  <div style={{ color: isActive ? 'white' : item.color }}>
                    {item.icon}
                  </div>
                </div>
                <span className={`text-[9px] font-black tracking-tighter ${
                  isActive ? 'text-[#1C1C1E]' : 'text-gray-300'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Category Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          {getSubCategories().map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSubCategory(type)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                subCategory === type ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-gray-400 border border-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
          {['SOLID', 'SNACK', 'ACTIVITY', 'CUSTOM', 'GROWTH'].includes(category) && (
            <button
              type="button"
              onClick={() => setIsAddingType(true)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-gray-50 text-gray-400 border border-dashed border-gray-200 flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>추가</span>
            </button>
          )}
        </div>

        {/* Add Type Input Modal/Overlay */}
        {isAddingType && (
          <div className="ios-glass p-4 border border-blue-100 bg-blue-50/30 animate-ios-in">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                autoFocus
                placeholder="새로운 종류 입력"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
                className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm outline-none border border-blue-100"
              />
              <button 
                onClick={handleAddType}
                className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg"
              >
                <Plus size={20} />
              </button>
              <button 
                onClick={() => setIsAddingType(false)}
                className="text-gray-400 p-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Main Form Fields */}
        <div className="ios-glass divide-y divide-gray-50 border border-white overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-300" />
              <span className="text-xs font-bold text-gray-400">시작 시간</span>
            </div>
            <input 
              type="datetime-local" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#1C1C1E] outline-none"
            />
          </div>

          {category === 'SLEEP' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">종료 시간</span>
                </div>
                <input 
                  type="datetime-local" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent text-sm font-bold text-[#1C1C1E] outline-none"
                />
              </div>
              {endTime && (
                <div className="bg-blue-50/50 p-3 rounded-xl text-center">
                  <span className="text-xs font-bold text-blue-600">{calculateDuration()}</span>
                </div>
              )}
            </div>
          )}

          {['FEEDING', 'SOLID', 'SNACK', 'WATER', 'GROWTH'].includes(category) && (
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-400">값 ({getUnit()})</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    step={category === 'GROWTH' ? '0.01' : '5'}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-right font-black text-4xl w-32 outline-none text-[#1C1C1E]"
                    placeholder="0"
                  />
                  <span className="ml-2 font-bold text-blue-500">{getUnit()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {(category === 'GROWTH' ? [-1, -0.5, -0.1, 0.1, 0.5, 1] : [-20, -10, -5, 5, 10, 20]).map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAdjustAmount(val)}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all ${
                      val > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    } active:scale-90`}
                  >
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
              </div>

              {category !== 'GROWTH' && (
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120, 150, 180, 210, 240].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="py-2.5 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 active:bg-gray-100"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {category === 'DIAPER' && subCategory === '대변' && (
            <div className="p-4 space-y-3">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">변 색상</span>
              <div className="flex justify-between px-1">
                {POO_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setPooColor(c.name)}
                    className={`group flex flex-col items-center space-y-2`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        pooColor === c.name ? 'border-blue-500 scale-125 shadow-sm' : 'border-white'
                      }`}
                      style={{ backgroundColor: c.color }}
                    />
                    <span className={`text-[8px] font-bold ${
                      pooColor === c.name ? 'text-blue-500' : 'text-gray-300'
                    }`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이사항이나 메모를 남겨주세요"
              rows={2}
              className="bg-transparent w-full outline-none text-sm font-medium text-[#1C1C1E] placeholder-gray-300 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg active:scale-[0.98] transition-transform shadow-xl shadow-blue-500/20"
        >
          기록 완료
        </button>
      </form>
    </div>
  );
};


