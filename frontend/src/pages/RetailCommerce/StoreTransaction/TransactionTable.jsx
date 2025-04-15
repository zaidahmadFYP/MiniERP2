import { useState, useRef, useEffect } from "react"
import { Box, Paper, Typography, IconButton, Snackbar } from "@mui/material"
import { Refresh, FilterList, KeyboardArrowDown } from "@mui/icons-material"

// Import components
import TransactionList from "./cCmponents/TransactionList"
import TransactionDetails from "./Components/TransactionDetails"
import SearchBar from "./Components/SearchBar"
import FilterDialog from "./Components/FilterDialog"
import ExportMenu from "./Components/ExportMenu"
import ErrorDisplay from "./Components/ErrorDisplay"
import LoadingDisplay from "./Components/LoadingDisplay"

// Import utilities
import { formatDate, printTransaction } from "./utils/formatUtils"

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
    paidStatus: "",
    transactionStatus: "",
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
      const enhancedData = data.map((t) => ({
        ...t,
        id: t._id, // Use MongoDB _id as our id
        transactionId: t.transactionID, // Use the specific transactionID field
        channel: t.paymentMethod === "Cash" ? "IN-STORE" : "ONLINE",
        receipt: `RCPT-${t.transactionID || ""}`,
        store: "10052",
        purpose: t.items.length > 3 ? "BULK ORDER" : "REGULAR",
        // Generate a distinct transaction number in TXN-XXXXXX format
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
          (typeof t.paymentMethod === "string" && t.paymentMethod.toLowerCase().includes(lowercasedQuery)) ||
          (t.total && t.total.toString().includes(lowercasedQuery)) ||
          (typeof t.transactionID === "string" && t.transactionID.toLowerCase().includes(lowercasedQuery)) ||
          (typeof t.transactionNumber === "string" && t.transactionNumber.toLowerCase().includes(lowercasedQuery)) ||
          (t.items &&
            t.items.some(
              (item) => typeof item.itemName === "string" && item.itemName.toLowerCase().includes(lowercasedQuery),
            ))
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

    if (filterOptions.paidStatus) {
      filtered = filtered.filter((t) => t.paidStatus === filterOptions.paidStatus)
    }

    if (filterOptions.transactionStatus) {
      filtered = filtered.filter((t) => t.transactionStatus === filterOptions.transactionStatus)
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
      paidStatus: "",
      transactionStatus: "",
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
      paidStatus: "",
      transactionStatus: "",
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
      const headers = [
        "Date",
        "Transaction ID",
        "Transaction Number",
        "Payment Method",
        "Total",
        "Status",
        "Paid",
        "Items",
      ]
      let csvContent = headers.join(",") + "\n"

      const dataToExport = selectedTransaction ? [selectedTransaction] : filteredTransactions

      dataToExport.forEach((transaction) => {
        const itemsList = transaction.items.map((item) => `${item.itemName}(${item.itemQuantity})`).join("; ")
        const row = [
          formatDate(transaction.date),
          transaction.transactionID || "",
          transaction.transactionNumber || "",
          transaction.paymentMethod || "",
          transaction.total || 0,
          transaction.transactionStatus || "",
          transaction.paidStatus || "",
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
    if (!selectedTransaction) {
      showSnackbar("Please select a transaction to print")
      return
    }

    printTransaction(selectedTransaction, showSnackbar)
  }

  // Get unique payment methods for filter dropdown
  const uniquePaymentMethods = [...new Set(transactions.map((t) => t.paymentMethod).filter(Boolean))]

  // Get unique transaction statuses for filter dropdown
  const uniqueTransactionStatuses = [...new Set(transactions.map((t) => t.transactionStatus).filter(Boolean))]

  // Get unique paid statuses for filter dropdown
  const uniquePaidStatuses = [...new Set(transactions.map((t) => t.paidStatus).filter(Boolean))]

  // If there's an error, show the error message
  if (error) {
    return (
      <Box sx={{ height: "100%", bgcolor: "background.default", p: 2 }}>
        <ErrorDisplay error={error} onRetry={() => setRetryCount((prevCount) => prevCount + 1)} />
      </Box>
    )
  }

  // If loading, show loading indicator
  if (loading) {
    return (
      <Box sx={{ height: "100%", bgcolor: "background.default", p: 2 }}>
        <LoadingDisplay />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#121212" : "#f5f5f7"),
        overflow: "hidden",
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          position: "relative",
          p: 2,
          gap: 0,
          overflow: "hidden",
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
            bgcolor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff"),
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: (theme) =>
                `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: (theme) => (theme.palette.mode === "dark" ? "#b0b0b0" : "#666"),
                  fontWeight: 500,
                }}
              >
                Standard view
              </Typography>
              <IconButton size="small">
                <KeyboardArrowDown />
              </IconButton>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: (theme) => (theme.palette.mode === "dark" ? "#ffffff" : "#333"),
              }}
            >
              Store transactions
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <IconButton
                sx={{
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)"}`,
                  borderRadius: 1,
                }}
                onClick={handleFilterOpen}
              >
                <FilterList />
              </IconButton>
              <IconButton
                sx={{
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)"}`,
                  borderRadius: 1,
                }}
                onClick={handleRefresh}
              >
                <Refresh />
              </IconButton>
            </Box>
          </Box>

          <TransactionList
            transactions={filteredTransactions}
            selectedTransaction={selectedTransaction}
            onRowClick={handleRowClick}
          />
        </Paper>

        {/* Resizable splitter */}
        <Box
          ref={splitterRef}
          onMouseDown={handleMouseDown}
          sx={{
            width: "8px",
            cursor: "col-resize",
            backgroundColor: isDragging
              ? "#1976d2"
              : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"),
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
            bgcolor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff"),
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
                color: (theme) => (theme.palette.mode === "dark" ? "#b0b0b0" : "text.secondary"),
              }}
            >
              <Typography>Select a transaction to view details</Typography>
            </Box>
          ) : (
            <TransactionDetails
              transaction={selectedTransaction}
              onPrint={handlePrint}
              onExportMenuOpen={handleExportMenuOpen}
            />
          )}
        </Paper>
      </Box>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={handleFilterClose}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        paymentMethods={uniquePaymentMethods}
        transactionStatuses={uniqueTransactionStatuses}
        paidStatuses={uniquePaidStatuses}
      />

      {/* Export Menu */}
      <ExportMenu
        anchorEl={exportMenuAnchorEl}
        open={exportMenuOpen}
        onClose={handleExportMenuClose}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
      />

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Box>
  )
}
