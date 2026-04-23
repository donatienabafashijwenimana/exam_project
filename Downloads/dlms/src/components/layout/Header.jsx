import React from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar, IconButton, Tooltip, Typography, Box } from '@mui/material';
import { Menu, DarkMode, LightMode } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/manage_learners': 'Manage Learners',
  '/admin/manage_instructors': 'Manage Instructors',
  '/admin/manage_vehicles': 'Manage Vehicles',
  '/admin/schedule_lessons': 'Schedule Lessons',
  '/admin/analytics': 'Analytics',
  '/instructor/dashboard': 'Dashboard',
  '/instructor/assigned': 'Assigned Learners',
  '/instructor/update_progress': 'Update Progress',
  '/learner/dashboard': 'My Dashboard',
  '/learner/register': 'Register for Lessons',
  '/learner/progress': 'My Progress',
  '/learner/schedule': 'My Schedule',
};

const ROLE_COLORS = { admin: '#c8a94a', instructor: '#0288d1', learner: '#1a6b3c' };

export default function Header({ darkMode, onThemeToggle, onMobileMenu }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'DLMS';
  const roleColor = ROLE_COLORS[user?.role] || '#0d2b5e';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', padding: '0 24px',
      height: 65, gap: 12,
      backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${darkMode ? 'rgba(200,169,74,0.1)' : 'rgba(13,43,94,0.08)'}`,
      background: darkMode ? 'rgba(8,14,26,0.88)' : 'rgba(255,255,255,0.92)',
    }}>
      <IconButton onClick={onMobileMenu} sx={{ display: { md: 'none' }, color: 'text.primary' }}>
        <Menu />
      </IconButton>

      <Box flex={1}>
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Syne", sans-serif' }}>{title}</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1.5}>

        <Box
          component="button" onClick={onThemeToggle}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.8,
            px: 1.5, py: 0.6, border: '1px solid', borderColor: darkMode ? 'rgba(200,169,74,0.3)' : 'rgba(13,43,94,0.2)',
            borderRadius: '20px', cursor: 'pointer', background: 'none', fontFamily: '"IBM Plex Sans", sans-serif',
            color: 'text.primary', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s',
            '&:hover': { borderColor: darkMode ? '#c8a94a' : '#0d2b5e' },
          }}
        >
          {darkMode ? <LightMode sx={{ fontSize: 15 }} /> : <DarkMode sx={{ fontSize: 15 }} />}
          {darkMode ? 'Light' : 'Dark'}
        </Box>

        <Box sx={{
          px: 1.2, py: 0.3, borderRadius: 1,
          background: `${roleColor}18`, color: roleColor,
          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          {user?.role}
        </Box>

        <Tooltip title={`${user?.name} · ${user?.badge}`}>
          <Avatar sx={{ bgcolor: '#0d2b5e', border: `2px solid ${roleColor}`, width: 34, height: 34, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
            {user?.avatar}
          </Avatar>
        </Tooltip>
      </Box>
    </header>
  );
}
