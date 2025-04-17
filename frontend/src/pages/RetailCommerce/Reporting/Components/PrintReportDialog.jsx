import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material"
import { CalendarMonth, Print } from "@mui/icons-material"
import { format, subDays, isWithinInterval } from "date-fns"

const PrintReportDialog = ({ open, onClose, transactions, posConfigs, currentStartDate, currentEndDate }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  const [dateOption, setDateOption] = useState("specific")
  const [specificDate, setSpecificDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [rangeStartDate, setRangeStartDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"))
  const [rangeEndDate, setRangeEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)

    // Filter transactions based on selected date option
    let filteredData = []

    if (dateOption === "specific") {
      const targetDate = new Date(specificDate)
      filteredData = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return (
          transactionDate.getDate() === targetDate.getDate() &&
          transactionDate.getMonth() === targetDate.getMonth() &&
          transactionDate.getFullYear() === targetDate.getFullYear()
        )
      })
    } else if (dateOption === "range") {
      const start = new Date(rangeStartDate)
      const end = new Date(rangeEndDate)
      filteredData = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return isWithinInterval(transactionDate, { start, end })
      })
    } else if (dateOption === "all") {
      const end = new Date()
      filteredData = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate <= end
      })
    }

    // Create a printable report
    setTimeout(() => {
      generatePrintableReport(filteredData)
      setIsPrinting(false)
      onClose()
    }, 1000)
  }

  const generatePrintableReport = (data) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    // Calculate summary statistics
    const totalSales = data.reduce((sum, transaction) => sum + transaction.total, 0)
    const totalTransactions = data.length
    const averageTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0

    // Group by payment method
    const paymentMethods = data.reduce((acc, transaction) => {
      const method = transaction.paymentMethod
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0 }
      }
      acc[method].count += 1
      acc[method].total += transaction.total
      return acc
    }, {})

    // Get top selling items
    const itemSales = data.reduce((acc, transaction) => {
      transaction.items.forEach((item) => {
        if (!acc[item.itemId]) {
          acc[item.itemId] = {
            itemName: item.itemName,
            totalQuantity: 0,
            totalSales: 0,
          }
        }
        acc[item.itemId].totalQuantity += item.itemQuantity
        acc[item.itemId].totalSales +=
          item.itemQuantity * (transaction.total / transaction.items.reduce((sum, i) => sum + i.itemQuantity, 0))
      })
      return acc
    }, {})

    const topItems = Object.values(itemSales)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5)

    // Generate HTML content for the report
    const reportTitle =
      dateOption === "specific"
        ? `POS Report for ${format(new Date(specificDate), "MMMM d, yyyy")}`
        : dateOption === "range"
          ? `POS Report from ${format(new Date(rangeStartDate), "MMMM d, yyyy")} to ${format(new Date(rangeEndDate), "MMMM d, yyyy")}`
          : `POS Report - All Transactions up to ${format(new Date(), "MMMM d, yyyy")}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f15a22;
            padding-bottom: 10px;
          }
          .header h1 {
            color: #f15a22;
            margin-bottom: 5px;
          }
          .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }
          .summary-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            width: 30%;
            box-sizing: border-box;
            margin-bottom: 15px;
          }
          .summary-card h3 {
            margin-top: 0;
            color: #f15a22;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #f15a22;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
          .print-button {
            background-color: #f15a22;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reportTitle}</h1>
          <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
        </div>
        
        <button class="print-button no-print" onclick="window.print(); return false;">Print Report</button>
        
        <div class="summary">
          <div class="summary-card">
            <h3>Total Sales</h3>
            <p>$${totalSales.toFixed(2)}</p>
          </div>
          <div class="summary-card">
            <h3>Total Transactions</h3>
            <p>${totalTransactions}</p>
          </div>
          <div class="summary-card">
            <h3>Average Transaction</h3>
            <p>$${averageTransactionValue.toFixed(2)}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Payment Methods</h2>
          <table>
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Number of Transactions</th>
                <th>Total Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(paymentMethods)
                .map(
                  ([method, data]) => `
                <tr>
                  <td>${method}</td>
                  <td>${data.count}</td>
                  <td>$${data.total.toFixed(2)}</td>
                  <td>${((data.total / totalSales) * 100).toFixed(1)}%</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Top Selling Products</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              ${topItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.itemName}</td>
                  <td>${item.totalQuantity}</td>
                  <td>$${item.totalSales.toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Transaction Details</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Payment Method</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (transaction) => `
                <tr>
                  <td>${format(new Date(transaction.date), "MM/dd/yyyy")}</td>
                  <td>${transaction.id}</td>
                  <td>${transaction.paymentMethod}</td>
                  <td>${transaction.items.map((item) => `${item.itemName} (${item.itemQuantity})`).join(", ")}</td>
                  <td>$${transaction.total.toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          border: `1px solid ${alpha(primaryColor, 0.2)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(primaryColor, isDarkMode ? 0.2 : 0.05),
          color: primaryColor,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Print /> Print POS Report
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Select a date range for the report you want to print:
        </Typography>

        <RadioGroup value={dateOption} onChange={(e) => setDateOption(e.target.value)}>
          <FormControlLabel
            value="specific"
            control={<Radio sx={{ color: primaryColor, "&.Mui-checked": { color: primaryColor } }} />}
            label="Specific Date"
          />

          {dateOption === "specific" && (
            <Box sx={{ ml: 4, mb: 2 }}>
              <TextField
                label="Select Date"
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: alpha(primaryColor, 0.5),
                    },
                  },
                }}
                InputProps={{
                  startAdornment: <CalendarMonth fontSize="small" sx={{ mr: 1, color: alpha(primaryColor, 0.7) }} />,
                }}
              />
            </Box>
          )}

          <FormControlLabel
            value="range"
            control={<Radio sx={{ color: primaryColor, "&.Mui-checked": { color: primaryColor } }} />}
            label="Date Range"
          />

          {dateOption === "range" && (
            <Box sx={{ ml: 4, mb: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={rangeStartDate}
                  onChange={(e) => setRangeStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: alpha(primaryColor, 0.5),
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: <CalendarMonth fontSize="small" sx={{ mr: 1, color: alpha(primaryColor, 0.7) }} />,
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={rangeEndDate}
                  onChange={(e) => setRangeEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: alpha(primaryColor, 0.5),
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: <CalendarMonth fontSize="small" sx={{ mr: 1, color: alpha(primaryColor, 0.7) }} />,
                  }}
                />
              </Box>
            </Box>
          )}

          <FormControlLabel
            value="all"
            control={<Radio sx={{ color: primaryColor, "&.Mui-checked": { color: primaryColor } }} />}
            label="All Dates (up to current date)"
          />
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: alpha(primaryColor, 0.5),
            color: primaryColor,
            "&:hover": {
              borderColor: primaryColor,
              backgroundColor: alpha(primaryColor, 0.1),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          disabled={isPrinting}
          startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : <Print />}
          sx={{
            bgcolor: primaryColor,
            "&:hover": {
              bgcolor: alpha(primaryColor, 0.9),
            },
          }}
        >
          {isPrinting ? "Preparing..." : "Print Report"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PrintReportDialog
