import { create } from 'zustand';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';

export const useThemeStore = create((set) => ({
  mode: 'light',
  toggleTheme: () => set((prev) => ({ mode: prev.mode === 'light' ? 'dark' : 'light' })),
}));

export function ThemeProvider({ children }) {
  const mode = useThemeStore((s) => s.mode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#7c3aed',
            light: '#a855f7',
            dark: '#4c1d95',
          },
          secondary: {
            main: '#a855f7',
            light: '#c084fc',
            dark: '#7c3aed',
          },
          background: {
            default: mode === 'light' ? '#faf5ff' : '#000000',
            paper: mode === 'light' ? '#ffffff' : '#000000',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 10,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 14,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
