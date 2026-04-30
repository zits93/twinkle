import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  ReferenceLine
} from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import growthData from '@shared/assets/data/growth_standards.json';

interface GrowthChartProps {
  gender: 'male' | 'female';
  babyData: { month: number; weight: number }[];
  babyName: string;
}

export const GrowthChart = ({ gender, babyData, babyName }: GrowthChartProps) => {
  const theme = useTheme();
  const standards = growthData[gender].weight;

  // Combine standards and baby data for the chart
  const data = standards.map((s) => {
    const babyPoint = babyData.find((b) => b.month === s.month);
    return {
      ...s,
      babyWeight: babyPoint?.weight,
    };
  });

  return (
    <Paper className="glass" sx={{ p: 2, height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        {babyName} 성장 곡선 (체중)
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            label={{ value: '개월', position: 'insideBottomRight', offset: -5 }} 
            stroke="rgba(255,255,255,0.5)"
          />
          <YAxis 
            label={{ value: 'kg', angle: -90, position: 'insideLeft' }} 
            stroke="rgba(255,255,255,0.5)"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: 8 }}
            itemStyle={{ color: '#fff' }}
          />
          
          {/* Normal Range Area (p5 to p95) */}
          <Area 
            type="monotone" 
            dataKey="p95" 
            stroke="none" 
            fill="rgba(255,255,255,0.05)" 
          />
          <Area 
            type="monotone" 
            dataKey="p5" 
            stroke="none" 
            fill="#242424" 
          />

          {/* Median Line */}
          <Line 
            type="monotone" 
            dataKey="p50" 
            stroke="rgba(255,255,255,0.3)" 
            strokeDasharray="5 5" 
            dot={false}
          />

          {/* Baby's Actual Data */}
          <Line 
            type="monotone" 
            dataKey="babyWeight" 
            stroke={theme.palette.primary.main} 
            strokeWidth={3}
            dot={{ r: 6, fill: theme.palette.primary.main }}
            name={babyName}
          />
        </AreaChart>
      </ResponsiveContainer>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        * 회색 영역은 하위 5% ~ 상위 5% 정상 범위를 나타냅니다. 점선은 평균값(50%)입니다.
      </Typography>
    </Paper>
  );
};
