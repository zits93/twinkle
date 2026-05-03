/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
} from 'recharts';
import growthData from '@shared/assets/data/growth_standards.json';

interface GrowthChartProps {
  gender: 'male' | 'female';
  babyData: { month: number; weight?: number; height?: number }[];
  babyName: string;
  colorTheme: string;
}

export const GrowthChart = ({ gender, babyData, babyName, colorTheme }: GrowthChartProps) => {
  const [mode, setMode] = useState<'weight' | 'height'>('weight');
  const standards = (growthData /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any)[gender][mode] as unknown[];
  const themeColor = colorTheme;
  
  const gradientId = `colorBaby-${colorTheme.replace('#', '')}-${gender}-${mode}`;

  const data = standards.map((s: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    const babyPoint = babyData.find((b) => b.month === s.month);
    return {
      ...s,
      babyValue: mode === 'weight' ? babyPoint?.weight : babyPoint?.height,
    };
  });

  return (
    <div className="ios-glass p-6 h-[460px] w-full border border-white">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold tracking-tight text-[#1C1C1E]">
          {babyName} 성장 곡선
        </h3>
        <div className="flex bg-gray-100 p-1 rounded-xl space-x-1">
          <button 
            onClick={() => setMode('weight')}
            className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${
              mode === 'weight' ? 'bg-white shadow-sm' : 'text-gray-400'
            }`}
            style={{ color: mode === 'weight' ? themeColor : undefined }}
          >체중</button>
          <button 
            onClick={() => setMode('height')}
            className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${
              mode === 'height' ? 'bg-white shadow-sm' : 'text-gray-400'
            }`}
            style={{ color: mode === 'height' ? themeColor : undefined }}
          >키</button>
        </div>
      </div>

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
              label={{ value: mode === 'weight' ? 'kg' : 'cm', position: 'insideTopLeft', offset: 0, fontSize: 10, fill: '#636366' }}
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
            
            <Area 
              type="monotone" 
              dataKey="p97" 
              name="상위 3%"
              stroke="none" 
              fill="rgba(142, 142, 147, 0.05)" 
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="p3" 
              name="하위 3%"
              stroke="none" 
              fill="#FFFFFF" 
              connectNulls
            />
            
            <Area
              type="monotone"
              dataKey="p50"
              stroke="rgba(142, 142, 147, 0.2)"
              strokeDasharray="4 4"
              fill="none"
              name="표준 50%"
              connectNulls
            />
            
            <Area 
              type="monotone" 
              dataKey="babyValue" 
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
          * 회색 영역은 하위 3% ~ 상위 3% 표준 범위를 나타냅니다. (WHO 기준)
        </p>
        <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
          * 점선은 표준 성장 곡선의 중위값(50%)입니다.
        </p>
      </div>
    </div>
  );
};
