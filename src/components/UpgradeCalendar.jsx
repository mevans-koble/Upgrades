import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, differenceInCalendarDays, startOfDay, subDays, isWithinInterval, isBefore } from 'date-fns';
import { useDeviceSizes } from '../hooks/useDeviceSizes';
import { fetchExcelData, createUpgrade, updateUpgrade, deleteUpgrade } from '../utils/api';

import CountdownBanner from './CountdownBanner';
import CalendarHeader from './CalendarHeader';
import UpgradeDetailsModal from './UpgradeDetailsModal';
import PastUpgradesSidebar from './PastUpgradesSidebar'; 

export default function UpgradeCalendar() {
  const [loading, setLoading] = useState(true);
  const [upgrades, setUpgrades] = useState([]);
  const [pastUpgrades, setPastUpgrades] = useState([]); 
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextUpgrade, setNextUpgrade] = useState(null);
  
  const [activeUpgrade, setActiveUpgrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobileDevice } = useDeviceSizes();

  const loadData = () => {
    fetchExcelData().then((data) => {
      const today = startOfDay(new Date());
      const twoWeeksAgo = subDays(today, 14);
      
      const formatted = data.map(item => ({
        ...item,
        parsedDate: parseISO(item.upgradeDate)
      }));
      setUpgrades(formatted);

      const history = formatted
        .filter(item => isWithinInterval(item.parsedDate, { start: twoWeeksAgo, end: subDays(today, 1) }))
        .sort((a, b) => b.parsedDate - a.parsedDate);
      setPastUpgrades(history);

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

  const todayMidnight = startOfDay(new Date());

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <CountdownBanner nextUpgrade={nextUpgrade} />

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: isMobileDevice ? '1fr' : '9fr 3fr', 
          gap: 3,
          alignItems: 'start'
        }}
      >
        {/* LEFT COLUMN: Calendar Panel */}
        <Box>
          <CalendarHeader 
            currentMonth={currentMonth}
            onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
            onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
            onAddClick={handleOpenCreate}
          />

          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: isMobileDevice ? '1fr' : 'repeat(7, minmax(0, 1fr))', 
              gap: 1.5 
            }}
          >
            {!isMobileDevice && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Box key={day} sx={{ textAlign: 'center', pb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>{day}</Typography>
              </Box>
            ))}

            {!isMobileDevice && Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <Paper key={`empty-${index}`} variant="outlined" sx={{ minHeight: 110, bgcolor: '#f4f6f4', border: '1px dashed #e0e0e0', borderRadius: 2 }} />
            ))}

            {daysInMonth.map((day) => {
              const dayUpgrades = upgrades.filter(u => isSameDay(u.parsedDate, day));
              const hasUpgrade = dayUpgrades.length > 0;
              
              // Check if this specific day belongs to the past
              const isPastDay = isBefore(day, todayMidnight);

              if (isMobileDevice && !hasUpgrade) return null;

              // Determine the background and border styling color for the calendar tile itself
              let tileBgColor = 'background.paper';
              let tileBorderColor = 'divider';

              if (hasUpgrade) {
                if (isPastDay) {
                  tileBgColor = '#f3f4f6'; // Muted light gray for past event tiles
                  tileBorderColor = '#d1d5db';
                } else {
                  tileBgColor = 'customHighlight.main'; // Vibrant theme color for today/future events
                  tileBorderColor = 'customHighlight.dark';
                }
              }

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
                    borderColor: tileBorderColor,
                    bgcolor: tileBgColor,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: hasUpgrade && !isPastDay ? 'primary.main' : 'text.secondary', 
                      mb: isMobileDevice ? 0 : 1,
                      minWidth: isMobileDevice ? '65px' : 'auto'
                    }}
                  >
                    {isMobileDevice ? format(day, 'MMM d') : format(day, 'd')}
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, ml: isMobileDevice ? 2 : 0 }}>
                    {dayUpgrades.map((upg, i) => {
                      const pillBgColor = isPastDay ? '#9ca3af' : 'primary.main'; 
                      const pillHoverColor = isPastDay ? '#6b7280' : 'secondary.main';

                      return (
                        <Box 
                          key={i} 
                          onClick={() => handleOpenEdit(upg)}
                          sx={{ 
                            bgcolor: pillBgColor, 
                            color: 'primary.contrastText', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.72rem', 
                            fontWeight: '600', 
                            cursor: 'pointer', 
                            textOverflow: 'ellipsis',
                            overflow: 'hidden', 
                            whiteSpace: 'nowrap', 
                            '&:hover': { bgcolor: pillHoverColor }
                          }}
                        >
                          {isPastDay ? `${upg.customer}` : upg.customer}
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>

        {/* RIGHT COLUMN: Standing sidebar element container */}
        <PastUpgradesSidebar 
          pastUpgrades={pastUpgrades} 
          onItemClick={handleOpenEdit} 
        />
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