import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, addMonths, subMonths, parseISO, differenceInDays 
} from 'date-fns';
import { fetchExcelData } from '../utils/api';

// Sub-component imports
import CountdownBanner from './CountdownBanner';
import CalendarHeader from './CalendarHeader';
import UpgradeDetailsModal from './UpgradeDetailsModal';

export default function UpgradeCalendar() {
  const [loading, setLoading] = useState(true);
  const [upgrades, setUpgrades] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextUpgrade, setNextUpgrade] = useState(null);
  const [activeUpgrade, setActiveUpgrade] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchExcelData().then((data) => {
      if (!isMounted) return;
      const today = new Date();
      
      const formatted = data.map(item => ({
        ...item,
        parsedDate: parseISO(item.upgradeDate)
      }));
      setUpgrades(formatted);

      const upcoming = formatted
        .filter(item => item.parsedDate >= today)
        .sort((a, b) => a.parsedDate - b.parsedDate)[0];

      if (upcoming) {
        const daysAway = differenceInDays(upcoming.parsedDate, today);
        setNextUpgrade({ ...upcoming, daysAway });
      }
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CountdownBanner nextUpgrade={nextUpgrade} />
      
      <CalendarHeader 
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
        onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
      />

      {/* --- GRID GRID INTERACTION LAYER --- */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 1.5 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>{day}</Typography>
          </Box>
        ))}

        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <Paper key={`empty-${index}`} variant="outlined" sx={{ minHeight: 110, bgcolor: '#f4f6f4', border: '1px dashed #e0e0e0', borderRadius: 2 }} />
        ))}

        {daysInMonth.map((day) => {
          const dayUpgrades = upgrades.filter(u => isSameDay(u.parsedDate, day));
          const hasUpgrade = dayUpgrades.length > 0;

          return (
            <Paper 
              key={day.toString()}
              variant="outlined" 
              sx={{ 
                minHeight: 110, p: 1.5, display: 'flex', flexDirection: 'column', borderRadius: 2,
                transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                borderColor: hasUpgrade ? 'customHighlight.dark' : 'divider',
                bgcolor: hasUpgrade ? 'customHighlight.main' : 'background.paper',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: hasUpgrade ? 'primary.main' : 'text.secondary', mb: 1 }}>
                {format(day, 'd')}
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {dayUpgrades.map((upg, i) => (
                  <Box 
                    key={i} 
                    onClick={() => setActiveUpgrade(upg)}
                    sx={{ 
                      bgcolor: 'primary.main', color: 'primary.contrastText', px: 1, py: 0.5, borderRadius: 1,
                      fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', textOverflow: 'ellipsis',
                      overflow: 'hidden', whiteSpace: 'nowrap', '&:hover': { bgcolor: 'secondary.main' }
                    }}
                  >
                    📦 {upg.customer}
                  </Box>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>

      <UpgradeDetailsModal 
        activeUpgrade={activeUpgrade} 
        onClose={() => setActiveUpgrade(null)} 
      />
    </Container>
  );
}