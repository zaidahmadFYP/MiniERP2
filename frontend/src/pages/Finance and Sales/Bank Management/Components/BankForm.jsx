import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { Add as AddIcon, Cancel as CancelIcon, Check as CheckIcon } from "@mui/icons-material"

const BankForm = ({ formData, formErrors, isEditing, submitting, handleInputChange, handleSubmit, resetForm }) => {
  return (
    <Card sx={{ mb: 3, borderRadius: "12px", boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)" }}>
      <CardContent>
        <Typography variant="h6" component="h2" fontWeight="600" sx={{ mb: 3, color: "#f15a22" }}>
          {isEditing ? "Edit Bank Details" : "Add New Bank"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                color="warning"
                error={!!formErrors.name}
                helperText={formErrors.name || "Must be unique"}
                disabled={submitting}
                inputProps={{ maxLength: 100 }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f15a22",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#f15a22",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bank Code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                variant="outlined"
                color="warning"
                error={!!formErrors.code}
                helperText={formErrors.code || "Must be unique, letters and numbers only"}
                disabled={submitting}
                inputProps={{ maxLength: 20 }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f15a22",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#f15a22",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
                variant="outlined"
                color="warning"
                error={!!formErrors.address}
                helperText={formErrors.address}
                disabled={submitting}
                inputProps={{ maxLength: 500 }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f15a22",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#f15a22",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    disabled={submitting}
                    sx={{
                      "&.Mui-checked": {
                        color: "#f15a22",
                      },
                    }}
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={isEditing ? <CheckIcon /> : <AddIcon />}
                disabled={submitting}
                sx={{
                  px: 4,
                  backgroundColor: "#f15a22",
                  "&:hover": {
                    backgroundColor: "#d14a12",
                  },
                  transition: "background-color 0.3s ease",
                }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : isEditing ? (
                  "Update Bank"
                ) : (
                  "Add Bank"
                )}
              </Button>

              {isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={resetForm}
                  disabled={submitting}
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
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BankForm
