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
        p: 2,
        backgroundColor: backgroundColor,
        borderRadius: '12px',
        boxShadow: `0 4px 12px ${shadowColor}`,
        maxWidth: '100%',
        ml: isMobile ? 0 : 10, // Align with the module tiles
        transition: 'all 0.3s ease',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: textColor, // Black in all modes
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
            width: '100%',
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
              padding: '12px 16px',
              marginBottom: '8px',
              '& .MuiPickersCalendarHeader-label': {
                color: `${textColor} !important`, // Force black in all modes
                fontFamily: 'TanseekModernPro-Bold, Arial, sans-serif',
                fontSize: isMobile ? '1rem' : '1.2rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
              },
              '& .MuiIconButton-root': {
                color: `${highlightColor} !important`, // Orange arrows
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                padding: '6px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
              },
            },
            
            // Ensure uniform grid layout
            '& .MuiDayPicker-monthContainer': {
              padding: '0',
              width: '100%',
              margin: '0',
            },
            
            // Fix alignment of day headers with dates
            '& .MuiDayPicker-header': {
              padding: '0',
              margin: '0',
              width: '100%',
              '& .MuiDayPicker-weekDayLabel': {
                color: `${textColor} !important`,
                margin: '0',
                padding: '0',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                width: isMobile ? '36px' : '40px',
                height: isMobile ? '26px' : '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
            
            // Ensure week containers are properly aligned
            '& .MuiDayPicker-weekContainer': {
              margin: '4px 0',
              padding: '0',
              justifyContent: 'center',
              width: '100%',
              '& .MuiPickersDay-root': {
                width: isMobile ? '36px' : '40px',
                height: isMobile ? '36px' : '40px',
                margin: '0 1px',
                padding: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
            
            // Additional fix for grid layout
            '& .MuiPickersSlideTransition-root': {
              minHeight: isMobile ? '200px' : '240px',
              width: '100%',
              '& .PrivatePickersSlideTransition-root': {
                width: '100%',
              },
            },
            
            // Style the days
            '& .MuiPickersDay-root': {
              color: `${textColor} !important`, // Force black in all modes
              fontSize: isMobile ? '0.9rem' : '1rem',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
              '&.Mui-selected': {
                backgroundColor: highlightColor, // Orange for selected day
                color: `${textColor} !important`, // Force black for selected day
                fontWeight: 'bold',
                boxShadow: `0 2px 8px ${shadowColor}`,
                border: '2px solid #ffffff', // White border for better contrast
                '&:hover': {
                  backgroundColor: '#d14e1f',
                  transform: 'scale(1.1)',
                },
              },
              '&.Mui-disabled': {
                color: 'rgba(0, 0, 0, 0.3) !important', // Muted black for disabled days
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
