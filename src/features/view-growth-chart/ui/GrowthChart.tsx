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
  colorTheme: 'mint' | 'coral';
}

export const GrowthChart = ({ gender, babyData, babyName, colorTheme }: GrowthChartProps) => {
  const standards = (growthData as any)[gender].weight;
  const themeColor = colorTheme === 'mint' ? '#30D158' : '#FF375F';
  
  // Safe ID for SVG gradients (avoiding special characters/Korean)
  const gradientId = `colorBaby-${colorTheme}-${gender}`;

  // Combine standards and baby data for the chart
  const data = standards.map((s: any) => {
    const babyPoint = babyData.find((b) => b.month === s.month);
    return {
      ...s,
      babyWeight: babyPoint?.weight,
    };
  });

  return (
    <div className="ios-glass p-6 h-[420px] w-full border border-white">
      <h3 className="text-lg font-bold mb-8 tracking-tight text-[#1C1C1E]">
        {babyName} 성장 곡선 (체중)
      </h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={themeColor} stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="rgba(0,0,0,0.2)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: 600, fill: '#636366' }}
              label={{ value: '개월', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#636366' }}
            />
            <YAxis 
              stroke="rgba(0,0,0,0.2)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: 600, fill: '#636366' }}
              label={{ value: 'kg', position: 'insideTopLeft', offset: 0, fontSize: 10, fill: '#636366' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                padding: '12px'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1C1C1E' }}
              labelStyle={{ color: '#636366', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
            />
            
            {/* Standard Range Area (p3 to p97) */}
            <Area 
              type="monotone" 
              dataKey="p97" 
              stroke="none" 
              fill="rgba(142, 142, 147, 0.05)" 
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="p3" 
              stroke="none" 
              fill="#FFFFFF" 
              connectNulls
            />
            
            {/* Median Line (p50) */}
            <Area
              type="monotone"
              dataKey="p50"
              stroke="rgba(142, 142, 147, 0.2)"
              strokeDasharray="4 4"
              fill="none"
              name="표준(50%)"
              connectNulls
            />
            
            {/* Baby's Actual Data Area */}
            <Area 
              type="monotone" 
              dataKey="babyWeight" 
              stroke={themeColor} 
              strokeWidth={4}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              name={babyName}
              connectNulls
              activeDot={{ r: 6, strokeWidth: 0, fill: themeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 space-y-1">
        <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
          * 회색 영역은 하위 3% ~ 상위 3% 표준 범위를 나타냅니다.
        </p>
        <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
          * 점선은 WHO 표준 성장 곡선의 중위값(50%)입니다.
        </p>
      </div>
    </div>
  );
};
