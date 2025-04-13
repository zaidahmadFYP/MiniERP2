import React from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DrawerHeader = ({ handleDrawerToggle, isMobile }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        justifyContent: 'flex-end',
        height: '64px',
      }}
    >
      {/* Only show the chevron on desktop */}
      {!isMobile && (
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      )}
    </div>
  );
};

export default DrawerHeader;
