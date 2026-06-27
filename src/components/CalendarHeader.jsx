import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format } from 'date-fns';

export default function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth }) {
  return (
    <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {format(currentMonth, 'MMMM yyyy')}
      </Typography>
      <Box>
        <IconButton onClick={onPrevMonth} sx={{ color: 'secondary.main' }}>
          <ChevronLeft fontSize="large" />
        </IconButton>
        <IconButton onClick={onNextMonth} sx={{ color: 'secondary.main' }}>
          <ChevronRight fontSize="large" />
        </IconButton>
      </Box>
    </Paper>
  );
}