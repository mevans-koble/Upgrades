import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, differenceInCalendarDays } from 'date-fns';
import { useDeviceSizes } from '../hooks/useDeviceSizes';
import { fetchExcelData, createUpgrade, updateUpgrade, deleteUpgrade } from '../utils/api';

import CountdownBanner from './CountdownBanner';
import CalendarHeader from './CalendarHeader';
import UpgradeDetailsModal from './UpgradeDetailsModal';

export default function UpgradeCalendar() {
  const [loading, setLoading] = useState(true);
  const [upgrades, setUpgrades] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextUpgrade, setNextUpgrade] = useState(null);
  
  const [activeUpgrade, setActiveUpgrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobileDevice } = useDeviceSizes();

  const loadData = () => {
    fetchExcelData().then((data) => {
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
        const daysAway = differenceInCalendarDays(upcoming.parsedDate, today);
        setNextUpgrade({ ...upcoming, daysAway });
      } else {
        setNextUpgrade(null);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveUpgrade = async (fields) => {
    setLoading(true);
    setIsModalOpen(false);
    
    if (activeUpgrade && activeUpgrade.id) {
      await updateUpgrade(activeUpgrade.id, fields);
    } else {
      await createUpgrade(fields);
    }
    loadData();
  };

  const handleDeleteUpgrade = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule window?")) {
      setLoading(true);
      setIsModalOpen(false);
      await deleteUpgrade(id);
      loadData();
    }
  };

  const handleOpenEdit = (upgrade) => {
    setActiveUpgrade(upgrade);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setActiveUpgrade(null); 
    setIsModalOpen(true);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (loading) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }} >
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
        onAddClick={handleOpenCreate}
      />

      {/* Dynamic layout change: converts from a 7-column grid to a single vertical stack on mobile layout */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: isMobileDevice ? '1fr' : 'repeat(7, minmax(0, 1fr))', 
          gap: 1.5 
        }}
      >
        {/* Hide weekday labels entirely on mobile layouts */}
        {!isMobileDevice && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>{day}</Typography>
          </Box>
        ))}

        {/* Hide calendar blank indentation spaces on small viewport screens */}
        {!isMobileDevice && Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <Paper key={`empty-${index}`} variant="outlined" sx={{ minHeight: 110, bgcolor: '#f4f6f4', border: '1px dashed #e0e0e0', borderRadius: 2 }} />
        ))}

        {/* Day Item Canvas */}
        {daysInMonth.map((day) => {
          const dayUpgrades = upgrades.filter(u => isSameDay(u.parsedDate, day));
          const hasUpgrade = dayUpgrades.length > 0;

          // Mobile View Optimization: Collapse empty calendar slots into a clean timeline agenda view
          if (isMobileDevice && !hasUpgrade) return null;

          return (
            <Paper 
              key={day.toString()}
              variant="outlined" 
              sx={{ 
                minHeight: isMobileDevice ? 'auto' : 110, 
                p: 1.5, 
                display: 'flex', 
                flexDirection: isMobileDevice ? 'row' : 'column',
                alignItems: isMobileDevice ? 'center' : 'stretch',
                borderRadius: 2,
                borderColor: hasUpgrade ? 'customHighlight.dark' : 'divider',
                bgcolor: hasUpgrade ? 'customHighlight.main' : 'background.paper',
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: hasUpgrade ? 'primary.main' : 'text.secondary', 
                  mb: isMobileDevice ? 0 : 1,
                  minWidth: isMobileDevice ? '65px' : 'auto'
                }}
              >
                {/* Shows short month token prefix on mobile rows to provide context */}
                {isMobileDevice ? format(day, 'MMM d') : format(day, 'd')}
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, ml: isMobileDevice ? 2 : 0 }}>
                {dayUpgrades.map((upg, i) => (
                  <Box 
                    key={i} 
                    onClick={() => handleOpenEdit(upg)}
                    sx={{ 
                      bgcolor: 'primary.main', color: 'primary.contrastText', px: 1, py: 0.5, borderRadius: 1,
                      fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', textOverflow: 'ellipsis',
                      overflow: 'hidden', whiteSpace: 'nowrap', '&:hover': { bgcolor: 'secondary.main' }
                    }}
                  >
                    {upg.customer}
                  </Box>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Central CRUD Dialog Manager */}
      <UpgradeDetailsModal 
        isOpen={isModalOpen}
        activeUpgrade={activeUpgrade} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveUpgrade}
        onDelete={handleDeleteUpgrade}
      />
    </Container>
  );
}