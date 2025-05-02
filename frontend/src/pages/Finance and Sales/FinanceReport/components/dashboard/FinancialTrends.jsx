import { Grid, Card, CardContent, Typography } from "@mui/material"
import MultiLineChart from "../charts/MultiLineChart"
import MultiBarChart from "../charts/MultiBarChart"
import { alpha } from "@mui/material/styles"

// Add null checks to prevent undefined errors
const FinancialTrends = ({ monthlyData = [], quarterlyForecast = [], isDarkMode, primaryColor }) => {
  // Ensure we have arrays even if props are undefined
  const safeMonthlyData = Array.isArray(monthlyData) ? monthlyData : []
  const safeQuarterlyForecast = Array.isArray(quarterlyForecast) ? quarterlyForecast : []

  return (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor }}>
              Monthly Financial Performance
            </Typography>
            <MultiLineChart
              data={safeMonthlyData}
              xKey="month"
              lines={[
                { key: "revenue", label: "Revenue" },
                { key: "expenses", label: "Expenses" },
                { key: "profit", label: "Profit" },
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
            height: "100%",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor }}>
              Quarterly Forecast vs Actual
            </Typography>
            <MultiBarChart
              data={safeQuarterlyForecast}
              xKey="quarter"
              title="2023 Performance"
              bars={[
                { key: "projected", label: "Projected", format: "currency" },
                { key: "actual", label: "Actual", format: "currency" },
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FinancialTrends
