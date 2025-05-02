"use client"

import { useState, useEffect } from "react"
import { Box, Container, Alert, useTheme, alpha } from "@mui/material"
import { format, subDays, isWithinInterval } from "date-fns"
import MainContentWrapper from "./FinanceReport/MainContentWrapper"

// Import components
import ErrorBoundary from "./FinanceReport/components/ErrorBoundary"
import DashboardHeader from "./FinanceReport/components/dashboard/DashboardHeader"
import FilterSection from "./FinanceReport/components/dashboard/FilterSection"
import KpiCards from "./FinanceReport/components/dashboard/KpiCards"
import FinancialTrends from "./FinanceReport/components/dashboard/FinancialTrends"
import TabsSection from "./FinanceReport/components/dashboard/TabsSection"
import LoadingScreen from "./FinanceReport/components/LoadingScreen"

// Import API services
import { fetchTransactions, fetchBanks } from "./FinanceReport/api/apiService"

// Financial monthly data (placeholder - would come from API in real app)
const mockFinancialMonthlyData = [
  { month: "Jan", revenue: 145000, expenses: 98500, profit: 46500 },
  { month: "Feb", revenue: 152000, expenses: 101000, profit: 51000 },
  { month: "Mar", revenue: 159500, expenses: 105500, profit: 54000 },
  { month: "Apr", revenue: 182000, expenses: 110000, profit: 72000 },
  { month: "May", revenue: 196000, expenses: 114500, profit: 81500 },
  { month: "Jun", revenue: 215000, expenses: 122000, profit: 93000 },
]

// Quarterly forecast data (placeholder - would come from API in real app)
const mockQuarterlyForecast = [
  { quarter: "Q1", projected: 495000, actual: 456500, variance: -38500 },
  { quarter: "Q2", projected: 593000, actual: 593000, variance: 0 },
  { quarter: "Q3", projected: 645000, actual: null, variance: null },
  { quarter: "Q4", projected: 720000, actual: null, variance: null },
]

const FinanceReport = ({ open = true }) => {
  const theme = useTheme()
  const [transactions, setTransactions] = useState([])
  const [banks, setBanks] = useState([])
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
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch transactions and banks in parallel
        const [transactionsData, banksData] = await Promise.all([fetchTransactions(), fetchBanks()])

        setTransactions(transactionsData)
        setBanks(banksData)
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
      // Fetch transactions and banks in parallel
      const [transactionsData, banksData] = await Promise.all([fetchTransactions(), fetchBanks()])

      setTransactions(transactionsData)
      setBanks(banksData)
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

  // Get unique payment methods for filter dropdown
  const paymentMethods = [...new Set(transactions.map((t) => t.paymentMethod))]

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

  // Calculate summary statistics
  const totalSales = filteredTransactions.reduce((sum, transaction) => sum + transaction.total, 0)
  const averageTransactionValue = filteredTransactions.length > 0 ? totalSales / filteredTransactions.length : 0
  const totalTransactions = filteredTransactions.length

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

  if (loading && !transactions.length && !banks.length) {
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
              paymentMethodData={paymentMethodData}
              paymentMethods={paymentMethods}
              handleDateRangeChange={handleDateRangeChange}
              resetFilters={resetFilters}
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
            />
          </Box>

          {/* Financial Overview Cards */}
          <KpiCards
            totalSales={totalSales}
            totalTransactions={totalTransactions}
            averageTransactionValue={averageTransactionValue}
            activeBanks={banks.filter((bank) => bank.isActive).length}
            totalBanks={banks.length}
            startDate={startDate}
            endDate={endDate}
            isDarkMode={isDarkMode}
            primaryColor={primaryColor}
          />

          {/* Financial Trends Charts */}
          <FinancialTrends
            mockFinancialMonthlyData={mockFinancialMonthlyData}
            mockQuarterlyForecast={mockQuarterlyForecast}
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
