import React, { useState } from 'react';
import {
  Drawer,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const steps = ['Basics', 'Manage Roles', 'Manage Modules', 'Finish'];

const headquarterRoles = [
  'IT', 'Admin', 'HR', 'Operations', 
  'Finance'
];

const branchRoles = ['Cashier', 'Manager'];

const modules = [
  { main: 'Retail and Commerce', subModules: ['Store Transactions', 'POS Configuration', 'Reports'] },
  { main: 'Product Information and Configuration', subModules: ['Product Addition','Product Categories','SKU Management','Product Pricing'] },
  { main: 'Inventory Management', subModules: ['Stock Management', 'Warehouse Management','Stock Movements & Adjustments'] },
  { main: 'Finance and Sales', subModules: ['Sales Order','Billing and Payments','Tax Configurations'] },
  { main: 'Reports and Analytics', subModules: ['Sales Report', 'Inventory Report', 'Financial Analytics'] },
  { main: 'User Management', subModules: [] },
];

const AddUserDrawer = ({ open, onClose, onUserCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [roleType, setRoleType] = useState('Headquarter Roles');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [checkedModules, setCheckedModules] = useState({});
  const [notificationOpen, setNotificationOpen] = useState(false);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Form state
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    username: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Password generation state
  const [generatePassword, setGeneratePassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Reset function to clear drawer state when closed
  const resetDrawer = () => {
    setActiveStep(0);
    setRoleType('Headquarter Roles');
    setRole('');
    setCustomRole('');
    setCheckedModules({});
    setFormValues({
      firstName: '',
      lastName: '',
      displayName: '',
      username: '',
    });
    setFormErrors({});
    setGeneratePassword(false);
    setGeneratedPassword('');
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = {
      ...formValues,
      [name]: value,
    };

    if (name === 'firstName' || name === 'lastName') {
      updatedValues.displayName = `${updatedValues.firstName} ${updatedValues.lastName}`.trim();
    }

    setFormValues(updatedValues);

    if (value.trim()) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Handle role type change
  const handleRoleTypeChange = (e) => {
    setRoleType(e.target.value);
    setRole('');
    setCheckedModules({});
    if (e.target.value !== 'Custom Role') {
      setCustomRole('');
    }
  };

  // Handle role selection or custom role input
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setCheckedModules({});
  };

  // Handle custom role input
  const handleCustomRoleChange = (e) => {
    setCustomRole(e.target.value);
    setRole(e.target.value);
  };

  // Password generation function
  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 5; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Handle password generation checkbox change
  const handlePasswordGenerationChange = (e) => {
    setGeneratePassword(e.target.checked);
    if (e.target.checked) {
      const newPassword = generateRandomPassword();
      setGeneratedPassword(newPassword);
    } else {
      setGeneratedPassword('');
    }
  };

  // Validation before going to the next step
  const validateForm = () => {
    let errors = {};

    if (!formValues.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    if (!formValues.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
    if (!formValues.displayName.trim()) {
      errors.displayName = 'Display Name is required';
    }
    if (!formValues.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!generatePassword) {
      errors.generatePassword = 'You must generate a password';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1 && (role === 'Cashier' || role === 'Manager')) {
      // Skip Manage Modules step if the role is Cashier or Manager
      setActiveStep(3);  // Directly go to Finish step
    } else if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 3) { // If we're on the Finish step
      if (role === 'Cashier' || role === 'Manager') {
        setActiveStep(1); // Go back to Manage Roles for Cashier/Manager
      } else {
        setActiveStep(2); // Go back to Manage Modules for other roles
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  // Handle module selection for Manage Modules step
  const handleModuleChange = (main, sub) => (event) => {
    const key = `${main}_${sub}`;
    setCheckedModules({
      ...checkedModules,
      [key]: event.target.checked,
    });
  };

  // Helper function to format the selected modules with sub-modules
  const formatModules = () => {
    let formattedModules = [];

    for (const moduleKey in checkedModules) {
      if (checkedModules[moduleKey]) {
        const [mainModule, subModule] = moduleKey.split('_');
        if (subModule) {
          const mainModuleIndex = formattedModules.findIndex(
            (module) => module.main === mainModule
          );
          if (mainModuleIndex !== -1) {
            formattedModules[mainModuleIndex].subModules.push(subModule);
          } else {
            formattedModules.push({ main: mainModule, subModules: [subModule] });
          }
        } else {
          formattedModules.push({ main: mainModule, subModules: [] });
        }
      }
    }
    return formattedModules;
  };

  // Render formatted modules in the Review Details step
  const renderModules = () => {

    if (role === 'Cashier' || role === 'Manager') {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography>None</Typography>
        </Box>
      );
    }

    const formattedModules = formatModules();

    if (formattedModules.length === 0) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography>None</Typography>
        </Box>
      );
    }

    return formattedModules.map((module) => (
      <Box key={module.main} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 'bold' }}>{module.main}</Typography>
        {module.subModules.length > 0 && (
          <ul>
            {module.subModules.map((subModule) => (
              <li key={subModule}>{subModule}</li>
            ))}
          </ul>
        )}
      </Box>
    ));
  };

  // Handle selecting/deselecting all submodules
  const handleSelectAllSubmodules = (main, checked) => {
    const updatedCheckedModules = { ...checkedModules };

    modules.forEach((module) => {
      if (module.main === main) {
        module.subModules.forEach((sub) => {
          updatedCheckedModules[`${main}_${sub}`] = checked;
        });
      }
    });

    setCheckedModules(updatedCheckedModules);
  };

  // Render module selection for Manage Modules step
  const renderModuleSelection = () => {
    const modulesWithSubModules = modules.filter((module) => module.subModules.length > 0);
    const modulesWithoutSubModules = modules.filter((module) => module.subModules.length === 0);
  
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
            backgroundColor: '#f15a22',
            borderRadius: '15px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
          },
        }}
      >
        {modulesWithSubModules.map((module) => (
          <Accordion key={module.main} sx={{ marginBottom: 0 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />}
              sx={{
                minHeight: '32px',
                '&.Mui-expanded': {
                  minHeight: '32px',
                },
                '.MuiAccordionSummary-content': {
                  margin: '4px 0',
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={module.subModules.every((sub) => !!checkedModules[`${module.main}_${sub}`])}
                    indeterminate={
                      module.subModules.some((sub) => !!checkedModules[`${module.main}_${sub}`]) &&
                      !module.subModules.every((sub) => !!checkedModules[`${module.main}_${sub}`])
                    }
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectAllSubmodules(module.main, e.target.checked);
                    }}
                    sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                  />
                }
                label={
                  <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
                    {module.main}
                  </Typography>
                }
                sx={{ marginRight: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {module.subModules.map((subModule) => (
                  <FormControlLabel
                    key={subModule}
                    control={
                      <Checkbox
                        checked={!!checkedModules[`${module.main}_${subModule}`]}
                        onChange={handleModuleChange(module.main, subModule)}
                        sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                      />
                    }
                    label={subModule}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
  
        {modulesWithoutSubModules.map((module) => (
          <Accordion key={module.main} sx={{ marginBottom: 0 }}>
            <AccordionSummary
              sx={{
                minHeight: '32px',
                '&.Mui-expanded': {
                  minHeight: '32px',
                },
                '.MuiAccordionSummary-content': {
                  margin: '4px 0',
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkedModules[`${module.main}_`]}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleModuleChange(module.main, '')(e);
                    }}
                    sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                  />
                }
                label={
                  <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
                    {module.main}
                  </Typography>
                }
                sx={{ marginRight: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </AccordionSummary>
          </Accordion>
        ))}
      </Box>
    );
  };

  // Handle finish and submit user
  const handleFinish = async () => {
    const user = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      displayName: formValues.displayName,
      username: formValues.username.trim(),
      password: generatedPassword || formValues.password,
      role: role,
      modules: Object.keys(checkedModules).filter((moduleKey) => checkedModules[moduleKey]),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User created:', data);
        onClose();
        setNotificationOpen(true);
      } else {
        console.error('Error creating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  // Render the drawer content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
              Set up the basics
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
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d1d1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#f15a22',
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
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d1d1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#f15a22',
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
                  error={!!formErrors.displayName}
                  helperText={formErrors.displayName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d1d1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#f15a22',
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Username"
                    fullWidth
                    name="username"
                    variant="outlined"
                    value={formValues.username}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#d1d1d1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f15a22',
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
                  <Typography sx={{ marginLeft: 1, color: isDarkMode ? '#fff' : '#000' }}>
                    @loop.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={generatePassword}
                      onChange={handlePasswordGenerationChange}
                      sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }}
                    />
                  }
                  label="Generate New Password"
                />
                {formErrors.generatePassword && (
                  <Typography sx={{ color: '#f44336', mt: 1 }}>
                    {formErrors.generatePassword}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
              Manage Roles
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  color: '#f15a22',
                  '&.Mui-focused': {
                    color: '#f15a22',
                  },
                }}
              >
                Select Type
              </FormLabel>
              <RadioGroup row value={roleType} onChange={handleRoleTypeChange}>
                <FormControlLabel
                  value="Headquarter Roles"
                  control={<Radio sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }} />}
                  label="Department"
                />
                <FormControlLabel
                  value="Branch Roles"
                  control={<Radio sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }} />}
                  label="Branch"
                />
                <FormControlLabel
                  value="Custom Role"
                  control={<Radio sx={{ color: '#f15a22', '&.Mui-checked': { color: '#f15a22' } }} />}
                  label="Custom"
                />
              </RadioGroup>
            </FormControl>

            {roleType === 'Custom Role' && (
              <TextField
                label="Enter Custom Role"
                fullWidth
                variant="outlined"
                value={customRole}
                onChange={handleCustomRoleChange}
                sx={{
                  mt: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d1d1',
                    },
                    '&:hover fieldset': {
                      borderColor: '#f15a22',
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
            )}

            {roleType !== 'Custom Role' && roleType === 'Headquarter Roles' ? (
              <FormControl fullWidth sx={{ mt: 3 }}>
                <Select
                  value={role}
                  onChange={handleRoleChange}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '& .MuiSelect-icon': {
                      color: '#f15a22',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Department
                  </MenuItem>
                  {headquarterRoles.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : roleType !== 'Custom Role' && (
              <FormControl fullWidth sx={{ mt: 3 }}>
                <Select
                  value={role}
                  onChange={handleRoleChange}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22',
                    },
                    '& .MuiSelect-icon': {
                      color: '#f15a22',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Branch Role
                  </MenuItem>
                  {branchRoles.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
              Manage Modules
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {renderModuleSelection()}
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#fff' : '#000' }}>
              Review Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="head"><strong>Name:</strong></TableCell>
                  <TableCell>{formValues.firstName} {formValues.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head"><strong>Display Name:</strong></TableCell>
                  <TableCell>{formValues.displayName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head"><strong>Username:</strong></TableCell>
                  <TableCell>{formValues.username}@loop.com</TableCell>
                </TableRow>
                {generatePassword && (
                  <TableRow>
                    <TableCell variant="head"><strong>Generated Password:</strong></TableCell>
                    <TableCell>{generatedPassword}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell variant="head"><strong>Role:</strong></TableCell>
                  <TableCell>{role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head"><strong>Selected Modules:</strong></TableCell>
                  <TableCell>{renderModules()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        );
      default:
        return null;
    }
  };

  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        resetDrawer();
        onClose();
      }}
      PaperProps={{ sx: { width: '70%' } }}
    >
      <Box sx={{
        display: 'flex',
        height: '100%',
        paddingTop: '64px',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#f15a22',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
        }
      }}>
        <Box
          sx={{
            width: '20%',
            backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
            paddingTop: 3,
            paddingLeft: 2,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    style: { color: activeStep >= index ? '#f15a22' : isDarkMode ? '#555' : '#d1d1d1' },
                  }}
                >
                  <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          sx={{
            width: '80%',
            padding: 4,
            height: '100%',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#f15a22',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
            }
          }}
        >
          {renderStepContent()}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, color: '#f15a22' }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleFinish}
                sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
              >
                Finish
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleNotificationClose} severity="success" sx={{ width: '100%' }}>
          User Has Been Created Successfully!
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default AddUserDrawer;

