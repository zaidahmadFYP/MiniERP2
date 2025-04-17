"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Container, Paper, Alert, Tabs, Tab, useTheme, alpha } from "@mui/material"
import { TrendingUp, Payment, PointOfSale, Inventory } from "@mui/icons-material"
import { format, subDays, isWithinInterval } from "date-fns"

// Import components
import MainContentWrapper from "./MainContentWrapper"
import ErrorBoundary from "./Components/ErrorBoundary"
import FilterPanel from "./Components/FilterPanel"
import SummaryCards from "./Components/SummaryCards"
import SalesTrendsTab from "./Components/tabs/SalesTrendsTab"
import PaymentAnalysisTab from "./Components/tabs/PaymentAnalysisTab"
import POSConfigurationTab from "./Components/tabs/POSConfigurationTab"
import TopProductsTab from "./Components/tabs/TopProductsTab"
import DashboardHeader from "./Components/DashboardHeader"
import LoadingScreen from "./Components/LoadingScreen"

const Reporting = ({ open = true }) => {
  const theme = useTheme()
  const [transactions, setTransactions] = useState([])
  const [posConfigs, setPosConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())
  const [filterAuthority, setFilterAuthority] = useState("all")
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all")

  // Define primary color
  const primaryColor = "#f15a22"
  const isDarkMode = theme.palette.mode === "dark"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [transactionsRes, posConfigsRes] = await Promise.all([
          axios.get("http://localhost:5002/api/transactions"),
          axios.get("http://localhost:5002/api/posconfig"),
        ])

        setTransactions(transactionsRes.data)
        setPosConfigs(posConfigsRes.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to fetch data. Please try again later.")
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
    try {
      const [transactionsRes, posConfigsRes] = await Promise.all([
        axios.get("http://localhost:5002/api/transactions"),
        axios.get("http://localhost:5002/api/posconfig"),
      ])

      setTransactions(transactionsRes.data)
      setPosConfigs(posConfigsRes.data)
      setError(null)
    } catch (err) {
      setError("Failed to refresh data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    const isInDateRange = isWithinInterval(transactionDate, { start: startDate, end: endDate })

    const matchesPaymentMethod = filterPaymentMethod === "all" || transaction.paymentMethod === filterPaymentMethod

    return isInDateRange && matchesPaymentMethod
  })

  // Filter POS configs
  const filteredPosConfigs = posConfigs.filter((config) => {
    return filterAuthority === "all" || config.AuthorityType === filterAuthority
  })

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

  // Group POS by status
  const posStatusCount = posConfigs.reduce((acc, config) => {
    const status = config.POSStatus
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status] += 1
    return acc
  }, {})

  const posStatusData = Object.entries(posStatusCount).map(([name, value]) => ({ name, value }))

  // Group POS by authority
  const authorityCount = posConfigs.reduce((acc, config) => {
    const authority = config.AuthorityType
    if (!acc[authority]) {
      acc[authority] = 0
    }
    acc[authority] += 1
    return acc
  }, {})

  const authorityData = Object.entries(authorityCount).map(([name, value]) => ({ name, value }))

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
      acc[item.itemId].totalSales +=
        item.itemQuantity * (transaction.total / transaction.items.reduce((sum, i) => sum + i.itemQuantity, 0))
      acc[item.itemId].occurrences += 1
    })
    return acc
  }, {})

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5)

  if (loading && !transactions.length && !posConfigs.length) {
    return (
      <MainContentWrapper open={open}>
        <LoadingScreen />
      </MainContentWrapper>
    )
  }

  return (
    <MainContentWrapper open={open}>
      <ErrorBoundary>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
          <DashboardHeader 
            loading={loading} 
            handleRefresh={handleRefresh} 
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            posConfigs={posConfigs}
            startDate={startDate}
            endDate={endDate}
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

          <FilterPanel
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            filterAuthority={filterAuthority}
            setFilterAuthority={setFilterAuthority}
            filterPaymentMethod={filterPaymentMethod}
            setFilterPaymentMethod={setFilterPaymentMethod}
            paymentMethodData={paymentMethodData}
          />

          <SummaryCards
            totalSales={totalSales}
            totalTransactions={totalTransactions}
            averageTransactionValue={averageTransactionValue}
            startDate={startDate}
            endDate={endDate}
            posConfigs={posConfigs}
            posStatusCount={posStatusCount}
          />

          {/* Tabs for different report sections */}
          <Paper
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: isDarkMode ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "hidden",
              border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.25 : 0.15)}`,
              backgroundColor: isDarkMode ? "rgba(30,30,30,0.6)" : undefined,
              mt: 4,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  py: 2.5,
                  fontWeight: 600,
                  color: alpha("#f15a22", isDarkMode ? 0.8 : 0.7),
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    color: primaryColor,
                  },
                  "&:hover": {
                    backgroundColor: alpha("#f15a22", isDarkMode ? 0.1 : 0.05),
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: primaryColor,
                  height: 3,
                },
              }}
            >
              <Tab icon={<TrendingUp />} label="Sales Trends" iconPosition="start" sx={{ gap: 1 }} />
              <Tab icon={<Payment />} label="Payment Analysis" iconPosition="start" sx={{ gap: 1 }} />
              <Tab icon={<PointOfSale />} label="POS Configuration" iconPosition="start" sx={{ gap: 1 }} />
              <Tab icon={<Inventory />} label="Top Products" iconPosition="start" sx={{ gap: 1 }} />
            </Tabs>

            {/* Sales Trends Tab */}
            {tabValue === 0 && <SalesTrendsTab trendData={trendData} />}

            {/* Payment Analysis Tab */}
            {tabValue === 1 && <PaymentAnalysisTab paymentChartData={paymentChartData} />}

            {/* POS Configuration Tab */}
            {tabValue === 2 && (
              <POSConfigurationTab
                authorityData={authorityData}
                posStatusData={posStatusData}
                filteredPosConfigs={filteredPosConfigs}
                posConfigs={posConfigs}
              />
            )}

            {/* Top Products Tab */}
            {tabValue === 3 && <TopProductsTab topItems={topItems} itemSales={itemSales} />}
          </Paper>
        </Container>
      </ErrorBoundary>
    </MainContentWrapper>
  )
}

export default Reporting