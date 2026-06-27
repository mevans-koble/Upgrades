import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Box, 
  Typography, IconButton, Divider, TextField, Button 
} from '@mui/material';
import { Close, Notes, Delete, Save } from '@mui/icons-material';

export default function UpgradeDetailsModal({ activeUpgrade, isOpen, onClose, onSave, onDelete }) {
  const [customer, setCustomer] = useState('');
  const [upgradeDate, setUpgradeDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (activeUpgrade && activeUpgrade.id) {
      setCustomer(activeUpgrade.customer || '');
      setUpgradeDate(activeUpgrade.upgradeDate || '');
      setNotes(activeUpgrade.notes || '');
    } else {
      setCustomer('');
      setUpgradeDate('');
      setNotes('');
    }
  }, [activeUpgrade]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      customer,
      upgradeDate,
      notes
    });
  };

  const isEditing = activeUpgrade && activeUpgrade.id;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {isEditing ? 'Modify Upgrade Schedule' : 'Schedule New Upgrade'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <Divider sx={{ mx: 2 }} />

        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Customer Name"
            required
            fullWidth
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />

          <TextField
            label="Upgrade Date"
            type="date"
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={upgradeDate}
            onChange={(e) => setUpgradeDate(e.target.value)}
          />

          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Notes sx={{ color: 'secondary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                UPGRADE PROCESS NOTES
              </Typography>
            </Box>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Enter special deployment instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          {isEditing ? (
            <Button 
              startIcon={<Delete />} 
              color="error" 
              onClick={() => onDelete(activeUpgrade.id)}
            >
              Delete
            </Button>
          ) : <Box />}
          
          <Box display="flex" gap={1}>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<Save />}
              sx={{ bgcolor: 'primary.main' }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}