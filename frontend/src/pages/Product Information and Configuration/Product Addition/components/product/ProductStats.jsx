"use client"
import { Box, Button, CircularProgress, Grid, Paper, Typography, Alert, alpha } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import { PRIMARY_COLOR } from "../../ProductAddition"

const ProductStats = ({ stats, onRefresh, onExport }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
              height: "100%",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Total Products
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: PRIMARY_COLOR,
                mt: 1,
              }}
            >
              {stats.totalProducts}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {stats.filteredCount} shown with current filters
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
              height: "100%",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Inventory Status
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: stats.outOfStockCount > 0 ? "error.main" : "success.main",
                  mr: 1,
                }}
              >
                {stats.outOfStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of stock
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: alpha(PRIMARY_COLOR, 0.8),
                  mr: 1,
                }}
              >
                {stats.lowStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                low stock items
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
              height: "100%",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Inventory Value
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: PRIMARY_COLOR,
                mt: 1,
              }}
            >
              ${stats.totalValue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total value of all products in stock
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Quick Actions
            </Typography>
            <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{
                  justifyContent: "flex-start",
                  color: PRIMARY_COLOR,
                  borderColor: alpha(PRIMARY_COLOR, 0.5),
                  "&:hover": {
                    borderColor: PRIMARY_COLOR,
                    backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                  },
                }}
                variant="outlined"
              >
                Refresh Data
              </Button>
              <Button
                size="small"
                startIcon={<FileDownloadIcon />}
                onClick={onExport}
                sx={{
                  justifyContent: "flex-start",
                  color: PRIMARY_COLOR,
                  borderColor: alpha(PRIMARY_COLOR, 0.5),
                  "&:hover": {
                    borderColor: PRIMARY_COLOR,
                    backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                  },
                }}
                variant="outlined"
              >
                Export to CSV
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

// Loading state component
const LoadingState = () => (
  <>
    <CircularProgress size={60} thickness={4} sx={{ color: PRIMARY_COLOR }} />
    <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
      Loading Products...
    </Typography>
  </>
)

// Error state component
const ErrorState = ({ error, onRetry }) => (
  <Alert
    severity="error"
    variant="filled"
    sx={{
      width: "100%",
      maxWidth: 600,
    }}
  >
    <Typography variant="subtitle1" fontWeight={500}>
      {error}
    </Typography>
    <Button color="inherit" size="small" sx={{ mt: 1 }} onClick={onRetry}>
      Retry
    </Button>
  </Alert>
)

ProductStats.LoadingState = LoadingState
ProductStats.ErrorState = ErrorState

export default ProductStats
