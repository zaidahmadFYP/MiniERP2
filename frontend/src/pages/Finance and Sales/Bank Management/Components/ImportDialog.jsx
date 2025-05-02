import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { Upload as UploadIcon } from "@mui/icons-material"

const ImportDialog = ({ open, handleClose, handleImport }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      aria-labelledby="import-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
        },
      }}
    >
      <DialogTitle id="import-dialog-title" sx={{ color: "#f15a22" }}>Import Banks</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Upload a CSV or Excel file to import banks. The file should have the following columns: name, code, address,
          isActive.
        </DialogContentText>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
          sx={{
            color: "#f15a22",
            borderColor: "#f15a22",
            "&:hover": {
              borderColor: "#d14a12",
              backgroundColor: "rgba(241, 90, 34, 0.04)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Choose File
          <input type="file" hidden accept=".csv,.xlsx,.xls" />
        </Button>
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
          variant="contained"
          onClick={() => {
            handleClose()
            handleImport()
          }}
          sx={{
            backgroundColor: "#f15a22",
            "&:hover": {
              backgroundColor: "#d14a12",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportDialog
