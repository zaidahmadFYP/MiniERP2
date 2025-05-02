import React from "react"
import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Tooltip,
  Divider,
  LinearProgress,
  Collapse,
} from "@mui/material"
import {
  AttachMoney,
  TrendingUp,
  Payment,
  KeyboardArrowDown,
  KeyboardArrowUp,
  CreditCard,
  Money,
  AccountBalance,
  CalendarToday,
  Inventory,
  FilterList,
  AccountBalanceWallet,
  MoreVert,
  Send,
  Download,
  Print,
  Refresh,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  Search,
  ReceiptLong,
  BarChart,
} from "@mui/icons-material"
import MainContentWrapper from "./Components/MainContentWrapper"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"

// Create custom theme with the orange accent color
const customTheme = (theme) => {
  const isDarkMode = theme.palette.mode === "dark"

  return createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        main: "#f15a22", // The requested orange accent color
        dark: isDarkMode ? "#ff8c5a" : "#d24b18", // Adjusted for dark mode visibility
        light: isDarkMode ? "#ff7a44" : "#f8a982", // Adjusted for dark mode visibility
      },
      secondary: {
        main: isDarkMode ? "#f8a982" : "#f8a982", // Lighter shade of the primary color
      },
      card: {
        main: isDarkMode ? "rgba(241, 90, 34, 0.08)" : "#fef4f0", // Adaptive background for cards
      },
      background: {
        ...theme.palette.background,
        paper: isDarkMode ? theme.palette.background.paper : "#ffffff",
      },
      // Keep current mode (light/dark)
      mode: theme.palette.mode,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.05)",
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: isDarkMode ? "0 10px 20px rgba(241, 90, 34, 0.2)" : "0 10px 20px rgba(241, 90, 34, 0.15)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlinedPrimary: {
            borderColor: isDarkMode ? "#ff7a44" : "#f15a22",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: isDarkMode ? "rgba(241, 90, 34, 0.1)" : "#fef4f0",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: isDarkMode ? "rgba(255, 255, 255, 0.87)" : undefined,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
          },
          containedPrimary: {
            boxShadow: isDarkMode ? "0 4px 12px rgba(241, 90, 34, 0.3)" : "0 4px 12px rgba(241, 90, 34, 0.2)",
            "&:hover": {
              boxShadow: isDarkMode ? "0 6px 16px rgba(241, 90, 34, 0.4)" : "0 6px 16px rgba(241, 90, 34, 0.3)",
            },
          },
        },
      },
    },
  })
}

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

