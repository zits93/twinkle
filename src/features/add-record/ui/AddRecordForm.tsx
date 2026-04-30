import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  ToggleButton, 
  ToggleButtonGroup, 
  TextField, 
  Typography, 
  Stack, 
  Grid2 as Grid,
  Paper,
  InputAdornment
} from '@mui/material';
import { 
  Milk, 
  Moon, 
  Droplets, 
  Baby, 
  Plus,
  Clock
} from 'lucide-react';
import { useRecordStore } from '@entities/record/model/store';
import { BabyId, RecordCategory } from '@shared/types/record';

export const AddRecordForm = () => {
  const [targetBaby, setTargetBaby] = useState<BabyId | 'BOTH'>('baby-a');
  const [category, setCategory] = useState<RecordCategory>('FEEDING');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  
  const addRecord = useRecordStore((state) => state.addRecord);
  const addDualRecord = useRecordStore((state) => state.addDualRecord);

  const handleBabyChange = (_: any, newBaby: BabyId | 'BOTH') => {
    if (newBaby) setTargetBaby(newBaby);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseRecord = {
      userId: 'user-1', // Mock user
      category,
      subCategory: 'FORMULA', // Default for now
      value: amount ? parseFloat(amount) : undefined,
      startTime: new Date().toISOString(),
      note,
      createdAt: new Date().toISOString(),
    };

    if (targetBaby === 'BOTH') {
      const recordA = { ...baseRecord, id: crypto.randomUUID(), babyId: 'baby-a' as BabyId, isDual: true, syncGroupId: crypto.randomUUID() };
      const recordB = { ...baseRecord, id: crypto.randomUUID(), babyId: 'baby-b' as BabyId, isDual: true, syncGroupId: recordA.syncGroupId };
      addDualRecord(recordA, recordB);
    } else {
      addRecord({ ...baseRecord, id: crypto.randomUUID(), babyId: targetBaby });
    }

    // Reset form
    setAmount('');
    setNote('');
    alert('기록되었습니다!');
  };

  return (
    <Paper className="glass" sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        새 활동 기록하기
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Baby Selection */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              기록할 아이 선택
            </Typography>
            <ToggleButtonGroup
              value={targetBaby}
              exclusive
              onChange={handleBabyChange}
              fullWidth
              size="small"
              color="primary"
            >
              <ToggleButton value="baby-a" sx={{ py: 1.5 }}>
                <Baby size={16} style={{ marginRight: 8 }} /> 아기 A
              </ToggleButton>
              <ToggleButton value="BOTH" sx={{ py: 1.5 }}>둘 다</ToggleButton>
              <ToggleButton value="baby-b" sx={{ py: 1.5 }} color="secondary">
                아기 B <Baby size={16} style={{ marginLeft: 8 }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Category Selection */}
          <Grid container spacing={1}>
            {[
              { id: 'FEEDING', label: '수유', icon: <Milk size={20} />, color: '#70D6BC' },
              { id: 'SLEEP', label: '수면', icon: <Moon size={20} />, color: '#9FA8DA' },
              { id: 'DIAPER', label: '기저귀', icon: <Droplets size={20} />, color: '#FFAB91' },
            ].map((item) => (
              <Grid size={4} key={item.id}>
                <Button
                  fullWidth
                  variant={category === item.id ? 'contained' : 'outlined'}
                  onClick={() => setCategory(item.id as RecordCategory)}
                  sx={{ 
                    flexDirection: 'column', 
                    py: 2,
                    borderColor: category === item.id ? 'transparent' : 'rgba(255,255,255,0.1)',
                    bgcolor: category === item.id ? item.color : 'transparent',
                    '&:hover': { bgcolor: category === item.id ? item.color : 'rgba(255,255,255,0.05)' }
                  }}
                >
                  {item.icon}
                  <Typography variant="caption" sx={{ mt: 0.5 }}>{item.label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Input Fields */}
          {category === 'FEEDING' && (
            <TextField
              label="수유량"
              fullWidth
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end">ml</InputAdornment>,
                }
              }}
            />
          )}

          <TextField
            label="메모"
            fullWidth
            multiline
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="특이사항을 입력하세요"
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            startIcon={<Plus size={20} />}
            sx={{ 
              py: 1.5, 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #70D6BC 30%, #FF7E67 90%)',
              color: 'white'
            }}
          >
            기록 추가
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
