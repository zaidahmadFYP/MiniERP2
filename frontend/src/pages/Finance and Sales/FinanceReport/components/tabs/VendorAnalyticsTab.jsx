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
import { Business } from "@mui/icons-material"
import SimpleBarChart from "../charts/SimpleBarChart"
import ErrorBoundary from "../ErrorBoundary"

const VendorAnalyticsTab = ({ vendorSpendData, vendors, primaryColor, isDarkMode }) => {
  const theme = useTheme()

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Top Vendors by Spend
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
              {vendorSpendData.length > 0 ? (
                <SimpleBarChart data={vendorSpendData} valueKey="value" labelKey="name" color="#4cc9f0" />
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
                  <Business sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
                  <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                    No vendor data available.
                  </Typography>
                </Box>
              )}
            </Box>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Vendor Performance Metrics
          </Typography>
          <ErrorBoundary>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
                maxHeight: "400px",
                height: "auto",
                overflow: "auto",
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Vendor</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                      Rating
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                      On-Time Delivery
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                      Quality
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendors.length > 0 ? (
                    vendors.map((vendor) => (
                      <TableRow
                        key={vendor.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                          },
                        }}
                      >
                        <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                          {vendor.name}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          {vendor.rating.toFixed(1)}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          {vendor.onTimeDelivery}%
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          {vendor.qualityRating.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <Business sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                          <Typography variant="body2" color="text.secondary">
                            No vendor data available.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mt: 2, mb: 3 }}>
            Vendor Directory
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
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Contact Person</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Total Spend
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <TableRow
                      key={vendor.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>{vendor.id}</TableCell>
                      <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{vendor.name}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{vendor.category}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{vendor.contactPerson}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{vendor.email}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={vendor.status}
                          color={vendor.status === "Active" ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: "medium" }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 500 }}>
                        ${vendor.totalSpend.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Business sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                        <Typography variant="body2" color="text.secondary">
                          No vendors available.
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

export default VendorAnalyticsTab
