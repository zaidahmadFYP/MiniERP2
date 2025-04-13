import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock'; // Import Lock Icon
import { useTheme } from '@mui/material/styles'; // Import to use theme settings
import axios from 'axios';

const AddBranchDrawer = ({ open, onClose }) => {
  const theme = useTheme(); // Access current theme (light/dark)

  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [brandName] = useState('Cheezious'); // Static brand name
  const [branchName, setBranchName] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  // Fetch zones from the server
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/zones`);
        setZones(response.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, []);

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };

  const handleBranchNameChange = (e) => {
    setBranchName(e.target.value); // Ensure branch name is in uppercase
  };

  const handleAddBranch = () => {
    if (!selectedZone || !branchName) {
      alert('Please select a zone and enter a branch name');
      return;
    }
    setConfirmationDialogOpen(true);
  };

  const handleConfirmAddBranch = async () => {
    try {
      // Concatenate brand name with branch name
      const fullBranchName = `${brandName} ${branchName}`;

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/zones/${selectedZone}/addBranch`, { branchName: fullBranchName });
      setConfirmationDialogOpen(false);
      onClose(); // Close drawer after adding the branch
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  const handleCancelAddBranch = () => {
    setConfirmationDialogOpen(false);
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '30%' } }}>
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#f15a22', fontWeight: 'bold', mt: 8, mb:1 }}>
            Add a Branch
          </Typography>
          <Divider sx={{ mb: 3, borderColor: '#f15a22' }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel
                  shrink
                  sx={{
                    color: '#f15a22',
                    '&.Mui-focused': { color: '#f15a22' }, // Ensure label color remains f15a22 when focused
                  }}
                >
                  Zone
                </InputLabel>
                <Select
                  label="Zone"
                  value={selectedZone}
                  onChange={handleZoneChange}
                  displayEmpty
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#f15a22' }, // Default border color
                      '&:hover fieldset': { borderColor: '#f15a22' }, // Hover border color
                      '&.Mui-focused fieldset': { borderColor: '#f15a22' }, // Focused border color
                    },
                    '& .MuiSelect-icon': { color: '#f15a22' }, // Dropdown arrow color
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f15a22', // Fix border color when focused
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Zone
                  </MenuItem>
                  {zones.map((zone) => (
                    <MenuItem key={zone._id} value={zone.zoneName}>
                      {zone.zoneName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Brand Name"
                value={brandName}
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: true, // Make field read-only
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{
                          color: theme.palette.mode === 'dark' ? '#9e9e9e' : '#616161', // Adjust color for dark/light mode
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#f15a22', // Set label color
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f15a22' },
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f0f0f0', // Grey out the input field dynamically
                    '& input': {
                      color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Set input text color dynamically
                    },
                    '&:hover fieldset': { borderColor: '#f15a22' },
                    '&.Mui-focused fieldset': { borderColor: '#f15a22' },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Branch Name"
                fullWidth
                variant="outlined"
                value={branchName}
                onChange={handleBranchNameChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#f15a22', // Set label color
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f15a22' }, // Set border color
                    '& input': {
                      color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Set input text color dynamically
                    },
                    '&:hover fieldset': { borderColor: '#f15a22' },
                    '&.Mui-focused fieldset': { borderColor: '#f15a22' },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={onClose} sx={{ color: '#f15a22' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddBranch}
              sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
            >
              Add Branch
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCancelAddBranch}
        aria-labelledby="confirm-add-branch-dialog"
      >
        <DialogTitle id="confirm-add-branch-dialog">Confirm Add Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are adding <strong>{`${brandName} ${branchName}`}</strong> in <strong>{selectedZone}</strong>. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAddBranch} sx={{ color: '#f15a22' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAddBranch}
            sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#d3541e' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddBranchDrawer;
