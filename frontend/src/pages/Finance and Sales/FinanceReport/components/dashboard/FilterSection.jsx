
import { Box, TextField, MenuItem, Button, ButtonGroup, alpha } from "@mui/material"
import { FilterList, CalendarMonth, CreditCard, Inventory } from "@mui/icons-material"
import { format } from "date-fns"

const FilterSection = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterStatus,
  setFilterStatus,
  filterPaymentMethod,
  setFilterPaymentMethod,
  paymentMethods = [],
  poStatuses = [],
  handleDateRangeChange,
  resetFilters,
  primaryColor,
  isDarkMode,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        alignItems: "center",
        mb: 2,
      }}
    >
      <ButtonGroup variant="outlined" size="small" sx={{ mb: { xs: 2, md: 0 } }}>
        <Button onClick={() => handleDateRangeChange("today")}>Today</Button>
        <Button onClick={() => handleDateRangeChange("week")}>Week</Button>
        <Button onClick={() => handleDateRangeChange("month")}>Month</Button>
        <Button onClick={() => handleDateRangeChange("quarter")}>Quarter</Button>
        <Button onClick={() => handleDateRangeChange("year")}>Year</Button>
      </ButtonGroup>

      <TextField
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
      />

      <TextField
        select
        label="Status"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
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
          startAdornment: <Inventory fontSize="small" sx={{ mr: 1, color: alpha("#f15a22", 0.7) }} />,
        }}
      >
        <MenuItem value="all">All Statuses</MenuItem>
        {poStatuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
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
        {paymentMethods.map((method) => (
          <MenuItem key={method} value={method}>
            {method}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="outlined"
        startIcon={<FilterList />}
        onClick={resetFilters}
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
  )
}

export default FilterSection
