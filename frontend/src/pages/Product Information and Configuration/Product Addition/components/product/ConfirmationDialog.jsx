"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, alpha, useTheme } from "@mui/material"

const ConfirmationDialog = ({ open, title, message, onClose, onConfirm }) => {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          backgroundColor: alpha("#f44336", 0.1),
          borderBottom: `1px solid ${alpha("#f44336", 0.2)}`,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: "#f44336" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 1.5,
            color: theme.palette.text.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 1.5,
            px: 3,
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
