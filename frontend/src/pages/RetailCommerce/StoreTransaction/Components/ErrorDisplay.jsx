import { Box, Alert, Button } from "@mui/material"

export default function ErrorDisplay({ error, onRetry }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        p: 3,
      }}
    >
      <Alert
        severity="error"
        sx={{
          width: "100%",
          maxWidth: 500,
          mb: 2,
        }}
      >
        {error}
      </Alert>
      <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
        Retry
      </Button>
    </Box>
  )
}
