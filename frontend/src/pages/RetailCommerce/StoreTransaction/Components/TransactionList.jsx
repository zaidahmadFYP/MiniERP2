import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Chip, useTheme } from "@mui/material"
import { formatDate, formatCurrency, getStatusColor } from "../utils/formatUtils"

export default function TransactionList({ transactions, selectedTransaction, onRowClick }) {
  const theme = useTheme()

  return (
    <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
      <Table size="small" aria-label="transaction table" stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                fontWeight: 600,
                bgcolor: theme.palette.mode === "dark" ? "#262626" : "#f5f5f7",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#333333",
              },
            }}
          >
            <TableCell>Date</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Transaction Number</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow
                key={transaction._id}
                hover
                selected={selectedTransaction && selectedTransaction._id === transaction._id}
                onClick={() => onRowClick(transaction)}
                sx={{
                  cursor: "pointer",
                  "&.Mui-selected": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgba(144, 202, 249, 0.16)" : "rgba(25, 118, 210, 0.08)",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgba(144, 202, 249, 0.24)" : "rgba(25, 118, 210, 0.12)",
                  },
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>{transaction.transactionID}</TableCell>
                <TableCell>{transaction.transactionNumber}</TableCell>
                <TableCell>{formatCurrency(transaction.total)}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.transactionStatus}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(transaction.transactionStatus),
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: "20px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
