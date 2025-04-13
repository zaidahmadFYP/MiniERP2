import React, { useState, useEffect, useRef } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha('#5c104f', 0.8), // Adjusted to match app bar color
  '&:hover': {
    backgroundColor: alpha('#5c104f', 0.9), // Darker hover state
  },
  marginRight: '50px',
  marginLeft: '50px',
  width: '50%',
  maxWidth: '600px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: '400px',
    marginRight: '210px',
    width: '50%',
  },
  display: 'flex',
  flexDirection: 'column',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const SearchBar = ({ searchQuery = '', onSearch = () => {}, searchResults = [] }) => {
  const navigate = useNavigate();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const theme = useTheme();
  const searchRef = useRef(null);
  const itemRefs = useRef([]); // References for each MenuItem to handle scrolling

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onSearch(''); // Clear search results when clicking outside
      }
    };

    if (searchResults.length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResults, onSearch]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchResults]);

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [highlightedIndex]);

  const handleInputChange = (event) => {
    if (typeof onSearch === 'function') {
      onSearch(event.target.value);
    }
  };

  const handleKeyDown = (event) => {
    if (searchResults.length > 0) {
      if (event.key === 'ArrowDown') {
        setHighlightedIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
        );
      } else if (event.key === 'ArrowUp') {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
        );
      } else if (event.key === 'Enter') {
        if (highlightedIndex >= 0) {
          handleSelect(searchResults[highlightedIndex].path);
        }
      }
    }
  };

  const handleSelect = (path) => {
    navigate(path);
    onSearch('');
  };

  return (
    <Tooltip title="Search Bar" placement="bottom" arrow>
      <Search ref={searchRef}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {searchResults.length > 0 && (
          <Paper
            elevation={3}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1,
              width: '100%',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '8px 0',
            }}
          >
            {searchResults.map((result, index) => (
              <MenuItem
                key={index}
                ref={(el) => (itemRefs.current[index] = el)} // Attach ref to each MenuItem
                onClick={() => handleSelect(result.path)}
                selected={index === highlightedIndex}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  backgroundColor:
                    index === highlightedIndex
                      ? theme.palette.mode === 'dark'
                        ? '#555'
                        : '#ddd' // Slightly darker color for light mode highlight
                      : 'inherit',
                  color:
                    index === highlightedIndex
                      ? theme.palette.mode === 'dark'
                        ? '#fff'
                        : '#000'
                      : 'inherit',
                }}
              >
                <Typography variant="body1">{result.name}</Typography>
                <Typography variant="caption" style={{ color: theme.palette.text.secondary }}>
                  {result.category}
                </Typography>
              </MenuItem>
            ))}
          </Paper>
        )}
      </Search>
    </Tooltip>
  );
};

export default SearchBar;
