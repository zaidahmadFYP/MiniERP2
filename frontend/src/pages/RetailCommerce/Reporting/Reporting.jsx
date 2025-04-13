import React, { useState, useEffect,useCallback  } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MainContentWrapper from './MainContentWrapper';
import SearchBar from './SearchBar';
import AddFileButton from './AddFileButton';
import FileTable from './FileTable';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HoverPopoverButton from './HoverPopoverButton';
import Fade from '@mui/material/Fade';

const Reporting = ({ open, user }) => {
  const theme = useTheme();
  const headingColor = theme.palette.mode === 'dark' ? '#f15a22' : '#000000';
  const [files, setFiles] = useState([]); // State for files
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  // const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialogs
  // const [dialogMessage, setDialogMessage] = useState(''); // State for messages
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // State for delete confirmation dialog
  const [fileToDelete, setFileToDelete] = useState(null); // Store file to delete
  const [loading, setLoading] = useState(false); // State for managing table refresh
  const [zones, setZones] = useState([]); // State for zones
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedZone, setSelectedZone] = useState(user?.role === 'Admin' ? '' : user?.zone); // State for selected zone
  const [selectedBranch, setSelectedBranch] = useState(user?.role === 'Admin' ? '' : user?.branch); // State for selected branch
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State for snackbar severity

  // Supported file types
  // const supportedFileTypes = [
  //   'image/png',
  //   'image/jpeg',
  //   'image/webp',
  //   'application/pdf',
  //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  //   'application/vnd.ms-excel', // .xls
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  //   'text/csv',
  //   'application/txt'
  // ];

  // Fetch zones from the server
  const fetchZones = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/zones`);
      const zonesData = await response.json();
      setZones(zonesData);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  // Fetch branches for the selected zone
  const fetchBranches = async (zoneName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/zones/${zoneName}/branches`);
      const branchesData = await response.json();
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  // Fetch the files for the specified zone and branch
  const fetchFiles = useCallback(async () => {
    if (!selectedZone || !selectedBranch) return;
  
    setLoading(true);
    try {
      const encodedZone = encodeURIComponent(selectedZone.trim());
      const encodedBranch = encodeURIComponent(selectedBranch.trim());
  
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/files/approvals-outerspaces-generators/${encodedZone}/${encodedBranch}`);
  
      if (response.ok) {
        const filesData = await response.json();
        setFiles(filesData);
      } else if (response.status === 404) {
        console.error('No files found for this zone and branch.');
        setFiles([]);
      } else {
        console.error('Error fetching files:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    setLoading(false);
  }, [selectedZone, selectedBranch]);

  useEffect(() => {
    fetchZones(); // Fetch zones when component mounts
  }, []);

  useEffect(() => {
    if (selectedZone) {
      fetchBranches(selectedZone); // Fetch branches when a zone is selected
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedZone && selectedBranch) {
      fetchFiles(); // Fetch files when component mounts or when zone/branch changes
    }
  }, [selectedZone, selectedBranch,fetchFiles]);

  // Handle file upload
  const handleFileSelect = async (file) => {
    if (file) {
      // Normalize filename to avoid spaces
      const normalizedFileName = file.name.replace(/\s+/g, '_');

      const formData = new FormData();
      formData.append('file', new File([file], normalizedFileName, { type: file.type }));

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/files/approvals-outerspaces-generators/${encodeURIComponent(selectedZone)}/${encodeURIComponent(selectedBranch)}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          fetchFiles(); // Re-fetch files after upload to update the UI
          setSnackbarMessage(`File "${normalizedFileName}" has been added successfully.`);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        setSnackbarOpen(true); // Ensure snackbar triggers after deletion
        } else {
          const errorMessage = await response.text();
          console.error('Error uploading file:', response.statusText, errorMessage);
          setSnackbarMessage('Failed to upload file.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setSnackbarMessage('Failed to upload file.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  // Open confirmation dialog before deletion
  const openDeleteDialog = (filename) => {
    setFileToDelete(filename);
    setConfirmDeleteOpen(true); // Open the delete confirmation dialog
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setConfirmDeleteOpen(false); // Close the confirmation dialog immediately
  
    const trimmedFilename = fileToDelete.trim();
    const encodedFilename = encodeURIComponent(trimmedFilename);
    const deleteUrl = `${process.env.REACT_APP_API_BASE_URL}/files/approvals-outerspaces-generators/${encodeURIComponent(selectedZone)}/${encodeURIComponent(selectedBranch)}/${encodedFilename}`;
  
    // Show snackbar right away with success message
    setSnackbarMessage(`File "${trimmedFilename}" is being deleted, Please Click Refresh Icon`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  
    try {
      console.log('DELETE URL:', deleteUrl);  // Debugging log
  
      const response = await fetch(deleteUrl, { method: 'DELETE' });
  
      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.filename !== trimmedFilename)
        );
  
        // Update snackbar to success after delete
        setSnackbarMessage(`File "${trimmedFilename}" has been deleted successfully.`);
        setSnackbarSeverity('success');
      } else {
        const errorMessage = await response.text();
        console.error('Failed to delete file:', response.statusText, errorMessage);
  
        // Update snackbar to error in case of failure
        setSnackbarMessage('Failed to delete file.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setSnackbarMessage('Error occurred while deleting the file.');
      setSnackbarSeverity('error');
    }
  
    setSnackbarOpen(true); // Ensure snackbar opens in all cases
    setFileToDelete(null); // Clear the file to delete after the operation
  };

  // Handle canceling the deletion
  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false); // Close the confirmation dialog
    setFileToDelete(null); // Reset the file to delete
  };

  // Handle Dialog Close
  // const handleDialogClose = () => {
  //   setIsDialogOpen(false);
  // };

  // Handle Snackbar Close
  const handleSnackbarClose = (event, reason) => {
    console.log('Snackbar closed with reason:', reason); // Debugging log
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  // Filter files based on search query (filename or fileNumber)
  const filteredFiles = files.filter(file =>
    file?.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file?.fileNumber?.toLowerCase().includes(searchQuery.toLowerCase())  // Added fileNumber to search filter
  );

  return (
    <MainContentWrapper open={open}>
    {/* Heading Section */}
    <Typography
      variant="h4"
      sx={{
        color: headingColor,
        mb: 4,
        textAlign: 'center',
        fontSize: { xs: '24px', sm: '30px' }, // Responsive font size
        fontFamily: 'TanseekModernW20',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px',
        transition: 'color 0.3s ease', // Transition for color change
      }}
    >
      LICENSES/OUTER SPACES/GENERATORS
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        textAlign: 'center',
        color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
        mb: 2,
        transition: 'color 0.3s ease', // Transition for color change
      }}
    >
      Your Branch: {user?.branch}
    </Typography>

    {/* Box to contain the search bar, Refresh button, Zone and Branch Select, and Add File button */}
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
        padding: '20px',
        borderRadius: '8px',
        transition: 'background-color 0.3s ease', // Transition for background color change
      }}
    >
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        {user?.role === 'Admin' && (
          <>
            {/* Zone Dropdown */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  displayEmpty
                  sx={{
                    transition: 'background-color 0.3s ease, color 0.3s ease', // Transition for select component
                  }}
                >
                  <MenuItem value="" disabled>
                    Zone
                  </MenuItem>
                  {zones.map((zone) => (
                    <MenuItem key={zone.zoneName} value={zone.zoneName}>
                      {zone.zoneName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Branch Dropdown */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  displayEmpty
                  disabled={!selectedZone}
                  sx={{
                    transition: 'background-color 0.3s ease, color 0.3s ease', // Transition for select component
                  }}
                >
                  <MenuItem value="" disabled>
                    Branch
                  </MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Search Bar */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search files..."
                  style={{ width: '100%' }} // Make search bar full width
                />
              </FormControl>
            </Grid>

            {/* Buttons for Add File, Refresh, and HoverPopover */}
            <Grid
              item
              xs={12} sm={3}
              sx={{
                padding: 0,
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px',
                flexWrap: 'wrap', // Ensures buttons stack on smaller screens
                transition: 'all 0.3s ease', // Transition for buttons
              }}
            >
              <AddFileButton onFileSelect={handleFileSelect} />
              <IconButton onClick={fetchFiles} sx={{ color: '#f15a22', transition: 'color 0.3s ease' }}>
                <RefreshIcon />
              </IconButton>
              <HoverPopoverButton />
            </Grid>
          </>
        )}

        {user?.role !== 'Admin' && (
          <>
            {/* Search Bar for non-admin users */}
            <Grid item xs={12} sm={9}>
              <FormControl fullWidth>
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search files..."
                  style={{ width: '100%' }} // Make search bar full width
                />
              </FormControl>
            </Grid>

            {/* Refresh Icon for non-admin users */}
            <Grid
              item
              xs={12} sm={3}
              sx={{
                padding: 0,
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px',
                transition: 'all 0.3s ease', // Transition for refresh button
              }}
            >
              <IconButton onClick={fetchFiles} sx={{ color: '#f15a22', transition: 'color 0.3s ease' }}>
                <RefreshIcon />
              </IconButton>
            </Grid>
          </>
        )}
      </Grid>

      {/* File Table */}
      <Box
        sx={{
          width: '100%',
          maxHeight: '500px', // Limit the max height for scrollability
          overflowY: files.length > 5 ? 'scroll' : 'unset', // Enable scrolling if there are more than 5 files
          backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#fafafa',
          color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
          padding: '20px',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease, color 0.3s ease', // Transition for background and text color
        }}
      >
        {/* Show loading indicator if files are being refreshed */}
        {loading ? (
          <Typography sx={{ transition: 'color 0.3s ease' }}>Loading...</Typography>
        ) : files.length === 0 ? (
          <Typography sx={{ transition: 'color 0.3s ease' }}>No Files Stored</Typography> // Display this when no files are present
        ) : (
          <FileTable files={filteredFiles} onDelete={openDeleteDialog} user={user} />
        )}
      </Box>
    </Box>

    {/* Confirmation Dialog for Deletion */}
    <Dialog
      open={confirmDeleteOpen}
      onClose={handleDeleteCancel}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
          color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
          transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transition for dialog colors
        },
      }}
    >
      <DialogTitle sx={{ transition: 'color 0.3s ease' }}>Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ transition: 'color 0.3s ease' }}>
          Are you sure you want to delete the file "{fileToDelete}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeleteCancel}
          sx={{
            backgroundColor: '#d14e1d',
            color: '#fff',
            '&:hover': { backgroundColor: '#c43d17' },
            transition: 'background-color 0.3s ease',
          }}
        >
          No
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          sx={{
            backgroundColor: '#f15a22',
            color: '#fff',
            '&:hover': { backgroundColor: '#d14e1d' },
            transition: 'background-color 0.3s ease',
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>

    {/* Snackbar for file operations */}
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={(props) => <Fade {...props} timeout={300} />} // Optional: Customize Snackbar transition
    >
      <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
  </MainContentWrapper>

  );
};

export default Reporting;