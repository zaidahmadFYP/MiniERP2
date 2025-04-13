import React, { useState } from 'react';
import { 
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Box
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const FilterButton = ({ roles, onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoleToggle = (role) => {
    const currentIndex = selectedRoles.indexOf(role);
    const newSelectedRoles = [...selectedRoles];

    if (currentIndex === -1) {
      newSelectedRoles.push(role);
    } else {
      newSelectedRoles.splice(currentIndex, 1);
    }

    setSelectedRoles(newSelectedRoles);
  };

  const handleApplyFilter = () => {
    onFilterChange(selectedRoles);
    handleClose();
  };

  const handleClearFilter = () => {
    setSelectedRoles([]);
    onFilterChange([]);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: selectedRoles.length > 0 ? '#f15a22' : 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(241, 90, 34, 0.04)',
          },
        }}
      >
        <FilterListIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '250px',
            maxHeight: '400px',
            mt: 1,
            border: '1px solid #d1d1d1',
            '& .MuiList-root': {
              padding: 0,
            },
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #d1d1d1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ fontWeight: 'bold' }}>Filter by Role</Box>
          <IconButton 
            size="small" 
            onClick={handleClose}
            sx={{ 
              color: 'grey.500',
              '&:hover': {
                color: 'grey.700',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {roles.map((role) => (
          <MenuItem 
            key={role} 
            onClick={() => handleRoleToggle(role)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(241, 90, 34, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <Checkbox 
                checked={selectedRoles.indexOf(role) !== -1}
                sx={{
                  color: '#d1d1d1',
                  '&.Mui-checked': {
                    color: '#f15a22',
                  },
                }}
              />
            </ListItemIcon>
            <ListItemText primary={role} />
          </MenuItem>
        ))}

        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #d1d1d1',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleClearFilter}
            sx={{ 
              color: '#f15a22',
              '&:hover': {
                backgroundColor: 'rgba(241, 90, 34, 0.04)',
              },
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyFilter}
            sx={{
              backgroundColor: '#f15a22',
              '&:hover': {
                backgroundColor: '#d3541e',
              },
            }}
          >
            Apply
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default FilterButton;