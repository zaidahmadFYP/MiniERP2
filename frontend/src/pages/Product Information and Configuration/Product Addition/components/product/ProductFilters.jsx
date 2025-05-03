
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  alpha,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import TuneIcon from "@mui/icons-material/Tune"
import { PRIMARY_COLOR } from "../../ProductAddition"

const ProductFilters = ({ filters, categories, onFilterChange, onAdvancedClick }) => {
  // Add console logging to debug category selection
  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value
    console.log("Category selected:", selectedValue)
    console.log("Categories available:", categories)
    onFilterChange("category", selectedValue)
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: 2,
      }}
    >
      <TextField
        placeholder="Search products by name or ID..."
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: alpha(PRIMARY_COLOR, 0.7) }} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 1.5,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(PRIMARY_COLOR, 0.3),
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(PRIMARY_COLOR, 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: PRIMARY_COLOR,
            },
          },
        }}
        sx={{
          flexGrow: 1,
          "& .MuiInputLabel-root.Mui-focused": {
            color: PRIMARY_COLOR,
          },
        }}
        variant="outlined"
        size="small"
      />

      <FormControl
        size="small"
        sx={{
          minWidth: 150,
          "& .MuiInputLabel-root.Mui-focused": {
            color: PRIMARY_COLOR,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: alpha(PRIMARY_COLOR, 0.3),
            },
            "&:hover fieldset": {
              borderColor: alpha(PRIMARY_COLOR, 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: PRIMARY_COLOR,
            },
          },
        }}
      >
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select
          labelId="category-filter-label"
          value={filters.category || "all"}
          onChange={handleCategoryChange}
          label="Category"
          sx={{ borderRadius: 1.5 }}
        >
          <MenuItem key="all" value="all">
            All Categories
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: 150,
          "& .MuiInputLabel-root.Mui-focused": {
            color: PRIMARY_COLOR,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: alpha(PRIMARY_COLOR, 0.3),
            },
            "&:hover fieldset": {
              borderColor: alpha(PRIMARY_COLOR, 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: PRIMARY_COLOR,
            },
          },
        }}
      >
        <InputLabel id="stock-filter-label">Stock Status</InputLabel>
        <Select
          labelId="stock-filter-label"
          value={filters.stockStatus || "all"}
          onChange={(e) => onFilterChange("stockStatus", e.target.value)}
          label="Stock Status"
          sx={{ borderRadius: 1.5 }}
        >
          <MenuItem key="all-stock" value="all">
            All Stock Status
          </MenuItem>
          <MenuItem key="in-stock" value="inStock">
            In Stock
          </MenuItem>
          <MenuItem key="low-stock" value="lowStock">
            Low Stock
          </MenuItem>
          <MenuItem key="out-of-stock" value="outOfStock">
            Out of Stock
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={onAdvancedClick}
        sx={{
          borderRadius: 1.5,
          color: PRIMARY_COLOR,
          borderColor: alpha(PRIMARY_COLOR, 0.5),
          "&:hover": {
            borderColor: PRIMARY_COLOR,
            backgroundColor: alpha(PRIMARY_COLOR, 0.1),
          },
        }}
      >
        Advanced
      </Button>
    </Paper>
  )
}

export default ProductFilters