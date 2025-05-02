import { Grid, Card, CardContent, Box, Typography, alpha } from "@mui/material"
import { AttachMoney, MoneyOff, ShowChart, ReceiptLong } from "@mui/icons-material"
import { format } from "date-fns"

const KpiCard = ({ title, value, subtitle, icon, color, isDarkMode, primaryColor }) => {
  return (
    <Grid item xs={12} md={3}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
          border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: isDarkMode ? "0 15px 35px rgba(0,0,0,0.4)" : "0 15px 35px rgba(0,0,0,0.15)",
            borderColor: alpha("#f15a22", isDarkMode ? 0.5 : 0.4),
          },
          overflow: "hidden",
          position: "relative",
          backgroundColor: isDarkMode ? "rgba(30,30,30,0.6)" : undefined,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: `linear-gradient(to right, ${color}, ${alpha(color, 0.7)})`,
          }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 4,
            pt: 5,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: alpha(color, isDarkMode ? 0.2 : 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            {icon}
          </Box>
          <Typography color="textSecondary" gutterBottom variant="subtitle1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 700,
              color: color,
              my: 2,
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </Typography>
          <Typography color="textSecondary" variant="body2" sx={{ textAlign: "center" }}>
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

const KpiCards = ({
  totalSales = 0,
  totalPurchaseAmount = 0,
  grossProfit = 0,
  grossMargin = 0,
  totalTransactions = 0,
  averageTransactionValue = 0,
  startDate,
  endDate,
  isDarkMode,
  primaryColor,
  purchaseOrders = [],
}) => {
  // Ensure we have valid dates
  const safeStartDate = startDate instanceof Date ? startDate : new Date()
  const safeEndDate = endDate instanceof Date ? endDate : new Date()

  return (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <KpiCard
        title="Total Sales"
        value={`$${(totalSales || 0).toFixed(2)}`}
        subtitle={`${format(safeStartDate, "MMM d, yyyy")} - ${format(safeEndDate, "MMM d, yyyy")}`}
        icon={<AttachMoney sx={{ fontSize: 32, color: "#4361ee" }} />}
        color="#4361ee"
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
      />
      <KpiCard
        title="Total Purchases"
        value={`$${(totalPurchaseAmount || 0).toFixed(2)}`}
        subtitle={`${Array.isArray(purchaseOrders) ? purchaseOrders.length : 0} Purchase Orders`}
        icon={<MoneyOff sx={{ fontSize: 32, color: "#f72585" }} />}
        color="#f72585"
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
      />
      <KpiCard
        title="Gross Profit"
        value={`$${(grossProfit || 0).toFixed(2)}`}
        subtitle={`${(grossMargin || 0).toFixed(1)}% Margin`}
        icon={<ShowChart sx={{ fontSize: 32, color: "#4cc9f0" }} />}
        color="#4cc9f0"
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
      />
      <KpiCard
        title="Transactions"
        value={totalTransactions || 0}
        subtitle={`Avg. $${(averageTransactionValue || 0).toFixed(2)} per transaction`}
        icon={<ReceiptLong sx={{ fontSize: 32, color: primaryColor }} />}
        color={primaryColor}
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
      />
    </Grid>
  )
}

export default KpiCards
