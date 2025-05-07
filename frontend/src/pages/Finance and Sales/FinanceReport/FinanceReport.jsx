import { useState, useEffect } from "react"
import { Box, Container, Alert, useTheme, alpha } from "@mui/material"
import { format, subDays, isWithinInterval } from "date-fns"
import MainContentWrapper from "./MainContentWrapper"

// Import components
import ErrorBoundary from "./components/ErrorBoundary"
import DashboardHeader from "./components/dashboard/DashboardHeader"
import FilterSection from "./components/dashboard/FilterSection"
import KpiCards from "./components/dashboard/KpiCards"
import FinancialTrends from "./components/dashboard/FinancialTrends"
import TabsSection from "./components/dashboard/TabsSection"
import LoadingScreen from "./components/LoadingScreen"

// Import API services
import { fetchTransactions, fetchBanks, fetchPurchaseOrders, fetchVendors, fetchFinancialData } from "./api/apiService"

const FinanceReport = ({ open = true }) => {
  const theme = useTheme()
  const [transactions, setTransactions] = useState([])
  const [banks, setBanks] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [vendors, setVendors] = useState([])
  // Initialize financialData with empty arrays to prevent undefined errors
  const [financialData, setFinancialData] = useState({
    monthlyData: [],
    quarterlyForecast: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all")

  // Define primary color
  const primaryColor = "#f15a22"
  const isDarkMode = theme.palette.mode === "dark"

  // Fetch data from API
  useEffect(() => {
    // Add default empty arrays for API responses
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch all data in parallel
        let [transactionsData, banksData, purchaseOrdersData, vendorsData, financialDataResult] = await Promise.all([
          fetchTransactions().catch(() => []),
          fetchBanks().catch(() => []),
          fetchPurchaseOrders().catch(() => []),
          fetchVendors().catch(() => []),
          fetchFinancialData().catch(() => ({ monthlyData: [], quarterlyForecast: [] })),
        ])

        // Ensure we have arrays even if API returns null/undefined
        transactionsData = Array.isArray(transactionsData) ? transactionsData : []
        banksData = Array.isArray(banksData) ? banksData : []
        purchaseOrdersData = Array.isArray(purchaseOrdersData) ? purchaseOrdersData : []
        vendorsData = Array.isArray(vendorsData) ? vendorsData : []

        // Ensure financialData has the expected structure
        if (!financialDataResult || typeof financialDataResult !== "object") {
          financialDataResult = { monthlyData: [], quarterlyForecast: [] }
        }

        if (!Array.isArray(financialDataResult.monthlyData)) {
          financialDataResult.monthlyData = []
        }

        if (!Array.isArray(financialDataResult.quarterlyForecast)) {
          financialDataResult.quarterlyForecast = []
        }

        setTransactions(transactionsData)
        setBanks(banksData)
        setPurchaseOrders(purchaseOrdersData)
        setVendors(vendorsData)
        setFinancialData(financialDataResult)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel
      let [transactionsData, banksData, purchaseOrdersData, vendorsData, financialDataResult] = await Promise.all([
        fetchTransactions().catch(() => []),
        fetchBanks().catch(() => []),
        fetchPurchaseOrders().catch(() => []),
        fetchVendors().catch(() => []),
        fetchFinancialData().catch(() => ({ monthlyData: [], quarterlyForecast: [] })),
      ])

      // Ensure we have arrays even if API returns null/undefined
      transactionsData = Array.isArray(transactionsData) ? transactionsData : []
      banksData = Array.isArray(banksData) ? banksData : []
      purchaseOrdersData = Array.isArray(purchaseOrdersData) ? purchaseOrdersData : []
      vendorsData = Array.isArray(vendorsData) ? vendorsData : []

      // Ensure financialData has the expected structure
      if (!financialDataResult || typeof financialDataResult !== "object") {
        financialDataResult = { monthlyData: [], quarterlyForecast: [] }
      }

      if (!Array.isArray(financialDataResult.monthlyData)) {
        financialDataResult.monthlyData = []
      }

      if (!Array.isArray(financialDataResult.quarterlyForecast)) {
        financialDataResult.quarterlyForecast = []
      }

      setTransactions(transactionsData)
      setBanks(banksData)
      setPurchaseOrders(purchaseOrdersData)
      setVendors(vendorsData)
      setFinancialData(financialDataResult)
    } catch (err) {
      console.error("Error refreshing data:", err)
      setError("Failed to refresh data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (range) => {
    switch (range) {
      case "today":
        setStartDate(new Date())
        setEndDate(new Date())
        break
      case "yesterday":
        setStartDate(subDays(new Date(), 1))
        setEndDate(subDays(new Date(), 1))
        break
      case "week":
        setStartDate(subDays(new Date(), 7))
        setEndDate(new Date())
        break
      case "month":
        setStartDate(subDays(new Date(), 30))
        setEndDate(new Date())
        break
      case "quarter":
        setStartDate(subDays(new Date(), 90))
        setEndDate(new Date())
        break
      case "year":
        setStartDate(subDays(new Date(), 365))
        setEndDate(new Date())
        break
      default:
        break
    }
  }

  const resetFilters = () => {
    setStartDate(subDays(new Date(), 30))
    setEndDate(new Date())
    setFilterStatus("all")
    setFilterPaymentMethod("all")
  }

  // Filter transactions by date range and payment method
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    const isInDateRange = isWithinInterval(transactionDate, { start: startDate, end: endDate })
    const matchesPaymentMethod = filterPaymentMethod === "all" || transaction.paymentMethod === filterPaymentMethod

    return isInDateRange && matchesPaymentMethod
  })

  // Filter purchase orders by date range and status
  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const poDate = new Date(po.createdAt)
    const isInDateRange = isWithinInterval(poDate, { start: startDate, end: endDate })
    const matchesStatus = filterStatus === "all" || po.status === filterStatus

    return isInDateRange && matchesStatus
  })

  // Get unique payment methods for filter dropdown
  const paymentMethods = [...new Set(transactions.map((t) => t.paymentMethod))]

  // Get unique purchase order statuses for filter dropdown
  const poStatuses = [...new Set(purchaseOrders.map((po) => po.status))]

  // Group by payment method for pie chart
  const paymentMethodData = filteredTransactions.reduce((acc, transaction) => {
    const method = transaction.paymentMethod
    if (!acc[method]) {
      acc[method] = { name: method, value: 0, count: 0 }
    }
    acc[method].value += transaction.total
    acc[method].count += 1
    return acc
  }, {})

  const paymentChartData = Object.values(paymentMethodData)

  // Group purchase orders by status
  const poByStatus = filteredPurchaseOrders.reduce((acc, po) => {
    if (!acc[po.status]) {
      acc[po.status] = { name: po.status, value: 0, count: 0 }
    }
    acc[po.status].value += po.totalAmount
    acc[po.status].count += 1
    return acc
  }, {})

  const poStatusData = Object.values(poByStatus)

  // Calculate summary statistics
  const totalSales = filteredTransactions.reduce((sum, transaction) => sum + transaction.total, 0)
  const averageTransactionValue = filteredTransactions.length > 0 ? totalSales / filteredTransactions.length : 0
  const totalTransactions = filteredTransactions.length

  // Calculate total purchase order amount
  const totalPurchaseAmount = filteredPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)

  // Calculate gross profit (simplified: sales - purchases)
  const grossProfit = totalSales - totalPurchaseAmount
  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0

  // Group transactions by date for trend chart
  const transactionsByDate = filteredTransactions.reduce((acc, transaction) => {
    const date = format(new Date(transaction.date), "MM/dd/yyyy")
    if (!acc[date]) {
      acc[date] = { date, count: 0, total: 0 }
    }
    acc[date].count += 1
    acc[date].total += transaction.total
    return acc
  }, {})

  const trendData = Object.values(transactionsByDate).sort((a, b) => new Date(a.date) - new Date(b.date))

  // Get top selling items
  const itemSales = filteredTransactions.reduce((acc, transaction) => {
    transaction.items.forEach((item) => {
      if (!acc[item.itemId]) {
        acc[item.itemId] = {
          itemId: item.itemId,
          itemName: item.itemName,
          totalQuantity: 0,
          totalSales: 0,
          occurrences: 0,
        }
      }
      acc[item.itemId].totalQuantity += item.itemQuantity
      // Since we don't have unitPrice in the model, we'll estimate it
      // This is a simplification - in a real app, you'd want to get the actual price from somewhere
      const estimatedUnitPrice = transaction.total / transaction.items.reduce((sum, i) => sum + i.itemQuantity, 0)
      acc[item.itemId].totalSales += item.itemQuantity * estimatedUnitPrice
      acc[item.itemId].occurrences += 1
    })
    return acc
  }, {})

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5)

  // Transform banks data for display
  const banksData = banks.map((bank) => ({
    id: bank._id,
    name: bank.name,
    code: bank.code,
    status: bank.isActive ? "Active" : "Inactive",
    createdAt: bank.createdAt,
    address: bank.address || "N/A",
  }))

  // Transform vendors data for display
  const vendorsData = vendors.map((vendor) => ({
    id: vendor._id,
    vendorId: vendor.vendorId,
    name: vendor.vendorName,
    searchName: vendor.searchName,
    phone: vendor.phone,
    city: vendor.city,
    productCount: vendor.productList ? vendor.productList.length : 0,
  }))

  // Group vendors by city for chart
  const vendorsByCity = vendorsData.reduce((acc, vendor) => {
    const city = vendor.city || "Unknown"
    if (!acc[city]) {
      acc[city] = { name: city, value: 0 }
    }
    acc[city].value += 1
    return acc
  }, {})

  const vendorCityData = Object.values(vendorsByCity)

  if (loading && !transactions.length && !banks.length && !purchaseOrders.length && !vendors.length) {
    return (
      <MainContentWrapper open={open} sx={{ height: "auto", minHeight: "100vh", overflow: "auto" }}>
        <LoadingScreen open={open} primaryColor={primaryColor} isDarkMode={isDarkMode} />
      </MainContentWrapper>
    )
  }

  return (
    <MainContentWrapper open={open} sx={{ height: "auto", minHeight: "100vh", overflow: "auto" }}>
      <ErrorBoundary>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
          <DashboardHeader
            title="Finance & Sales Dashboard"
            loading={loading}
            handleRefresh={handleRefresh}
            primaryColor={primaryColor}
            isDarkMode={isDarkMode}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid rgba(211, 47, 47, 0.2)",
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="div"
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.08)",
              background: isDarkMode
                ? "linear-gradient(to right, rgba(30,30,30,0.4), rgba(30,30,30,0.2))"
                : "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,1))",
              border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
            }}
          >
            <FilterSection
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPaymentMethod={filterPaymentMethod}
              setFilterPaymentMethod={setFilterPaymentMethod}
              paymentMethods={paymentMethods}
              poStatuses={poStatuses}
              handleDateRangeChange={handleDateRangeChange}
              resetFilters={resetFilters}
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
            />
          </Box>

          {/* Financial Overview Cards */}
          <KpiCards
            totalSales={totalSales}
            totalPurchaseAmount={totalPurchaseAmount}
            grossProfit={grossProfit}
            grossMargin={grossMargin}
            totalTransactions={totalTransactions}
            averageTransactionValue={averageTransactionValue}
            activeBanks={banks.filter((bank) => bank.isActive).length}
            totalBanks={banks.length}
            startDate={startDate}
            endDate={endDate}
            isDarkMode={isDarkMode}
            primaryColor={primaryColor}
            purchaseOrders={purchaseOrders}
          />

          {/* Financial Trends Charts */}
          <FinancialTrends
            monthlyData={financialData.monthlyData}
            quarterlyForecast={financialData.quarterlyForecast}
            isDarkMode={isDarkMode}
            primaryColor={primaryColor}
          />

          {/* Tabs for different report sections */}
          <TabsSection
            tabValue={tabValue}
            handleTabChange={handleTabChange}
            trendData={trendData}
            paymentChartData={paymentChartData}
            filteredTransactions={filteredTransactions}
            poStatusData={poStatusData}
            filteredPurchaseOrders={filteredPurchaseOrders}
            vendorCityData={vendorCityData}
            vendors={vendorsData}
            banks={banksData}
            topItems={topItems}
            itemSales={itemSales}
            primaryColor={primaryColor}
            isDarkMode={isDarkMode}
            theme={theme}
          />
        </Container>
      </ErrorBoundary>
    </MainContentWrapper>
  )
}

export default FinanceReport
