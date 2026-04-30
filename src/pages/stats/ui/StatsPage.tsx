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
import { Box, Typography, Stack, Grid, Paper } from '@mui/material';
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
    <Box sx={{ animate: 'fadeIn 0.5s', pb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        성장 통계
      </Typography>

      <Stack spacing={4}>
        {/* Daily Feeding Chart */}
        <Paper className="glass" sx={{ p: 3, height: 350 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            일간 총 수유량 추이
          </Typography>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={feedingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: 8 }}
              />
              <Legend />
              <Bar dataKey="babyA" name="아기 A" fill="#70D6BC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="babyB" name="아기 B" fill="#FF7E67" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

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
        
        <Paper className="glass" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            패턴 요약
          </Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box sx={{ p: 2, bgcolor: 'rgba(112, 214, 188, 0.1)', borderRadius: 2 }}>
                <Typography variant="caption" color="primary">평균 수유량 (A)</Typography>
                <Typography variant="h5">160ml</Typography>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 126, 103, 0.1)', borderRadius: 2 }}>
                <Typography variant="caption" color="secondary">평균 수유량 (B)</Typography>
                <Typography variant="h5">140ml</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
};
