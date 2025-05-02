import {
    Box,
    Typography,
    Grid,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    alpha,
  } from "@mui/material"
  import { TrendingUp, Payment, ReceiptLong } from "@mui/icons-material"
  import { format } from "date-fns"
  import SimpleLineChart from "../charts/SimpleLineChart"
  import SimplePieChart from "../charts/SimplePieChart"
  import ErrorBoundary from "../ErrorBoundary"
  
  const SalesAnalysisTab = ({ trendData, paymentChartData, filteredTransactions, primaryColor, isDarkMode }) => {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
          Sales Trend Over Time
        </Typography>
        <ErrorBoundary>
          <Box sx={{ height: "auto", minHeight: 400, p: 2, mb: 4 }}>
            {trendData.length > 0 ? (
              <SimpleLineChart data={trendData} xKey="date" yKey="total" label="Daily Sales ($)" />
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
                <TrendingUp sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
                <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                  No trend data available for the selected period.
                </Typography>
              </Box>
            )}
          </Box>
        </ErrorBoundary>
  
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
              Payment Method Distribution
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                height: "100%",
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
            </Paper>
          </Grid>
  
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
              Transaction Status
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
                maxHeight: "calc(400px - 32px)",
                height: "auto",
                overflow: "auto",
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Payment Method</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                      Items
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1.5 }}>{format(new Date(transaction.date), "MM/dd/yyyy")}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>{transaction.paymentMethod}</TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          {transaction.items.length}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5, fontWeight: 500 }}>
                          ${transaction.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <ReceiptLong sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                          <Typography variant="body2" color="text.secondary">
                            No transactions available for the selected period.
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
  
  export default SalesAnalysisTab
  