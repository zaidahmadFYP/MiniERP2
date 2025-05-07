import { Paper, Tabs, Tab, alpha } from "@mui/material"
import { AttachMoney, Business, Inventory } from "@mui/icons-material"
import SalesAnalysisTab from "../tabs/SalesAnalysisTab"
import BanksTab from "../tabs/BanksTab"
import ProductPerformanceTab from "../tabs/ProductPerformanceTab"

const TabsSection = ({
  tabValue,
  handleTabChange,
  trendData = [],
  paymentChartData = [],
  filteredTransactions = [],
  poStatusData = [],
  filteredPurchaseOrders = [],
  vendorCityData = [],
  vendors = [],
  banks = [],
  topItems = [],
  itemSales = {},
  primaryColor,
  isDarkMode,
  theme,
}) => {
  // Ensure we have arrays even if props are undefined
  const safeTrendData = Array.isArray(trendData) ? trendData : []
  const safePaymentChartData = Array.isArray(paymentChartData) ? paymentChartData : []
  const safeFilteredTransactions = Array.isArray(filteredTransactions) ? filteredTransactions : []
  const safePoStatusData = Array.isArray(poStatusData) ? poStatusData : []
  const safeFilteredPurchaseOrders = Array.isArray(filteredPurchaseOrders) ? filteredPurchaseOrders : []
  const safeVendorCityData = Array.isArray(vendorCityData) ? vendorCityData : []
  const safeVendors = Array.isArray(vendors) ? vendors : []
  const safeBanks = Array.isArray(banks) ? banks : []
  const safeTopItems = Array.isArray(topItems) ? topItems : []
  const safeItemSales = itemSales && typeof itemSales === "object" ? itemSales : {}

  return (
    <Paper
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: isDarkMode ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.12)",
        overflow: "hidden",
        border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.25 : 0.15)}`,
        backgroundColor: isDarkMode ? "rgba(30,30,30,0.6)" : undefined,
        mb: 4,
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
        <Tab icon={<AttachMoney />} label="Sales Analysis" iconPosition="start" sx={{ gap: 1 }} />
        <Tab icon={<Business />} label="Banks" iconPosition="start" sx={{ gap: 1 }} />
        <Tab icon={<Inventory />} label="Product Performance" iconPosition="start" sx={{ gap: 1 }} />
      </Tabs>

      {tabValue === 0 && (
        <SalesAnalysisTab
          trendData={safeTrendData}
          paymentChartData={safePaymentChartData}
          filteredTransactions={safeFilteredTransactions}
          primaryColor={primaryColor}
          isDarkMode={isDarkMode}
        />
      )}

      {tabValue === 1 && (
        <BanksTab banks={safeBanks} primaryColor={primaryColor} isDarkMode={isDarkMode} theme={theme} />
      )}

      {tabValue === 2 && (
        <ProductPerformanceTab
          topItems={safeTopItems}
          itemSales={safeItemSales}
          primaryColor={primaryColor}
          isDarkMode={isDarkMode}
          theme={theme}
        />
      )}
    </Paper>
  )
}

export default TabsSection
