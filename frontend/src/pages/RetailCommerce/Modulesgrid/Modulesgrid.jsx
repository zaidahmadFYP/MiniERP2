import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const modules = [
  {
    name: 'Store Transactions',
    image: '/images/1.png',
    path: '/RetailCommerce/StoreTransactions/', // Add the path for the page
  },
  {
    name: 'POS Configuration',
    image: '/images/2.png',
    path: '/pos-configuration', // Add the path for the page
  },
  {
    name: 'Reporting',
    image: '/images/3.png',
    path: '/reporting', // Add the path for the page
  },
];

const ModulesGrid = ({user}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const handleTileClick = (path) => {
    console.log("Navigating to: ", path); // Debug log to check the path
    navigate(path); // This navigates to the path
  };

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      <Grid container spacing={2} justifyContent="flex-start">
        {/* Map over the new tiles */}
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                padding: 1, // Reduced padding for smaller tiles
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', // Reduced shadow for subtle effect
                borderRadius: '10px',
                backgroundColor: isDarkMode ? '#424242' : '#FFF', // Dark mode background
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px', // Reduced height for smaller tiles
                position: 'relative', // To ensure the content is centered
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)', // Hover effect with more shadow
                },
              }}
              onClick={() => handleTileClick(module.path)} // Navigate to the tile's path
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'center',
                  padding: 1,
                }}
              >
                <img
                  src={module.image}
                  alt={module.name}
                  style={{
                    width: '100px', // Smaller image size
                    height: '100px',
                    marginBottom: '10px',
                    borderRadius: '8px', // Rounded image corners
                  }}
                />
                <Typography
                  variant="body2" // Smaller font size for the name
                  sx={{
                    fontWeight: 'bold',
                    fontFamily: 'Encode Sans, Arial, sans-serif',
                    color: isDarkMode ? '#fff' : '#f14a22', // Change text color based on dark mode
                    textTransform: 'uppercase', // To make the text stand out
                    letterSpacing: '1px', // Slight spacing for effect
                  }}
                >
                  {module.name}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModulesGrid;
