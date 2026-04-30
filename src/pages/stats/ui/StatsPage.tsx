import { Box, Typography, Stack, Grid2 as Grid, Paper } from '@mui/material';
import { GrowthChart } from '@features/view-growth-chart/ui/GrowthChart';

export const StatsPage = () => {
  // Mock data for demonstration
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
    <Box sx={{ animate: 'fadeIn 0.5s' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        성장 통계
      </Typography>

      <Stack spacing={4}>
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
