"use client"
import { Box, Typography, IconButton, Tooltip, CircularProgress, alpha } from "@mui/material"
import { AttachMoney, Refresh, Download } from "@mui/icons-material"

const DashboardHeader = ({ title, loading, handleRefresh, primaryColor, isDarkMode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        pb: 2,
        borderBottom: `2px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          display: "flex",
          alignItems: "center",
          fontWeight: 700,
          color: primaryColor,
          letterSpacing: "-0.5px",
        }}
      >
        <AttachMoney sx={{ mr: 1.5, color: primaryColor }} />
        {title}
      </Typography>
      <Box>
        <Tooltip title="Refresh data">
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              mr: 1,
              backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
              color: primaryColor,
              "&:hover": {
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.3 : 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Export report">
          <IconButton
            sx={{
              backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
              color: primaryColor,
              "&:hover": {
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.3 : 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            <Download />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default DashboardHeader
