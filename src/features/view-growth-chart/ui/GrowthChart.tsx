import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  Line
} from 'recharts';
import growthData from '@shared/assets/data/growth_standards.json';

interface GrowthChartProps {
  gender: 'male' | 'female';
  babyData: { month: number; weight: number }[];
  babyName: string;
}

export const GrowthChart = ({ gender, babyData, babyName }: GrowthChartProps) => {
  const standards = (growthData as any)[gender].weight;
  const isMale = gender === 'male';
  const themeColor = isMale ? '#007AFF' : '#FF375F';

  // Combine standards and baby data for the chart
  const data = standards.map((s: any) => {
    const babyPoint = babyData.find((b) => b.month === s.month);
    return {
      ...s,
      babyWeight: babyPoint?.weight,
    };
  });

  return (
    <div className="ios-glass p-6 h-[420px] w-full">
      <h3 className="text-lg font-bold mb-8 tracking-tight text-[#1C1C1E]">
        {babyName} 성장 곡선 (체중)
      </h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorBaby-${babyName}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="rgba(0,0,0,0.2)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: 600 }}
            />
            <YAxis 
              stroke="rgba(0,0,0,0.2)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '0.5px solid rgba(0,0,0,0.05)', 
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            
            {/* Normal Range Area (p5 to p95) */}
            <Area 
              type="monotone" 
              dataKey="p95" 
              stroke="none" 
              fill="rgba(0,0,0,0.02)" 
            />
            
            {/* Baby's Actual Data Area */}
            <Area 
              type="monotone" 
              dataKey="babyWeight" 
              stroke={themeColor} 
              strokeWidth={4}
              fillOpacity={1}
              fill={`url(#colorBaby-${babyName})`}
              name={babyName}
            />

            {/* Median Line */}
            <Line 
              type="monotone" 
              dataKey="p50" 
              stroke="rgba(0,0,0,0.1)" 
              strokeDasharray="5 5" 
              dot={false}
              name="평균"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] font-bold text-gray-300 mt-6 leading-relaxed">
        * 회색 영역은 하위 5% ~ 상위 5% 정상 범위를 나타냅니다. 점선은 평균값(50%)입니다.
      </p>
    </div>
  );
};
