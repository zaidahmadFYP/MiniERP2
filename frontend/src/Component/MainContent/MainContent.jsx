import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Banner from '../BannerComponent/BannerComponent';
import TilesGrid from '../TileGrid/TileGrid';
import CalendarComponent from './CalandarComponent';

const MainContent = ({ user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const headingColor = theme.palette.mode === 'dark' ? '#f5a623' : '#000000'; // Adjusted to a more vibrant orange for contrast
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  const tiles = useMemo(() => {
    const allTiles = [
      { name: 'Retail and Commerce', image: '/images/licenses.webp' },
      { name: 'Product Information and Management', image: '/images/approved.webp' },
      { name: 'Finance and Sales', image: '/images/vehicle.webp' },
      { name: 'Inventory Management', image: '/images/vehicle.webp' },
      { name: 'Reports and Analytics', image: '/images/vehicle.webp' },
      { name: 'User Management', image: '/images/user_management.webp' },
    ];
    return allTiles.filter((tile) =>
      user.registeredModules.some((module) => module.startsWith(tile.name))
    );
  }, [user]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/announcements/latest`)
      .then((response) => response.json())
      .then((data) => setLatestAnnouncement(data))
      .catch((error) => console.error('Error fetching the latest announcement:', error));
  }, []);

  const handleTileClick = (tileName) => {
    const paths = {
      RetailCommerce: '/RetailCommerce/RetailCommerce',
      'User Management': '/UserManagement/UserManagement',
    };
    navigate(paths[tileName], { state: { tileName } });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: isMobile ? 2 : 4,
        marginLeft: isMobile ? 0 : 1,
        transition: 'margin-left 0.3s ease', // Smoother transition
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5', // Dark background for dark mode
        overflowY: 'auto',
        height: '100vh',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f1f1',
        },
      }}
    >
      {/* Banner with gradient for visual appeal */}
      <Banner sx={{ background: 'linear-gradient(135deg, #6B48FF 0%, #A855F7 100%)' }} />

      {/* Modules Heading */}
      <Typography
        variant="h4"
        sx={{
          color: headingColor,
          mb: 3, // Increased margin for better spacing
          textAlign: 'left',
          ml: isMobile ? 2 : 6,
          fontSize: isMobile ? '28px' : '36px', // Slightly larger for emphasis
          fontFamily: 'TanseekModernPro-Bold, Arial, sans-serif',
          letterSpacing: '1px', // Add spacing for a modern look
          textTransform: 'uppercase', // Match the screenshot style
        }}
      >
        Modules
      </Typography>

      <Grid container spacing={isMobile ? 2 : 3} alignItems="flex-start">
        {/* Tiles Grid */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              ml: isMobile ? 0 : 6,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2, // Add gap between tiles for better spacing
            }}
          >
            <TilesGrid
              tiles={tiles}
              onTileClick={handleTileClick}
              sx={{
                '& .tile': {
                  // Assuming TilesGrid renders tiles with a "tile" class
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  borderRadius: '12px', // Rounded corners for a modern look
                  boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
                  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff', // Card-like background
                  '&:hover': {
                    transform: 'translateY(-5px)', // Lift effect on hover
                    boxShadow: theme.palette.mode === 'dark' ? '0 8px 20px rgba(0, 0, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
                  },
                },
                '& .tile-text': {
                  // Assuming tile text has a "tile-text" class
                  fontSize: '16px',
                  fontWeight: 500,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
                  textAlign: 'center',
                  mt: 1,
                },
              }}
            />
          </Box>
        </Grid>

        {/* Calendar Section */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              ml: isMobile ? 0 : 10,
              mr: isMobile ? 0 : 2, // Add right margin for balance
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5', // Match background
              borderRadius: '12px', // Rounded corners for calendar
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
              p: 2, // Add padding inside the calendar container
              overflowY: 'auto',
              maxHeight: isMobile ? '60vh' : 'calc(100vh - 200px)',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f1f1',
              },
            }}
          >
            <CalendarComponent
              isMobile={isMobile}
              sx={{
                '& .calendar-header': {
                  // Assuming CalendarComponent has a header with "calendar-header" class
                  fontSize: '18px',
                  fontWeight: 600,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
                  mb: 1,
                },
                '& .calendar-day': {
                  // Assuming days have a "calendar-day" class
                  borderRadius: '50%',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#f5a623' : '#e0e0e0', // Highlight on hover
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContent;