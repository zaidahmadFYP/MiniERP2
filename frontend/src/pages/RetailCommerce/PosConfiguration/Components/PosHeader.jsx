import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const PosHeader = () => {
  const theme = useTheme()

  return (
    <Box sx={{ p: 2.5, pb: 1.5, bgcolor: theme.palette.background.paper }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "13px",
          color: theme.palette.text.secondary,
          mb: 0.5,
          fontWeight: 500,
        }}
      >
        POS registeration
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            color: theme.palette.text.primary,
          }}
        >
          Standard view
        </Typography>
      </Box>
    </Box>
  )
}


export default PosHeader
