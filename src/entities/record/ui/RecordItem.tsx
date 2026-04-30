import { 
  Milk, 
  Moon, 
  Droplets, 
  Baby, 
  Gamepad2, 
  Stethoscope, 
  Star,
  Utensils,
  Apple,
  Droplet,
  GlassWater
} from 'lucide-react';
import type { RecordEntry } from '@shared/types/record';
import { format, differenceInMinutes } from 'date-fns';
import { useBabyStore } from '@entities/baby';

interface RecordItemProps {
  record: RecordEntry;
}

const categoryIcons: Record<string, React.ReactNode> = {
  FEEDING: <Milk size={16} />,
  SOLID: <Utensils size={16} />,
  SNACK: <Apple size={16} />,
  WATER: <Droplet size={16} />,
  MILK: <GlassWater size={16} />,
  SLEEP: <Moon size={16} />,
  DIAPER: <Droplets size={16} />,
  ACTIVITY: <Gamepad2 size={16} />,
  HEALTH: <Stethoscope size={16} />,
  CUSTOM: <Star size={16} />,
};

const POO_COLORS: Record<string, string> = {
  '노랑': '#F8D66D',
  '옅은갈색': '#D2B48C',
  '짙은갈색': '#8B4513',
  '녹색': '#556B2F',
  '붉은색': '#B22222',
  '흰색': '#FFFFFF',
};

const categoryLabels: Record<string, string> = {
  FEEDING: '수유',
  SOLID: '이유식',
  SNACK: '간식',
  WATER: '물',
  MILK: '우유',
  SLEEP: '수면',
  DIAPER: '기저귀',
  ACTIVITY: '활동',
  HEALTH: '건강',
  CUSTOM: '기타',
};

export const RecordItem = ({ record }: RecordItemProps) => {
  const { babies } = useBabyStore();
  const baby = babies.find(b => b.id === record.babyId);
  const themeColor = baby?.colorTheme === 'mint' ? '#30D158' : '#FF375F';

  const renderValue = () => {
    const label = categoryLabels[record.category] || record.category;
    
    if (['FEEDING', 'SOLID', 'SNACK', 'WATER', 'MILK'].includes(record.category)) {
      const amount = record.value ? `${record.value}ml` : '';
      const type = record.subCategory && record.subCategory !== '기본' ? `(${record.subCategory})` : '';
      return `${label} ${amount} ${type}`.trim();
    }
    
    if (record.category === 'SLEEP') {
      if (record.endTime) {
        const mins = differenceInMinutes(new Date(record.endTime), new Date(record.startTime));
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        const duration = h > 0 ? `${h}시간 ${m}분` : `${m}분`;
        return `${label} ${duration}`;
      }
      return `${label} 중...`;
    }

    if (record.category === 'DIAPER') {
      return `${label} (${record.subCategory || '기본'})`;
    }

    return `${label} (${record.subCategory || '기본'})`;
  };
  
  return (
    <div className="ios-glass p-4 mb-2 flex items-center justify-between border border-white bg-white/40 active:scale-[0.98] transition-transform">
      <div className="flex items-center space-x-4">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
        >
          {categoryIcons[record.category] || <Baby size={18} />}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-[#1C1C1E]">
              {renderValue()}
            </span>
            {record.isDual && (
              <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-md border border-blue-100 uppercase">Dual</span>
            )}
            {record.category === 'DIAPER' && record.subCategory === '대변' && record.metadata?.pooColor && (
              <div 
                className="w-3 h-3 rounded-full border border-gray-100 shadow-sm" 
                style={{ backgroundColor: POO_COLORS[record.metadata.pooColor] }}
                title={record.metadata.pooColor}
              />
            )}
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5">
            {format(new Date(record.startTime), 'HH:mm')} • {record.note || categoryLabels[record.category] || record.category}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black px-2 py-1 rounded-lg" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
          {baby?.name || 'Unknown'}
        </span>
      </div>
    </div>
  );
};
