import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';

const HoverModalButton = () => {
  const [open, setOpen] = useState(false);
  const [zones, setZones] = useState([]); // State to store zones and branches
  const [error, setError] = useState(null);
  const theme = useTheme(); // Get the current theme

  // Handle modal open
  const handleOpen = () => {
    fetchZones(); // Fetch data when modal opens
    setOpen(true);
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
  };

  // Fetch zones and branches
  const fetchZones = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/zones`); // API call to get all zones
      const zonesData = await Promise.all(
        response.data.map(async (zone) => {
          const branchesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/zones/${zone.zoneName}/branches`);
          return {
            zoneName: zone.zoneName,
            branches: branchesResponse.data,
          };
        })
      );
      setZones(zonesData);
    } catch (error) {
      setError('Failed to fetch zones or branches');
      console.error(error);
    }
  };

  // Modal styling
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%', // Adjust modal width for a more balanced look
    maxHeight: '90vh', // Increase modal height
    overflowY: 'auto', // Enable scrolling for overflow
    bgcolor: theme.palette.background.paper, // Use theme-based background color
    boxShadow: 24,
    p: 3,
    borderRadius: 3,
  };

  return (
    <>
  <Tooltip title="Zone Information" arrow>
    <IconButton onClick={handleOpen} sx={{ color: theme.palette.primary.main }}>
      <InfoIcon />
    </IconButton>
  </Tooltip>

  <Modal open={open} closeAfterTransition onClose={handleClose}>
  <Fade in={open}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        minHeight: '100vh', // Full screen height
        outline: 'none', // Remove default focus outline
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: '600px', // Restrict width
          backgroundColor: theme.palette.background.paper,
          borderRadius: '8px',
          boxShadow: 24,
          padding: '16px',
          overflow: 'hidden',
          '@media (max-width: 600px)': { padding: '8px', width: '95%' }, // Adjust for mobile
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: '70vh',
            overflowY: 'auto',
            overflowX: 'auto',
            marginTop: '24px',
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              background: '#f15a22',
              borderRadius: '10px',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                    textAlign: 'center',
                  }}
                >
                  Zone
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                    textAlign: 'left',
                  }}
                >
                  Branches
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.length > 0 ? (
                zones.map((zone, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? theme.palette.action.hover : 'inherit',
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      {zone.zoneName}
                    </TableCell>
                    <TableCell>
                      {zone.branches.map((branch, i) => (
                        <div key={i}>{branch}</div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'center' }}>
                    {error || 'No data available'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  </Fade>
</Modal>

</>

  );
};

export default HoverModalButton;
