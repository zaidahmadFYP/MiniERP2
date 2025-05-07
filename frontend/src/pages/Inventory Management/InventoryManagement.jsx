import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ModulesGrid from './Modulesgrid/Modulesgrid';
import { useTheme } from '@mui/material/styles';
import Banner from '../../Component/BannerComponent/BannerComponent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f5f5f5',
  color: theme.palette.mode === 'dark' ? '#FFF' : '#000',
  minHeight: '100vh', // Ensure it fills the viewport height
  height: '100%',      // Ensure it takes full height
  overflowY: 'auto',   // Allow vertical scrolling
}));

const InventoryManagement = () => {
  const theme = useTheme(); 
  const isMobile = window.innerWidth < 600; // Simple mobile check for ml prop

  // Function to get responsive font size (as per remembered MainContent)
  const getFontSize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 600) return '1.1rem'; // xs
    if (windowWidth < 960) return '1.25rem'; // sm
    if (windowWidth <= 1366) return '1.4rem'; // md-compact
    return '1.5rem'; // md
  };

  return (
    <MainContent>
      {/* Banner Section */}
      <Box
        sx={{
          mt: { xs: 6, sm: 2 }, // Top margin: larger on mobile
          ml: { xs: -2, sm: 1 }, // Left margin: none on mobile, small on desktop
          mr: { xs: -2, sm: -1 }, // Right margin: none on both
          mb: { xs: -1, sm: 4 }, // Bottom margin: small on mobile, larger on desktop
        }}
      >
        <Banner />
      </Box>

      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          color: '#f15a22', // Orange color
          mt: 1, // Margin-top
          mb: 6, // Margin-bottom
          textAlign: 'left', // Align text to the left
          ml: isMobile ? 2 : 6, // Left margin based on screen size
          fontSize: getFontSize(), // Dynamic font size
          fontFamily: 'TanseekModernPro-Bold, Arial, sans-serif', // Font family
          fontWeight: 'bold', // Bold font weight
          letterSpacing: '1px', // Letter spacing
          textTransform: 'uppercase', // Uppercase text
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid #333333', // Bottom border
          paddingBottom: '6px', // Padding below text
        }}
      >
        <Box
          sx={{
            height: '25px',
            width: '3px',
            backgroundColor: '#f15a22',
            marginRight: '4px',
          }}
        />
        Finance and Sales
      </Typography>

      {/* Modules Section */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              mt: { xs: -6, sm: -6 }, // Negative top margin: smaller on mobile
              ml: { xs: 2, sm: 6 },   // Left margin: smaller on mobile
            }}
          >
            <ModulesGrid />
          </Box>
        </Grid>
      </Grid>
    </MainContent>
  );
};

export default InventoryManagement;