import { Paper, Box, TextField, MenuItem, Button, useTheme, alpha } from "@mui/material"
import { FilterList, CalendarMonth, AccountBalance, CreditCard } from "@mui/icons-material"
import { format, subDays } from "date-fns"

const FilterPanel = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterAuthority,
  setFilterAuthority,
  filterPaymentMethod,
  setFilterPaymentMethod,
  paymentMethodData,
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.08)",
        background: isDarkMode
          ? "linear-gradient(to right, rgba(30,30,30,0.4), rgba(30,30,30,0.2))"
          : "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,1))",
        border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* <TextField
          label="Start Date"
          type="date"
          value={format(startDate, "yyyy-MM-dd")}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: alpha("#f15a22", 0.5),
              },
            },
          }}
          InputProps={{
            startAdornment: <CalendarMonth fontSize="small" sx={{ mr: 1, color: alpha("#f15a22", 0.7) }} />,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={format(endDate, "yyyy-MM-dd")}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: alpha("#f15a22", 0.5),
              },
            },
          }}
          InputProps={{
            startAdornment: <CalendarMonth fontSize="small" sx={{ mr: 1, color: alpha("#f15a22", 0.7) }} />,
          }}
        /> */}

        <TextField
          select
          label="Authority Type"
          value={filterAuthority}
          onChange={(e) => setFilterAuthority(e.target.value)}
          size="small"
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: alpha("#f15a22", 0.5),
              },
            },
          }}
          InputProps={{
            startAdornment: <AccountBalance fontSize="small" sx={{ mr: 1, color: alpha("#f15a22", 0.7) }} />,
          }}
        >
          <MenuItem value="all">All Authorities</MenuItem>
          <MenuItem value="FBR">FBR</MenuItem>
          <MenuItem value="KPRA">KPRA</MenuItem>
          <MenuItem value="PRA">PRA</MenuItem>
        </TextField>

        <TextField
          select
          label="Payment Method"
          value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)}
          size="small"
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: alpha("#f15a22", 0.5),
              },
            },
          }}
          InputProps={{
            startAdornment: <CreditCard fontSize="small" sx={{ mr: 1, color: alpha("#f15a22", 0.7) }} />,
          }}
        >
          <MenuItem value="all">All Methods</MenuItem>
          {Object.keys(paymentMethodData).map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {
            setStartDate(subDays(new Date(), 30))
            setEndDate(new Date())
            setFilterAuthority("all")
            setFilterPaymentMethod("all")
          }}
          sx={{
            ml: "auto",
            borderColor: primaryColor,
            color: primaryColor,
            "&:hover": {
              borderColor: primaryColor,
              backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
            },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Reset Filters
        </Button>
      </Box>
    </Paper>
  )
}

export default FilterPanel
