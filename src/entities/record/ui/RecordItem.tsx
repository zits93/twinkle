import { Milk, Moon, Droplets, Baby, Gamepad2, Stethoscope, Star } from 'lucide-react';
import type { RecordEntry } from '@shared/types/record';
import { format } from 'date-fns';
import { useBabyStore } from '@entities/baby';

interface RecordItemProps {
  record: RecordEntry;
}

const categoryIcons: Record<string, React.ReactNode> = {
  FEEDING: <Milk size={16} />,
  SLEEP: <Moon size={16} />,
  DIAPER: <Droplets size={16} />,
  ACTIVITY: <Gamepad2 size={16} />,
  HEALTH: <Stethoscope size={16} />,
  CUSTOM: <Star size={16} />,
};

export const RecordItem = ({ record }: RecordItemProps) => {
  const { babies } = useBabyStore();
  const baby = babies.find(b => b.id === record.babyId);
  const color = baby?.colorTheme === 'mint' ? '#30D158' : '#FF375F';
  
  return (
    <div className="ios-glass p-4 mb-3 flex items-center justify-between border-l-4 bg-white/60" style={{ borderColor: color }}>
      <div className="flex items-center space-x-4">
        <div style={{ color }}>
          {categoryIcons[record.category] || <Baby size={16} />}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-[#1C1C1E]">
              {record.category === 'FEEDING' ? `${record.value}ml` : 
               record.category === 'SLEEP' ? '수면' : 
               record.category === 'DIAPER' ? '기저귀' : record.category}
            </span>
            {record.isDual && (
              <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-md border border-blue-100">동시</span>
            )}
          </div>
          <p className="text-[11px] font-medium text-gray-400 mt-0.5">
            {format(new Date(record.startTime), 'HH:mm')} • {record.note || '메모 없음'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[11px] font-black" style={{ color }}>
          {baby?.name || '알 수 없음'}
        </span>
      </div>
    </div>
  );
};
