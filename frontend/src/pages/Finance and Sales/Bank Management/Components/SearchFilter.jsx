import {
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { Clear as ClearIcon, FilterList as FilterIcon, Search as SearchIcon } from "@mui/icons-material"

const SearchFilter = ({ searchTerm, filterStatus, handleSearchChange, clearSearch, handleFilterChange }) => {
  return (
    <Card sx={{ mb: 3, borderRadius: "12px", boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)" }}>
      <CardContent>
        <Typography variant="h6" component="h2" fontWeight="600" sx={{ mb: 3, color: "#f15a22" }}>
          Search & Filter
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by name, code or address..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f15a22",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#f15a22" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch} aria-label="Clear search">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-filter-label" sx={{ "&.Mui-focused": { color: "#f15a22" } }}>
                Status
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                onChange={handleFilterChange}
                label="Status"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&.Mui-focused": {
                      borderColor: "#f15a22",
                    },
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon sx={{ color: "#f15a22" }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SearchFilter
