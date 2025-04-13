import React, { useState, useEffect } from 'react';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/transactions`);
        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data); // Initially set all transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (searchQuery === '') {
        setFilteredTransactions(transactions); // Show all if no search query
      } else {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = transactions.filter((t) => {
          return (
            t.paymentMethod.toLowerCase().includes(lowercasedQuery) ||
            t.total.toString().includes(lowercasedQuery) ||
            t.items.some((item) =>
              item.itemName.toLowerCase().includes(lowercasedQuery)
            )
          );
        });
        setFilteredTransactions(filtered);
      }
    };

    filterData();
  }, [searchQuery, transactions]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transaction Records</h2>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
      />
      
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Total</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((t, index) => (
              <tr key={index}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.paymentMethod}</td>
                <td>{t.total}</td>
                <td>
                  <ul>
                    {t.items.map((item, i) => (
                      <li key={i}>
                        {item.itemName} (x{item.itemQuantity})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
