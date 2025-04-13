// src/Component/DrawerComponent/DrawerComponent.jsx

import React, { useState } from 'react';
import {
  Drawer as MuiDrawer,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Toolbar,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 400;

// For the expanded (full-width) desktop drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// For the collapsed (mini) desktop drawer
const closedMixin = (theme) => ({
  width: `calc(${theme.spacing(7.5)} + 1px)`,
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});

// A styled Drawer for desktop (mini/full)
const DrawerStyled = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

/**
 * Props:
 * - user: object with `registeredModules` array for filtering
 * - mobileOpen: bool controlling the mobile (temporary) drawer open/close
 * - setMobileOpen: function to toggle mobileOpen
 * - desktopOpen: bool controlling mini vs. full drawer on desktop
 * - setDesktopOpen: function to toggle desktopOpen
 */
export default function DrawerComponent({
  user,
  mobileOpen,
  setMobileOpen,
  desktopOpen,
  setDesktopOpen,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Track which submenus are expanded
  const [openMenu, setOpenMenu] = useState({});

  // Check if user has access to a module
  const hasAccess = (moduleName, submoduleName = '') => {
    return user?.registeredModules?.some((module) => {
      if (submoduleName) {
        return module === `${moduleName}_${submoduleName}`;
      }
      return module.startsWith(`${moduleName}_`) || module === moduleName;
    });
  };

  // Sample items array
  const items = [
    {
      text: 'Retail and Commerce',
      icon: '/images/licenses.webp',
      path: '/Licenses/Licensepage',
      submenu: [
        { text: 'Trade Licenses', path: '/Licenses/Licensepage' },
        { text: 'Staff Medicals', path: '/Licenses/Licensepage' },
        { text: 'Tourism Licenses', path: '/Licenses/Licensepage' },
        { text: 'Labour Licenses', path: '/Licenses/Licensepage' },
      ],
    },
    {
      text: 'Product Information and Management',
      icon: '/images/approved.webp',
      path: '/Approval/Approvalpage',
      submenu: [{ text: 'Outer Spaces', path: '/Approval/Approvalpage' }],
    },
    {
      text: 'Finance and Sales',
      icon: '/images/vehicle.webp',
      path: '/Vehicles/Vehiclepage',
      submenu: [
        { text: 'Maintenance', path: '/Vehicles/Vehiclepage' },
        { text: 'Token Taxes', path: '/Vehicles/Vehiclepage' },
        { text: 'Route Permits', path: '/Vehicles/Vehiclepage' },
      ],
    },
    {
      text: 'Health Safety Environment',
      icon: '/images/hse.webp',
      path: '/Hse/Hse',
      submenu: [
        { text: 'Monthly Inspection', path: '/Hse/MonthlyInspection' },
        { text: 'Quarterly Audit', path: '/Hse/QuarterlyAudit' },
        { text: 'Expiry of Cylinders', path: '/Hse/ExpiryofCylinders' },
        { text: 'Training Status', path: '/Hse/Hse/training' },
        { text: 'Incidents', path: '/Hse/Hse/incidents' },
      ],
    },
    
   //User Managament
    {
      text: 'User Management',
      icon: '/images/user_management.webp',
      path: '/UserManagement',
    },

  ];

  // Filter top-level items
  const filteredItems = items.filter((item) => hasAccess(item.text));

  const handleMenuClick = (itemText) => {
    setOpenMenu((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    // On mobile, close the drawer after navigating
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Drawer contents
  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {filteredItems.map((item) => {
          const hasSubmenu = !!item.submenu;

          return (
            <div key={item.text}>
              <ListItem disablePadding>
                <Tooltip
                  title={item.text}
                  placement="right"
                  arrow
                  enterDelay={500}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: desktopOpen ? 'initial' : 'center',
                      px: 2,
                    }}
                    onClick={() => {
                      if (isMobile) {
                        // On mobile, always expand if there's a submenu
                        if (hasSubmenu) {
                          handleMenuClick(item.text);
                        } else {
                          handleNavigate(item.path);
                        }
                      } else {
                        // On desktop
                        if (!desktopOpen) {
                          // If drawer is closed, just navigate
                          handleNavigate(item.path);
                        } else {
                          // If drawer is open and item has a submenu, expand
                          if (hasSubmenu) {
                            handleMenuClick(item.text);
                          } else {
                            handleNavigate(item.path);
                          }
                        }
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2, // spacing between icon and text
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={item.text}
                        style={{ width: 25, height: 25 }}
                      />
                    </ListItemIcon>

                    {/* Show text if mobile OR if desktop drawer is open */}
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: isMobile || desktopOpen ? 1 : 0,
                      }}
                    />

                    {/* Show arrow if it has a submenu and (desktop open or mobile) */}
                    {hasSubmenu && (desktopOpen || isMobile) && (
                      openMenu[item.text] ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {/* Submenu collapse if the user expanded it on mobile, or if desktop is open */}
              {hasSubmenu && (desktopOpen || isMobile) && (
                <Collapse in={openMenu[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu
                      .filter((sub) => hasAccess(item.text, sub.text))
                      .map((sub) => (
                        <ListItemButton
                          key={sub.text}
                          sx={{ pl: 4 }}
                          onClick={() => handleNavigate(sub.path)}
                        >
                          <ListItemText primary={sub.text} />
                        </ListItemButton>
                      ))}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
    </>
  );

  // Mobile => swipeable drawer
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="left"
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ style: { width: drawerWidth } }}
      >
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  // Desktop => permanent mini/full drawer
  return (
    <DrawerStyled variant="permanent" open={desktopOpen}>
      {drawerContent}
    </DrawerStyled>
  );
}
