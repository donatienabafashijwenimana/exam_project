import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { useAuthStore } from '../../stores/authStore';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useAuthStore((s) => s.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: '260px' },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <AppHeader onMenuToggle={() => setSidebarOpen(true)} />
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: '64px',
            p: { xs: 2, sm: 3 },
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#000000' : '#faf5ff',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
