import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, differenceInDays } from 'date-fns';

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
        const daysAway = differenceInDays(upcoming.parsedDate, today);
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

  // CRUD Delete handler
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
      <Box sx={{ height:"100vh",display:"flex", justifyContent:"center", alignItems:"center"}}>
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
                borderColor: hasUpgrade ? 'customHighlight.dark' : 'divider',
                bgcolor: hasUpgrade ? 'customHighlight.main' : 'background.paper',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: hasUpgrade ? 'primary.main' : 'text.secondary', mb: 1 }}>
                {format(day, 'd')}
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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