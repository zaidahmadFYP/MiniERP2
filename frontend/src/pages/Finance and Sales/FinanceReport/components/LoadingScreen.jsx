import { Box, Typography, CircularProgress } from "@mui/material"

const LoadingScreen = ({ open, primaryColor, isDarkMode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)", // Adjust for potential header height
        minHeight: "500px",
        flexDirection: "column",
        gap: 2,
        background: isDarkMode
          ? "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.2))"
          : "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))",
        py: 4,
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: primaryColor }} />
      <Typography variant="h5" sx={{ fontWeight: 600, color: primaryColor, mt: 2 }}>
        Loading financial data...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Please wait while we fetch your finance and sales reports
      </Typography>
    </Box>
  )
}

export default LoadingScreen
