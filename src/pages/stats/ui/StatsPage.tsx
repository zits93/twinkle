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
import { useRecordStore } from '@entities/record';
import { useBabyStore } from '@entities/baby';
import { format, subDays, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export const StatsPage = () => {
  const { records } = useRecordStore();
  const { babies } = useBabyStore();

  // Calculate Last 7 Days Feeding Trend
  const feedingTrend = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayLabel = format(date, 'eee', { locale: ko });
    
    const dayData: any = { day: dayLabel };
    
    babies.forEach((baby, index) => {
      const dailyTotal = records
        .filter(r => 
          r.babyId === baby.id && 
          r.category === 'FEEDING' && 
          isSameDay(new Date(r.startTime), date)
        )
        .reduce((sum, r) => sum + (r.value || 0), 0);
      
      const key = index === 0 ? 'babyA' : 'babyB';
      dayData[key] = dailyTotal;
      dayData[`${key}Name`] = baby.name;
    });
    
    return dayData;
  }).filter(() => babies.length > 0);

  // Calculate Average Feeding (Last 7 days)
  const getAverageFeeding = (babyId: string) => {
    const feedingRecords = records.filter(r => 
      r.babyId === babyId && 
      r.category === 'FEEDING' && 
      new Date(r.startTime) > subDays(new Date(), 7)
    );
    if (feedingRecords.length === 0) return 0;
    const total = feedingRecords.reduce((sum, r) => sum + (r.value || 0), 0);
    return Math.round(total / feedingRecords.length);
  };


  return (
    <div className="animate-ios-in space-y-8 pb-10">
      <h2 className="text-3xl font-black tracking-tight text-[#1C1C1E]">성장 통계</h2>

      <div className="space-y-8">
        {/* Daily Feeding Chart */}
        <div className="ios-glass p-6 h-[400px] border border-white">
          <h3 className="text-lg font-bold mb-8 tracking-tight text-[#1C1C1E]">일간 총 수유량 추이</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontWeight: 600, fill: '#636366' }}
                />
                <YAxis 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontWeight: 600, fill: '#636366' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '20px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontWeight: 'bold', color: '#636366', marginBottom: '4px' }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} 
                />
                {babies.map((baby, index) => {
                  const key = index === 0 ? 'babyA' : 'babyB';
                  const color = baby.colorTheme;
                  return (
                    <Bar 
                      key={baby.id}
                      dataKey={key} 
                      name={baby.name} 
                      fill={color} 
                      radius={[8, 8, 0, 0]} 
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          {babies.map((baby, idx) => {
            // Filter real growth data for this baby (Group by month)
            const growthByMonth = records
              .filter(r => r.babyId === baby.id && r.category === 'GROWTH')
              .reduce((acc: any, r) => {
                const month = Math.floor(Math.abs(new Date(r.startTime).getTime() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
                if (!acc[month]) acc[month] = { month };
                if (r.subCategory === '체중') acc[month].weight = r.value;
                if (r.subCategory === '키') acc[month].height = r.value;
                return acc;
              }, {});

            const babyGrowthRecords = Object.values(growthByMonth).sort((a: any, b: any) => a.month - b.month);
            
            // Temporary mock data if no real records exist
            const mockData = idx === 0 
              ? [
                  { month: 0, weight: 3.2, height: 49.9 },
                  { month: 1, weight: 4.5, height: 54.7 },
                  { month: 2, weight: 5.8, height: 58.4 },
                ]
              : [
                  { month: 0, weight: 3.0, height: 49.1 },
                  { month: 1, weight: 4.1, height: 53.7 },
                  { month: 2, weight: 5.2, height: 57.1 },
                ];

            return (
              <GrowthChart 
                key={baby.id}
                gender={baby.gender === 'F' ? 'female' : 'male'} 
                babyName={baby.name} 
                colorTheme={baby.colorTheme}
                babyData={babyGrowthRecords.length > 0 ? babyGrowthRecords as any : mockData} 
              />
            );
          })}
        </div>
        
        {babies.length > 0 && (
          <div className="ios-glass p-8 border border-white">
            <h3 className="text-lg font-bold mb-8 tracking-tight text-[#1C1C1E]">패턴 요약</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {babies.map((baby) => {
                const color = baby.colorTheme;
                return (
                  <div key={baby.id} className="p-5 rounded-3xl border shadow-sm" style={{ 
                    backgroundColor: `${color}08`, 
                    borderColor: `${color}20` 
                  }}>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
                      평균 수유량 ({baby.name})
                    </span>
                    <p className="text-3xl font-black mt-2 text-[#1C1C1E]">
                      {getAverageFeeding(baby.id)}
                      <span className="text-sm ml-1 text-gray-400">ml</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
