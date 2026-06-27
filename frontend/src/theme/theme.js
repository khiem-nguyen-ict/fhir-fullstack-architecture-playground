import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#dc004e',
  },
  background: {
    default: '#f5f7fa',
    paper: '#ffffff',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#f48fb1',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

export const lightTheme = createTheme({
  palette: lightPalette,
  typography: {
    fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: {
    fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});