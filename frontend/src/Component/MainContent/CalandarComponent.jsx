import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const CalendarComponent = ({ isMobile }) => {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());

  // Define colors
  const isDarkMode = theme.palette.mode === 'dark';
  const textColor = '#000000'; // Black text for all modes
  const backgroundColor = '#e1d7f5'; // Light purple for both modes
  const calendarBackgroundColor = isDarkMode ? '#d5cbeb' : '#f3eefb'; // Slightly different shade for the calendar
  const highlightColor = '#f15a22'; // Orange for highlights
  const headerBackgroundColor = isDarkMode
    ? 'linear-gradient(135deg, #c4b8e8 0%, #e1d7f5 100%)'
    : 'linear-gradient(135deg, #d5cbeb 0%, #e1d7f5 100%)';
  const shadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <Box
      sx={{
        p: 3, // Padding for the outer container
        backgroundColor: backgroundColor,
        borderRadius: '12px',
        boxShadow: `0 4px 12px ${shadowColor}`,
        width: '100%', // Make the component take up 100% of the container width
        maxWidth: '100%',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center the content horizontally
      }}
    >
      {/* <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: textColor,
          fontFamily: 'TanseekModernPro-Bold, Arial, sans-serif',
          fontSize: isMobile ? '1rem' : '1.2rem',
          letterSpacing: '0.5px',
          width: '100%', // Full width for the title
          textAlign: 'center', // Center the text for balanced appearance
          paddingLeft: 0, // Remove left padding
        }}
      >
        Calendar
      </Typography> */}
      
      {/* Inner box with balanced spacing */}
      <Box
        sx={{
          backgroundColor: calendarBackgroundColor,
          borderRadius: '8px',
          padding: '1.5rem', // Equal padding on all sides
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          width: '100%', // Take full width of container
          display: 'flex', // Use flexbox for centering
          justifyContent: 'center', // Center content horizontally
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={date}
            onChange={(newDate) => setDate(newDate)}
            sx={{
              width: '100%',
              fontFamily: 'Arial, sans-serif',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex', // Use flexbox for centering
              justifyContent: 'center', // Center content horizontally
              
              // Force black text color for ALL elements in the calendar
              '& *': {
                color: `${textColor} !important`,
              },

              // Style the calendar header (month and year)
              '& .MuiPickersCalendarHeader-root': {
                background: headerBackgroundColor,
                borderRadius: '8px 8px 0 0',
                padding: '8px 12px',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%', // Ensure full width
                '& .MuiPickersCalendarHeader-label': {
                  color: `${textColor} !important`,
                  fontFamily: 'TanseekModernPro-Bold, Arial, sans-serif',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                },
                '& .MuiIconButton-root': {
                  color: `${highlightColor} !important`,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '4px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)',
                  },
                },
              },

              // Center the entire month container
              '& .MuiDayPicker-monthContainer': {
                padding: '0',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center children horizontally
              },

              // Fix alignment of day headers with dates
              '& .MuiDayPicker-header': {
                padding: '0',
                margin: '0',
                width: '100%',
                maxWidth: '280px', // Fixed width for consistent sizing
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: 'auto',
                marginRight: 'auto',
                '& .MuiDayPicker-weekDayLabel': {
                  color: `${textColor} !important`,
                  margin: '0',
                  padding: '0',
                  fontSize: isMobile ? '0.75rem' : '0.85rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  width: '40px', // Slightly wider for better spacing
                  height: '28px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              },

              // Ensure week containers are properly centered
              '& .MuiDayPicker-weekContainer': {
                margin: '2px auto', // Center horizontally with auto margins
                padding: '0',
                width: '100%',
                maxWidth: '280px', // Fixed width for consistent sizing
                display: 'flex',
                justifyContent: 'space-between',
                '& .MuiPickersDay-root': {
                  width: '40px', // Slightly wider for better spacing
                  height: '40px', // Increased height for better proportion
                  margin: '0',
                  padding: '0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              },

              // Adjust the overall height of the calendar to fit the container
              '& .MuiPickersSlideTransition-root': {
                minHeight: '240px', // Increased height
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                '& .PrivatePickersSlideTransition-root': {
                  width: '100%',
                },
              },

              // Style the days
              '& .MuiPickersDay-root': {
                color: `${textColor} !important`,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.05)',
                },
                '&.Mui-selected': {
                  backgroundColor: highlightColor,
                  color: `${textColor} !important`,
                  fontWeight: 'bold',
                  boxShadow: `0 2px 8px ${shadowColor}`,
                  border: '2px solid #ffffff',
                  '&:hover': {
                    backgroundColor: '#d14e1f',
                    transform: 'scale(1.1)',
                  },
                },
                '&.Mui-disabled': {
                  color: 'rgba(0, 0, 0, 0.3) !important',
                },
                '&:not(.Mui-selected)': {
                  border: 'none',
                },
                '&.MuiPickersDay-today': {
                  border: `1px solid ${highlightColor}`,
                },
              },

              // Remove any possible padding or margin causing misalignment
              '& .MuiDateCalendar-root': {
                width: '100%',
                padding: '0',
                margin: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
              '& .MuiDayPicker-root': {
                width: '100%',
                padding: '0',
                margin: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default CalendarComponent;