import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

const DeletePosDialog = ({ open, handleClose, handleConfirmDelete, loading, selectedCount }) => {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, p: 2.5 }}>Confirm Delete</DialogTitle>
      <DialogContent sx={{ p: 2.5, pb: 1 }}>
        <DialogContentText sx={{ color: theme.palette.text.secondary }}>
          Are you sure you want to delete {selectedCount} selected item(s)? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: theme.palette.error.main,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: theme.palette.error.dark,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePosDialog
