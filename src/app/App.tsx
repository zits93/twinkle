import { useState } from 'react'
import { Container, Box, Typography, Button, Stack } from '@mui/material'
import { Activity, PieChart, Settings, Home } from 'lucide-react'
import { AddRecordForm } from '@features/add-record'
import { RecordTimeline } from '@widgets/record-timeline'
import { StatsPage } from '@pages/stats'
import { Dashboard } from '@widgets/dashboard'

function App() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'RECORD' | 'STATS' | 'SETTINGS'>('HOME')

  return (
    <Container maxWidth="sm" sx={{ py: 4, pb: 10 }}>
      <Box className="glass" sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Twinkle ✨
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Smart Twin Parenting Log
        </Typography>
      </Box>

      {activeTab === 'HOME' && (
        <Dashboard />
      )}

      {activeTab === 'RECORD' && (
        <Box sx={{ animate: 'fadeIn 0.5s' }}>
          <AddRecordForm />
          <RecordTimeline />
        </Box>
      )}

      {activeTab === 'STATS' && (
        <StatsPage />
      )}

      {activeTab === 'SETTINGS' && (
        <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            준비 중인 기능입니다 🚧
          </Typography>
        </Box>
      )}

      {/* Bottom Navigation */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', p: 1, borderTop: 1, borderColor: 'divider', zIndex: 1000 }}>
        <Stack direction="row" sx={{ justifyContent: "space-around" }}>
          <Button 
            onClick={() => setActiveTab('HOME')}
            color={activeTab === 'HOME' ? 'primary' : 'inherit'}
            startIcon={<Home size={20} />} 
            sx={{ flexDirection: 'column', fontSize: '10px' }}
          >
            홈
          </Button>
          <Button 
            onClick={() => setActiveTab('RECORD')}
            color={activeTab === 'RECORD' ? 'primary' : 'inherit'}
            startIcon={<Activity size={20} />} 
            sx={{ flexDirection: 'column', fontSize: '10px' }}
          >
            기록
          </Button>
          <Button 
            onClick={() => setActiveTab('STATS')}
            color={activeTab === 'STATS' ? 'primary' : 'inherit'}
            startIcon={<PieChart size={20} />} 
            sx={{ flexDirection: 'column', fontSize: '10px' }}
          >
            통계
          </Button>
          <Button 
            onClick={() => setActiveTab('SETTINGS')}
            color={activeTab === 'SETTINGS' ? 'primary' : 'inherit'}
            startIcon={<Settings size={20} />} 
            sx={{ flexDirection: 'column', fontSize: '10px' }}
          >
            설정
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default App
