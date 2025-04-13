import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import TodoList from '../TodoList/TodoList';

const TabsComponent = ({ latestAnnouncement, userId, userZone, userBranch, userEmail }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [majorAnnouncements, setMajorAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch major announcements from the backend
    axios.get('/api/majorannouncements')
      .then(response => setMajorAnnouncements(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    console.log("TabsComponent parameters:", { userId, userZone, userBranch, userEmail });
  }, [userId, userZone, userBranch, userEmail]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper
      square
      sx={{
        backgroundColor: 'background.default',
        borderRadius: 2,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        width: 400,
        maxWidth: '100%',
        margin: 'auto',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="inherit"
        variant="fullWidth"
        TabIndicatorProps={{
          style: {
            backgroundColor: '#f15a22',
          },
        }}
      >
        <Tab label="Major Announcements" sx={{ color: activeTab === 0 ? '#f15a22' : 'inherit' }} />
        <Tab label="Assigned Tasks" sx={{ color: activeTab === 1 ? '#f15a22' : 'inherit' }} />
      </Tabs>

      <Box
        sx={{
          p: 2,
          pt: 1,
          height: '220px', // Reduced height from 300px to 200px
          overflowY: 'auto',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#666',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#444',
          },
        }}
      >
        {activeTab === 0 && (
          <Box
            sx={{
              p: 2,
              textAlign: 'left',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              height: '100%',
              width: '100%',
              position: 'relative',
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#666',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#444',
              },
            }}
          >
            {latestAnnouncement ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Subject: {latestAnnouncement.announcement}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {latestAnnouncement.announcementDetails}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}
                >
                  Date Posted: {new Date(latestAnnouncement.createdAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)' }}
                >
                  Posted by: Admin
                </Typography>
              </>
            ) : (
              <Typography variant="h6">No Announcements</Typography>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <TodoList
            userId={userId}
            userZone={userZone}
            userBranch={userBranch}
            userEmail={userEmail}
          />
        )}
      </Box>
    </Paper>
  );
};

export default TabsComponent;