import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; // Import the useTheme hook

const EditAssignedModulesDrawer = ({ open, onClose, user, onModulesUpdated }) => {
  const [modules, setModules] = useState([]);
  const [checkedModules, setCheckedModules] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const theme = useTheme(); // Access the current theme
  const isDarkMode = theme.palette.mode === 'dark'; // Check if the current theme is dark

  useEffect(() => {
    setModules([
      { main: 'Retail and Commerce', subModules: ['Store Transactions', 'POS Configuration', 'Reports'] },
      { main: 'Product Information and Configuration', subModules: ['Product Addition', 'Product Categories', 'SKU Management', 'Product Pricing'] },
      { main: 'Inventory Management', subModules: ['Stock Management', 'Warehouse Management', 'Stock Movements & Adjustments'] },
      { main: 'Finance and Sales', subModules: ['Sales Order', 'Billing and Payments', 'Tax Configurations'] },
      { main: 'Reports and Analytics', subModules: ['Sales Report', 'Inventory Report', 'Financial Analytics'] },
      { main: 'User Management', subModules: [] },
    ]);

    if (user && user.registeredModules) {
      const userModules = {};
      user.registeredModules.forEach((module) => {
        userModules[module] = true;
      });
      setCheckedModules(userModules);
    }
  }, [user]);

  const handleModuleChange = (main, sub) => (event) => {
    const key = `${main}_${sub}`;
    setCheckedModules({
      ...checkedModules,
      [key]: event.target.checked,
    });
  };

  const handleSave = async () => {
    if (!user || !user._id) {
      console.error('User ID is missing.');
      return;
    }

    const selectedModules = Object.keys(checkedModules).filter((key) => checkedModules[key]);
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${user._id}/modules`, {
        modules: selectedModules,
      });
      setSnackbarOpen(true); // Show Snackbar on successful update
      onModulesUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating modules:', error.response || error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  const renderModuleSelection = () => {
    const moduleHeight = 56; // Fixed height for consistent styling

    return (
      <Box
        sx={{
          height: '400px',
          overflowY: 'auto',
          paddingRight: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: isDarkMode ? '#f15a22' : '#f15a22',
            borderRadius: '10px',
          },
        }}
      >
        {modules.map((module) =>
          module.subModules.length > 0 ? (
            // Expandable modules
            <Accordion
              key={module.main}
              sx={{
                marginBottom: '4px', // Reduced gap between accordions
                backgroundColor: isDarkMode ? '#333' : '#fff', // Adjust background based on mode
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: moduleHeight,
                  '&.MuiAccordionSummary-root': {
                    alignItems: 'center',
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                }}
              >
                <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{module.main}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: isDarkMode ? '#444' : '#f9f9f9' }}>
                <FormGroup>
                  {module.subModules.map((subModule) => (
                    <FormControlLabel
                      key={subModule}
                      control={
                        <Checkbox
                          checked={!!checkedModules[`${module.main}_${subModule}`]}
                          onChange={handleModuleChange(module.main, subModule)}
                          sx={{
                            color: isDarkMode ? '#fff' : '#000', // Checkbox color based on mode
                            '&.Mui-checked': {
                              color: '#f15a22', // Checkbox color when checked
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{subModule}</Typography>}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ) : (
            // Non-expandable modules
            <Box
              key={module.main}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                borderRadius: '4px',
                backgroundColor: isDarkMode ? '#1c1c1c' : '#f5f5f5', // Background color for non-expandable modules
                height: moduleHeight,
                marginBottom: '4px', // Reduced gap for non-expandable modules
                boxShadow: isDarkMode ? '0px 1px 3px rgba(0, 0, 0, 0.2)' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkedModules[`${module.main}_`]}
                    onChange={handleModuleChange(module.main, '')}
                    sx={{
                      color: isDarkMode ? '#fff' : '#000', // Checkbox color based on mode
                      '&.Mui-checked': {
                        color: '#f15a22', // Checkbox color when checked
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{module.main}</Typography>}
              />
            </Box>
          )
        )}
      </Box>
    );
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
            Edit Assigned Modules
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {renderModuleSelection()}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              onClick={onClose}
              sx={{
                mr: 2,
                color: isDarkMode ? 'red' : 'red',
                borderColor: isDarkMode ? 'red' : 'red',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                  borderColor: 'red',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: '#f15a22',
                '&:hover': {
                  backgroundColor: '#d3541e',
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Modules updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditAssignedModulesDrawer;
