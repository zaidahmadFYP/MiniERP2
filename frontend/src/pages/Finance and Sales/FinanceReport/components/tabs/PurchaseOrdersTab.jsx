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
  Chip,
  alpha,
  useTheme,
} from "@mui/material"
import { LocalShipping, Payment } from "@mui/icons-material"
import { format } from "date-fns"
import SimplePieChart from "../charts/SimplePieChart"
import SimpleBarChart from "../charts/SimpleBarChart"
import ErrorBoundary from "../ErrorBoundary"

// Add null checks to prevent undefined errors
const PurchaseOrdersTab = ({ poStatusData = [], filteredPurchaseOrders = [], primaryColor, isDarkMode }) => {
  const theme = useTheme()

  // Ensure we have arrays even if props are undefined
  const safePoStatusData = Array.isArray(poStatusData) ? poStatusData : []
  const safeFilteredPurchaseOrders = Array.isArray(filteredPurchaseOrders) ? filteredPurchaseOrders : []

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Purchase Orders by Status
          </Typography>
          <ErrorBoundary>
            <Box
              sx={{
                height: "auto",
                minHeight: 400,
                p: 2,
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.1)
                  : alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
              }}
            >
              {safePoStatusData.length > 0 ? (
                <SimplePieChart data={safePoStatusData} valueKey="value" labelKey="name" />
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
                  <LocalShipping sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
                  <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                    No purchase order data available.
                  </Typography>
                </Box>
              )}
            </Box>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Purchase Order Payment Status
          </Typography>
          <ErrorBoundary>
            <Box
              sx={{
                height: "auto",
                minHeight: 400,
                p: 2,
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.1)
                  : alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
              }}
            >
              {safeFilteredPurchaseOrders.length > 0 ? (
                <SimpleBarChart
                  data={Object.values(
                    safeFilteredPurchaseOrders.reduce((acc, po) => {
                      if (!acc[po.paymentStatus]) {
                        acc[po.paymentStatus] = { name: po.paymentStatus || "Unknown", value: 0 }
                      }
                      acc[po.paymentStatus].value += po.totalAmount || 0
                      return acc
                    }, {}),
                  )}
                  valueKey="value"
                  labelKey="name"
                  color="#f72585"
                />
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
                    No payment data available.
                  </Typography>
                </Box>
              )}
            </Box>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mt: 2, mb: 3 }}>
            Purchase Order Details
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
              border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
              backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>PO ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Vendor</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Payment Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safeFilteredPurchaseOrders.length > 0 ? (
                  safeFilteredPurchaseOrders.map((po, index) => (
                    <TableRow
                      key={po._id || po.id || index}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>{po.orderNumber || po.id || "N/A"}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{po.vendorName || "N/A"}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {po.createdAt ? format(new Date(po.createdAt), "MM/dd/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 500 }}>
                        ${(po.totalAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={po.status || "Unknown"}
                          color={
                            po.status === "Delivered" || po.status === "Received"
                              ? "success"
                              : po.status === "In Transit" || po.status === "Open order"
                                ? "info"
                                : "warning"
                          }
                          size="small"
                          sx={{ fontWeight: "medium" }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Chip
                          label={po.paymentStatus || "Unknown"}
                          color={po.paymentStatus === "Paid" ? "success" : "warning"}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: "medium" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <LocalShipping sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                        <Typography variant="body2" color="text.secondary">
                          No purchase orders available for the selected period.
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

export default PurchaseOrdersTab
