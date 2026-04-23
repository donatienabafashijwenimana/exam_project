import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#0d2b5e', light: '#1a4a9e', dark: '#071a3c', contrastText: '#fff' },
    secondary: { main: '#c8a94a', light: '#e2c97a', dark: '#9a7c2a', contrastText: '#fff' },
    error: { main: '#b71c1c' },
    warning: { main: '#e65100' },
    success: { main: '#1a6b3c' },
    info: { main: '#0288d1' },
    ...(mode === 'dark' ? {
      background: { default: '#080e1a', paper: '#0f1c30' },
      text: { primary: '#e8edf5', secondary: '#8fa3c0' },
    } : {
      background: { default: '#f0f4fa', paper: '#ffffff' },
      text: { primary: '#0a1628', secondary: '#3d5a80' },
    }),
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h1: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 800 },
    h2: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 800 },
    h3: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700 },
    h4: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700 },
    h5: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 600 },
    h6: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 600 },
    button: { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 16px rgba(13,43,94,0.3)' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 14, boxShadow: mode === 'dark' ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 20px rgba(13,43,94,0.08)' },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 600, fontSize: '0.73rem' } } },
    MuiDataGrid: { styleOverrides: { root: { border: 'none', borderRadius: 12 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 18 } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 9 } } } },
  },
});
