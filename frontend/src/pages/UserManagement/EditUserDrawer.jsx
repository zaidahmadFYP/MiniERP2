import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; // Import the useTheme hook

const Roles = [
  'IT', 'Admin', 'HR', 'Operations','Finance',
];
const branchRoles = ['Cashier', 'Manager'];

const EditUserDrawer = ({ open, onClose, user, onUserUpdated }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    role: '',
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [drawerCloseNotificationOpen, setDrawerCloseNotificationOpen] = useState(false);

  const theme = useTheme(); // Access the current theme
  const isDarkMode = theme.palette.mode === 'dark'; // Check if the current theme is dark

  useEffect(() => {
    if (user) {
      const [firstName, lastName] = user.name ? user.name.split(' ') : ['', ''];
      setFormValues({
        firstName: firstName || '',
        lastName: lastName || '',
        displayName: user.displayName || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => {
      const updatedValues = { ...prev, [name]: value };

      // Automatically update the displayName based on firstName and lastName
      if (name === 'firstName' || name === 'lastName') {
        updatedValues.displayName = `${updatedValues.firstName} ${updatedValues.lastName}`.trim();
      }

      return updatedValues;
    });
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    const name = `${formValues.firstName} ${formValues.lastName}`.trim();

    const updatePayload = {
      name,
      displayName: formValues.displayName,
      role: formValues.role,
    };

    console.log("Update payload being sent:", updatePayload); // Log payload

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${user._id}`, updatePayload);
      console.log('Response from server:', response.data); // Log response
      setNotificationOpen(true); // Show success notification
      setDrawerCloseNotificationOpen(true); // Show snackbar when drawer closes
      onUserUpdated(); // Refresh user list or any other necessary actions
      onClose(); // Close the drawer
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the notification
  };

  const handleDrawerCloseNotificationClose = () => {
    setDrawerCloseNotificationOpen(false); // Close the drawer close notification
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '40%',
            marginTop: '64px',
            backgroundColor: isDarkMode ? '#333' : '#fff', // Background color based on mode
          },
        }}
      >
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
            Edit User Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                fullWidth
                name="firstName"
                variant="outlined"
                value={formValues.firstName}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#888',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#f15a22',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f15a22',
                    },
                  },
                  '& label.Mui-focused': {
                    color: '#f15a22',
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                fullWidth
                name="lastName"
                variant="outlined"
                value={formValues.lastName}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#888',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#f15a22',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f15a22',
                    },
                  },
                  '& label.Mui-focused': {
                    color: '#f15a22',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Display Name"
                fullWidth
                name="displayName"
                variant="outlined"
                value={formValues.displayName}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#888',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#f15a22',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f15a22',
                    },
                  },
                  '& label.Mui-focused': {
                    color: '#f15a22',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                variant="outlined"
                value={formValues.email}
                onChange={handleInputChange}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#888',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#f15a22' : '#f15a22',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f15a22',
                    },
                  },
                  '& label.Mui-focused': {
                    color: '#f15a22',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Role</InputLabel>
                <Select
                  label="Role"
                  fullWidth
                  name="role"
                  variant="outlined"
                  value={formValues.role}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? '#f15a22' : '#888',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#f15a22' : '#f15a22',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f15a22',
                      },
                    },
                    '& label.Mui-focused': {
                      color: '#f15a22',
                    },
                  }}
                >
                  <MenuItem value="" disabled>Select Role</MenuItem>
                  {Roles.concat(branchRoles).map((role) => (
                    <MenuItem key={role} value={role} style={{ color: isDarkMode ? '#fff' : '#000' }}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{
                backgroundColor: '#f15a22',
                '&:hover': { backgroundColor: '#d3541e' },
              }}
            >
              Save Changes
            </Button>
          </Box>

          {/* Snackbar for notification */}
          <Snackbar
            open={notificationOpen}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%' }}>
              User details updated successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Drawer>

      {/* Snackbar for drawer close notification */}
      <Snackbar
        open={drawerCloseNotificationOpen}
        autoHideDuration={3000}
        onClose={handleDrawerCloseNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleDrawerCloseNotificationClose} severity="info" sx={{ width: '100%' }}>
          User Edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUserDrawer;
