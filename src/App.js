import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/palette';
import UpgradeCalendar from './components/UpgradeCalendar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <UpgradeCalendar />
    </ThemeProvider>
  );
}

export default App;