import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

const DeleteConfirmation = ({ open, bankToDelete, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete Bank"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete {bankToDelete?.name}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: "#f15a22",
            "&:hover": {
              backgroundColor: "rgba(241, 90, 34, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained" 
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmation
