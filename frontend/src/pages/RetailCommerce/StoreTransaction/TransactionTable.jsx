"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Collapse,
  Button,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
} from "@mui/material"
import {
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
  Refresh,
  Print,
  CloudDownload,
  MoreVert,
  Close,
} from "@mui/icons-material"

export default function TransactionTable() {
  // State for API data
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // UI state
  const [generalOpen, setGeneralOpen] = useState(true)
  const [amountOpen, setAmountOpen] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Filter dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    paymentMethod: "",
    minAmount: "",
    maxAmount: "",
    dateFrom: "",
    dateTo: "",
  })

  // Export menu state
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null)
  const exportMenuOpen = Boolean(exportMenuAnchorEl)

  // State for resizable panels
  const [leftPanelWidth, setLeftPanelWidth] = useState(50) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const splitterRef = useRef(null)

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      // For demo purposes, use a relative URL if no environment variable is set
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || ""
      const response = await fetch(`${apiBaseUrl}/transactions`, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Enhance the data with additional fields for UI display
      const enhancedData = data.map((t, index) => ({
        ...t,
        id: t.id || index + 1,
        channel: t.paymentMethod === "Cash" ? "IN-STORE" : "ONLINE",
        receipt: `RCPT-${index + 1000}`,
        store: "10052",
        purpose: t.items.length > 3 ? "BULK ORDER" : "REGULAR",
        transactionNumber: `TXN-${new Date(t.date).getTime().toString().slice(-8)}`,
      }))

      setTransactions(enhancedData)
      setFilteredTransactions(enhancedData)
      if (enhancedData.length > 0) {
        setSelectedTransaction(enhancedData[0])
      }

      // Show success message
      showSnackbar("Transactions loaded successfully")
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError("Failed to load transactions. Please check your API connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchTransactions()
  }, [retryCount])

  // Filter transactions based on search query
  useEffect(() => {
    applyFilters()
  }, [searchQuery, transactions])

  // Apply all filters (search and advanced filters)
  const applyFilters = () => {
    if (transactions.length === 0) {
      setFilteredTransactions([])
      return
    }

    let filtered = [...transactions]

    // Apply search query filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((t) => {
        return (
          t.paymentMethod.toLowerCase().includes(lowercasedQuery) ||
          t.total.toString().includes(lowercasedQuery) ||
          (t.transactionNumber && t.transactionNumber.toLowerCase().includes(lowercasedQuery)) ||
          t.items.some((item) => item.itemName.toLowerCase().includes(lowercasedQuery))
        )
      })
    }

    // Apply advanced filters
    if (filterOptions.paymentMethod) {
      filtered = filtered.filter((t) => t.paymentMethod === filterOptions.paymentMethod)
    }

    if (filterOptions.minAmount) {
      filtered = filtered.filter((t) => t.total >= Number.parseFloat(filterOptions.minAmount))
    }

    if (filterOptions.maxAmount) {
      filtered = filtered.filter((t) => t.total <= Number.parseFloat(filterOptions.maxAmount))
    }

    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom)
      filtered = filtered.filter((t) => new Date(t.date) >= fromDate)
    }

    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter((t) => new Date(t.date) <= toDate)
    }

    setFilteredTransactions(filtered)
  }

  // Handle row click
  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction)
  }

  // Handle mouse down on the splitter
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const mouseX = e.clientX - containerRect.left

      // Calculate percentage (constrain between 20% and 80%)
      let newLeftWidth = (mouseX / containerWidth) * 100
      newLeftWidth = Math.max(20, Math.min(80, newLeftWidth))

      setLeftPanelWidth(newLeftWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  // Format currency for display
  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    } catch (e) {
      return `${amount}`
    }
  }

  // Show snackbar message
  const showSnackbar = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Handle refresh button click
  const handleRefresh = () => {
    setSearchQuery("")
    setFilterOptions({
      paymentMethod: "",
      minAmount: "",
      maxAmount: "",
      dateFrom: "",
      dateTo: "",
    })
    setRetryCount((prevCount) => prevCount + 1) // This will trigger a re-fetch
  }

  // Handle filter dialog open
  const handleFilterOpen = () => {
    setFilterDialogOpen(true)
  }

  // Handle filter dialog close
  const handleFilterClose = () => {
    setFilterDialogOpen(false)
  }

  // Handle filter apply
  const handleFilterApply = () => {
    applyFilters()
    setFilterDialogOpen(false)
    showSnackbar("Filters applied")
  }

  // Handle filter reset
  const handleFilterReset = () => {
    setFilterOptions({
      paymentMethod: "",
      minAmount: "",
      maxAmount: "",
      dateFrom: "",
      dateTo: "",
    })
    setFilterDialogOpen(false)
    applyFilters()
    showSnackbar("Filters reset")
  }

  // Handle export menu open
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchorEl(event.currentTarget)
  }

  // Handle export menu close
  const handleExportMenuClose = () => {
    setExportMenuAnchorEl(null)
  }

  // Handle export to CSV
  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ["Date", "Transaction Number", "Payment Method", "Total", "Items"]
      let csvContent = headers.join(",") + "\n"

      const dataToExport = selectedTransaction ? [selectedTransaction] : filteredTransactions

      dataToExport.forEach((transaction) => {
        const itemsList = transaction.items.map((item) => `${item.itemName}(${item.itemQuantity})`).join("; ")
        const row = [
          formatDate(transaction.date),
          transaction.transactionNumber,
          transaction.paymentMethod,
          transaction.total,
          `"${itemsList}"`,
        ]
        csvContent += row.join(",") + "\n"
      })

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      handleExportMenuClose()
      showSnackbar("Export completed")
    } catch (error) {
      console.error("Export error:", error)
      showSnackbar("Export failed")
    }
  }

  // Handle export to JSON
  const handleExportJSON = () => {
    try {
      const dataToExport = selectedTransaction ? [selectedTransaction] : filteredTransactions
      const jsonContent = JSON.stringify(dataToExport, null, 2)

      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `transactions_${new Date().toISOString().slice(0, 10)}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      handleExportMenuClose()
      showSnackbar("Export completed")
    } catch (error) {
      console.error("Export error:", error)
      showSnackbar("Export failed")
    }
  }

  // Handle print
  const handlePrint = () => {
    try {
      if (!selectedTransaction) {
        showSnackbar("Please select a transaction to print")
        return
      }

      // Create a printable version of the transaction
      const printWindow = window.open("", "_blank")

      if (!printWindow) {
        showSnackbar("Pop-up blocked. Please allow pop-ups for printing.")
        return
      }

      const itemsList = selectedTransaction.items
        .map(
          (item) =>
            `<tr>
          <td>${item.itemName}</td>
          <td>${item.itemQuantity}</td>
          <td>${formatCurrency((selectedTransaction.total / selectedTransaction.items.reduce((sum, i) => sum + i.itemQuantity, 0)) * item.itemQuantity)}</td>
        </tr>`,
        )
        .join("")

      printWindow.document.write(`
        <html>
          <head>
            <title>Transaction ${selectedTransaction.transactionNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { display: flex; justify-content: space-between; align-items: center; }
              .section { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Transaction Details</h1>
              <p>Date: ${formatDate(selectedTransaction.date)}</p>
            </div>
            
            <div class="section">
              <h2>General Information</h2>
              <table>
                <tr>
                  <th>Transaction Number</th>
                  <td>${selectedTransaction.transactionNumber}</td>
                </tr>
                <tr>
                  <th>Payment Method</th>
                  <td>${selectedTransaction.paymentMethod}</td>
                </tr>
                <tr>
                  <th>Channel</th>
                  <td>${selectedTransaction.channel || ""}</td>
                </tr>
                <tr>
                  <th>Total Amount</th>
                  <td>${formatCurrency(selectedTransaction.total)}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <h2>Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Estimated Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <p><strong>Total Items:</strong> ${selectedTransaction.items.reduce((sum, item) => sum + item.itemQuantity, 0)}</p>
              <p><strong>Total Amount:</strong> ${formatCurrency(selectedTransaction.total)}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `)

      printWindow.document.close()
      showSnackbar("Print job sent")
    } catch (error) {
      console.error("Print error:", error)
      showSnackbar("Print failed")
    }
  }

  // Error display component
  const ErrorDisplay = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        p: 3,
      }}
    >
      <Alert
        severity="error"
        sx={{
          width: "100%",
          maxWidth: 500,
          mb: 2,
        }}
      >
        {error}
      </Alert>
      <Button variant="contained" onClick={() => setRetryCount((prevCount) => prevCount + 1)} sx={{ mt: 2 }}>
        Retry
      </Button>
    </Box>
  )

  // Loading display component
  const LoadingDisplay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <CircularProgress size={60} />
      <Typography sx={{ mt: 2 }}>Loading transactions...</Typography>
    </Box>
  )

  // If there's an error, show the error message
  if (error) {
    return (
      <Box sx={{ height: "100vh", bgcolor: "#f5f5f7", p: 2 }}>
        <ErrorDisplay />
      </Box>
    )
  }

  // If loading, show loading indicator
  if (loading) {
    return (
      <Box sx={{ height: "100vh", bgcolor: "#f5f5f7", p: 2 }}>
        <LoadingDisplay />
      </Box>
    )
  }

  // Get unique payment methods for filter dropdown
  const uniquePaymentMethods = [...new Set(transactions.map((t) => t.paymentMethod))]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#f5f5f7" }}>
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          position: "relative",
          p: 2,
          gap: 0,
        }}
      >
        {/* Left side - Transaction list */}
        <Paper
          elevation={2}
          sx={{
            width: `${leftPanelWidth}%`,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "#666", fontWeight: 500 }}>
                Standard view
              </Typography>
              <IconButton size="small">
                <KeyboardArrowDown />
              </IconButton>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
              Store transactions
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                placeholder="Filter"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: 1 }} onClick={handleFilterOpen}>
                <FilterList />
              </IconButton>
              <IconButton sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: 1 }} onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            </Box>
          </Box>

          <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Table size="small" aria-label="transaction table" stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 600, bgcolor: "#f5f5f7" } }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Transaction Number</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      hover
                      selected={selectedTransaction && selectedTransaction.id === transaction.id}
                      onClick={() => handleRowClick(transaction)}
                      sx={{
                        cursor: "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{transaction.transactionNumber}</TableCell>
                      <TableCell>{formatCurrency(transaction.total)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Resizable splitter */}
        <Box
          ref={splitterRef}
          onMouseDown={handleMouseDown}
          sx={{
            width: "8px",
            cursor: "col-resize",
            backgroundColor: isDragging ? "#1976d2" : "rgba(0, 0, 0, 0.1)",
            transition: isDragging ? "none" : "background-color 0.2s",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            zIndex: 10,
            mx: 1,
            borderRadius: 1,
          }}
        />

        {/* Right side - Transaction details */}
        <Paper
          elevation={2}
          sx={{
            width: `${100 - leftPanelWidth}%`,
            overflowY: "auto",
            borderRadius: 2,
            p: 0,
          }}
        >
          {!selectedTransaction ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Select a transaction to view details</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#666" }}>
                      Transaction number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedTransaction.transactionNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Print />}
                      sx={{ textTransform: "none" }}
                      onClick={handlePrint}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloudDownload />}
                      sx={{ textTransform: "none" }}
                      onClick={handleExportMenuOpen}
                    >
                      Export
                    </Button>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" sx={{ color: "#666" }}>
                      Transaction Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedTransaction.transactionNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" sx={{ color: "#666" }}>
                      Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(selectedTransaction.date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" sx={{ color: "#666" }}>
                      Payment Method
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedTransaction.paymentMethod}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 2 }}>
                {/* General section */}
                <Card
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          General
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2" sx={{ color: "#666", mr: 1 }}>
                            {selectedTransaction.channel || ""}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setGeneralOpen(!generalOpen)}
                            aria-expanded={generalOpen}
                            aria-label="show more"
                          >
                            {generalOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                        </Box>
                      </Box>
                    }
                    sx={{ p: 1.5, bgcolor: "#f9f9f9" }}
                  />
                  <Collapse in={generalOpen} timeout="auto" unmountOnExit>
                    <CardContent sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Transaction Date
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={formatDate(selectedTransaction.date)}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Payment Method
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={selectedTransaction.paymentMethod}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Transaction Number
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={selectedTransaction.transactionNumber || ""}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Channel
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={selectedTransaction.channel || ""}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Purpose
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={selectedTransaction.purpose || ""}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Total Items
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={selectedTransaction.items ? selectedTransaction.items.length : 0}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Card>

                {/* Amount section */}
                <Card
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Amount
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setAmountOpen(!amountOpen)}
                          aria-expanded={amountOpen}
                          aria-label="show more"
                        >
                          {amountOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </Box>
                    }
                    sx={{ p: 1.5, bgcolor: "#f9f9f9" }}
                  />
                  <Collapse in={amountOpen} timeout="auto" unmountOnExit>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: "#555" }}>
                        AMOUNTS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Total Amount
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={formatCurrency(selectedTransaction.total)}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Item Count
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={
                              selectedTransaction.items
                                ? selectedTransaction.items.reduce((sum, item) => sum + item.itemQuantity, 0)
                                : 0
                            }
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                            Average Item Price
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            value={formatCurrency(
                              selectedTransaction.total /
                                Math.max(
                                  1,
                                  selectedTransaction.items
                                    ? selectedTransaction.items.reduce((sum, item) => sum + item.itemQuantity, 0)
                                    : 1,
                                ),
                            )}
                            InputProps={{ readOnly: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Card>

                {/* Details section - Items */}
                <Card
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Items
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setDetailsOpen(!detailsOpen)}
                          aria-expanded={detailsOpen}
                          aria-label="show more"
                        >
                          {detailsOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </Box>
                    }
                    sx={{ p: 1.5, bgcolor: "#f9f9f9" }}
                  />
                  <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
                    <CardContent sx={{ p: 2 }}>
                      {selectedTransaction.items && selectedTransaction.items.length > 0 ? (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Est. Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedTransaction.items.map((item, index) => {
                                // Calculate estimated price per item (total divided by total quantity)
                                const totalQuantity = selectedTransaction.items
                                  ? selectedTransaction.items.reduce((sum, i) => sum + i.itemQuantity, 0)
                                  : 1
                                const estimatedPrice = (selectedTransaction.total / totalQuantity) * item.itemQuantity

                                return (
                                  <TableRow key={index}>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell>{item.itemQuantity}</TableCell>
                                    <TableCell>{formatCurrency(estimatedPrice)}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography align="center">No items found</Typography>
                      )}
                    </CardContent>
                  </Collapse>
                </Card>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleFilterClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Advanced Filters</Typography>
            <IconButton onClick={handleFilterClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={filterOptions.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setFilterOptions({ ...filterOptions, paymentMethod: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  {uniquePaymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Min Amount"
                type="number"
                size="small"
                fullWidth
                value={filterOptions.minAmount}
                onChange={(e) => setFilterOptions({ ...filterOptions, minAmount: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Amount"
                type="number"
                size="small"
                fullWidth
                value={filterOptions.maxAmount}
                onChange={(e) => setFilterOptions({ ...filterOptions, maxAmount: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date From"
                type="date"
                size="small"
                fullWidth
                value={filterOptions.dateFrom}
                onChange={(e) => setFilterOptions({ ...filterOptions, dateFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date To"
                type="date"
                size="small"
                fullWidth
                value={filterOptions.dateTo}
                onChange={(e) => setFilterOptions({ ...filterOptions, dateTo: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset} color="inherit">
            Reset
          </Button>
          <Button onClick={handleFilterApply} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Menu */}
      <Menu anchorEl={exportMenuAnchorEl} open={exportMenuOpen} onClose={handleExportMenuClose}>
        <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
        <MenuItem onClick={handleExportJSON}>Export as JSON</MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Box>
  )
}
