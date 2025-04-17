import { Box, Typography, LinearProgress, useTheme, alpha } from "@mui/material"

const SimpleBarChart = ({ data, valueKey, labelKey, color = "#8884d8" }) => {
  const theme = useTheme()
  const maxValue = Math.max(...data.map((item) => item[valueKey]))

  return (
    <Box sx={{ width: "100%", px: 2 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              {item[labelKey]}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {typeof item[valueKey] === "number" ? item[valueKey].toFixed(2) : item[valueKey]}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(item[valueKey] / maxValue) * 100}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: alpha("#f15a22", theme.palette.mode === "dark" ? 0.2 : 0.1),
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
                borderRadius: 6,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  )
}

export default SimpleBarChart
