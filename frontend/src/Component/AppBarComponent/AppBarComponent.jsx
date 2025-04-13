import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Box,
  useMediaQuery,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

import SearchBar from '../SearchBar/SearchBar';
import ProfileMenu from './ProfileMenu'; // If you have a separate file for that
import './AppBarComponent.css';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#4a0245',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
}));

function AppBarComponent({
  // Dark mode
  darkMode,
  handleDarkModeToggle,

  // Search
  searchQuery,
  onSearch,
  searchResults,

  // User info
  user,

  // Drawer states
  mobileOpen,
  setMobileOpen,
  desktopOpen,
  setDesktopOpen,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animations, etc.
  const [jumping, setJumping] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [highlightedIcon, setHighlightedIcon] = useState(null);

  // Profile menu anchor
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  // Mobile search bar
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Toggle the Drawer
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  // Dark mode icon animation
  const triggerAnimation = (setter, icon) => {
    setHighlightedIcon(icon);
    setter(true);
    setTimeout(() => setter(false), 500);
  };

  const handleDarkModeClick = () => {
    triggerAnimation(setRotating, 'darkMode');
    if (handleDarkModeToggle) {
      handleDarkModeToggle();
    }
  };

  // Notifications
  const handleNotificationsClick = () => {
    triggerAnimation(setJumping, 'notifications');
  };

  // Profile menu open/close
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
    setHighlightedIcon('account');
  };
  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    setHighlightedIcon(null);
  };

  // Mobile search
  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    setHighlightedIcon('search');
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* Menu Icon (hamburger or close) */}
          <Tooltip
            title={mobileOpen ? 'Close Menu' : 'Open Menu'}
            placement="bottom"
            arrow
            enterDelay={900}
          >
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                marginRight: 1,
                padding: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {/* If mobile AND drawer is open, show close icon */}
              {isMobile && mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>

          {/* LOGO */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: isMobile ? 1 : 0, display: 'flex', alignItems: 'center' }}
          >
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src="/images/loop2__1_-removebg-preview.png"
                alt="Logo"
                style={{
                  width: isMobile ? 100 : 80,
                  height: 'auto',
                  cursor: 'pointer',
                }}
              />
            </Link>
          </Typography>

          {/* DESKTOP SEARCH BAR */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, mx: 2 }}>
              <SearchBar
                searchQuery={searchQuery}
                onSearch={onSearch}
                searchResults={searchResults}
              />
            </Box>
          )}

          {/* MOBILE SEARCH ICON */}
          {isMobile && (
            <Tooltip title="Search" placement="bottom" arrow enterDelay={900}>
              <IconButton
                onClick={toggleMobileSearch}
                color="inherit"
                sx={{
                  padding: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
            </Tooltip>
          )}

          {/* DARK MODE ICON */}
          <Tooltip title="Toggle Dark Mode" placement="bottom" arrow enterDelay={900}>
            <IconButton
              onClick={handleDarkModeClick}
              color="inherit"
              sx={{
                padding: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {/* NOTIFICATIONS */}
          <Tooltip title="Notifications" placement="bottom" arrow enterDelay={900}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationsClick}
              sx={{
                padding: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* ACCOUNT */}
          <Tooltip title="Account" placement="bottom" arrow enterDelay={900}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{
                padding: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>

          {/* PROFILE MENU */}
          <ProfileMenu
            anchorEl={profileAnchorEl}
            isOpen={isProfileMenuOpen}
            onClose={handleMenuClose}
            user={user}
            darkMode={darkMode}
          />
        </Toolbar>

        {/* MOBILE SEARCH BAR BELOW THE MAIN TOOLBAR */}
        {isMobile && mobileSearchOpen && (
          <Toolbar
            sx={{
              backgroundColor: '#4a0245',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <SearchBar
              searchQuery={searchQuery}
              onSearch={onSearch}
              searchResults={searchResults}
              fullWidth
            />
          </Toolbar>
        )}
      </AppBar>
    </>
  );
}

export default AppBarComponent;
