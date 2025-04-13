import React from 'react';
import Box from '@mui/material/Box';
import { useTheme, useMediaQuery } from '@mui/material';

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // Some top margin so it’s below the AppBar
        mt: { xs: 6, sm: 2 },

        // Extra left/right margins only on desktop
        ml: { xs: 0, sm: 8 },
        mr: { xs: 0, sm: 1 },

        // Negative bottom margin only on desktop if desired
        mb: { xs: 0, sm: -5 },

        // Padding: smaller on mobile, bigger on desktop
        p: { xs: 2, sm: 6 },
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/images/banner.png`}
        alt="Banner"
        style={{
          // Always scale to 100% width of the container,
          // but on large screens, don’t exceed 1200px.
          // On mobile, optionally allow 120% for a bigger effect.
          width: isMobile ? '120%' : '110%',
          maxWidth: isMobile ? 'none' : '2400px',

          height: 'auto',
          marginBottom: '1px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
        }}
      />
    </Box>
  );
};

export default Banner;
