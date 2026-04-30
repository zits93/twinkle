import { Box, Typography, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useRecordStore, RecordItem } from '@entities/record';
import { useState } from 'react';

export const RecordTimeline = () => {
  const records = useRecordStore((state) => state.records);
  const [viewMode, setViewMode] = useState<'ALL' | 'BABY_A' | 'BABY_B'>('ALL');

  const filteredRecords = records.filter((r) => {
    if (viewMode === 'ALL') return true;
    if (viewMode === 'BABY_A') return r.babyId === 'baby-a';
    if (viewMode === 'BABY_B') return r.babyId === 'baby-b';
    return true;
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          활동 타임라인
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
        >
          <ToggleButton value="ALL">전체</ToggleButton>
          <ToggleButton value="BABY_A">A</ToggleButton>
          <ToggleButton value="BABY_B">B</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {filteredRecords.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            기록된 활동이 없습니다.
          </Typography>
        </Box>
      ) : (
        <Box>
          {filteredRecords.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </Box>
      )}
    </Box>
  );
};
