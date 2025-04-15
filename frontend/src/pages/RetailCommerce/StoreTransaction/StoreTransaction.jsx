import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import TransactionTable from './TransactionTable';
import MainContentWrapper from './Components/MainContentWrapper';
import { Box } from '@mui/material';

const StoreTransaction = ({ open, user }) => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([
    { date: '2/3/2025', amount: '$50', purpose: 'Dine In' },
    { date: '2/3/2025', amount: '$30', purpose: 'Take Away' },
    { date: '2/3/2025', amount: '$70', purpose: 'Delivery' },
  ]);

  return (
    <MainContentWrapper open={open}>
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // Subtract header height if any
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // Prevent scrolling
        }}
      >
        <TransactionTable />
      </Box>
    </MainContentWrapper>
  );
};

export default StoreTransaction;
