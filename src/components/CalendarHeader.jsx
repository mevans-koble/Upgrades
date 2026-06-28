import React from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Add } from '@mui/icons-material';
import { format } from 'date-fns';
import {useDeviceSizes} from '../hooks/useDeviceSizes';
import AddIcon from '@mui/icons-material/Add';

export default function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth, onAddClick }) {
  const { isMobileDevice } = useDeviceSizes();
  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderRadius: 2 
      }}
    >
      <Box  gap={3} sx={{display:"flex", justifyContent:"space-between"}}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        
        {!isMobileDevice && (
           <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={onAddClick}
          size="small"
          sx={{ bgcolor: 'secondary.main', fontWeight: 'bold', textTransform: 'none', marginLeft:"15px" }}
        >
          Add Upgrade
        </Button>
            )}
        {isMobileDevice && (

          <IconButton 
          onClick={onAddClick}
          size="small"
          sx={{ bgcolor: 'secondary.main', fontWeight: 'bold', textTransform: 'none', marginLeft:"15px" }}
          >
          <AddIcon />
        </IconButton>
        )}
      </Box>

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