"use client"
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import InventoryIcon from "@mui/icons-material/Inventory"
import CategoryIcon from "@mui/icons-material/Category"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { PRIMARY_COLOR } from "../../ProductAddition"

const ProductTable = ({
  products,
  filteredProducts,
  allProducts,
  categories,
  selected,
  order,
  orderBy,
  page,
  rowsPerPage,
  viewOptions,
  onSelectAllClick,
  onSelectClick,
  onRequestSort,
  onChangePage,
  onChangeRowsPerPage,
  onViewOptionChange,
  onEdit,
  onDelete,
  onAdjustStock,
  onActionMenuOpen,
  onBulkDelete,
  onExport,
}) => {
  const theme = useTheme()
  const isSelected = (id) => selected.indexOf(id) !== -1

  // Get stock status chip
  const getStockStatusChip = (stock) => {
    if (stock <= 0) {
      return (
        <Chip
          label="Out of Stock"
          size="small"
          color="error"
          sx={{
            fontWeight: 500,
            backgroundColor: alpha("#f15a22", 0.9),
            color: "#fff",
          }}
        />
      )
    } else if (stock < 10) {
      return (
        <Chip
          label="Low Stock"
          size="small"
          color="warning"
          sx={{
            fontWeight: 500,
            backgroundColor: alpha("#f15a22", 0.6),
            color: "#fff",
          }}
        />
      )
    } else {
      return <Chip label="In Stock" size="small" color="success" sx={{ fontWeight: 500 }} />
    }
  }

  return (
    <>
      {/* Table Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          px: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selected.length > 0 ? (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {selected.length} selected
              </Typography>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onBulkDelete}
                sx={{
                  mr: 1,
                  borderRadius: 1.5,
                }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FileDownloadIcon />}
                onClick={onExport}
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
                Export
              </Button>
            </>
          ) : (
            <Typography variant="subtitle2" color="text.secondary">
              {filteredProducts.length} products found
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Toggle compact view">
            <FormControlLabel
              control={
                <Switch
                  checked={viewOptions.compactView}
                  onChange={() => onViewOptionChange("compactView")}
                  size="small"
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
              label="Compact"
              sx={{ mr: 1 }}
            />
          </Tooltip>

          <Tooltip title="Toggle ingredient display">
            <FormControlLabel
              control={
                <Switch
                  checked={viewOptions.showIngredients}
                  onChange={() => onViewOptionChange("showIngredients")}
                  size="small"
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
              label="Ingredients"
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Products Table */}
      <Paper
        elevation={2}
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
        }}
      >
        <TableContainer sx={{ maxHeight: "calc(100vh - 380px)" }}>
          <Table stickyHeader aria-label="product table" size={viewOptions.compactView ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredProducts.length}
                    checked={filteredProducts.length > 0 && selected.length === filteredProducts.length}
                    onChange={onSelectAllClick}
                    sx={{
                      color: alpha(PRIMARY_COLOR, 0.5),
                      "&.Mui-checked": {
                        color: PRIMARY_COLOR,
                      },
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => onRequestSort("id")}
                    sx={{
                      "&.MuiTableSortLabel-active": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: `${PRIMARY_COLOR} !important`,
                      },
                    }}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => onRequestSort("name")}
                    sx={{
                      "&.MuiTableSortLabel-active": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: `${PRIMARY_COLOR} !important`,
                      },
                    }}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => onRequestSort("price")}
                    sx={{
                      "&.MuiTableSortLabel-active": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: `${PRIMARY_COLOR} !important`,
                      },
                    }}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "stock"}
                    direction={orderBy === "stock" ? order : "asc"}
                    onClick={() => onRequestSort("stock")}
                    sx={{
                      "&.MuiTableSortLabel-active": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: `${PRIMARY_COLOR} !important`,
                      },
                    }}
                  >
                    Stock
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => onRequestSort("category")}
                    sx={{
                      "&.MuiTableSortLabel-active": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: `${PRIMARY_COLOR} !important`,
                      },
                    }}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                {viewOptions.showIngredients && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.9)
                          : alpha(theme.palette.background.paper, 0.9),
                    }}
                  >
                    Ingredients
                  </TableCell>
                )}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={viewOptions.showIngredients ? 8 : 7} align="center" sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <InventoryIcon sx={{ fontSize: 60, color: alpha(PRIMARY_COLOR, 0.6), mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        No products found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        {allProducts.length > 0
                          ? "Try adjusting your filters to see more products"
                          : "Add your first product to get started with inventory management"}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => onEdit(null)}
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
                        Add New Product
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const isItemSelected = isSelected(product._id)
                  const isLowStock = product.stock > 0 && product.stock <= 10
                  const isOutOfStock = product.stock <= 0

                  return (
                    <TableRow
                      key={product._id}
                      hover
                      selected={isItemSelected}
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha(PRIMARY_COLOR, 0.05),
                        },
                        "&.Mui-selected": {
                          backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                          "&:hover": {
                            backgroundColor: alpha(PRIMARY_COLOR, 0.15),
                          },
                        },
                        ...(viewOptions.highlightLowStock && isLowStock && !isItemSelected
                          ? {
                              backgroundColor: alpha("#f15a22", 0.05),
                            }
                          : {}),
                        ...(viewOptions.highlightLowStock && isOutOfStock && !isItemSelected
                          ? {
                              backgroundColor: alpha("#f15a22", 0.1),
                            }
                          : {}),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => onSelectClick(event, product._id)}
                          sx={{
                            color: alpha(PRIMARY_COLOR, 0.5),
                            "&.Mui-checked": {
                              color: PRIMARY_COLOR,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 500 }}>{product.id}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: PRIMARY_COLOR,
                            fontWeight: 500,
                          }}
                        >
                          <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {product.price.toFixed(2)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              mr: 1,
                              fontWeight: isLowStock || isOutOfStock ? 600 : 400,
                              color: isOutOfStock
                                ? alpha(PRIMARY_COLOR, 0.9)
                                : isLowStock
                                  ? alpha(PRIMARY_COLOR, 0.7)
                                  : "inherit",
                            }}
                          >
                            {product.stock}
                          </Typography>
                          {getStockStatusChip(product.stock)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CategoryIcon fontSize="small" />}
                          label={product.categoryName || "Uncategorized"}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            borderColor: alpha(PRIMARY_COLOR, 0.5),
                            color: alpha(PRIMARY_COLOR, 0.8),
                          }}
                        />
                      </TableCell>
                      {viewOptions.showIngredients && (
                        <TableCell>
                          {product.rawIngredients && product.rawIngredients.length > 0 ? (
                            <Tooltip
                              title={
                                <Box sx={{ p: 1 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Ingredients:
                                  </Typography>
                                  {product.rawIngredients.map((ing, idx) => (
                                    <Typography variant="body2" key={idx}>
                                      • {ing.Name}: {ing.RawConsume} {ing.UnitMeasure}
                                    </Typography>
                                  ))}
                                </Box>
                              }
                              arrow
                            >
                              <Chip
                                icon={<RestaurantIcon fontSize="small" />}
                                label={`${product.rawIngredients.length} ingredients`}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{
                                  fontWeight: 500,
                                  borderColor: alpha(PRIMARY_COLOR, 0.5),
                                  color: alpha(PRIMARY_COLOR, 0.8),
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No ingredients
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="right">
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Tooltip title="Edit Product">
                            <IconButton
                              color="primary"
                              onClick={() => onEdit(product)}
                              size="small"
                              sx={{
                                backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                                color: PRIMARY_COLOR,
                                "&:hover": {
                                  backgroundColor: alpha(PRIMARY_COLOR, 0.2),
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Adjust Stock">
                            <IconButton
                              onClick={() => onAdjustStock(product)}
                              size="small"
                              sx={{
                                backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                                color: PRIMARY_COLOR,
                                "&:hover": {
                                  backgroundColor: alpha(PRIMARY_COLOR, 0.2),
                                },
                              }}
                            >
                              <InventoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              color="error"
                              onClick={() => onDelete(product._id)}
                              size="small"
                              sx={{
                                backgroundColor: alpha("#f44336", 0.1),
                                "&:hover": {
                                  backgroundColor: alpha("#f44336", 0.2),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton
                              size="small"
                              onClick={(e) => onActionMenuOpen(e, product._id)}
                              sx={{
                                backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                                "&:hover": {
                                  backgroundColor: alpha(theme.palette.text.secondary, 0.2),
                                },
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              color: theme.palette.text.secondary,
            },
            "& .MuiTablePagination-select": {
              color: PRIMARY_COLOR,
            },
            "& .MuiTablePagination-actions button": {
              color: PRIMARY_COLOR,
            },
          }}
        />
      </Paper>
    </>
  )
}

export default ProductTable
