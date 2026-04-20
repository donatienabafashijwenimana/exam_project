import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Breadcrumbs,
  Link,
  Chip,
  Switch,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';

import {
  Menu as MenuIcon,
  HowToVote,
  NavigateNext,
  Home,
  DarkMode,
  LightMode,
  Person,
  Logout,
} from '@mui/icons-material';

import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/candidates': 'Candidates',
  '/voters': 'Voters',
  '/voting': 'Vote Now',
  '/results': 'Results',
  '/profile': 'Profile',
};

export default function AppHeader({ onMenuToggle }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const currentPage = routeLabels[location.pathname] || 'Dashboard';

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        left: { xs: 0, md: '260px' },
        width: { xs: '100%', md: 'calc(100% - 260px)' },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, px: { xs: 2, sm: 3 } }}>
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            onClick={onMenuToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
            size="small"
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <HowToVote sx={{ color: 'primary.main', fontSize: 24 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
              VoteSystem
            </Typography>
          </Box>

          {/* Breadcrumbs - desktop */}
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" sx={{ fontSize: 16 }} />}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Link
              underline="hover"
              color="text.secondary"
              href="/dashboard"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.825rem' }}
            >
              <Home sx={{ fontSize: 16 }} />
              Home
            </Link>
            <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: 'primary.main' }}>
              {currentPage}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LightMode sx={{ fontSize: 18, color: mode === 'light' ? 'primary.main' : 'text.disabled' }} />
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
            <DarkMode sx={{ fontSize: 18, color: mode === 'dark' ? 'primary.main' : 'text.disabled' }} />
          </Box>

          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.3 }}>
                  {currentUser.name}
                </Typography>
                <Chip
                  label={currentUser.role === 'admin' ? 'Administrator' : 'Voter'}
                  size="small"
                  sx={{
                    fontSize: '0.6rem',
                    height: 16,
                    fontWeight: 600,
                    bgcolor: currentUser.role === 'admin'
                      ? 'rgba(46,125,50,0.1)'
                      : 'rgba(46,125,50,0.1)',
                    color: currentUser.role === 'admin' ? '#2e7d32' : '#2e7d32',
                  }}
                />
              </Box>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={handleAvatarClick}
                title="User menu"
              >
                {currentUser.name?.charAt(0) || 'U'}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 180,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfile} sx={{ py: 1.25 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.25 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}
