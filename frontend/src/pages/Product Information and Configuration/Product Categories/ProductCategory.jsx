"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  Typography,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  Card,
  CardContent,
  useTheme,
  Skeleton,
  Grid,
  InputAdornment,
  alpha,
  TableSortLabel,
  CircularProgress,
  Backdrop,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  TextFields as TextFieldsIcon,
  Sort as SortIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CloudDownload as CloudDownloadIcon,
  RestaurantMenu as RestaurantMenuIcon,
} from "@mui/icons-material"
import MainContentWrapper from "./MainContentWrapper"

// Brand color
const BRAND_COLOR = "#f15a22"

const ProductCategory = () => {
  // API base URL from environment variable
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002/api"
  const CATEGORIES_ENDPOINT = `${API_BASE_URL}/menu/categories`

  // Get theme from Material UI
  const theme = useTheme()

  // Theme-aware colors
  const THEME_COLOR = BRAND_COLOR
  const THEME_COLOR_LIGHT = alpha(BRAND_COLOR, theme.palette.mode === "dark" ? 0.15 : 0.1)
  const THEME_COLOR_LIGHTER = alpha(BRAND_COLOR, theme.palette.mode === "dark" ? 0.08 : 0.05)
  const THEME_COLOR_DARK = theme.palette.mode === "dark" ? "#ff6b33" : "#d44815"
  const BG_COLOR = theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.7) : "#f5f5f7"
  const CARD_BG = theme.palette.background.paper
  const TEXT_PRIMARY = theme.palette.text.primary
  const TEXT_SECONDARY = theme.palette.text.secondary
  const BORDER_COLOR = theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.3) : "rgba(224, 224, 224, 0.5)"
  const TABLE_HOVER_COLOR = theme.palette.mode === "dark" ? alpha(BRAND_COLOR, 0.15) : alpha(BRAND_COLOR, 0.05)
  const TABLE_ODD_ROW =
    theme.palette.mode === "dark" ? alpha(theme.palette.background.paper, 0.6) : alpha(BRAND_COLOR, 0.02)
  const SECONDARY_COLOR = theme.palette.mode === "dark" ? "#90a4ae" : "#2c3e50"

  // State for categories
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    withSmallText: 0,
    averageColumns: 0,
  })

  // Pagination state
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Sorting state
  const [orderBy, setOrderBy] = useState("order")
  const [order, setOrder] = useState("asc")

  // State for form
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState("add") // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState({
    id: "",
    name: "",
    columns: 2,
    smallText: false,
    order: 0,
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [page, rowsPerPage, orderBy, order])

  // Calculate stats when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const withSmallText = categories.filter((cat) => cat.smallText).length
      const totalColumns = categories.reduce((sum, cat) => sum + cat.columns, 0)
      const averageColumns = (totalColumns / categories.length).toFixed(1)

      setStats({
        total: categories.length,
        withSmallText,
        averageColumns,
      })
    } else {
      setStats({
        total: 0,
        withSmallText: 0,
        averageColumns: 0,
      })
    }
  }, [categories])

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      setLoading(true)
      // Build query parameters for pagination and sorting
      const queryParams = new URLSearchParams({
        page,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
      }).toString()

      const response = await fetch(`${CATEGORIES_ENDPOINT}?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()

      // Extract categories and pagination info
      const { categories: categoriesData, totalPages: totalPagesData } = data

      // Map the categories to our format
      const categoriesOnly = categoriesData.map((category) => ({
        _id: category._id,
        id: category.id,
        name: category.name,
        columns: category.columns,
        smallText: category.smallText,
        order: category.order,
      }))

      setCategories(categoriesOnly)
      setTotalPages(totalPagesData || Math.ceil(categoriesOnly.length / rowsPerPage))
      setError(null)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Function to refresh categories
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCategories()
    setRefreshing(false)
  }

  // Function to handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  // Function to handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(1)
  }

  // Function to handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  // Function to handle opening the add dialog
  const handleAddClick = () => {
    setCurrentCategory({
      id: `CAT${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      name: "",
      columns: 2,
      smallText: false,
      order: categories.length > 0 ? Math.max(...categories.map((cat) => cat.order)) + 1 : 0,
    })
    setFormErrors({})
    setDialogMode("add")
    setOpenDialog(true)
  }

  // Function to handle opening the edit dialog
  const handleEditClick = (category) => {
    setCurrentCategory({ ...category })
    setFormErrors({})
    setDialogMode("edit")
    setOpenDialog(true)
  }

  // Function to handle opening the delete confirmation dialog
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target
    setCurrentCategory({
      ...currentCategory,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value, 10) : value,
    })

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  // Function to validate form
  const validateForm = () => {
    const errors = {}
    if (!currentCategory.name.trim()) {
      errors.name = "Category name is required"
    }
    if (currentCategory.columns < 1 || currentCategory.columns > 6) {
      errors.columns = "Columns must be between 1 and 6"
    }
    if (currentCategory.order < 0) {
      errors.order = "Order must be a positive number"
    }
    return errors
  }

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const method = dialogMode === "add" ? "POST" : "PUT"
      const url = dialogMode === "add" ? CATEGORIES_ENDPOINT : `${CATEGORIES_ENDPOINT}/${currentCategory._id}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCategory),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${dialogMode} category`)
      }

      // Refresh the categories list
      await fetchCategories()

      // Show success message
      setSnackbar({
        open: true,
        message: `Category ${dialogMode === "add" ? "added" : "updated"} successfully!`,
        severity: "success",
      })

      // Close the dialog
      setOpenDialog(false)
    } catch (err) {
      console.error(`Error ${dialogMode}ing category:`, err)
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode} category. ${err.message}`,
        severity: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle category deletion
  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`${CATEGORIES_ENDPOINT}/${categoryToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete category")
      }

      // Refresh the categories list
      await fetchCategories()

      // Show success message
      setSnackbar({
        open: true,
        message: "Category deleted successfully!",
        severity: "success",
      })

      // Close the dialog
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error("Error deleting category:", err)
      setSnackbar({
        open: true,
        message: `Failed to delete category. ${err.message}`,
        severity: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Function to export categories as JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(categories, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `menu-categories-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Function to export categories as CSV
  const handleExportCSV = () => {
    // CSV header
    const csvHeader = ["ID", "Name", "Columns", "Small Text", "Order"]

    // Convert categories to CSV rows
    const csvRows = categories.map((cat) => [cat.id, cat.name, cat.columns, cat.smallText ? "Yes" : "No", cat.order])

    // Combine header and rows
    const csvContent = [csvHeader.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

    const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)

    const exportFileDefaultName = `menu-categories-${new Date().toISOString().split("T")[0]}.csv`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Function to close the snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <MainContentWrapper open={true}>
      <Box sx={{ width: "100%", height: "100%", overflow: "auto", px: { xs: 2, md: 4 }, bgcolor: BG_COLOR }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            mb: 4,
            mt: 2,
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              {/* <RestaurantMenuIcon sx={{ color: THEME_COLOR, fontSize: 32 }} /> */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: TEXT_PRIMARY,
                  "& span": { color: THEME_COLOR },
                }}
              >
                <span>Product Categories</span>
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Manage your menu categories and their display settings. Categories determine how your menu items are
              organized.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExportJSON}
              sx={{
                minWidth: 130,
                color: THEME_COLOR,
                borderColor: THEME_COLOR,
                "&:hover": {
                  borderColor: THEME_COLOR_DARK,
                  bgcolor: THEME_COLOR_LIGHT,
                },
                borderRadius: "8px",
              }}
            >
              Export JSON
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExportCSV}
              sx={{
                minWidth: 130,
                color: THEME_COLOR,
                borderColor: THEME_COLOR,
                "&:hover": {
                  borderColor: THEME_COLOR_DARK,
                  bgcolor: THEME_COLOR_LIGHT,
                },
                borderRadius: "8px",
              }}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading || refreshing}
              sx={{
                minWidth: 130,
                color: THEME_COLOR,
                borderColor: THEME_COLOR,
                "&:hover": {
                  borderColor: THEME_COLOR_DARK,
                  bgcolor: THEME_COLOR_LIGHT,
                },
                borderRadius: "8px",
              }}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                minWidth: 160,
                bgcolor: THEME_COLOR,
                "&:hover": { bgcolor: THEME_COLOR_DARK },
                borderRadius: "8px",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? `0 4px 12px ${alpha(THEME_COLOR, 0.4)}`
                    : `0 4px 12px ${alpha(THEME_COLOR, 0.2)}`,
              }}
            >
              Add Category
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderLeft: `4px solid ${THEME_COLOR}`,
                boxShadow: theme.palette.mode === "dark" ? `0 4px 20px rgba(0,0,0,0.2)` : `0 4px 20px rgba(0,0,0,0.08)`,
                height: "100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                bgcolor: CARD_BG,
                border: theme.palette.mode === "dark" ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 8px 30px ${alpha(THEME_COLOR, 0.25)}`
                      : `0 8px 30px ${alpha(THEME_COLOR, 0.15)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" sx={{ color: THEME_COLOR, fontWeight: 600, letterSpacing: 1 }}>
                  Total Categories
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 1, color: TEXT_PRIMARY }}>
                  {loading ? <Skeleton width={60} /> : stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loading ? <Skeleton width={120} /> : `Last updated: ${new Date().toLocaleTimeString()}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderLeft: `4px solid ${SECONDARY_COLOR}`,
                boxShadow: theme.palette.mode === "dark" ? `0 4px 20px rgba(0,0,0,0.2)` : `0 4px 20px rgba(0,0,0,0.08)`,
                height: "100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                bgcolor: CARD_BG,
                border: theme.palette.mode === "dark" ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 8px 30px ${alpha(SECONDARY_COLOR, 0.25)}`
                      : `0 8px 30px ${alpha(SECONDARY_COLOR, 0.15)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" sx={{ color: SECONDARY_COLOR, fontWeight: 600, letterSpacing: 1 }}>
                  Small Text Categories
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 1, color: TEXT_PRIMARY }}>
                  {loading ? <Skeleton width={60} /> : stats.withSmallText}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loading ? (
                    <Skeleton width={120} />
                  ) : (
                    `${((stats.withSmallText / stats.total) * 100 || 0).toFixed(1)}% of total categories`
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderLeft: `4px solid ${THEME_COLOR}`,
                boxShadow: theme.palette.mode === "dark" ? `0 4px 20px rgba(0,0,0,0.2)` : `0 4px 20px rgba(0,0,0,0.08)`,
                height: "100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                bgcolor: CARD_BG,
                border: theme.palette.mode === "dark" ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 8px 30px ${alpha(THEME_COLOR, 0.25)}`
                      : `0 8px 30px ${alpha(THEME_COLOR, 0.15)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" sx={{ color: THEME_COLOR, fontWeight: 600, letterSpacing: 1 }}>
                  Average Columns
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 1, color: TEXT_PRIMARY }}>
                  {loading ? <Skeleton width={60} /> : stats.averageColumns}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loading ? <Skeleton width={120} /> : `Range: 1-6 columns per category`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: CARD_BG,
            borderRadius: 2,
            boxShadow: theme.palette.mode === "dark" ? `0 2px 8px rgba(0,0,0,0.2)` : `0 2px 8px rgba(0,0,0,0.05)`,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
            border: theme.palette.mode === "dark" ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search categories by name or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: THEME_COLOR }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : "white",
                "&:hover": {
                  boxShadow: `0 0 0 2px ${alpha(THEME_COLOR, 0.2)}`,
                },
                "&.Mui-focused": {
                  boxShadow: `0 0 0 2px ${alpha(THEME_COLOR, 0.3)}`,
                },
              },
            }}
            size="small"
          />
          <Box sx={{ display: "flex", gap: 2, minWidth: { xs: "100%", sm: "auto" } }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Rows</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                label="Rows"
                sx={{
                  bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : "white",
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{
                minWidth: 100,
                color: THEME_COLOR,
                borderColor: THEME_COLOR,
                "&:hover": {
                  borderColor: THEME_COLOR_DARK,
                  bgcolor: THEME_COLOR_LIGHT,
                },
                borderRadius: "8px",
              }}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 1, borderRadius: 1 }} />
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rectangular" width="100%" height={40} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderLeft: "4px solid #f44336",
              "& .MuiAlert-icon": { color: "#f44336" },
              borderRadius: 2,
              boxShadow: theme.palette.mode === "dark" ? `0 2px 8px rgba(0,0,0,0.2)` : `0 2px 8px rgba(0,0,0,0.05)`,
            }}
          >
            {error}
          </Alert>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: theme.palette.mode === "dark" ? `0 4px 20px rgba(0,0,0,0.2)` : `0 4px 20px rgba(0,0,0,0.08)`,
              border:
                theme.palette.mode === "dark"
                  ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  : "1px solid rgba(0,0,0,0.05)",
              bgcolor: CARD_BG,
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.default, 0.4)
                          : alpha(THEME_COLOR, 0.05),
                      "& .MuiTableCell-head": {
                        color: TEXT_PRIMARY,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "id"}
                        direction={orderBy === "id" ? order : "asc"}
                        onClick={() => handleRequestSort("id")}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleRequestSort("name")}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "columns"}
                        direction={orderBy === "columns" ? order : "asc"}
                        onClick={() => handleRequestSort("columns")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          Columns
                          <Tooltip title="Number of columns used to display items in this category">
                            <InfoIcon fontSize="small" sx={{ color: THEME_COLOR, opacity: 0.7 }} />
                          </Tooltip>
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        Small Text
                        <Tooltip title="Whether to use smaller text for this category">
                          <InfoIcon fontSize="small" sx={{ color: THEME_COLOR, opacity: 0.7 }} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "order"}
                        direction={orderBy === "order" ? order : "asc"}
                        onClick={() => handleRequestSort("order")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          Order
                          <Tooltip title="Display order of the category (lower numbers appear first)">
                            <InfoIcon fontSize="small" sx={{ color: THEME_COLOR, opacity: 0.7 }} />
                          </Tooltip>
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: TABLE_ODD_ROW },
                        "&:hover": { bgcolor: TABLE_HOVER_COLOR },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={category.id}
                          size="small"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: 600,
                            bgcolor: theme.palette.mode === "dark" ? alpha(THEME_COLOR, 0.15) : alpha(THEME_COLOR, 0.1),
                            color: THEME_COLOR,
                            border: `1px solid ${alpha(THEME_COLOR, theme.palette.mode === "dark" ? 0.3 : 0.2)}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<ViewColumnIcon />}
                          label={category.columns}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: THEME_COLOR,
                            color: THEME_COLOR,
                            "& .MuiChip-icon": { color: THEME_COLOR },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {category.smallText ? (
                          <Chip
                            icon={<TextFieldsIcon />}
                            label="Yes"
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: THEME_COLOR,
                              color: THEME_COLOR,
                              bgcolor: alpha(THEME_COLOR, 0.1),
                              "& .MuiChip-icon": { color: THEME_COLOR },
                            }}
                          />
                        ) : (
                          <Chip
                            label="No"
                            size="small"
                            variant="outlined"
                            color="default"
                            sx={{
                              borderColor:
                                theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.5) : undefined,
                              color: TEXT_SECONDARY,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<SortIcon />}
                          label={category.order}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: SECONDARY_COLOR,
                            color: SECONDARY_COLOR,
                            "& .MuiChip-icon": { color: SECONDARY_COLOR },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Category">
                          <IconButton
                            onClick={() => handleEditClick(category)}
                            size="small"
                            sx={{
                              backgroundColor: alpha(THEME_COLOR, theme.palette.mode === "dark" ? 0.15 : 0.1),
                              mr: 1,
                              color: THEME_COLOR,
                              "&:hover": {
                                backgroundColor: alpha(THEME_COLOR, theme.palette.mode === "dark" ? 0.25 : 0.2),
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Category">
                          <IconButton
                            onClick={() => handleDeleteClick(category)}
                            size="small"
                            sx={{
                              backgroundColor: alpha("#f44336", theme.palette.mode === "dark" ? 0.15 : 0.1),
                              color: "#f44336",
                              "&:hover": {
                                backgroundColor: alpha("#f44336", theme.palette.mode === "dark" ? 0.25 : 0.2),
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s",
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <Typography variant="h6" color="text.secondary">
                            No categories found
                          </Typography>
                          {searchTerm ? (
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your search term or clear the search
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Add a new category to get started
                            </Typography>
                          )}
                          {searchTerm && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setSearchTerm("")}
                              sx={{
                                mt: 1,
                                color: THEME_COLOR,
                                borderColor: THEME_COLOR,
                                "&:hover": {
                                  borderColor: THEME_COLOR_DARK,
                                  bgcolor: THEME_COLOR_LIGHT,
                                },
                                borderRadius: "8px",
                              }}
                            >
                              Clear Search
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.2) : "rgba(0,0,0,0.05)"}`,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.default, 0.4)
                    : alpha(THEME_COLOR, 0.02),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredCategories.length} of {categories.length} categories
                {searchTerm && " (filtered)"}
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                size="medium"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      backgroundColor: alpha(THEME_COLOR, theme.palette.mode === "dark" ? 0.3 : 0.2),
                      color: THEME_COLOR,
                      fontWeight: 600,
                    },
                    color: TEXT_PRIMARY,
                  },
                }}
              />
            </Box>
          </Paper>
        )}

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => !isSubmitting && setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.1)",
              overflow: "hidden",
              bgcolor: CARD_BG,
              border: theme.palette.mode === "dark" ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: THEME_COLOR,
              color: "white",
              fontWeight: 600,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb:2,
            }}
          >
            {dialogMode === "add" ? <AddIcon /> : <EditIcon />}
            {dialogMode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* First row - ID and Name */}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="subtitle2"
                    component="label"
                    htmlFor="category-id"
                    sx={{ mb: 1, color: TEXT_PRIMARY }}
                  >
                    Category ID
                  </Typography>
                  <TextField
                    id="category-id"
                    name="id"
                    fullWidth
                    variant="outlined"
                    value={currentCategory.id}
                    onChange={handleInputChange}
                    disabled={dialogMode === "edit"}
                    InputProps={{
                      sx: {
                        fontFamily: "monospace",
                        fontWeight: 500,
                        bgcolor:
                          theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : undefined,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {dialogMode === "add" ? "Auto-generated unique identifier" : "ID cannot be changed after creation"}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="subtitle2"
                    component="label"
                    htmlFor="category-name"
                    sx={{ mb: 1, color: TEXT_PRIMARY }}
                  >
                    Category Name*
                  </Typography>
                  <TextField
                    id="category-name"
                    name="name"
                    fullWidth
                    variant="outlined"
                    value={currentCategory.name}
                    onChange={handleInputChange}
                    required
                    error={!!formErrors.name}
                    InputProps={{
                      sx: {
                        bgcolor:
                          theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : undefined,
                      },
                    }}
                  />
                  <Typography variant="caption" color={formErrors.name ? "error" : "text.secondary"} sx={{ mt: 1 }}>
                    {formErrors.name || "Display name for the category"}
                  </Typography>
                </Box>
              </Box>

              {/* Second row - Columns and Order */}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="subtitle2"
                    component="label"
                    htmlFor="category-columns"
                    sx={{ mb: 1, color: TEXT_PRIMARY }}
                  >
                    Number of Columns
                  </Typography>
                  <TextField
                    id="category-columns"
                    name="columns"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={currentCategory.columns}
                    onChange={handleInputChange}
                    InputProps={{
                      inputProps: { min: 1, max: 6 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <ViewColumnIcon sx={{ color: THEME_COLOR }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor:
                          theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : undefined,
                      },
                    }}
                    error={!!formErrors.columns}
                  />
                  <Typography variant="caption" color={formErrors.columns ? "error" : "text.secondary"} sx={{ mt: 1 }}>
                    {formErrors.columns || "Number of columns to display items (1-6)"}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="subtitle2"
                    component="label"
                    htmlFor="category-order"
                    sx={{ mb: 1, color: TEXT_PRIMARY }}
                  >
                    Display Order
                  </Typography>
                  <TextField
                    id="category-order"
                    name="order"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={currentCategory.order}
                    onChange={handleInputChange}
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <SortIcon sx={{ color: THEME_COLOR }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor:
                          theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : undefined,
                      },
                    }}
                    error={!!formErrors.order}
                  />
                  <Typography variant="caption" color={formErrors.order ? "error" : "text.secondary"} sx={{ mt: 1 }}>
                    {formErrors.order || "Lower numbers appear first"}
                  </Typography>
                </Box>
              </Box>

              {/* Small Text Toggle */}
              <Box sx={{ mt: 1 }}>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.2) : "rgba(0,0,0,0.1)"}`,
                    borderRadius: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: currentCategory.smallText
                      ? theme.palette.mode === "dark"
                        ? alpha(THEME_COLOR, 0.15)
                        : alpha(THEME_COLOR, 0.05)
                      : theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.default, 0.4)
                        : "transparent",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                      Use Small Text
                    </Typography>
                    <Switch
                      checked={currentCategory.smallText}
                      onChange={handleInputChange}
                      name="smallText"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: THEME_COLOR,
                          "&:hover": {
                            backgroundColor: alpha(THEME_COLOR, 0.1),
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: THEME_COLOR,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Enable for categories with longer item names or limited space
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 3,
              borderTop: `1px solid ${theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.2) : "rgba(0,0,0,0.1)"}`,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => setOpenDialog(false)}
              startIcon={<CancelIcon />}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2 }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={!currentCategory.name || isSubmitting}
              sx={{
                borderRadius: 2,
                px: 3,
                bgcolor: THEME_COLOR,
                "&:hover": { bgcolor: THEME_COLOR_DARK },
              }}
            >
              {isSubmitting ? "Saving..." : dialogMode === "add" ? "Add Category" : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !isDeleting && setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.1)",
              overflow: "hidden",
              bgcolor: CARD_BG,
              border: theme.palette.mode === "dark" ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#f44336",
              color: "white",
              fontWeight: 600,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DeleteIcon />
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Typography variant="body1" sx={{ mb: 2, color: TEXT_PRIMARY }}>
              Are you sure you want to delete the category{" "}
              <Typography component="span" fontWeight={600} color={THEME_COLOR}>
                "{categoryToDelete?.name}"
              </Typography>
              ?
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. All menu items in this category may be affected.
            </Alert>
            {categoryToDelete && (
              <Box
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.default, 0.4)
                      : alpha(THEME_COLOR, 0.05),
                  borderRadius: 1,
                  p: 2,
                  border: `1px solid ${theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.2) : "rgba(0,0,0,0.05)"}`,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Category ID
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace" fontWeight={500} color={TEXT_PRIMARY}>
                      {categoryToDelete.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Display Order
                    </Typography>
                    <Typography variant="body2" color={TEXT_PRIMARY}>
                      {categoryToDelete.order}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.2) : "rgba(0,0,0,0.1)"}`,
            }}
          >
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2 }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              sx={{ borderRadius: 2 }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Backdrop for loading states */}
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={refreshing}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress color="inherit" />
            <Typography variant="body1" color="white">
              Refreshing categories...
            </Typography>
          </Box>
        </Backdrop>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              boxShadow: theme.palette.mode === "dark" ? "0 2px 10px rgba(0,0,0,0.2)" : "0 2px 10px rgba(0,0,0,0.1)",
              borderLeft: `4px solid ${snackbar.severity === "success" ? "#4caf50" : "#f44336"}`,
              bgcolor:
                theme.palette.mode === "dark"
                  ? snackbar.severity === "success"
                    ? alpha("#4caf50", 0.9)
                    : alpha("#f44336", 0.9)
                  : undefined,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainContentWrapper>
  )
}

export default ProductCategory
