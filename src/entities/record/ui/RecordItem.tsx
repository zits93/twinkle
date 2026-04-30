import { Box, Typography, Stack, Chip } from '@mui/material';
import { Milk, Moon, Droplets, Baby } from 'lucide-react';
import { RecordEntry } from '@shared/types/record';
import { format } from 'date-fns';

interface RecordItemProps {
  record: RecordEntry;
}

const categoryIcons: Record<string, React.ReactNode> = {
  FEEDING: <Milk size={16} />,
  SLEEP: <Moon size={16} />,
  DIAPER: <Droplets size={16} />,
};

export const RecordItem = ({ record }: RecordItemProps) => {
  const isBabyA = record.babyId === 'baby-a';
  
  return (
    <Box 
      sx={{ 
        p: 2, 
        mb: 1, 
        borderRadius: 2, 
        bgcolor: 'rgba(255, 255, 255, 0.03)',
        borderLeft: 4,
        borderColor: isBabyA ? 'primary.main' : 'secondary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color: isBabyA ? 'primary.main' : 'secondary.main' }}>
          {categoryIcons[record.category] || <Baby size={16} />}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {record.category === 'FEEDING' ? `${record.value}ml` : record.category}
            {record.isDual && (
              <Chip label="동시" size="small" sx={{ ml: 1, height: 16, fontSize: '10px' }} />
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(record.startTime), 'HH:mm')} • {record.note || '메모 없음'}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="caption" sx={{ fontWeight: 'bold', color: isBabyA ? 'primary.main' : 'secondary.main' }}>
        {isBabyA ? '아기 A' : '아기 B'}
      </Typography>
    </Box>
  );
};
