import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

const modules = [
  {
    name: 'Store Transactions',
    image: '/images/1.png',
    path: '/RetailCommerce/StoreTransactions/',
  },
  {
    name: 'POS Configuration',
    image: '/images/2.png',
    path: '/RetailCommerce/PosConfiguration/',
  },
  {
    name: 'Reporting',
    image: '/images/3.png',
    path: '/RetailCommerce/Reporting/',
  },
];

const ModulesGrid = ({ user }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const handleTileClick = (path) => {
    console.log("Navigating to: ", path);
    navigate(path);
  };

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      <Grid container spacing={2} justifyContent="flex-start">
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tooltip title={module.name} arrow enterDelay={700} placement="top">
              <Paper
                aria-label={`Navigate to ${module.name}`}
                sx={{
                  padding: 1.5, // Slightly increased for balance
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out', // Smoother transition
                  position: 'relative',
                  height: { xs: '70px', sm: '80px', md: '90px' }, // Slightly taller for better spacing
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  boxShadow: isDarkMode
                    ? '0 6px 20px rgba(0, 0, 0, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.15)', // Softer, deeper shadow
                  borderRadius: '12px', // Slightly rounder corners
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)', // Subtle gradient
                  border: isDarkMode ? '1px solid #444' : '1px solid #e0e0e0', // Subtle border
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)', // Lift and slight scale
                    boxShadow: isDarkMode
                      ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                      : '0 10px 30px rgba(0, 0, 0, 0.2)', // Glow effect
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)'
                      : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)', // Reverse gradient on hover
                  },
                }}
                onClick={() => handleTileClick(module.path)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: { xs: 1, sm: 1.5 }, // Adjusted for balance
                    width: '100%',
                  }}
                >
                  <img
                    src={module.image}
                    alt={module.name}
                    style={{
                      width: '48px', // Slightly larger for visibility
                      height: '48px',
                      marginRight: '20px', // More space for elegance
                      borderRadius: '50%', // Circular images
                      border: isDarkMode
                        ? '2px solid #f15a22'
                        : '2px solid #e0e0e0', // Accent border
                      objectFit: 'cover', // Ensure image fits nicely
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '14px', sm: '16px' }, // Slightly larger for readability
                      fontWeight: '600', // Bold but refined
                      fontFamily: 'Encode Sans, Arial, sans-serif',
                      color: isDarkMode ? '#f5f5f5' : '#f15a22', // Orange for light mode to tie with heading
                      letterSpacing: '0.5px', // Subtle spacing
                      textTransform: 'uppercase', // Modern touch
                    }}
                  >
                    {module.name}
                  </Typography>
                </Box>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModulesGrid;