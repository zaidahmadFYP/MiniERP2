// src/Component/MainContent/MainContent.jsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Banner from '../BannerComponent/BannerComponent';
import TilesGrid from '../TileGrid/TileGrid';
import TabsComponent from '../TabComponent/TabComponent'; // Ensure correct path
import AnnouncementForm from './AnnouncementForm';
import TaskForm from './TaskForm';
import RetailCommerce from '../../pages/RetailCommerce/RetailCommerce';

const MainContent = ({ user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile devices
  const headingColor = theme.palette.mode === 'dark' ? '#f15a22' : '#000000';
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  const tiles = useMemo(() => {
    const allTiles = [
      { name: 'Retail and Commerce', image: '/images/licenses.webp' },
      { name: 'Product Information and Management', image: '/images/approved.webp' },
      { name: 'Finance and Sales', image: '/images/vehicle.webp' },
      { name: 'Inventory Management', image: '/images/vehicle.webp' },
      { name: 'Reports and Analytics', image: '/images/vehicle.webp' },
      // Add User Management tile
      { name: 'User Management', image: '/images/user_management.webp' },
    ];
    return allTiles.filter((tile) =>
      user.registeredModules.some((module) => module.startsWith(tile.name))
    );
  }, [user]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/announcements/latest`)
      .then((response) => response.json())
      .then((data) => setLatestAnnouncement(data))
      .catch((error) => console.error('Error fetching the latest announcement:', error));
  }, []);

  useEffect(() => {
    console.log('User data in MainContent:', user);
  }, [user]);

  const handleTileClick = (tileName) => {
    const paths = {
      RetailCommerce: '/RetailCommerce/RetailCommerce',
      'User Management': '/UserManagement/UserManagement',
    };
    navigate(paths[tileName], { state: { tileName } });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: isMobile ? 2 : 4, // Reduced padding on mobile
        marginLeft: isMobile ? 0 : 1,
        transition: 'margin-left 0.1s',
        overflowY: 'auto',
        height: '100vh',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
      }}
    >
      <Banner />
      <Typography
        variant="h4"
        sx={{
          color: headingColor,
          mb: 1,
          textAlign: 'left',
          ml: isMobile ? 2 : 6,
          fontSize: isMobile ? '24px' : '30px',
          fontFamily: 'TanseekModernPro-Bold, Arial ,sans-serif',
        }}
      >
        MODULES
      </Typography>

      <Grid container spacing={isMobile ? 2 : 0} alignItems="flex-start">
        <Grid item xs={12} md={8}>
          <Box sx={{ ml: isMobile ? 0 : 6 }}>
            <TilesGrid tiles={tiles} onTileClick={handleTileClick} />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {user.role === 'Admin' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                mb: 2,
                ml: isMobile ? 0 : 10,
                maxWidth: '100%',
                gap: isMobile ? 1 : 0, // Add gap between buttons on mobile
              }}
            >
              {/* <Button
                variant="contained"
                className="expanding-button"
                sx={{
                  width: isMobile ? '100%' : '48%',
                  backgroundColor: '#f15a22',
                  height: '47px',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d14e1f',
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => setShowAnnouncementForm(true)}
              >
                Add Announcement
              </Button>
              <Button
                variant="contained"
                sx={{
                  width: isMobile ? '100%' : '48%',
                  backgroundColor: '#f15a22',
                  borderRadius: '12px',
                  height: '47px',
                  transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d14e1f',
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => setShowTaskForm(true)}
              >
                Add Task
              </Button> */}
            </Box>
          )}

          <Box
            sx={{
              ml: isMobile ? 0 : 10,
              overflowY: 'auto',
              maxHeight: isMobile ? '60vh' : 'calc(100vh - 200px)',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
            }}
          >
            {/* <TabsComponent
              latestAnnouncement={latestAnnouncement}
              userId={user?._id?.toString()}
              userZone={user?.zone}
              userBranch={user?.branch}
              userEmail={user?.email}
            /> */}
          </Box>
        </Grid>
      </Grid>

      {/* Modals */}
      {/* {showAnnouncementForm && (
        <AnnouncementForm onClose={() => setShowAnnouncementForm(false)} user={user} />
      )} */}

      {/* {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          userId={user?._id}
          userZone={user?.zone}
          userBranch={user?.branch}
        />
      )} */}
    </Box>
  );
};

export default MainContent;
