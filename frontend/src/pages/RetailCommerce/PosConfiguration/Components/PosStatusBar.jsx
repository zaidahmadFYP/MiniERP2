"use client"

import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const PosStatusBar = ({ selected, filteredData }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        p: 1.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "13px", fontWeight: 500 }}>
        {selected.length > 0 ? `${selected.length} item(s) selected` : `${filteredData.length} item(s)`}
      </Typography>
    </Box>
  )
}

export default PosStatusBar
