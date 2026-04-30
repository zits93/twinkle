import { useState, useEffect } from 'react';
import { 
  Milk, 
  Moon, 
  Droplets, 
  Gamepad2,
  Stethoscope,
  Star
} from 'lucide-react';
import { useRecordStore } from '@entities/record';
import { useBabyStore } from '@entities/baby';
import { useSessionStore } from '@entities/session';
import { useUserSettingsStore } from '@entities/user-settings';
import type { BabyId, RecordCategory } from '@shared/types/record';

const CATEGORIES = [
  { id: 'FEEDING', label: '수유', icon: <Milk size={20} />, color: '#007AFF' },
  { id: 'SLEEP', label: '수면', icon: <Moon size={20} />, color: '#5856D6' },
  { id: 'DIAPER', label: '기저귀', icon: <Droplets size={20} />, color: '#FF9500' },
  { id: 'ACTIVITY', label: '활동', icon: <Gamepad2 size={20} />, color: '#30D158' },
  { id: 'HEALTH', label: '건강', icon: <Stethoscope size={20} />, color: '#FF3B30' },
  { id: 'CUSTOM', label: '기타', icon: <Star size={20} />, color: '#AF52DE' },
];

const FEEDING_TYPES = ['분유', '모유', '유축', '이유식', '간식', '물'];
const ACTIVITY_TYPES = ['목욕', '터미타임', '놀이', '산책'];
const HEALTH_TYPES = ['병원', '체온', '약', '접종'];

export const AddRecordForm = () => {
  const { babies } = useBabyStore();
  const [targetBaby, setTargetBaby] = useState<BabyId | 'BOTH'>('');
  const [category, setCategory] = useState<RecordCategory>('FEEDING');
  const [subCategory, setSubCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  
  const addRecord = useRecordStore((state) => state.addRecord);
  const addDualRecord = useRecordStore((state) => state.addDualRecord);
  const user = useSessionStore((state) => state.user);
  const { customCategories } = useUserSettingsStore();

  useEffect(() => {
    if (babies.length > 0 && !targetBaby) {
      setTargetBaby(babies[0].id);
    }
  }, [babies, targetBaby]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetBaby) return;
    
    const now = new Date();
    const baseRecord = {
      userId: user.id,
      category,
      subCategory: subCategory || '기본',
      value: amount ? parseFloat(amount) : undefined,
      startTime: now.toISOString(),
      note,
      createdAt: now.toISOString(),
    };

    try {
      if (targetBaby === 'BOTH' && babies.length >= 2) {
        const recordA = { ...baseRecord, id: crypto.randomUUID(), babyId: babies[0].id, isDual: true, syncGroupId: crypto.randomUUID() };
        const recordB = { ...baseRecord, id: crypto.randomUUID(), babyId: babies[1].id, isDual: true, syncGroupId: recordA.syncGroupId };
        await addDualRecord(recordA, recordB);
      } else {
        await addRecord({ ...baseRecord, id: crypto.randomUUID(), babyId: targetBaby as BabyId });
      }

      setAmount('');
      setNote('');
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  if (babies.length === 0) return null;

  return (
    <div className="mb-10 animate-ios-in">
      <h2 className="text-3xl font-black tracking-tight mb-6 text-[#1C1C1E]">기록</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* iOS Segmented Control - Light */}
        <div className="bg-black/5 p-1 rounded-2xl flex space-x-0.5 backdrop-blur-md">
          {babies.map((baby) => (
            <button
              key={baby.id}
              type="button"
              onClick={() => setTargetBaby(baby.id)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                targetBaby === baby.id ? 'bg-white text-black shadow-sm' : 'text-gray-400'
              }`}
            >
              {baby.name}
            </button>
          ))}
          {babies.length === 2 && (
            <button
              type="button"
              onClick={() => setTargetBaby('BOTH')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                targetBaby === 'BOTH' ? 'bg-white text-black shadow-sm' : 'text-gray-400'
              }`}
            >
              둘 다
            </button>
          )}
        </div>

        {/* Category Grid - Light */}
        <div className="ios-glass p-4 grid grid-cols-3 gap-3">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategory(item.id as RecordCategory);
                setSubCategory('');
              }}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                category === item.id ? 'bg-gray-50' : 'active:bg-gray-100'
              }`}
            >
              <div 
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-transform duration-200 ${
                  category === item.id ? 'scale-110 shadow-md' : 'opacity-30'
                }`}
                style={{ backgroundColor: category === item.id ? item.color : 'transparent' }}
              >
                <div style={{ color: category === item.id ? 'white' : item.color }}>
                  {item.icon}
                </div>
              </div>
              <span className={`text-[11px] font-bold ${
                category === item.id ? 'text-[#1C1C1E]' : 'text-gray-300'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Sub-Category Chips - Light */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {(category === 'FEEDING' ? FEEDING_TYPES : 
            category === 'ACTIVITY' ? ACTIVITY_TYPES : 
            category === 'HEALTH' ? HEALTH_TYPES : 
            category === 'CUSTOM' ? customCategories : ['기본']).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSubCategory(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                subCategory === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Value Inputs - Light */}
        <div className="ios-glass divide-y divide-gray-50">
          {(category === 'FEEDING' || subCategory === '체온' || subCategory === '몸무게') && (
            <div className="p-5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400">{subCategory || '수치'}</span>
              <div className="flex items-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent text-right font-black text-2xl w-24 outline-none text-[#1C1C1E] placeholder-gray-200"
                />
                <span className="ml-2 text-sm font-bold text-blue-500">ml</span>
              </div>
            </div>
          )}
          <div className="p-5">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="메모를 입력하세요"
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
