import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const Tile = ({ name, image }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const handleClick = () => {
    switch (name) {
      case 'Retail and Commerce':
        navigate('/RetailCommerce');
        break;
      case 'User Management':
        navigate('/UserManagement');
        break;
      default:
        console.log(`${name} clicked`);
    }
  };

  return (
    <Tooltip title={name} arrow enterDelay={700} placement="top">
      <Paper
        aria-label={`Navigate to ${name}`}
        sx={{
          padding: 1,
          cursor: 'pointer',
          transition: 'transform 0.1s ease-in-out',
          position: 'relative',
          height: { xs: '60px', sm: '70px', md: '80px' }, // Adjust height based on screen size
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          backgroundColor: isDarkMode ? '#333' : '#FFF',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: { xs: 1, sm: 2 }, // Adjust padding dynamically
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: '40px', // Keep the size constant or adjust as needed
              height: '40px',
              marginRight: '15px',
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '13px', sm: '15px' }, // Smaller font on mobile
              fontWeight: 'bold',
              fontFamily: 'Encode Sans, Arial, sans-serif',
              color: isDarkMode ? '#FFF' : '#000',
            }}
          >
            {name}
          </Typography>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default Tile;
