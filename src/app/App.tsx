import { useState } from 'react'
import { Container, Box, Typography, Button, Stack } from '@mui/material'
import { Baby, Activity, PieChart, Settings } from 'lucide-react'

function App() {
  const [activeBaby, setActiveBaby] = useState<'A' | 'B' | 'BOTH'>('A')

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box className="glass" sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Twinkle ✨
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Smart Twin Parenting Log
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Button 
          variant={activeBaby === 'A' ? 'contained' : 'outlined'} 
          color="primary"
          onClick={() => setActiveBaby('A')}
          startIcon={<Baby size={18} />}
        >
          아기 A
        </Button>
        <Button 
          variant={activeBaby === 'B' ? 'contained' : 'outlined'} 
          color="secondary"
          onClick={() => setActiveBaby('B')}
          startIcon={<Baby size={18} />}
        >
          아기 B
        </Button>
        <Button 
          variant={activeBaby === 'BOTH' ? 'contained' : 'outlined'} 
          sx={{ color: 'white', borderColor: 'white' }}
          onClick={() => setActiveBaby('BOTH')}
        >
          둘 다
        </Button>
      </Stack>

      <Box sx={{ flexGrow: 1, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {activeBaby === 'BOTH' ? '쌍둥이 동시 기록 모드' : `아기 ${activeBaby} 기록 화면`}
        </Typography>
      </Box>

      {/* Bottom Navigation Mockup */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', p: 1, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-around">
          <Button startIcon={<Activity size={20} />} sx={{ flexDirection: 'column', fontSize: '10px' }}>기록</Button>
          <Button startIcon={<PieChart size={20} />} sx={{ flexDirection: 'column', fontSize: '10px' }}>통계</Button>
          <Button startIcon={<Settings size={20} />} sx={{ flexDirection: 'column', fontSize: '10px' }}>설정</Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default App
