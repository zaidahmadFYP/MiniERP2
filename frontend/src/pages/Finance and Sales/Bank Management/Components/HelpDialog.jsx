import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"

const HelpDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="help-dialog-title"
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
        },
      }}
    >
      <DialogTitle id="help-dialog-title" sx={{ color: "#f15a22" }}>Bank Management Help</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom sx={{ color: "#f15a22" }}>
          Getting Started
        </Typography>
        <Typography paragraph>
          The Bank Management module allows you to manage your organization's banking relationships. You can add,
          edit, and delete banks, as well as manage their accounts, branches, and view transaction history.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: "#f15a22" }}>
          Dashboard
        </Typography>
        <Typography paragraph>
          The Dashboard tab provides an overview of your banking relationships, including total banks, accounts, and
          balances. You can also see recent transaction activity across all banks.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: "#f15a22" }}>
          Managing Banks
        </Typography>
        <Typography paragraph>
          To add a new bank, fill out the form at the top of the Banks tab and click "Add Bank". To edit a bank, click
          the edit icon in the Actions column. To delete a bank, click the delete icon.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: "#f15a22" }}>
          Bank Details
        </Typography>
        <Typography paragraph>
          Click the view icon in the Actions column to see detailed information about a bank, including its accounts,
          branches, and transaction history.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: "#f15a22" }}>
          Bulk Actions
        </Typography>
        <Typography paragraph>
          You can perform actions on multiple banks at once by selecting them using the checkboxes and then choosing
          an action from the Actions menu.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: "#f15a22" }}>
          Import/Export
        </Typography>
        <Typography paragraph>
          You can export your bank data to CSV, Excel, or PDF using the Actions menu. You can also import banks from a
          CSV or Excel file.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: "#f15a22",
            "&:hover": {
              backgroundColor: "rgba(241, 90, 34, 0.04)",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default HelpDialog