// Transaction Row component with expandable details
function TransactionRow({ transaction }) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case "credit":
      case "credit card":
        return <CreditCard fontSize="small" />
      case "cash":
        return <Money fontSize="small" />
      case "bank":
      case "bank transfer":
      case "hbl":
        return <AccountBalance fontSize="small" />
      case "meezar":
      case "meezaan":
      case "meezan":
        return <Payment fontSize="small" />
      case "loopay":
        return <Payment fontSize="small" />
      default:
        return <Payment fontSize="small" />
    }
  }

  // Get payment method color
  const getPaymentColor = (method) => {
    switch (method.toLowerCase()) {
      case "credit":
      case "credit card":
        return "primary"
      case "cash":
        return "success"
      case "bank":
      case "bank transfer":
      case "hbl":
        return "info"
      case "meezar":
      case "meezaan":
      case "meezan":
        return "warning"
      case "loopay":
        return "secondary"
      default:
        return "default"
    }
  }

  const isDarkMode = theme.palette.mode === "dark"

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, transition: "background-color 0.2s" }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              backgroundColor: open ? `rgba(241, 90, 34, ${isDarkMode ? 0.2 : 0.1})` : "transparent",
              "&:hover": {
                backgroundColor: `rgba(241, 90, 34, ${isDarkMode ? 0.3 : 0.2})`,
              },
            }}
          >
            {open ? <KeyboardArrowUp color="primary" /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ fontWeight: 500, fontFamily: "monospace", fontSize: "0.85rem" }}>
          {transaction._id}
        </TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{transaction.transactionID || "N/A"}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
            {formatDate(transaction.date)}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Inventory sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
            {transaction.items.length} items
          </Box>
        </TableCell>
        <TableCell
          sx={{ fontWeight: 600, color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }}
        >
          {formatCurrency(transaction.total)}
        </TableCell>
        <TableCell>
          <Chip
            icon={getPaymentIcon(transaction.paymentMethod)}
            label={transaction.paymentMethod}
            color={getPaymentColor(transaction.paymentMethod)}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        </TableCell>
        <TableCell>
          <Tooltip title="Transaction Actions">
            <IconButton size="small">
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                py: 2,
                px: 2,
                backgroundColor: isDarkMode ? "rgba(241, 90, 34, 0.1)" : "rgba(241, 90, 34, 0.04)",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{
                  color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                }}
              >
                Items Details
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: "none" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: isDarkMode ? "rgba(241, 90, 34, 0.15)" : "rgba(241, 90, 34, 0.08)",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>Item ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transaction.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row" sx={{ fontFamily: "monospace" }}>
                          {item.itemId}
                        </TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.itemQuantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice || 10)}</TableCell>
                        <TableCell>{formatCurrency((item.unitPrice || 10) * item.itemQuantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

// Stats Card Component
function StatsCard({ icon, title, value, subtitle, color = "primary", actionIcon, onActionClick }) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        height: "100%",
        border: isDarkMode ? `1px solid rgba(241, 90, 34, 0.15)` : "none",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
              }}
            >
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              {subtitle}
            </Typography>

            {actionIcon && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={actionIcon}
                onClick={onActionClick}
                sx={{ mt: 2, borderRadius: 4 }}
              >
                Transfer Funds
              </Button>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: isDarkMode ? `rgba(241, 90, 34, 0.3)` : `rgba(241, 90, 34, 0.12)`,
              borderRadius: "50%",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 2,
            }}
          >
            {React.cloneElement(icon, {
              color: isDarkMode ? "primary" : "primary",
              fontSize: "medium",
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// Bank Transfer Dialog Component
function BankTransferDialog({ open, onClose, amount }) {
  const [selectedBank, setSelectedBank] = useState("")
  const [transferAmount, setTransferAmount] = useState(amount)
  const [transferDate, setTransferDate] = useState(new Date())
  const [isProcessing, setIsProcessing] = useState(false)
  const [amountError, setAmountError] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [monthlyAmount, setMonthlyAmount] = useState(amount)

  // Get months for filter dropdown
  const months = [
    { value: "all", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  // Validate amount when it changes
  const handleAmountChange = (e) => {
    const value = Number.parseFloat(e.target.value)
    setTransferAmount(value)

    if (value > monthlyAmount) {
      setAmountError(
        `Amount exceeds the ${selectedMonth === "all" ? "total" : "monthly"} sales amount (${new Intl.NumberFormat(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          },
        ).format(monthlyAmount)})`,
      )
    } else if (value <= 0) {
      setAmountError("Amount must be greater than zero")
    } else {
      setAmountError("")
    }
  }

  // Handle month change
  const handleMonthChange = (e) => {
    const month = e.target.value
    setSelectedMonth(month)

    // Reset amount error
    setAmountError("")

    // If we have transaction data, calculate the monthly amount
    if (month === "all") {
      setMonthlyAmount(amount)
      setTransferAmount(amount)
    } else {
      // This would typically come from your transaction data
      // For now, we'll simulate it as a percentage of the total
      const monthIndex = Number.parseInt(month)
      const monthlyTotal = amount * (0.5 + monthIndex / 24) // Just a simulation
      setMonthlyAmount(monthlyTotal)
      setTransferAmount(monthlyTotal)
    }
  }

  const handleTransfer = () => {
    // Final validation before processing
    if (transferAmount <= 0) {
      setAmountError("Amount must be greater than zero")
      return
    }

    if (transferAmount > monthlyAmount) {
      setAmountError(`Amount exceeds the ${selectedMonth === "all" ? "total" : "monthly"} sales amount`)
      return
    }

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      onClose(true)
    }, 2000)
  }

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
        <AccountBalance sx={{ mr: 1 }} /> Transfer to Bank
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {isProcessing && <LinearProgress sx={{ mb: 3 }} />}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="bank-select-label">Select Bank</InputLabel>
            <Select
              labelId="bank-select-label"
              value={selectedBank}
              label="Select Bank"
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <MenuItem value="hbl">Habib Bank Limited (HBL)</MenuItem>
              <MenuItem value="ubl">United Bank Limited (UBL)</MenuItem>
              <MenuItem value="alfalah">Bank Alfalah</MenuItem>
              <MenuItem value="meezan">Meezan Bank</MenuItem>
              <MenuItem value="faysal">Faysal Bank</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="month-select-label">Select Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              label="Select Month"
              onChange={handleMonthChange}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Transfer Amount"
            type="number"
            fullWidth
            value={transferAmount}
            onChange={handleAmountChange}
            error={!!amountError}
            helperText={amountError}
            InputProps={{
              startAdornment: <AttachMoney fontSize="small" />,
            }}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {selectedMonth === "all" ? "Total Available" : "Monthly Available"}:
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(monthlyAmount)}
            </Typography>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Transfer Date"
              value={transferDate}
              onChange={(newDate) => setTransferDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              sx={{ mb: 3 }}
            />
          </LocalizationProvider>

          <TextField
            label="Transfer Notes"
            fullWidth
            multiline
            rows={2}
            placeholder="Add any notes about this transfer"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={() => onClose(false)} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransfer}
          startIcon={<Send />}
          disabled={!selectedBank || isProcessing || !!amountError}
        >
          {isProcessing ? "Processing..." : "Transfer Funds"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Filter Dialog Component
function FilterDialog({ open, onClose, onApplyFilters }) {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("all")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  const handleApply = () => {
    onApplyFilters({
      startDate,
      endDate,
      paymentMethod,
      minAmount: minAmount ? Number(minAmount) : null,
      maxAmount: maxAmount ? Number(maxAmount) : null,
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
        <FilterList sx={{ mr: 1 }} /> Filter Transactions
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Date Range
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="all">All Methods</MenuItem>
              <MenuItem value="credit card">Credit Card</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom>
            Amount Range
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Min Amount"
                type="number"
                fullWidth
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                InputProps={{
                  startAdornment: <AttachMoney fontSize="small" />,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Amount"
                type="number"
                fullWidth
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                InputProps={{
                  startAdornment: <AttachMoney fontSize="small" />,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleApply} startIcon={<FilterList />}>
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Custom Tab component to ensure badges are fully visible
function CustomTab({ label, count, isActive, ...props }) {
  const theme = useTheme()

  return (
    <Tab
      {...props}
      sx={{
        minWidth: "auto",
        padding: "12px 16px",
        marginRight: 2,
        position: "relative",
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.95rem",
      }}
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            pr: 4, // Add padding to the right to make room for the badge
          }}
        >
          <Typography
            component="span"
            sx={{
              color: isActive
                ? theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main
                : "text.primary",
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              right: -8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "999px",
              padding: "0 8px",
              minWidth: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            {count > 99 ? "99+" : count}
          </Box>
        </Box>
      }
    />
  )
}

export default function AccountsReceivable({ open = true }) {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const baseTheme = useTheme()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const theme = customTheme(baseTheme)

  // New state variables
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [bankTransferOpen, setBankTransferOpen] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [activeFilters, setActiveFilters] = useState(null)
  const [viewMode, setViewMode] = useState("table") // 'table', 'chart'
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("all")

  const menuOpen = Boolean(menuAnchorEl)

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleBankTransferOpen = () => {
    setBankTransferOpen(true)
    handleMenuClose()
  }

  const handleBankTransferClose = (success) => {
    setBankTransferOpen(false)
    if (success) {
      setSnackbarMessage("Funds transfer initiated successfully! You will receive a confirmation shortly.")
      setSnackbarOpen(true)
    }
  }

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true)
    handleMenuClose()
  }

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false)
  }

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters)
    applyFilters(filters)
  }

  const handleClearFilters = () => {
    setActiveFilters(null)
    setFilteredTransactions(transactions)
    setSelectedMonth("all")
    setSearchQuery("")
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    handleMenuClose()
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleMonthChange = (event) => {
    const month = event.target.value
    setSelectedMonth(month)

    if (month === "all") {
      // Reset to show all transactions without any month filtering
      if (activeFilters) {
        // If other filters exist, re-apply them without month filtering
        applyFilters(activeFilters)
      } else {
        // If no other filters, show all transactions
        setFilteredTransactions(transactions)
      }
    } else {
      const filtered = transactions.filter((transaction) => {
        const date = new Date(transaction.date)
        return date.getMonth() === Number.parseInt(month)
      })
      setFilteredTransactions(filtered)
    }
  }

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query) {
      setFilteredTransactions(transactions)
    } else {
      const filtered = transactions.filter(
        (transaction) =>
          transaction._id.toLowerCase().includes(query) ||
          transaction.paymentMethod.toLowerCase().includes(query) ||
          transaction.items.some((item) => item.itemName.toLowerCase().includes(query)),
      )
      setFilteredTransactions(filtered)
    }
  }

  const applyFilters = (filters) => {
    if (!filters) {
      setFilteredTransactions(transactions)
      return
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)

      // Date range filter
      if (filters.startDate && transactionDate < filters.startDate) {
        return false
      }
      if (filters.endDate && transactionDate > filters.endDate) {
        return false
      }

      // Payment method filter
      if (filters.paymentMethod !== "all" && transaction.paymentMethod !== filters.paymentMethod) {
        return false
      }

      // Amount range filter
      if (filters.minAmount !== null && transaction.total < filters.minAmount) {
        return false
      }
      if (filters.maxAmount !== null && transaction.total > filters.maxAmount) {
        return false
      }

      return true
    })

    setFilteredTransactions(filtered)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        // Try to fetch from API first
        let data = []
        try {
          const response = await fetch("/api/transactions")

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
          }

          data = await response.json()
        } catch (apiError) {
          console.warn("API fetch failed, using mock data:", apiError)
          // Mock data as fallback
          const mockTransactions = [
            {
              _id: "67e86fe458ee35014e15c37f",
              transactionID: "000018",
              date: "2023-04-15",
              total: 1250.99,
              paymentMethod: "hbl",
              items: [
                { itemId: "ITEM-001", itemName: "Laptop", itemQuantity: 1, unitPrice: 1200.99 },
                { itemId: "ITEM-002", itemName: "Mouse", itemQuantity: 1, unitPrice: 50.0 },
              ],
            },
            {
              _id: "67eaeeccde72b647b28fa934",
              transactionID: "000019",
              date: "2023-04-20",
              total: 89.97,
              paymentMethod: "cash",
              items: [{ itemId: "ITEM-003", itemName: "Keyboard", itemQuantity: 1, unitPrice: 89.97 }],
            },
            {
              _id: "67eaeef5de72b647b28faa06",
              transactionID: "000020",
              date: "2023-05-05",
              total: 2499.99,
              paymentMethod: "hbl",
              items: [{ itemId: "ITEM-004", itemName: "Desktop Computer", itemQuantity: 1, unitPrice: 2499.99 }],
            },
            {
              _id: "67eaf01fde72b647b28faad8",
              transactionID: "000021",
              date: "2023-05-12",
              total: 349.95,
              paymentMethod: "meezan",
              items: [{ itemId: "ITEM-005", itemName: "Monitor", itemQuantity: 1, unitPrice: 349.95 }],
            },
            {
              _id: "67eaf833de72b647b28fabaa",
              transactionID: "000022",
              date: "2023-06-01",
              total: 129.99,
              paymentMethod: "cash",
              items: [{ itemId: "ITEM-006", itemName: "Headphones", itemQuantity: 1, unitPrice: 129.99 }],
            },
            {
              _id: "67eaf834de72b647b28fabab",
              transactionID: "000023",
              date: "2023-06-15",
              total: 1899.97,
              paymentMethod: "loopay",
              items: [
                { itemId: "ITEM-007", itemName: "Smartphone", itemQuantity: 1, unitPrice: 999.99 },
                { itemId: "ITEM-008", itemName: "Tablet", itemQuantity: 1, unitPrice: 899.98 },
              ],
            },
            {
              _id: "67eaf835de72b647b28fabac",
              transactionID: "000024",
              date: "2023-07-02",
              total: 59.99,
              paymentMethod: "meezan",
              items: [
                { itemId: "ITEM-009", itemName: "Mouse Pad", itemQuantity: 1, unitPrice: 19.99 },
                { itemId: "ITEM-010", itemName: "USB Hub", itemQuantity: 1, unitPrice: 40.0 },
              ],
            },
            {
              _id: "67eaf836de72b647b28fabad",
              transactionID: "000025",
              date: "2023-07-10",
              total: 2999.99,
              paymentMethod: "hbl",
              items: [{ itemId: "ITEM-011", itemName: "Gaming PC", itemQuantity: 1, unitPrice: 2999.99 }],
            },
          ]
          data = mockTransactions
        }

        setTransactions(data)
        setFilteredTransactions(data)
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch transactions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // Sort transactions
  useEffect(() => {
    if (sortConfig && filteredTransactions.length > 0) {
      const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
        }

        if (sortConfig.key === "total") {
          return sortConfig.direction === "asc" ? a.total - b.total : b.total - a.total
        }

        if (sortConfig.key === "items") {
          return sortConfig.direction === "asc" ? a.items.length - b.items.length : b.items.length - a.items.length
        }

        return 0
      })

      // Only update if the sort actually changed something
      if (JSON.stringify(sortedTransactions) !== JSON.stringify(filteredTransactions)) {
        setFilteredTransactions(sortedTransactions)
      }
    }
  }, [sortConfig])

  // Calculate total sales amount
  const totalSalesAmount = transactions.reduce((total, transaction) => total + transaction.total, 0)
  const filteredTotalAmount = filteredTransactions.reduce((total, transaction) => total + transaction.total, 0)

  // Group transactions by payment method
  const paymentMethodGroups = transactions.reduce((groups, transaction) => {
    const method = transaction.paymentMethod
    if (!groups[method]) {
      groups[method] = {
        count: 0,
        total: 0,
      }
    }
    groups[method].count += 1
    groups[method].total += transaction.total
    return groups
  }, {})

  // Get most common payment method
  const getMostCommonPaymentMethod = () => {
    let mostCommon = { method: "None", count: 0 }

    Object.entries(paymentMethodGroups).forEach(([method, data]) => {
      if (data.count > mostCommon.count) {
        mostCommon = { method, count: data.count }
      }
    })

    return mostCommon.method
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Get payment methods for tab labels
  const paymentMethods = Object.keys(paymentMethodGroups)

  // Get months for filter dropdown
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <MainContentWrapper open={open}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress color="primary" />
              <Typography sx={{ mt: 2, color: "text.secondary" }}>Loading transactions...</Typography>
            </Box>
          </Box>
        </MainContentWrapper>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <MainContentWrapper open={open}>
          <Alert
            severity="error"
            sx={{ mt: 2, borderRadius: 2 }}
            action={
              <IconButton color="inherit" size="small" onClick={() => window.location.reload()}>
                <Refresh />
              </IconButton>
            }
          >
            Failed to load transactions: {error}
          </Alert>
        </MainContentWrapper>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <MainContentWrapper open={open}>
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
            pb: 4,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              pt: 2,
              pb: 2,
            }}
          >
            <Typography
  variant="h5"
  component="h1"
  sx={{
    fontWeight: 700, // Make it a bit bolder for emphasis
    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
    backgroundImage: "linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(0,204,255,1) 100%)", // Gradient background
    backgroundClip: "text", // Make the text appear with the gradient
    WebkitBackgroundClip: "text", // Ensure it works in WebKit browsers
    pb: 1,
    display: "inline-block",
    borderBottom: `3px solid ${theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main}`,
    padding: "10px 20px", // Add some padding around the text
    borderRadius: "8px", // Rounded corners
    boxShadow: theme.palette.mode === "dark" ? "0 4px 15px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.1)", // Subtle shadow for depth
    transition: "all 0.15s ease", // Smooth transition for hover effect
    ":hover": {
      transform: "scale(1.015)", // Slight zoom on hover
      boxShadow: theme.palette.mode === "dark" ? "0 8px 25px rgba(0,0,0,0.4)" : "0 8px 25px rgba(0,0,0,0.15)", // Enhance shadow on hover
    },
  }}
