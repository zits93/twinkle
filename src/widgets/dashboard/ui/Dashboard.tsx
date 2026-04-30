import { Baby, Clock, Milk, Moon, Droplets, AlertCircle, PlusCircle, ChevronRight } from 'lucide-react';
import { useRecordStore } from '@entities/record';
import { useBabyStore } from '@entities/baby';
import { useFeedingStatus } from '@features/notify-feeding';
import { format, differenceInMinutes } from 'date-fns';

export const Dashboard = () => {
  const records = useRecordStore((state) => state.records);
  const { babies, isLoading } = useBabyStore();

  const getLatestRecord = (babyId: string, category: string) => {
    return records
      .filter((r) => r.babyId === babyId && r.category === category)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
  };

  const SummaryCard = ({ babyId, name, color }: { babyId: string, name: string, color: string }) => {
    const lastFeed = getLatestRecord(babyId, 'FEEDING');
    const lastSleep = getLatestRecord(babyId, 'SLEEP');
    const lastDiaper = getLatestRecord(babyId, 'DIAPER');
    const { status } = useFeedingStatus(babyId);

    const minutesSinceFeed = lastFeed 
      ? differenceInMinutes(new Date(), new Date(lastFeed.startTime)) 
      : null;

    return (
      <div className="ios-glass animate-ios-in p-6 flex-1 relative border-t-4" style={{ borderTopColor: color }}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${color}15` }}
            >
              <Baby size={22} color={color} />
            </div>
            <h3 className="text-xl font-black tracking-tight text-[#1C1C1E]">{name}</h3>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        {(status === 'HUNGRY' || status === 'OVERDUE') && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center border ${
            status === 'OVERDUE' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'
          }`}>
            <AlertCircle size={18} className={`mr-3 ${
              status === 'OVERDUE' ? 'text-red-500' : 'text-orange-500'
            }`} />
            <span className={`text-sm font-black tracking-tight ${
              status === 'OVERDUE' ? 'text-red-500' : 'text-orange-500'
            }`}>
              {status === 'OVERDUE' ? '수유 시간 지남' : '곧 수유 시간'}
            </span>
          </div>
        )}

        <div className="space-y-6">
          {[
            { icon: <Milk size={18} color="#007AFF" />, label: '마지막 수유', value: minutesSinceFeed !== null ? `${Math.floor(minutesSinceFeed / 60)}시간 ${minutesSinceFeed % 60}분 전` : '-' },
            { icon: <Moon size={18} color="#5856D6" />, label: '마지막 수면', value: lastSleep ? format(new Date(lastSleep.startTime), 'HH:mm') : '-' },
            { icon: <Droplets size={18} color="#FF9500" />, label: '기저귀 상태', value: lastDiaper ? format(new Date(lastDiaper.startTime), 'HH:mm') : '-' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-gray-400">{item.label}</span>
              </div>
              <span className="text-sm font-black text-[#1C1C1E]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-500 w-1/2 animate-[loading_1.5s_infinite]" />
        </div>
      </div>
    );
  }

  if (babies.length === 0) {
    return (
      <div className="py-16 text-center animate-ios-in">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8">
          <Baby size={48} className="text-gray-200" />
        </div>
        <h2 className="text-3xl font-black mb-3 tracking-tight">새로운 시작 👶</h2>
        <p className="text-gray-400 text-sm font-bold mb-10 px-12 leading-relaxed">
          트윙클의 화사한 리퀴드 환경에서 아기의 성장을 기록해 보세요.
        </p>
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('changeTab', { detail: 'SETTINGS' }));
          }}
          className="bg-blue-600 text-white rounded-2xl px-10 py-4 font-black flex items-center justify-center mx-auto space-x-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <PlusCircle size={22} />
          <span>아기 등록하기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="animate-ios-in">
      <header className="flex justify-between items-end mb-8">
        <h2 className="text-4xl font-black tracking-tighter">오늘</h2>
        <span className="text-sm font-black text-gray-300 uppercase tracking-widest">{format(new Date(), 'M월 d일')}</span>
      </header>

      {/* Baby Summary Row */}
      <div className="flex flex-col space-y-6 mb-10">
        {babies.map((baby) => (
          <SummaryCard 
            key={baby.id} 
            babyId={baby.id} 
            name={baby.name} 
            color={baby.colorTheme === 'mint' ? '#30D158' : '#FF375F'} 
          />
        ))}
      </div>

      {/* Grouped Info Section */}
      <div className="mb-4 ml-1">
        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">인텔리전트 분석</span>
      </div>
      <div className="ios-glass overflow-hidden divide-y divide-gray-50">
        <div className="p-5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shadow-sm">
              <Clock size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-black text-[#1C1C1E]">패턴 안정도</p>
              <p className="text-[11px] text-gray-400 font-bold">아이들의 리듬이 안정적으로 유지되고 있습니다.</p>
            </div>
          </div>
          <div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <span className="text-[10px] font-black text-green-500">EXCELLENT</span>
          </div>
        </div>
        <div className="p-5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shadow-sm">
              <AlertCircle size={20} className="text-orange-500" />
            </div>
            <p className="text-sm font-black text-[#1C1C1E]">다음 예상 일정</p>
          </div>
          <span className="text-xs text-gray-400 font-black">분석 중</span>
        </div>
      </div>
    </div>
  );
};
