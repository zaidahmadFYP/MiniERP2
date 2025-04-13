import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const Sidebar = ({ user }) => {
  return (
    <Box
      
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Store Info
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Store: {user?.store}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Branch: {user?.branch}
      </Typography>
    </Box>
  );
};

export default Sidebar;