>
  Accounts Receivable Dashboard
</Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" color="primary" startIcon={<FilterList />} onClick={handleFilterDialogOpen}>
                Filter
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<MoreVert />}
                onClick={handleMenuClick}
                aria-controls={menuOpen ? "actions-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                Actions
              </Button>

              <Menu
                id="actions-menu"
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "actions-button",
                }}
              >
                <MenuItem onClick={handleBankTransferOpen}>
                  <AccountBalanceWallet sx={{ mr: 1 }} /> Transfer to Bank
                </MenuItem>
                <MenuItem onClick={() => handleViewModeChange("table")}>
                  <ReceiptLong sx={{ mr: 1 }} /> Table View
                </MenuItem>
                <MenuItem onClick={() => handleViewModeChange("chart")}>
                  <BarChart sx={{ mr: 1 }} /> Chart View
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                  <Download sx={{ mr: 1 }} /> Export Data
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Print sx={{ mr: 1 }} /> Print Report
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={<AttachMoney fontSize="medium" color="primary" />}
                title="Total Sales Amount"
                value={formatCurrency(totalSalesAmount)}
                subtitle={`From ${transactions.length} transactions`}
                actionIcon={<AccountBalance />}
                onActionClick={handleBankTransferOpen}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StatsCard
                icon={<Payment fontSize="medium" color="primary" />}
                title="Most Used Payment Method"
                value={getMostCommonPaymentMethod()}
                subtitle={`Used in ${paymentMethodGroups[getMostCommonPaymentMethod()]?.count || 0} transactions`}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StatsCard
                icon={<TrendingUp fontSize="medium" color="primary" />}
                title="Average Transaction Value"
                value={
                  transactions.length > 0 ? formatCurrency(totalSalesAmount / transactions.length) : formatCurrency(0)
                }
                subtitle="Across all transactions"
              />
            </Grid>
          </Grid>

          {/* Filter controls */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="month-select-label">Filter by Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    value={selectedMonth}
                    label="Filter by Month"
                    onChange={handleMonthChange}
                  >
                    <MenuItem value="all">All Months</MenuItem>
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-select-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-select-label"
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    label="Sort By"
                    onChange={(e) => {
                      const [key, direction] = e.target.value.split("-")
                      setSortConfig({ key, direction })
                    }}
                  >
                    <MenuItem value="date-desc">Date (Newest First)</MenuItem>
                    <MenuItem value="date-asc">Date (Oldest First)</MenuItem>
                    <MenuItem value="total-desc">Amount (High to Low)</MenuItem>
                    <MenuItem value="total-asc">Amount (Low to High)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleClearFilters}
                  disabled={!activeFilters && selectedMonth === "all" && !searchQuery}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>

            {activeFilters && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                <Chip label="Active Filters" color="primary" size="small" sx={{ mr: 1 }} />
                {activeFilters.startDate && (
                  <Chip
                    label={`From: ${new Date(activeFilters.startDate).toLocaleDateString()}`}
                    size="small"
                    onDelete={() => {
                      const newFilters = { ...activeFilters, startDate: null }
                      setActiveFilters(newFilters)
                      applyFilters(newFilters)
                    }}
                    sx={{ mr: 1 }}
                  />
                )}
                {activeFilters.endDate && (
                  <Chip
                    label={`To: ${new Date(activeFilters.endDate).toLocaleDateString()}`}
                    size="small"
                    onDelete={() => {
                      const newFilters = { ...activeFilters, endDate: null }
                      setActiveFilters(newFilters)
                      applyFilters(newFilters)
                    }}
                    sx={{ mr: 1 }}
                  />
                )}
                {activeFilters.paymentMethod !== "all" && (
                  <Chip
                    label={`Method: ${activeFilters.paymentMethod}`}
                    size="small"
                    onDelete={() => {
                      const newFilters = { ...activeFilters, paymentMethod: "all" }
                      setActiveFilters(newFilters)
                      applyFilters(newFilters)
                    }}
                    sx={{ mr: 1 }}
                  />
                )}
              </Box>
            )}
          </Paper>

          <Box
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: theme.palette.mode === "dark" ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.03)",
              border: theme.palette.mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="transaction tabs"
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                sx={{
                  px: 2,
                  pt: 1,
                }}
              >
                <CustomTab
                  label="All Transactions"
                  count={filteredTransactions.length > 99 ? 99 : filteredTransactions.length}
                  isActive={tabValue === 0}
                  id="tab-0"
                  aria-controls="tabpanel-0"
                />
                {paymentMethods.map((method, index) => (
                  <CustomTab
                    key={method}
                    label={method}
                    count={paymentMethodGroups[method].count}
                    isActive={tabValue === index + 1}
                    id={`tab-${index + 1}`}
                    aria-controls={`tabpanel-${index + 1}`}
                  />
                ))}
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 0 }}
                  >
                    All Transactions
                  </Typography>

                  <Card
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.15)" : "rgba(241, 90, 34, 0.08)",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.3)" : "rgba(241, 90, 34, 0.2)"}`,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 0.5 }}>
                      FILTERED TOTAL
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {formatCurrency(filteredTotalAmount)}
                    </Typography>
                  </Card>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </Typography>

                {filteredTransactions.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      mt: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "dark" ? `rgba(241, 90, 34, 0.15)` : `rgba(241, 90, 34, 0.1)`,
                          }}
                        >
                          <TableCell width="50px" />
                          <TableCell sx={{ fontWeight: 600 }}>Database ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                          <TableCell sx={{ fontWeight: 600, cursor: "pointer" }} onClick={() => handleSort("date")}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              Date
                              {sortConfig.key === "date" &&
                                (sortConfig.direction === "asc" ? (
                                  <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                                ) : (
                                  <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                                ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, cursor: "pointer" }} onClick={() => handleSort("items")}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              Items
                              {sortConfig.key === "items" &&
                                (sortConfig.direction === "asc" ? (
                                  <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                                ) : (
                                  <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                                ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, cursor: "pointer" }} onClick={() => handleSort("total")}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              Total
                              {sortConfig.key === "total" &&
                                (sortConfig.direction === "asc" ? (
                                  <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                                ) : (
                                  <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                                ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                          <TableCell width="50px" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TransactionRow key={transaction._id} transaction={transaction} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      color: "text.secondary",
                      backgroundColor: theme.palette.card.main,
                      borderRadius: 2,
                      mt: 2,
                    }}
                  >
                    <Payment sx={{ fontSize: 48, color: theme.palette.primary.main + "60", mb: 2 }} />
                    <Typography>No transactions found matching your filters</Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </Box>
                )}
              </Paper>
            </TabPanel>

            {paymentMethods.map((method, index) => (
              <TabPanel key={method} value={tabValue} index={index + 1}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 0 }}
                    >
                      {method} Transactions
                    </Typography>

                    <Card
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.15)" : "rgba(241, 90, 34, 0.08)",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.3)" : "rgba(241, 90, 34, 0.2)"}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 0.5 }}>
                        FILTERED TOTAL
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {formatCurrency(paymentMethodGroups[method].total)}
                      </Typography>
                    </Card>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Showing {paymentMethodGroups[method].count} transactions with a total of{" "}
                    {formatCurrency(paymentMethodGroups[method].total)}
                  </Typography>

                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      mt: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "dark" ? `rgba(241, 90, 34, 0.15)` : `rgba(241, 90, 34, 0.1)`,
                          }}
                        >
                          <TableCell width="50px" />
                          <TableCell sx={{ fontWeight: 600 }}>Database ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                          <TableCell width="50px" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTransactions
                          .filter((transaction) => transaction.paymentMethod === method)
                          .map((transaction) => (
                            <TransactionRow key={transaction._id} transaction={transaction} />
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </TabPanel>
            ))}
          </Box>
        </Box>

        {/* Bank Transfer Dialog */}
        <BankTransferDialog open={bankTransferOpen} onClose={handleBankTransferClose} amount={totalSalesAmount} />

        {/* Filter Dialog */}
        <FilterDialog open={filterDialogOpen} onClose={handleFilterDialogClose} onApplyFilters={handleApplyFilters} />

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle sx={{ mr: 1 }} />
              {snackbarMessage}
            </Box>
          }
        />
      </MainContentWrapper>
    </ThemeProvider>
  )
}
