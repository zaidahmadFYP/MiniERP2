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
    name: 'Product Addition',
    image: '/images/Product_Addition.png',
    path: '/ProductInformationConfiguration/ProductAddition',
  },
  {
    name: 'Product Categories',
    image: '/images/Product_Category.png',
    path: '/ProductInformationConfiguration/ProductCategory',
  },
  {
    name: 'Product Pricing',
    image: '/images/Product_Pricing.png',
    path: '/ProductInformationConfiguration/ProductPricing',
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
                  padding: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  height: { xs: '70px', sm: '80px', md: '90px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  boxShadow: isDarkMode
                    ? '0 6px 20px rgba(0, 0, 0, 0.4)'
                    : '0 6px 20px rgba(0, 0, 0, 0.15)',
                  borderRadius: '12px',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                  border: isDarkMode ? '1px solid #444' : '1px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)',
                    boxShadow: isDarkMode
                      ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                      : '0 10px 30px rgba(0, 0, 0, 0.2)',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)'
                      : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
                  },
                }}
                onClick={() => handleTileClick(module.path)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: { xs: 1, sm: 1.5 },
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      marginRight: '20px',
                      borderRadius: '50%',
                      border: isDarkMode
                        ? '2px solid #f15a22'
                        : '2px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={module.image}
                      alt={module.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '14px', sm: '16px' },
                      fontWeight: '600',
                      fontFamily: 'Encode Sans, Arial, sans-serif',
                      color: isDarkMode ? '#f5f5f5' : '#f15a22',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
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