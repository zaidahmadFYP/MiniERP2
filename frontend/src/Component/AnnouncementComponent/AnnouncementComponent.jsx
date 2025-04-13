import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const MajorAnnouncements = () => {
  return (
    <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Announcements
      </Typography>
      <Typography variant="body1">
        No new announcements.
      </Typography>
    </Paper>
  );
};

export default MajorAnnouncements;
