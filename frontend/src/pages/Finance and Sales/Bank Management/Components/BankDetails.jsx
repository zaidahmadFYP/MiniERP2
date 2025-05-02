import React from "react"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material"

const BankDetails = ({
  open,
  selectedBankForDetails,
  bankDetailsTab,
  handleBankDetailsTabChange,
  handleClose,
  handleEdit,
  formatCurrency,
}) => {
  if (!selectedBankForDetails) return null

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "#f15a22" }}>{selectedBankForDetails.name} Details</Typography>
          <Chip
            label={selectedBankForDetails.isActive ? "Active" : "Inactive"}
            color={selectedBankForDetails.isActive ? "success" : "error"}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs 
          value={bankDetailsTab} 
          onChange={handleBankDetailsTabChange} 
          aria-label="bank details tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#f15a22",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#f15a22",
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Accounts" />
          <Tab label="Branches" />
          <Tab label="Transactions" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {bankDetailsTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Bank Code:
                </Typography>
                <Typography variant="body1">{selectedBankForDetails.code}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Status:
                </Typography>
                <Typography variant="body1">{selectedBankForDetails.isActive ? "Active" : "Inactive"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Address:
                </Typography>
                <Typography variant="body1">{selectedBankForDetails.address || "No address provided"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Total Accounts:
                </Typography>
                <Typography variant="body1">0</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Total Branches:
                </Typography>
                <Typography variant="body1">0</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Total Balance:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="#f15a22">
                  {formatCurrency(0)}
                </Typography>
              </Grid>
              {selectedBankForDetails.createdAt && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Created:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedBankForDetails.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
              {selectedBankForDetails.updatedAt && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Last Updated:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedBankForDetails.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}

          {bankDetailsTab === 1 && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#f15a22" }}>Bank Accounts</Typography>
                <Button
                  variant="outlined"
                  size="small"
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
                  Add Account
                </Button>
              </Box>
              <Alert severity="info">No accounts found for this bank.</Alert>
            </>
          )}

          {bankDetailsTab === 2 && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#f15a22" }}>Bank Branches</Typography>
                <Button
                  variant="outlined"
                  size="small"
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
                  Add Branch
                </Button>
              </Box>
              <Alert severity="info">No branches found for this bank.</Alert>
            </>
          )}

          {bankDetailsTab === 3 && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#f15a22" }}>Recent Transactions</Typography>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel sx={{ "&.Mui-focused": { color: "#f15a22" } }}>Select Account</InputLabel>
                  <Select 
                    label="Select Account" 
                    defaultValue=""
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        "&.Mui-focused": {
                          borderColor: "#f15a22",
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>No accounts available</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Alert severity="info">No accounts found for this bank.</Alert>
            </>
          )}
        </Box>
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
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleEdit(selectedBankForDetails)
            handleClose()
          }}
          sx={{
            backgroundColor: "#f15a22",
            "&:hover": {
              backgroundColor: "#d14a12",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          Edit Bank
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BankDetails
