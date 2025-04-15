import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material"
import { Close } from "@mui/icons-material"

export default function FilterDialog({
  open,
  onClose,
  filterOptions,
  setFilterOptions,
  onApply,
  onReset,
  paymentMethods,
  transactionStatuses,
  paidStatuses,
}) {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
          color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}>
            Advanced Filters
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" }}>
                Payment Method
              </InputLabel>
              <Select
                value={filterOptions.paymentMethod}
                label="Payment Method"
                onChange={(e) => setFilterOptions({ ...filterOptions, paymentMethod: e.target.value })}
                sx={{
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit",
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" }}>
                Transaction Status
              </InputLabel>
              <Select
                value={filterOptions.transactionStatus}
                label="Transaction Status"
                onChange={(e) => setFilterOptions({ ...filterOptions, transactionStatus: e.target.value })}
                sx={{
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit",
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {transactionStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" }}>
                Payment Status
              </InputLabel>
              <Select
                value={filterOptions.paidStatus}
                label="Payment Status"
                onChange={(e) => setFilterOptions({ ...filterOptions, paidStatus: e.target.value })}
                sx={{
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit",
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {paidStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Min Amount"
              type="number"
              size="small"
              fullWidth
              value={filterOptions.minAmount}
              onChange={(e) => setFilterOptions({ ...filterOptions, minAmount: e.target.value })}
              InputProps={{
                sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
              }}
              InputLabelProps={{
                sx: { color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Max Amount"
              type="number"
              size="small"
              fullWidth
              value={filterOptions.maxAmount}
              onChange={(e) => setFilterOptions({ ...filterOptions, maxAmount: e.target.value })}
              InputProps={{
                sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
              }}
              InputLabelProps={{
                sx: { color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date From"
              type="date"
              size="small"
              fullWidth
              value={filterOptions.dateFrom}
              onChange={(e) => setFilterOptions({ ...filterOptions, dateFrom: e.target.value })}
              InputLabelProps={{
                shrink: true,
                sx: { color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" },
              }}
              InputProps={{
                sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date To"
              type="date"
              size="small"
              fullWidth
              value={filterOptions.dateTo}
              onChange={(e) => setFilterOptions({ ...filterOptions, dateTo: e.target.value })}
              InputLabelProps={{
                shrink: true,
                sx: { color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "inherit" },
              }}
              InputProps={{
                sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop:
            theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Button onClick={onReset} color="inherit">
          Reset
        </Button>
        <Button onClick={onApply} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}
