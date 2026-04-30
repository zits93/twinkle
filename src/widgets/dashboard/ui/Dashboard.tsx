import { Box, Typography, Stack, Grid2 as Grid, Paper, IconButton, Chip, Alert } from '@mui/material';
import { Baby, Clock, Milk, Moon, Droplets, ChevronRight, AlertCircle } from 'lucide-react';
import { useRecordStore } from '@entities/record';
import { useFeedingStatus } from '@features/notify-feeding';
import { format, differenceInMinutes } from 'date-fns';

export const Dashboard = () => {
  const records = useRecordStore((state) => state.records);

  const getLatestRecord = (babyId: string, category: string) => {
    return records
      .filter((r) => r.babyId === babyId && r.category === category)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
  };

  const SummaryCard = ({ babyId, name, color }: { babyId: string, name: string, color: string }) => {
    const lastFeed = getLatestRecord(babyId, 'FEEDING');
    const lastSleep = getLatestRecord(babyId, 'SLEEP');
    const lastDiaper = getLatestRecord(babyId, 'DIAPER');
    const { status, minutesLeft } = useFeedingStatus(babyId);

    const minutesSinceFeed = lastFeed 
      ? differenceInMinutes(new Date(), new Date(lastFeed.startTime)) 
      : null;

    return (
      <Paper className="glass" sx={{ p: 2, flex: 1, borderTop: 4, borderColor: color }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{name}</Typography>
          <Baby size={18} color={color} />
        </Stack>

        {(status === 'HUNGRY' || status === 'OVERDUE') && (
          <Box sx={{ mb: 2, p: 1, bgcolor: status === 'OVERDUE' ? 'rgba(239, 83, 80, 0.1)' : 'rgba(255, 167, 38, 0.1)', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={14} color={status === 'OVERDUE' ? '#ef5350' : '#ffa726'} style={{ marginRight: 6 }} />
            <Typography variant="caption" sx={{ color: status === 'OVERDUE' ? '#ef5350' : '#ffa726', fontWeight: 'bold' }}>
              {status === 'OVERDUE' ? '수유 시간 지남' : '곧 수유 시간'}
            </Typography>
          </Box>
        )}

        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Milk size={14} color="rgba(255,255,255,0.6)" />
              <Typography variant="caption" color="text.secondary">마지막 수유</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {minutesSinceFeed !== null ? `${Math.floor(minutesSinceFeed / 60)}시간 ${minutesSinceFeed % 60}분 전` : '-'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Moon size={14} color="rgba(255,255,255,0.6)" />
              <Typography variant="caption" color="text.secondary">마지막 수면</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {lastSleep ? format(new Date(lastSleep.startTime), 'HH:mm') : '-'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Droplets size={14} color="rgba(255,255,255,0.6)" />
              <Typography variant="caption" color="text.secondary">마지막 기저귀</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {lastDiaper ? format(new Date(lastDiaper.startTime), 'HH:mm') : '-'}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        대시보드
      </Typography>

      {/* Baby Summary Row */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <SummaryCard babyId="baby-a" name="아기 A" color="#70D6BC" />
        <SummaryCard babyId="baby-b" name="아기 B" color="#FF7E67" />
      </Stack>

      {/* Sync Status Card */}
      <Paper className="glass" sx={{ p: 2, mb: 4, bgcolor: 'rgba(255,255,255,0.03)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>쌍둥이 싱크 상태</Typography>
            <Typography variant="caption" color="text.secondary">두 아이의 수면 시간이 80% 일치합니다.</Typography>
          </Box>
          <Chip label="좋음" color="success" size="small" />
        </Stack>
      </Paper>

      {/* Quick Actions or Next Schedule */}
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <Clock size={16} style={{ marginRight: 8 }} /> 다음 예상 일정
      </Typography>
      <Paper className="glass" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">수유 (A, B 동시)</Typography>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>오후 3:30 예정</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
