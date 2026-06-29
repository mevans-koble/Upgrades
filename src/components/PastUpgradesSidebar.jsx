import React from 'react';
import { Paper, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import { format } from 'date-fns';

export default function PastUpgradesSidebar({ pastUpgrades, onItemClick }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.paper', height:"100%" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Completed (Past 14 Days)
      </Typography>
      <Divider sx={{ mb: 1.5 }} />
      
      {pastUpgrades.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', py: 2, textAlign: 'center' }}>
          No upgrades deployed in the last 2 weeks.
        </Typography>
      ) : (
        <List disablePadding>
          {pastUpgrades.map((upg) => (
            <>
            <ListItem 
              key={upg.id} 
              disableGutters 
              onClick={() => onItemClick(upg)}
              sx={{ 
                cursor: 'pointer', 
                borderRadius: 1, 
                px: 1,
                py: 0.75,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' } 
              }}
            >
              <ListItemText
                primary={`${upg.customer}`}
                secondary={format(upg.parsedDate, 'MMM d, yyyy')}
                primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: '600', color: 'text.primary' } }}
                secondaryTypographyProps={{ variant: 'caption', sx: { color: 'text.secondary' } }}
              />
            </ListItem>
            <Divider />
            </>
        ))}
        </List>
      )}
    </Paper>
  );
}