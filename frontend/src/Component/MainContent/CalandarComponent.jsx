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
  const highlightColor = '#f15a22'; // Orange for highlights
  const headerBackgroundColor = isDarkMode
    ? 'linear-gradient(135deg, #c4b8e8 0%, #e1d7f5 100%)'
    : 'linear-gradient(135deg, #d5cbeb 0%, #e1d7f5 100%)';
  const shadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <Box
      sx={{
        p: 1.5, // Reduced padding to 1.5 (12px) for small gaps on all sides
        backgroundColor: backgroundColor,
        borderRadius: '12px',
        boxShadow: `0 4px 12px ${shadowColor}`,
        maxWidth: '100%',
        ml: isMobile ? 0 : 10, // Align with the module tiles
        transition: 'all 0.3s ease',
        width: isMobile ? '100%' : '280px', // Match the modal width from the screenshot
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          color: textColor,
          fontFamily: 'TanseekModernPro-Bold, Arial, sans-serif',
          fontSize: isMobile ? '1rem' : '1.2rem',
          letterSpacing: '0.5px',
        }}
      >
        Calendar
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={date}
          onChange={(newDate) => setDate(newDate)}
          sx={{
            width: '100%', // Take the full width of the container
            fontFamily: 'Arial, sans-serif',
            backgroundColor: backgroundColor,
            borderRadius: '8px',
            overflow: 'hidden',

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

            // Ensure the calendar content takes up the full available space
            '& .MuiDayPicker-monthContainer': {
              padding: '0',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
            },

            // Fix alignment of day headers with dates
            '& .MuiDayPicker-header': {
              padding: '0',
              margin: '0',
              width: '100%',
              maxWidth: '252px', // Increased to 36px * 7 days = 252px to fill the container
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
                width: '36px', // Increased to 36px to fill the container
                height: '28px', // Adjusted height for better proportion
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },

            // Ensure week containers are properly aligned and centered
            '& .MuiDayPicker-weekContainer': {
              margin: '2px 0',
              padding: '0',
              width: '100%',
              maxWidth: '252px', // Increased to 36px * 7 days = 252px to fill the container
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: 'auto',
              marginRight: 'auto',
              '& .MuiPickersDay-root': {
                width: '36px', // Increased to 36px to fill the container
                height: '36px', // Adjusted height for better proportion
                margin: '0',
                padding: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },

            // Adjust the overall height of the calendar to fit the container
            '& .MuiPickersSlideTransition-root': {
              minHeight: '200px', // Increased to fill the container vertically
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
              justifyContent: 'center',
            },
            '& .MuiDayPicker-root': {
              width: '100%',
              padding: '0',
              margin: '0',
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarComponent;