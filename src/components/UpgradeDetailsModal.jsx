import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, IconButton, Divider, Paper, Button } from '@mui/material';
import { Close, CalendarMonth, Notes } from '@mui/icons-material';
import { format } from 'date-fns';

export default function UpgradeDetailsModal({ activeUpgrade, onClose }) {
  return (
    <Dialog 
      open={Boolean(activeUpgrade)} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      {activeUpgrade && (
        <>
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {activeUpgrade.customer}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <CalendarMonth fontSize="inherit" /> Upgrade Date: {format(activeUpgrade.parsedDate, 'MMMM do, yyyy')}
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          
          <Divider sx={{ mx: 2 }} />

          <DialogContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Notes sx={{ color: 'secondary.main' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'secondary.main', letterSpacing: 0.5 }}>
                UPGRADE PROCESS NOTES
              </Typography>
            </Box>
            
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fcfdfc', borderRadius: 2, minHeight: '100px', borderColor: 'divider' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.6 }}>
                {activeUpgrade.notes || "No special instructions or notes provided for this deployment block."}
              </Typography>
            </Paper>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="contained" sx={{ bgcolor: 'primary.main', borderRadius: 2, px: 3 }}>
              Close View
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}