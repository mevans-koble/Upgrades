import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { format } from 'date-fns';

export default function CountdownBanner({ nextUpgrade }) {
  if (!nextUpgrade) return null;

  return (
    <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 3, boxShadow: 4 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'customHighlight.main', fontWeight: 'bold', letterSpacing: 1.5 }}>
            NEXT UPCOMING UPGRADE
          </Typography>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
            {nextUpgrade.customer}
          </Typography>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
            <CalendarMonth fontSize="small" /> Scheduled: {format(nextUpgrade.parsedDate, 'MMMM do, yyyy')}
          </Typography>
        </Box>
        
        <Box textAlign="center" sx={{ bgcolor: 'rgba(255,255,255,0.1)', px: 3, py: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'customHighlight.main', lineHeight: 1, display:"flex", justifyContent:"center" }}>
            {nextUpgrade.daysAway}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
            DAYS AWAY
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}