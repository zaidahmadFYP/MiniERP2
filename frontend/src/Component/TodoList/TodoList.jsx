import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Divider, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TodoList = ({ userZone, userBranch }) => {
  const [tasks, setTasks] = useState([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (!userZone || !userBranch) {
      console.error('Required parameters are missing:', { userZone, userBranch });
      return;
    }
  
    axios
      .get(`/api/user/assignedTasks`, {
        params: { zone: userZone, branch: userBranch },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please try again later.');
      });
  }, [userZone, userBranch]);

  const handleMarkAll = async () => {
    try {
      await Promise.all(
        tasks.map((task) =>
          axios.patch(`/api/assignedTasks/${task._id}/complete`, { branch: userBranch })
        )
      );
      setTasks(tasks.map(task => ({ ...task, completed: true })));
    } catch (error) {
      console.error('Error marking all tasks as completed:', error);
    }
  };

  const handleToggle = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedStatus = !task.completed;
    try {
      await axios.patch(`/api/assignedTasks/${taskId}/complete`, { branch: userBranch });
      setTasks(tasks.map(t =>
        t._id === taskId ? { ...t, completed: updatedStatus } : t
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const allCompleted = tasks.length > 0 && tasks.every(task => task.completed);

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
        padding: 1.5,
        borderRadius: 2,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        '@media (max-width: 600px)': {
          maxWidth: '100%', // Take full width on small screens
          padding: 1,
        },
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
        },
      }}
    >
      {/* Header with "Mark All" checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 0.5 }}>
        <Checkbox
          checked={allCompleted}
          onChange={handleMarkAll}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{
            color: '#f15a22',
            '&.Mui-checked': {
              color: '#f15a22',
            },
            padding: 0,
            marginRight: 1.5
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Encode Sans',
            color: isDarkMode ? '#FFF' : 'inherit',
          }}
        >
          Mark All
        </Typography>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 1, bgcolor: isDarkMode ? '#555' : 'divider' }} />

      <Box
        sx={{
          maxHeight: { xs: 300, md: 400 }, // Adjust height for smaller screens
          overflowY: 'auto',
          '::-webkit-scrollbar': {
            width: '6px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
          },
        }}
      >
        <List disablePadding>
          {tasks.map((task) => (
            <ListItem
            key={task._id}
            sx={{
              paddingLeft: 2,
              flexWrap: { xs: 'wrap', md: 'nowrap' }, // Allow wrapping on small screens
              alignItems: 'flex-start',
            }}
          >
            <ListItemIcon sx={{ minWidth: '25px', marginBottom: { xs: 0.5, md: 0 } }}>
              <Checkbox
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                edge="start"
                checked={task.completed}
                onChange={() => handleToggle(task._id)}
                sx={{
                  color: task.completed ? (isDarkMode ? '#F5B300' : '#F5B300') : 'inherit',
                  '&.Mui-checked': {
                    color: '#f15a22',
                  },
                  padding: 0,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed
                      ? isDarkMode
                        ? '#888'
                        : 'text.disabled'
                      : isDarkMode
                      ? '#FFF'
                      : 'text.primary',
                    fontSize: { xs: '0.9rem', md: '1rem' }, // Adjust font size for mobile
                  }}
                >
                  {task.taskName}
                </Typography>
              }
            />
          </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TodoList;
