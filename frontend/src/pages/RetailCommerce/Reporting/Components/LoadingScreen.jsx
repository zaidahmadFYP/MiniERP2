import { Box, Typography, CircularProgress, useTheme } from "@mui/material"

const LoadingScreen = ({ open }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 2,
        background: isDarkMode
          ? "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.2))"
          : "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))",
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: primaryColor }} />
      <Typography variant="h5" sx={{ fontWeight: 600, color: primaryColor, mt: 2 }}>
        Loading reporting data...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Please wait while we fetch your dashboard information
      </Typography>
    </Box>
  )
}

export default LoadingScreen

