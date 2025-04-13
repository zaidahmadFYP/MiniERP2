import React, { useState } from 'react';
import { Menu, Avatar, Typography, Box, Divider, Button, CircularProgress } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ anchorEl, isOpen, onClose, user, darkMode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder to suppress eslint warning
  console.log(navigate);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onClose();
      window.location.href = '/login'; // Ensure full page reload to remove app state
    }, 1000); // Simulate a short delay for loading animation
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        style: {
          width: 320,
          padding: '25px',
          borderRadius: '16px',
          backgroundColor: darkMode ? '#1f1f1f' : '#fefefe', // Dark background for dark mode
          color: darkMode ? '#e0e0e0' : '#333',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {/* Profile Avatar with Gradient */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            width: 64,
            height: 64,
            fontSize: '1.5rem',
            color: '#fff',
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      </Box>

      {/* User Name and Email */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#333', mb: 1 }}
      >
        {user.name || 'User Name'}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: darkMode ? '#bdbdbd' : '#666', mb: 2 }}
      >
        {user.email || 'email@example.com'}
      </Typography>

      {/* Divider for better section separation */}
      <Divider sx={{ my: 2, backgroundColor: darkMode ? '#333' : '#e0e0e0' }} />

      {/* Role and Branch Details with Prominent Text and Icons */}
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box sx={{ padding: 0, display: 'flex', alignItems: 'center', mb: 1 }}>
          <WorkIcon
            fontSize="small"
            sx={{ mr: 1, color: darkMode ? '#f15a22' : '#f15a22' }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#000' }}
          >
            Role:{' '}
            <span
              style={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#000' }}
            >
              {user.role || 'N/A'}
            </span>
          </Typography>
        </Box>
        <Box sx={{ padding: 0, display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon
            fontSize="small"
            sx={{ mr: 1, color: darkMode ? '#f15a22' : '#f15a22' }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#000' }}
          >
            Branch:{' '}
            <span
              style={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#000' }}
            >
              {user.branch || 'N/A'}
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Divider and Centered Logout Button */}
      <Divider sx={{ my: 2, backgroundColor: darkMode ? '#333' : '#e0e0e0' }} />
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          startIcon={
            isLoading ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              <LogoutIcon />
            )
          }
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            padding: '8px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: darkMode ? '#e53935' : '#f44336', // Dark red for logout button in dark mode
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out..' : 'Logout'}
        </Button>
      </Box>
    </Menu>
  );
};

export default ProfileMenu;
