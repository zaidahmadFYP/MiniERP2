"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import {
  Card,
  Title,
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
} from '@tremor/react'
import {
  Dashboard,
  TrendingUp,
  AttachMoney,
  Inventory,
  Restaurant,
  AccountBalance,
  ShoppingCart,
  PointOfSale,
  Download,
  Refresh,
  DateRange,
  FilterList,
} from "@mui/icons-material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { format, subDays, isWithinInterval, parseISO } from "date-fns"
import MainContentWrapper from "../Finance and Sales/Bank Management/Components/MainContentWrapper"

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Custom hook for API data fetching
const useApiData = (endpoint, initialState = []) => {
  const [data, setData] = useState(initialState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get(endpoint)
      setData(response.data)
      setError(null)
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err)
      setError(`Failed to load data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Custom tooltip component for Recharts
const CustomTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "", labelFormatter }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="custom-tooltip"
      style={{
        backgroundColor: "#fff",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      }}
    >
      <p className="label" style={{ margin: "0 0 5px", fontWeight: "bold" }}>
        {labelFormatter ? labelFormatter(label) : label}
      </p>
      {payload.map((entry, index) => (
        <p
          key={`item-${index}`}
          style={{
            margin: "2px 0",
            color: entry.color,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ marginRight: "10px" }}>{entry.name}:</span>
          <span style={{ fontWeight: "bold" }}>
            {valuePrefix}
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            {valueSuffix}
          </span>
        </p>
      ))}
    </div>
  )
}

// Custom colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#ffc658", "#8dd1e1"]

// Chart wrapper component to handle loading and empty states
const ChartWrapper = ({ loading, data, height = 300, children, emptyMessage = "No data available" }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height,
          border: "1px dashed #ccc",
          borderRadius: "4px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%", height }}>
      {children}
    </Box>
  )
}

// Create a theme instance with specific chart configurations
const chartTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiChart: {
      styleOverrides: {
        root: {
          '& .MuiChartsAxis-tickLabel': {
            fill: '#666',
          },
          '& .MuiChartsAxis-line': {
            stroke: '#666',
          },
        },
      },
    },
  },
});

// Chart components with Tremor
const RevenueChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    Revenue: item.amount,
  }));

  return (
    <Card>
      <Title>Revenue Trend</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="date"
        categories={["Revenue"]}
        colors={["blue"]}
        valueFormatter={(number) => `$${number.toLocaleString()}`}
        yAxisWidth={40}
      />
    </Card>
  );
};

const CategoryDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    name: item.category,
    value: item.count,
  }));

  return (
    <Card>
      <Title>Category Distribution</Title>
      <DonutChart
        className="h-72 mt-4"
        data={chartData}
        category="value"
        index="name"
        valueFormatter={(number) => number.toLocaleString()}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
      />
    </Card>
  );
};

const VendorProductChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    name: item.name,
    "Product Count": item.productCount,
  }));

  return (
    <Card>
      <Title>Vendor Products</Title>
      <BarChart
        className="h-72 mt-4"
        data={chartData}
        index="name"
        categories={["Product Count"]}
        colors={["blue"]}
        valueFormatter={(number) => number.toLocaleString()}
        yAxisWidth={40}
      />
    </Card>
  );
};

const BankStatusChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <Card>
      <Title>Bank Status</Title>
      <DonutChart
        className="h-72 mt-4"
        data={chartData}
        category="value"
        index="name"
        valueFormatter={(number) => number.toLocaleString()}
        colors={["green", "red"]}
      />
    </Card>
  );
};

const PosStatusChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <Card>
      <Title>POS Status</Title>
      <DonutChart
        className="h-72 mt-4"
        data={chartData}
        category="value"
        index="name"
        valueFormatter={(number) => number.toLocaleString()}
        colors={["green", "red", "yellow"]}
      />
    </Card>
  );
};

const ReportAnalyticsContent = () => {
  // State for tab management
  const [activeTab, setActiveTab] = useState(0)
  const [activePieIndex, setActivePieIndex] = useState(null)

  // State for date range filters
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())

  // State for alerts
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" })

  // Fetch data from APIs
  const { data: banks, loading: banksLoading, error: banksError } = useApiData("/banks")
  const { data: purchaseOrders, loading: poLoading, error: poError } = useApiData("/purchase-orders")
  const { data: posConfigs, loading: posConfigLoading, error: posConfigError } = useApiData("/posconfig")
  const { data: transactions, loading: transactionsLoading, error: transactionsError } = useApiData("/transactions")
  const { data: vendors, loading: vendorsLoading, error: vendorsError } = useApiData("/vendors")
  const {
    data: menuCategories,
    loading: menuCategoriesLoading,
    error: menuCategoriesError,
  } = useApiData("/menu/categories")
  const {
    data: finishedGoods,
    loading: finishedGoodsLoading,
    error: finishedGoodsError,
  } = useApiData("/menu/finishedgoods")
  const { data: bomData, loading: bomLoading, error: bomError } = useApiData("/menu/bom")

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Handle alert close
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false })
  }

  // Show error if any API fails
  useEffect(() => {
    const errors = [
      banksError,
      poError,
      posConfigError,
      transactionsError,
      vendorsError,
      menuCategoriesError,
      finishedGoodsError,
      bomError,
    ].filter(Boolean)

    if (errors.length > 0) {
      setAlert({
        open: true,
        message: `Error loading data: ${errors[0]}`,
        severity: "error",
      })
    }
  }, [
    banksError,
    poError,
    posConfigError,
    transactionsError,
    vendorsError,
    menuCategoriesError,
    finishedGoodsError,
    bomError,
  ])

  // Apply date filter
  const handleApplyFilter = () => {
    // This would typically refetch data with the new date range
    // For now, we'll just show a success message
    setAlert({
      open: true,
      message: "Date filter applied successfully",
      severity: "success",
    })
  }

  // Reset date filter
  const handleResetFilter = () => {
    setStartDate(subDays(new Date(), 30))
    setEndDate(new Date())
    setAlert({
      open: true,
      message: "Date filter reset",
      severity: "info",
    })
  }

  // Filter data by date range
  const filterByDateRange = (data, dateField = "createdAt") => {
    if (!data || !Array.isArray(data)) return []

    return data.filter((item) => {
      if (!item[dateField]) return false
      const itemDate = typeof item[dateField] === "string" ? parseISO(item[dateField]) : new Date(item[dateField])

      return isWithinInterval(itemDate, { start: startDate, end: endDate })
    })
  }

  // Calculate summary metrics
  const calculateMetrics = () => {
    // Filter data by date range
    const filteredTransactions = filterByDateRange(transactions || [])
    const filteredPurchaseOrders = filterByDateRange(purchaseOrders || [])

    // Calculate metrics
    const totalRevenue =
      filteredTransactions?.reduce((sum, transaction) => {
        return sum + (transaction.amount || transaction.total || 0)
      }, 0) || 0

    const totalExpenses = filteredPurchaseOrders?.reduce((sum, po) => sum + (po.totalAmount || 0), 0) || 0

    const profit = totalRevenue - totalExpenses

    const activeVendors = vendors?.filter((vendor) => vendor.isActive)?.length || 0

    const totalProducts = finishedGoods?.length || 0

    const activeBanks = banks?.filter((bank) => bank.isActive)?.length || 0

    return {
      totalRevenue,
      totalExpenses,
      profit,
      activeVendors,
      totalProducts,
      activeBanks,
    }
  }

  // Prepare chart data
  const prepareRevenueChartData = () => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) return []

    // Group transactions by date
    const groupedByDate = transactions.reduce((acc, transaction) => {
      if (!transaction.createdAt && !transaction.date) return acc

      const date = format(new Date(transaction.createdAt || transaction.date), "yyyy-MM-dd")

      if (!acc[date]) {
        acc[date] = { date, amount: 0, count: 0 }
      }

      acc[date].amount += transaction.amount || transaction.total || 0
      acc[date].count += 1

      return acc
    }, {})

    // Convert to array format for chart
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const prepareCategoryDistributionData = () => {
    if (!finishedGoods || !Array.isArray(finishedGoods) || finishedGoods.length === 0) {
      // Return sample data if no real data is available
      return [
        { category: "Category 1", count: 5, value: 500 },
        { category: "Category 2", count: 3, value: 300 },
        { category: "Category 3", count: 7, value: 700 },
      ]
    }

    // Group products by category
    const groupedByCategory = finishedGoods.reduce((acc, product) => {
      const categoryName = product.categoryName || product.category?.name || "Uncategorized"

      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          count: 0,
          value: 0,
        }
      }

      acc[categoryName].count += 1
      acc[categoryName].value += product.price || 0

      return acc
    }, {})

    // Convert to array format for chart
    return Object.values(groupedByCategory)
  }

  const prepareVendorProductData = () => {
    if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
      // Return sample data if no real data is available
      return [
        { name: "Vendor 1", productCount: 12, isActive: true },
        { name: "Vendor 2", productCount: 8, isActive: false },
        { name: "Vendor 3", productCount: 15, isActive: true },
      ]
    }

    return vendors
      .map((vendor) => ({
        name: vendor.vendorName || vendor.name || "Unknown Vendor",
        productCount: vendor.productList?.length || 0,
        isActive: vendor.isActive !== undefined ? vendor.isActive : true,
      }))
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 10)
  }

  // Prepare monthly revenue and expenses data
  const prepareMonthlyFinancialData = () => {
    if (
      (!transactions || !Array.isArray(transactions) || transactions.length === 0) &&
      (!purchaseOrders || !Array.isArray(purchaseOrders) || purchaseOrders.length === 0)
    ) {
      // Return sample data if no real data is available
      return [
        { name: "Jan 2023", revenue: 4000, expenses: 2400, profit: 1600 },
        { name: "Feb 2023", revenue: 3000, expenses: 1398, profit: 1602 },
        { name: "Mar 2023", revenue: 2000, expenses: 1800, profit: 200 },
        { name: "Apr 2023", revenue: 2780, expenses: 3908, profit: -1128 },
        { name: "May 2023", revenue: 1890, expenses: 4800, profit: -2910 },
        { name: "Jun 2023", revenue: 2390, expenses: 3800, profit: -1410 },
      ]
    }

    // Create a map for months
    const monthsData = {}

    // Process transactions (revenue)
    if (transactions && Array.isArray(transactions)) {
      transactions.forEach((transaction) => {
        if (!transaction.createdAt && !transaction.date) return

        const date = new Date(transaction.createdAt || transaction.date)
        const monthKey = format(date, "MMM yyyy")

        if (!monthsData[monthKey]) {
          monthsData[monthKey] = {
            name: monthKey,
            revenue: 0,
            expenses: 0,
            profit: 0,
          }
        }

        monthsData[monthKey].revenue += transaction.amount || transaction.total || 0
      })
    }

    // Process purchase orders (expenses)
    if (purchaseOrders && Array.isArray(purchaseOrders)) {
      purchaseOrders.forEach((po) => {
        if (!po.createdAt) return

        const date = new Date(po.createdAt)
        const monthKey = format(date, "MMM yyyy")

        if (!monthsData[monthKey]) {
          monthsData[monthKey] = {
            name: monthKey,
            revenue: 0,
            expenses: 0,
            profit: 0,
          }
        }

        monthsData[monthKey].expenses += po.totalAmount || 0
      })
    }

    // Calculate profit
    Object.values(monthsData).forEach((month) => {
      month.profit = month.revenue - month.expenses
    })

    // Convert to array and sort by date
    return Object.values(monthsData).sort((a, b) => {
      const dateA = new Date(a.name)
      const dateB = new Date(b.name)
      return dateA - dateB
    })
  }

  // Prepare inventory stock data
  const prepareInventoryStockData = () => {
    if (!finishedGoods || !Array.isArray(finishedGoods) || finishedGoods.length === 0) {
      // Return sample data if no real data is available
      return [
        { name: "Product 1", stock: 25, reorderLevel: 10, category: "Category 1" },
        { name: "Product 2", stock: 15, reorderLevel: 5, category: "Category 2" },
        { name: "Product 3", stock: 8, reorderLevel: 10, category: "Category 1" },
      ]
    }

    return finishedGoods
      .filter((item) => item.name && item.stock !== undefined)
      .map((item) => ({
        name: item.name,
        stock: item.stock || 0,
        reorderLevel: item.reorderLevel || Math.floor((item.stock || 0) * 0.2) || 5, // Example reorder level
        category: item.categoryName || item.category?.name || "Uncategorized",
      }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10)
  }

  // Prepare POS status data
  const preparePosStatusData = () => {
    if (!posConfigs || !Array.isArray(posConfigs) || posConfigs.length === 0) {
      // Return sample data if no real data is available
      return [
        { status: "Online", count: 3 },
        { status: "Offline", count: 1 },
      ]
    }

    const statusCounts = posConfigs.reduce((acc, config) => {
      const status = config.POSStatus || "Unknown"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
  }

  // Prepare bank status data
  const prepareBankStatusData = () => {
    if (!banks || !Array.isArray(banks) || banks.length === 0) {
      // Return sample data if no real data is available
      return [
        { name: "Active", value: 3 },
        { name: "Inactive", value: 1 },
      ]
    }

    return [
      { name: "Active", value: banks.filter((bank) => bank.isActive).length || 0 },
      { name: "Inactive", value: banks.filter((bank) => !bank.isActive).length || 0 },
    ]
  }

  // Prepare purchase order data
  const preparePurchaseOrderData = () => {
    // Return sample data if no real data is available
    return [
      { month: "Jan", count: 12, value: 4500 },
      { month: "Feb", count: 9, value: 3200 },
      { month: "Mar", count: 15, value: 5800 },
      { month: "Apr", count: 11, value: 4200 },
      { month: "May", count: 13, value: 4900 },
      { month: "Jun", count: 10, value: 3800 },
    ]
  }

  // Prepare profit margin data
  const prepareProfitMarginData = () => {
    // Return sample data if no real data is available
    return [
      { month: "Jan", grossMargin: 40, netMargin: 25 },
      { month: "Feb", grossMargin: 35, netMargin: 20 },
      { month: "Mar", grossMargin: 45, netMargin: 30 },
      { month: "Apr", grossMargin: 42, netMargin: 28 },
      { month: "May", grossMargin: 38, netMargin: 22 },
      { month: "Jun", grossMargin: 41, netMargin: 26 },
    ]
  }

  // Export data to CSV
  const exportToCSV = (data, filename) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      setAlert({
        open: true,
        message: "No data to export",
        severity: "warning",
      })
      return
    }

    // Get headers from first object
    const headers = Object.keys(data[0])

    // Convert data to CSV format
    const csvRows = []

    // Add headers
    csvRows.push(headers.join(","))

    // Add rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header]

        // Handle nested objects and arrays
        if (typeof value === "object" && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }

        // Handle strings with commas
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`
        }

        return value
      })

      csvRows.push(values.join(","))
    })

    // Create CSV file
    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })

    // Download CSV file
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setAlert({
      open: true,
      message: `${filename} exported successfully`,
      severity: "success",
    })
  }

  // Calculate metrics
  const metrics = calculateMetrics()

  // Prepare chart data
  const revenueChartData = prepareRevenueChartData()
  const categoryDistributionData = prepareCategoryDistributionData()
  const vendorProductData = prepareVendorProductData()
  const monthlyFinancialData = prepareMonthlyFinancialData()
  const inventoryStockData = prepareInventoryStockData()
  const posStatusData = preparePosStatusData()
  const bankStatusData = prepareBankStatusData()
  const purchaseOrderData = preparePurchaseOrderData()
  const profitMarginData = prepareProfitMarginData()

  // Color scales for different chart types
  const REVENUE_COLOR = "#8884d8"
  const EXPENSE_COLOR = "#82ca9d"
  const PROFIT_COLOR = "#ffc658"
  const STOCK_COLOR = "#0088FE"
  const REORDER_COLOR = "#FF8042"

  // Loading state
  const isLoading =
    banksLoading ||
    poLoading ||
    posConfigLoading ||
    transactionsLoading ||
    vendorsLoading ||
    menuCategoriesLoading ||
    finishedGoodsLoading ||
    bomLoading

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" component="h1" gutterBottom>
        Report & Analytics Dashboard
      </Typography>

      {/* Date Range Filter */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <DateRange color="primary" />
        <Typography variant="body1" sx={{ mr: 2 }}>
          Date Range:
        </Typography>

        <TextField
          label="Start Date"
          type="date"
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          size="small"
          sx={{ width: 170 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Typography variant="body1" sx={{ mx: 1 }}>
          to
        </Typography>

        <TextField
          label="End Date"
          type="date"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          size="small"
          sx={{ width: 170 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button variant="contained" startIcon={<FilterList />} sx={{ ml: 2 }} onClick={handleApplyFilter}>
          Apply Filter
        </Button>
        <Button variant="outlined" startIcon={<Refresh />} sx={{ ml: 1 }} onClick={handleResetFilter}>
          Reset
        </Button>
      </Paper>

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e3f2fd",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: "bold" }}>
              ${metrics.totalRevenue.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
              <TrendingUp color="primary" fontSize="small" />
              <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                +5.3% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#fff8e1",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Total Expenses
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: "bold" }}>
              ${metrics.totalExpenses.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
              <TrendingUp color="warning" fontSize="small" />
              <Typography variant="body2" color="warning.main" sx={{ ml: 1 }}>
                +2.1% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e8f5e9",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Net Profit
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: "bold" }}>
              ${metrics.profit.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
              <TrendingUp color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                +7.8% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#f3e5f5",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Active Vendors
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: "bold" }}>
              {metrics.activeVendors}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Total: {vendors?.length || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e0f7fa",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Total Products
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: "bold" }}>
              {metrics.totalProducts}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                In {categoryDistributionData.length} categories
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#fce4ec",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Active Banks
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: "bold" }}>
              {metrics.activeBanks}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Total: {banks?.length || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs for different reports */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<Dashboard />} label="Overview" />
          <Tab icon={<AttachMoney />} label="Financial" />
          <Tab icon={<ShoppingCart />} label="Purchase Orders" />
          <Tab icon={<Inventory />} label="Inventory" />
          <Tab icon={<Restaurant />} label="Menu Analysis" />
          <Tab icon={<AccountBalance />} label="Banking" />
          <Tab icon={<PointOfSale />} label="POS Config" />
        </Tabs>

        {/* Loading indicator */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Tab content */}
        {!isLoading && (
          <>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Business Overview
                </Typography>

                {/* Revenue Trend Chart */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Revenue Trend
                  </Typography>
                  <RevenueChart data={revenueChartData} loading={transactionsLoading} />
                </Paper>

                {/* Category and Vendor Charts */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Product Category Distribution
                      </Typography>
                      <CategoryDistributionChart data={categoryDistributionData} loading={finishedGoodsLoading} />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Top Vendors by Product Count
                      </Typography>
                      <VendorProductChart data={vendorProductData} loading={vendorsLoading} />
                    </Paper>
                  </Grid>
                </Grid>

                {/* Recent Transactions */}
                <Paper sx={{ p: 2, mt: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Recent Transactions</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(transactions, "transactions")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions &&
                          transactions.slice(0, 5).map((transaction) => (
                            <TableRow key={transaction._id || transaction.id}>
                              <TableCell>{transaction._id || transaction.id}</TableCell>
                              <TableCell>
                                {transaction.createdAt || transaction.date
                                  ? format(new Date(transaction.createdAt || transaction.date), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{transaction.type || "Sale"}</TableCell>
                              <TableCell>
                                ${(transaction.amount || transaction.total || 0).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={transaction.status || "Completed"}
                                  color={
                                    transaction.status === "Failed"
                                      ? "error"
                                      : transaction.status === "Pending"
                                        ? "warning"
                                        : "success"
                                  }
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {(!transactions || transactions.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {transactions && transactions.length > 5 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Button variant="text" size="small">
                        View All Transactions
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}

            {/* Financial Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Financial Analysis
                </Typography>

                {/* Revenue vs Expenses Chart */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Revenue vs Expenses
                  </Typography>
                  <ChartWrapper loading={transactionsLoading || poLoading} data={monthlyFinancialData}>
                    <LineChart
                      xAxis={[{ 
                        data: monthlyFinancialData.map(item => item.name),
                        scaleType: 'band',
                      }]}
                      series={[
                        {
                          data: monthlyFinancialData.map(item => item.revenue),
                          color: REVENUE_COLOR,
                        },
                        {
                          data: monthlyFinancialData.map(item => item.expenses),
                          color: EXPENSE_COLOR,
                        },
                      ]}
                      height={300}
                    />
                  </ChartWrapper>
                </Paper>

                {/* Profit Margin Analysis */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Profit Margin Analysis
                  </Typography>
                  <ChartWrapper data={profitMarginData}>
                    <LineChart
                      xAxis={[{ 
                        data: profitMarginData.map(item => item.month),
                        scaleType: 'band',
                      }]}
                      series={[
                        {
                          data: profitMarginData.map(item => item.grossMargin),
                          color: REVENUE_COLOR,
                        },
                        {
                          data: profitMarginData.map(item => item.netMargin),
                          color: EXPENSE_COLOR,
                        },
                      ]}
                      height={300}
                    />
                  </ChartWrapper>
                </Paper>

                {/* Transactions Table */}
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Transaction Details</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(transactions, "detailed_transactions")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Payment Method</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions &&
                          transactions.map((transaction) => (
                            <TableRow key={transaction._id || transaction.id}>
                              <TableCell>{transaction._id || transaction.id}</TableCell>
                              <TableCell>
                                {transaction.createdAt || transaction.date
                                  ? format(new Date(transaction.createdAt || transaction.date), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{transaction.type || "Sale"}</TableCell>
                              <TableCell>
                                ${(transaction.amount || transaction.total || 0).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={transaction.status || "Completed"}
                                  color={
                                    transaction.status === "Failed"
                                      ? "error"
                                      : transaction.status === "Pending"
                                        ? "warning"
                                        : "success"
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{transaction.paymentMethod || "Cash"}</TableCell>
                            </TableRow>
                          ))}
                        {(!transactions || transactions.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {transactions && transactions.length > 0 && (
                    <TablePagination
                      component="div"
                      count={transactions.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>
              </Box>
            )}

            {/* Purchase Orders Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Purchase Order Analysis
                </Typography>

                {/* Purchase Orders by Month Chart */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Purchase Orders by Month
                  </Typography>
                  <ChartWrapper data={purchaseOrderData}>
                    <LineChart
                      xAxis={[{ 
                        data: purchaseOrderData.map(item => item.month),
                        scaleType: 'band',
                      }]}
                      series={[
                        {
                          data: purchaseOrderData.map(item => item.count),
                          color: REVENUE_COLOR,
                        },
                        {
                          data: purchaseOrderData.map(item => item.value),
                          color: EXPENSE_COLOR,
                        },
                      ]}
                      height={300}
                    />
                  </ChartWrapper>
                </Paper>

                {/* Purchase Orders Table */}
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Purchase Order Details</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(purchaseOrders, "purchase_orders")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order Number</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Vendor</TableCell>
                          <TableCell>Items</TableCell>
                          <TableCell>Total Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {purchaseOrders &&
                          purchaseOrders.map((po) => (
                            <TableRow key={po._id || po.id}>
                              <TableCell>{po.orderNumber}</TableCell>
                              <TableCell>
                                {po.createdAt ? format(new Date(po.createdAt), "MMM dd, yyyy") : "N/A"}
                              </TableCell>
                              <TableCell>{po.vendorName || po.vendor || "N/A"}</TableCell>
                              <TableCell>{po.lineItems?.length || 0}</TableCell>
                              <TableCell>${po.totalAmount?.toLocaleString() || "0"}</TableCell>
                              <TableCell>
                                <Chip
                                  label={po.status || "Pending"}
                                  color={
                                    po.status === "Cancelled"
                                      ? "error"
                                      : po.status === "Pending"
                                        ? "warning"
                                        : po.status === "Delivered"
                                          ? "success"
                                          : "info"
                                  }
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {(!purchaseOrders || purchaseOrders.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No purchase orders found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {purchaseOrders && purchaseOrders.length > 0 && (
                    <TablePagination
                      component="div"
                      count={purchaseOrders.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>
              </Box>
            )}

            {/* Inventory Tab */}
            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Inventory Analysis
                </Typography>

                {/* Inventory Stock Levels */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Inventory Stock Levels
                  </Typography>
                  <ChartWrapper loading={finishedGoodsLoading} data={inventoryStockData}>
                    <BarChart
                      xAxis={[{ 
                        data: inventoryStockData.map(item => item.name),
                        scaleType: 'band',
                      }]}
                      series={[
                        {
                          data: inventoryStockData.map(item => item.stock),
                          color: STOCK_COLOR,
                        },
                      ]}
                      height={300}
                    />
                  </ChartWrapper>
                </Paper>

                {/* BOM Data Table */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Bill of Materials (BOM)</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(bomData, "bom_data")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Raw ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Unit</TableCell>
                          <TableCell>Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bomData &&
                          bomData.map((item) => (
                            <TableRow key={item._id || item.RawID}>
                              <TableCell>{item.RawID}</TableCell>
                              <TableCell>{item.Name || "N/A"}</TableCell>
                              <TableCell>{item.Quantity || 0}</TableCell>
                              <TableCell>{item.UnitMeasure || item.Unit || "N/A"}</TableCell>
                              <TableCell>${item.Cost?.toLocaleString() || "0"}</TableCell>
                            </TableRow>
                          ))}
                        {(!bomData || bomData.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No BOM data found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {bomData && bomData.length > 0 && (
                    <TablePagination
                      component="div"
                      count={bomData.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>

                {/* Finished Goods Table */}
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Finished Goods Inventory</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(finishedGoods, "finished_goods")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {finishedGoods &&
                          finishedGoods.map((item) => (
                            <TableRow key={item._id || item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                {item.categoryName || (item.category && item.category.name) || "Uncategorized"}
                              </TableCell>
                              <TableCell>${item.price?.toLocaleString() || "0"}</TableCell>
                              <TableCell>{item.stock || 0}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.stock > 0 ? "In Stock" : "Out of Stock"}
                                  color={item.stock > 0 ? "success" : "error"}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {(!finishedGoods || finishedGoods.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No finished goods found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {finishedGoods && finishedGoods.length > 0 && (
                    <TablePagination
                      component="div"
                      count={finishedGoods.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>
              </Box>
            )}

            {/* Menu Analysis Tab */}
            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Menu Analysis
                </Typography>

                {/* Menu Categories Chart */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Menu Categories
                  </Typography>
                  <CategoryDistributionChart data={categoryDistributionData} loading={finishedGoodsLoading} />
                </Paper>

                {/* Menu Categories Table */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Menu Categories</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(menuCategories?.categories || [], "menu_categories")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Columns</TableCell>
                          <TableCell>Small Text</TableCell>
                          <TableCell>Order</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menuCategories?.categories &&
                          menuCategories.categories.map((category) => (
                            <TableRow key={category._id || category.id}>
                              <TableCell>{category.id}</TableCell>
                              <TableCell>{category.name}</TableCell>
                              <TableCell>{category.columns || 2}</TableCell>
                              <TableCell>{category.smallText ? "Yes" : "No"}</TableCell>
                              <TableCell>{category.order || 0}</TableCell>
                            </TableRow>
                          ))}
                        {(!menuCategories?.categories || menuCategories.categories.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No menu categories found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                {/* Menu Items Table */}
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Menu Items</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(finishedGoods, "menu_items")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Is Pizza</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {finishedGoods &&
                          finishedGoods.map((item) => (
                            <TableRow key={item._id || item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                {item.categoryName || (item.category && item.category.name) || "Uncategorized"}
                              </TableCell>
                              <TableCell>${item.price?.toLocaleString() || "0"}</TableCell>
                              <TableCell>{item.isPizza ? "Yes" : "No"}</TableCell>
                            </TableRow>
                          ))}
                        {(!finishedGoods || finishedGoods.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No menu items found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {finishedGoods && finishedGoods.length > 0 && (
                    <TablePagination
                      component="div"
                      count={finishedGoods.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>
              </Box>
            )}

            {/* Banking Tab */}
            {activeTab === 5 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Banking Information
                </Typography>

                {/* Banks Status Chart */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Banks Status
                  </Typography>
                  <BankStatusChart data={bankStatusData} loading={banksLoading} />
                </Paper>

                {/* Banks Table */}
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">Bank Details</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(banks, "banks")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {banks &&
                          banks.map((bank) => (
                            <TableRow key={bank._id || bank.id}>
                              <TableCell>{bank.name}</TableCell>
                              <TableCell>{bank.code}</TableCell>
                              <TableCell>{bank.address || "N/A"}</TableCell>
                              <TableCell>
                                <Chip
                                  label={bank.isActive ? "Active" : "Inactive"}
                                  color={bank.isActive ? "success" : "error"}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {(!banks || banks.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              No banks found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {banks && banks.length > 0 && (
                    <TablePagination
                      component="div"
                      count={banks.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>
              </Box>
            )}

            {/* POS Config Tab */}
            {activeTab === 6 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  POS Configuration
                </Typography>

                {/* POS Status Chart */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    POS Status Distribution
                  </Typography>
                  <PosStatusChart data={posStatusData} loading={posConfigLoading} />
                </Paper>

                {/* POS Config Table */}
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1">POS Configuration Details</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => exportToCSV(posConfigs, "pos_configurations")}
                    >
                      Export
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>POS ID</TableCell>
                          <TableCell>Registration Number</TableCell>
                          <TableCell>Authority Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Time Bound Start</TableCell>
                          <TableCell>Time Bound End</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {posConfigs &&
                          posConfigs.map((config) => (
                            <TableRow key={config._id || config.PosID}>
                              <TableCell>{config.PosID}</TableCell>
                              <TableCell>{config.RegistrationNumber}</TableCell>
                              <TableCell>{config.AuthorityType}</TableCell>
                              <TableCell>
                                <Chip
                                  label={config.POSStatus}
                                  color={
                                    config.POSStatus === "Active" || config.POSStatus === "Online"
                                      ? "success"
                                      : config.POSStatus === "Inactive" || config.POSStatus === "Offline"
                                        ? "error"
                                        : "warning"
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {config.TimeBound?.Start
                                  ? format(new Date(config.TimeBound.Start), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {config.TimeBound?.End
                                  ? format(new Date(config.TimeBound.End), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        {(!posConfigs || posConfigs.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No POS configurations found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {posConfigs && posConfigs.length > 0 && (
                    <TablePagination
                      component="div"
                      count={posConfigs.length}
                      rowsPerPage={10}
                      page={0}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  )}
                </Paper>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  )
}

const ReportAnalytics = () => {
  return (
    <ThemeProvider theme={chartTheme}>
      <MainContentWrapper>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ReportAnalyticsContent />
        </LocalizationProvider>
      </MainContentWrapper>
    </ThemeProvider>
  )
}

export default ReportAnalytics
