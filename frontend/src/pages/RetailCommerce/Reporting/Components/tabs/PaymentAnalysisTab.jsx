import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  alpha,
} from "@mui/material"
import { Payment } from "@mui/icons-material"
import SimplePieChart from "../charts/SimplePieChart"
import ErrorBoundary from "../ErrorBoundary"

const PaymentAnalysisTab = ({ paymentChartData }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Sales by Payment Method
          </Typography>
          <ErrorBoundary>
            <Box
              sx={{
                height: 400,
                p: 2,
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.1)
                  : alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
              }}
            >
              {paymentChartData.length > 0 ? (
                <SimplePieChart data={paymentChartData} valueKey="value" labelKey="name" />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                    borderRadius: 2,
                    p: 4,
                  }}
                >
                  <Payment sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
                  <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                    No payment data available for the selected period.
                  </Typography>
                </Box>
              )}
            </Box>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Payment Method Details
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
              height: "calc(400px - 32px)",
              overflow: "auto",
              border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
              backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Payment Method</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Transactions
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Total Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Average
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentChartData.length > 0 ? (
                  paymentChartData.map((row) => (
                    <TableRow
                      key={row.name}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                        },
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                        {row.name}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        {row.count}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 500 }}>
                        ${row.value.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        ${(row.value / row.count).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Payment sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                        <Typography variant="body2" color="text.secondary">
                          No data available for the selected period.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PaymentAnalysisTab
