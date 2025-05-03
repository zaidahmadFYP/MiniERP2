"use client"
import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Switch,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { PRIMARY_COLOR } from "../../ProductAddition"

const FilterDrawer = ({
  open,
  filters,
  viewOptions,
  filterTab,
  products,
  categories,
  onClose,
  onTabChange,
  onFilterChange,
  onViewOptionChange,
  onResetFilters,
}) => {
  const theme = useTheme()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          p: 2,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>
          Advanced Filters
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs
        value={filterTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              color: PRIMARY_COLOR,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: PRIMARY_COLOR,
          },
        }}
      >
        <Tab label="Filters" />
        <Tab label="View Options" />
      </Tabs>

      {filterTab === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: PRIMARY_COLOR }}>
              Price Range
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => onFilterChange("priceRange", newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={Math.max(1000, ...products.map((p) => p.price * 1.5))}
                sx={{
                  color: PRIMARY_COLOR,
                  "& .MuiSlider-thumb": {
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: `0px 0px 0px 8px ${alpha(PRIMARY_COLOR, 0.16)}`,
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  ${filters.priceRange[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${filters.priceRange[1]}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: PRIMARY_COLOR }}>
              Category
            </Typography>
            <Select
              value={filters.category || "all"}
              onChange={(e) => onFilterChange("category", e.target.value)}
              displayEmpty
              size="small"
              fullWidth
              sx={{
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
              }}
            >
              <MenuItem key="all-categories" value="all">
                All Categories
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: PRIMARY_COLOR }}>
              Stock Status
            </Typography>
            <Select
              value={filters.stockStatus || "all"}
              onChange={(e) => onFilterChange("stockStatus", e.target.value)}
              displayEmpty
              size="small"
              fullWidth
              sx={{
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
              }}
            >
              <MenuItem key="all-stock-status" value="all">
                All Stock Status
              </MenuItem>
              <MenuItem key="in-stock-status" value="inStock">
                In Stock
              </MenuItem>
              <MenuItem key="low-stock-status" value="lowStock">
                Low Stock
              </MenuItem>
              <MenuItem key="out-of-stock-status" value="outOfStock">
                Out of Stock
              </MenuItem>
            </Select>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onResetFilters}
              sx={{
                borderRadius: 1.5,
                backgroundColor: PRIMARY_COLOR,
                "&:hover": {
                  backgroundColor: alpha(PRIMARY_COLOR, 0.9),
                },
              }}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>
      )}

      {filterTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={viewOptions.compactView}
                onChange={() => onViewOptionChange("compactView")}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: PRIMARY_COLOR,
                    "&:hover": {
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: PRIMARY_COLOR,
                  },
                }}
              />
            }
            label="Compact View"
          />

          <FormControlLabel
            control={
              <Switch
                checked={viewOptions.showIngredients}
                onChange={() => onViewOptionChange("showIngredients")}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: PRIMARY_COLOR,
                    "&:hover": {
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: PRIMARY_COLOR,
                  },
                }}
              />
            }
            label="Show Ingredients"
          />

          <FormControlLabel
            control={
              <Switch
                checked={viewOptions.highlightLowStock}
                onChange={() => onViewOptionChange("highlightLowStock")}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: PRIMARY_COLOR,
                    "&:hover": {
                      backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: PRIMARY_COLOR,
                  },
                }}
              />
            }
            label="Highlight Low Stock Items"
          />
        </Box>
      )}
    </Drawer>
  )
}

export default FilterDrawer
