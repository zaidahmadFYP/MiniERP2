"use client"
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
  alpha,
  useTheme,
} from "@mui/material"
import { Inventory } from "@mui/icons-material"
import SimpleBarChart from "../charts/SimpleBarChart"
import ErrorBoundary from "../ErrorBoundary"

// Add null checks to prevent undefined errors
const ProductPerformanceTab = ({ topItems = [], itemSales = {}, primaryColor, isDarkMode }) => {
  const theme = useTheme()

  // Ensure we have arrays even if props are undefined
  const safeTopItems = Array.isArray(topItems) ? topItems : []
  const safeItemSales = itemSales && typeof itemSales === "object" ? itemSales : {}

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
        Top Selling Products
      </Typography>
      <ErrorBoundary>
        <Box
          sx={{
            height: "auto",
            minHeight: 400,
            p: 3,
            backgroundColor: isDarkMode
              ? alpha(theme.palette.background.paper, 0.1)
              : alpha(theme.palette.background.paper, 0.5),
            borderRadius: 2,
            border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
            boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
            mb: 4,
          }}
        >
          {safeTopItems.length > 0 ? (
            <SimpleBarChart data={safeTopItems} valueKey="totalSales" labelKey="itemName" color={primaryColor} />
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
              <Inventory sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
              <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                No product data available for the selected period.
              </Typography>
            </Box>
          )}
        </Box>
      </ErrorBoundary>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mt: 4, mb: 3 }}>
        Product Sales Details
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
              <TableCell sx={{ fontWeight: "bold", py: 2 }}>Item ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", py: 2 }}>Item Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                Quantity Sold
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                Total Sales
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                Transactions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(safeItemSales).length > 0 ? (
              Object.values(safeItemSales)
                .sort((a, b) => b.totalSales - a.totalSales)
                .map((item) => (
                  <TableRow
                    key={item.itemId}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                      },
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }}>{item.itemId}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>{item.itemName}</TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      {item.totalQuantity}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5, fontWeight: 500 }}>
                      ${(item.totalSales || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      {item.occurrences}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Inventory sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                    <Typography variant="body2" color="text.secondary">
                      No product data available for the selected period.
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

export default ProductPerformanceTab
