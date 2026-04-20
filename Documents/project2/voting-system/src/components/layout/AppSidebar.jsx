import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Typography,
  Switch,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  HowToVote,
  Person,
  DarkMode,
  LightMode,
  Close,
  EmojiEvents,
  BarChart,
  Logout,
} from '@mui/icons-material';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard />, adminOnly: true, section: 'Management' },
  { label: 'Candidates', path: '/candidates', icon: <EmojiEvents />, adminOnly: true, section: 'Management' },
  { label: 'Voters', path: '/voters', icon: <People />, adminOnly: true, section: 'Management' },
  { label: 'Vote Now', path: '/voting', icon: <HowToVote />, voterOnly: true, section: 'Voting' },
  { label: 'Results', path: '/results', icon: <BarChart />, section: 'Analytics' },
  { label: 'Profile', path: '/profile', icon: <Person />, section: 'Personal' },
];

export default function AppSidebar({ open, onClose }) {
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const isAdmin = currentUser?.role === 'admin';

  const filteredItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.voterOnly && isAdmin) return false;
    return true;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const section = item.section;
    if (!groups[section]) groups[section] = [];
    groups[section].push(item);
    return groups;
  }, {});

  const content = (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: mode === 'dark'
          ? '#000000'
          : 'linear-gradient(180deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)',
        borderRight: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 2,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #43a047, #66bb6a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HowToVote sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2, color: '#fff' }}>
            VoteSystem
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', opacity: 0.6, letterSpacing: 1.5, fontWeight: 500, color: '#c8e6c9' }}>
            AUTOMATED VOTING
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ ml: 'auto', display: { xs: 'block', md: 'none' }, color: '#fff' }}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {/* User Profile */}
      {currentUser && (
        <Box sx={{ px: 2.5, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: mode === 'dark' ? '#2e7d32' : '#43a047',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {currentUser.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#fff',
                }}
              >
                {currentUser.name}
              </Typography>
              <Chip
                label={isAdmin ? 'Admin' : 'Voter'}
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  height: 18,
                  fontWeight: 600,
                  bgcolor: isAdmin
                    ? 'rgba(46,125,50,0.3)'
                    : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 1.5, py: 1, overflowY: 'auto' }}>
        {Object.entries(groupedItems).map(([section, items]) => (
          <Box key={section} sx={{ mb: 1 }}>
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                px: 2,
                py: 1,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {section}
            </Typography>
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.1,
                      borderRadius: 2,
                      mb: 0.25,
                      cursor: 'pointer',
                      position: 'relative',
                      color: isActive
                        ? '#fff'
                        : 'rgba(255, 255, 255, 0.85)',
                      bgcolor: isActive
                        ? 'rgba(255, 255, 255, 0.18)'
                        : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                      },
                    }}
                  >
                    {isActive && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 20,
                          borderRadius: '0 4px 4px 0',
                          bgcolor: '#66bb6a',
                        }}
                      />
                    )}
                    <Box sx={{ fontSize: 20, display: 'flex', opacity: isActive ? 1 : 0.85 }}>
                      {item.icon}
                    </Box>
                    <span>{item.label}</span>
                  </Box>
                </NavLink>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.15)' }}>
        {/* Theme Toggle */}
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightMode sx={{ fontSize: 16, opacity: mode === 'light' ? 1 : 0.4, color: '#fff' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
              {mode === 'dark' ? 'Dark' : 'Light'}
            </Typography>
          </Box>
          <Switch
            checked={mode === 'dark'}
            onChange={toggleTheme}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#43a047',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                bgcolor: '#2e7d32',
              },
            }}
          />
        </Box>

        {/* Logout */}
        <Box sx={{ px: 2.5, pb: 2 }}>
          <Box
            onClick={logout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              cursor: 'pointer',
              color: '#fca5a5',
              opacity: 0.8,
              transition: 'all 0.2s ease',
              '&:hover': {
                opacity: 1,
                bgcolor: 'rgba(239,68,68,0.15)',
              },
            }}
          >
            <Logout sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Logout</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 260,
          height: '100vh',
          zIndex: 1200,
          display: { xs: 'none', md: 'block' },
        }}
      >
        {content}
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 260,
          },
        }}
      >
        {content}
      </Drawer>

      {/* Mobile overlay */}
      {open && (
        <Box
          onClick={onClose}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1199,
            display: { xs: 'block', md: 'none' },
          }}
        />
      )}
    </>
  );
}
