import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export default function CountdownBanner({ nextUpgrade }) {
  if (!nextUpgrade) return null;

  // Check if the scheduled upgrade is happening today
  const isToday = nextUpgrade.daysAway === 0;

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2.5, 
        mb: 3, 
        bgcolor: isToday ? '#fff5f5' : '#f0fdf4', // Soft red background for today, soft green for future
        borderLeft: `6px solid ${isToday ? '#ef4444' : '#16a34a'}`, // Solid red side-accent line for today
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase', tracking: 1, fontWeight: 'bold' }}>
          Next Scheduled Deployment
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5 }}>
          {nextUpgrade.customer}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isToday ? (
          /* Render the flashing update alert badge if 0 days away */
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              bgcolor: '#ef4444', 
              color: '#ffffff', 
              px: 2, 
              py: 0.75, 
              borderRadius: 2, 
              fontWeight: '900',
              letterSpacing: '0.5px',
              animation: 'flashPulse 1.5s infinite alternate' // Applied the flashing keyframe animation
            }}
          >
            <ErrorIcon size="small" />
            UPDATE TODAY
          </Box>
        ) : (
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: '900', color: 'primary.main' }}>
              {nextUpgrade.daysAway}
            </Typography>
            <Typography variant="subtitle1" component="span" sx={{ ml: 1, color: 'text.secondary', fontWeight: '500' }}>
              {nextUpgrade.daysAway === 1 ? 'day away' : 'days away'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Embedded CSS animation layout context for smooth element scaling and color flashing */}
      <style>{`
        @keyframes flashPulse {
          0% { 
            transform: scale(1); 
            background-color: #ef4444; 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
          }
          100% { 
            transform: scale(1.04); 
            background-color: #b91c1c; /* Deepens to darker crimson at full pulse */
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </Paper>
  );
}