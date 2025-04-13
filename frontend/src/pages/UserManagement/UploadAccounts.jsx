import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Papa from 'papaparse';
import axios from 'axios';
import { saveAs } from 'file-saver';
import CloseIcon from '@mui/icons-material/Close';

const UploadAccounts = ({ open, onClose, onUsersAdded }) => {
  const [csvData, setCsvData] = useState([]);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  const expectedHeaders = [
    { csvHeader: 'firstName', displayName: 'First Name' },
    { csvHeader: 'lastName', displayName: 'Last Name' },
    { csvHeader: 'displayName', displayName: 'Display Name' },
    { csvHeader: 'username', displayName: 'Username' },
    { csvHeader: 'email', displayName: 'Email' },
    { csvHeader: 'role', displayName: 'Role' },
    { csvHeader: 'zone', displayName: 'Zone' },
    { csvHeader: 'branch', displayName: 'Branch' },
    { csvHeader: 'modules', displayName: 'Modules' },
    { csvHeader: 'password', displayName: 'Generated Password' }, // Password generated for each user
  ];

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate if the file is a CSV
    if (file.type !== 'text/csv') {
      setFileError('Please upload a valid CSV file');
      return;
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    // Parse CSV file using papaparse
    parseCsv(file);
  };

  const parseCsv = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setFileError('CSV file is empty. Please upload a valid CSV file with data.');
          return;
        }
        const headers = Object.keys(results.data[0]);
        if (validateCsvHeaders(headers)) {
          // Generate passwords for each user and add it to the parsed data
          const usersWithPasswords = results.data.map((user) => ({
            ...user,
            password: generateRandomPassword(),
            registeredModules: parseModules(user.modules)
          }));
          setCsvData(usersWithPasswords);
          setFileError('');
        } else {
          setFileError('CSV file does not match the required headers. Please make sure the headers match the required format.');
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setFileError('Error parsing CSV file');
      },
    });
  };

  const validateCsvHeaders = (headers) => {
    return expectedHeaders.every((header) => header.csvHeader === 'password' || headers.includes(header.csvHeader));
  };

  const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Function to parse and format modules into "MainModule_SubModule" format
  const parseModules = (modulesString) => {
    if (!modulesString) return [];
    const modules = modulesString.split(';');
    const formattedModules = [];
  
    modules.forEach((module) => {
      const [mainModule, subModules] = module.split(':');
      if (subModules) {
        subModules.split(',').forEach((subModule) => {
          formattedModules.push(`${mainModule.trim()}_${subModule.trim()}`);
        });
      } else {
        // If no submodules, add only the main module with an underscore at the end
        formattedModules.push(`${mainModule.trim()}_`);
      }
    });
  
    return formattedModules;
  };

  const handleAddUsersFromCsv = async () => {
    try {
      setLoading(true);
      const formattedUsers = csvData.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        zone: user.zone,
        branch: user.branch,
        registeredModules: user.registeredModules,
      }));

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/multiple`, { users: formattedUsers });
      console.log('Users added:', response.data);
      onUsersAdded();
      handleCancel();
    } catch (error) {
      console.error('Error adding users:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCsvData([]);
    setFileError('');
    onClose();
  };

  const handleDownloadTemplate = () => {
    const headers = expectedHeaders
      .filter(header => header.csvHeader !== 'password') // Exclude generated password from template headers
      .map(header => header.csvHeader).join(',');
    const exampleData = 'firstName,lastName,displayName,username,email,role,zone,branch,modules\nJohn,Doe,JohnDoe,johndoe,john.doe@example.com,Admin,Zone A,Headquarters,"Licenses:Trade Licenses, Staff Medicals;Vehicles:Maintenance, Token Taxes"\n';
    const instructions = '"\n# Instructions: Fill in the required data for each user following the headers. Ensure each field matches the expected format. Example data is provided.\n"';
    const blob = new Blob([headers + '\n' + instructions + exampleData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'upload_accounts_template.csv');
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>
        Upload Accounts
        <IconButton aria-label="close" onClick={handleCancel} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tooltip title="Download CSV template with instructions and example data">
          <IconButton
            onClick={handleDownloadTemplate}
            sx={{ position: 'absolute', left: 16, bottom: 16, color: '#f15a22' }}
          >
            <UploadFileIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>Download Template</Typography>
          </IconButton>
        </Tooltip>
        {csvData.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              border: '2px dashed #f15a22',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '24px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              style={{ display: 'none' }}
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button
                variant="contained"
                sx={{ backgroundColor: '#f15a22', '&:hover': { backgroundColor: '#f15a22' } }}
                component="span"
                startIcon={<UploadFileIcon />}
              >
                Upload CSV File
              </Button>
            </label>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Drag and Drop CSV File Here or Click to Upload
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {expectedHeaders.map((header) => (
                    <TableCell key={header.csvHeader} align="center" sx={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#f15a22' }}>{header.displayName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    {expectedHeaders.map((header) => (
                      <TableCell key={header.csvHeader} align="center">{row[header.csvHeader]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {fileError && <Typography color="error" sx={{ mt: 2 }}>{fileError}</Typography>}
        {loading && <CircularProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} sx={{ color: '#f15a22' }}>Cancel</Button>
        <Button onClick={handleAddUsersFromCsv} sx={{ color: '#f15a22' }} disabled={!csvData.length || loading}>
          Add Accounts
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAccounts;
