import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1b332a', // Deep Forest Green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#95ad5e', // Olive Green
      contrastText: '#ffffff',
    },
    customHighlight: {
      main: '#cfef91', // Lime / Light Sage
      dark: '#b6d678'
    },
    background: {
      default: '#f9fbf9',
    }
  },
});