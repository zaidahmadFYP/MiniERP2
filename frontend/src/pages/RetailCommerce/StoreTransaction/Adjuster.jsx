import React, { useState } from 'react';
import { Box, Divider } from '@mui/material';

const Adjuster = ({ onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  
  const handleMouseDown = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      onResize(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <Box
      sx={{
        width: '5px',
        backgroundColor: '#ccc',
        cursor: 'ew-resize',
        height: '100vh',
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

export default Adjuster;