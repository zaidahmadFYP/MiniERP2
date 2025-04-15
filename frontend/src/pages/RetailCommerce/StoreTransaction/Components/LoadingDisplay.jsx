import { Box, CircularProgress, Typography } from "@mui/material"

export default function LoadingDisplay() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <CircularProgress size={60} />
      <Typography sx={{ mt: 2 }}>Loading transactions...</Typography>
    </Box>
  )
}
