import {
  Box,
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
import { TrendingUp } from "@mui/icons-material"
import SimpleLineChart from "../charts/SimpleLineChart"
import ErrorBoundary from "../ErrorBoundary"

const SalesTrendsTab = ({ trendData }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
        Sales Trend Over Time
      </Typography>
      <ErrorBoundary>
        <Box sx={{ height: 400, p: 2, mb: 4 }}>
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

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mt: 13, pt: 2, clear: "both" }}>
        Daily Sales Breakdown
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          borderRadius: 2,
          boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mb: 4,
          width: "100%",
          clear: "both",
          border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
          backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
              <TableCell sx={{ fontWeight: "bold", py: 2 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                Transactions
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                Total Sales
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                Average Sale
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trendData.length > 0 ? (
              trendData.map((row) => (
                <TableRow
                  key={row.date}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                    },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                    {row.date}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5 }}>
                    {row.count}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5, fontWeight: 500 }}>
                    ${row.total.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5 }}>
                    ${(row.total / row.count).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <TrendingUp sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
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
    </Box>
  )
}

export default SalesTrendsTab
