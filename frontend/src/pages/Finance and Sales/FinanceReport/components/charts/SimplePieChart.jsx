
import { Box, Typography, Divider, useTheme } from "@mui/material"

const SimplePieChart = ({ data, valueKey, labelKey }) => {
  const theme = useTheme()
  const total = data.reduce((sum, item) => sum + item[valueKey], 0)
  const colors = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#4895ef"]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          mb: 4,
        }}
      >
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: colors[index % colors.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
                boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.1)",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 5,
                  left: 5,
                  right: 5,
                  bottom: 5,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.2)",
                },
              }}
            >
              <Typography variant="h6" color="white" fontWeight="bold">
                {Math.round((item[valueKey] / total) * 100)}%
              </Typography>
            </Box>
            <Typography variant="body2" align="center" sx={{ maxWidth: 120 }}>
              {item[labelKey]}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ width: "100%", mb: 3 }} />
      <Box sx={{ width: "100%" }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[index % colors.length],
                  mr: 1.5,
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">{item[labelKey]}</Typography>
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {typeof item[valueKey] === "number" ? item[valueKey].toFixed(2) : item[valueKey]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default SimplePieChart
