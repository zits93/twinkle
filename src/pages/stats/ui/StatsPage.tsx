import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { GrowthChart } from '@features/view-growth-chart/ui/GrowthChart';

export const StatsPage = () => {
  
  // Mock data for Daily Feeding Amount
  const feedingData = [
    { day: '월', babyA: 850, babyB: 800 },
    { day: '화', babyA: 900, babyB: 820 },
    { day: '수', babyA: 880, babyB: 850 },
    { day: '목', babyA: 920, babyB: 870 },
    { day: '금', babyA: 950, babyB: 900 },
    { day: '토', babyA: 820, babyB: 780 },
    { day: '일', babyA: 890, babyB: 840 },
  ];

  const babyAData = [
    { month: 0, weight: 3.2 },
    { month: 1, weight: 4.5 },
    { month: 2, weight: 5.8 },
    { month: 3, weight: 6.7 },
  ];

  const babyBData = [
    { month: 0, weight: 3.0 },
    { month: 1, weight: 4.1 },
    { month: 2, weight: 5.2 },
    { month: 3, weight: 6.1 },
  ];

  return (
    <div className="animate-ios-in space-y-8 pb-10">
      <h2 className="text-3xl font-black tracking-tight text-[#1C1C1E]">성장 통계</h2>

      <div className="space-y-8">
        {/* Daily Feeding Chart */}
        <div className="ios-glass p-6 h-[400px]">
          <h3 className="text-lg font-bold mb-8 tracking-tight text-[#1C1C1E]">일간 총 수유량 추이</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '0.5px solid rgba(0,0,0,0.05)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="babyA" name="아기 A" fill="#30D158" radius={[8, 8, 0, 0]} />
                <Bar dataKey="babyB" name="아기 B" fill="#FF375F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <GrowthChart 
            gender="male" 
            babyName="아기 A" 
            babyData={babyAData} 
          />

          <GrowthChart 
            gender="female" 
            babyName="아기 B" 
            babyData={babyBData} 
          />
        </div>
        
        <div className="ios-glass p-8">
          <h3 className="text-lg font-bold mb-8 tracking-tight text-[#1C1C1E]">패턴 요약</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">평균 수유량 (A)</span>
              <p className="text-3xl font-black mt-2 text-[#1C1C1E]">160<span className="text-sm ml-1 text-gray-400">ml</span></p>
            </div>
            <div className="p-5 bg-pink-50 rounded-2xl border border-pink-100 shadow-sm">
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">평균 수유량 (B)</span>
              <p className="text-3xl font-black mt-2 text-[#1C1C1E]">140<span className="text-sm ml-1 text-gray-400">ml</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
