import { useEffect } from "react"
import { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Chip,
  Tooltip,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
  Badge,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Container,
} from "@mui/material"

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  SearchRounded as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
  Help as HelpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material"
import MainContentWrapper from "./MainContentWrapper"

const StockManagement = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  // Define brand color
  const brandColor = "#f15a22"

  // Define colors based on current theme mode
  const colors = {
    primary: brandColor,
    primaryLight: isDarkMode ? alpha(brandColor, 0.2) : "#fff5f0",
    primaryBorder: isDarkMode ? alpha(brandColor, 0.3) : "#ffe0d0",
    cardBg: isDarkMode ? alpha(brandColor, 0.05) : "linear-gradient(135deg, #fff5f0 0%, #ffffff 100%)",
    tableBorderLeft: isDarkMode ? 2 : 4,
    tableHoverBg: isDarkMode ? alpha(brandColor, 0.1) : "#fff5f0",
    dialogBorderTop: isDarkMode ? 3 : 4,
    chipBg: isDarkMode ? alpha(brandColor, 0.15) : "#f5f5f5",
    shadow: isDarkMode ? "0 8px 16px rgba(0,0,0,0.2)" : `0 8px 24px ${alpha(brandColor, 0.08)}`,
    cardShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.15)" : `0 6px 18px ${alpha(brandColor, 0.05)}`,
    highlight: isDarkMode ? alpha(brandColor, 0.3) : alpha(brandColor, 0.15),
  }

  // Override theme colors
  const themeOverrides = {
    info: {
      main: brandColor,
      light: alpha(brandColor, 0.5),
      dark: alpha(brandColor, 0.7),
    },
  }

  // State for BOM data
  const [bomData, setBomData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalItems: 0,
    totalQuantity: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    averageStock: 0,
  })

  // State for dialogs
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openHelpDialog, setOpenHelpDialog] = useState(false)

  // State for current item being edited or deleted
  const [currentItem, setCurrentItem] = useState(null)
  const [newItem, setNewItem] = useState({
    RawID: "",
    Name: "",
    UnitMeasure: "",
    Quantity: 0,
  })

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)
  const [filterOptions, setFilterOptions] = useState({
    showLowStock: true,
    showOutOfStock: true,
    showInStock: true,
    showHighStock: true,
  })

  // State for sort
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null)
  const [sortOption, setSortOption] = useState("name-asc")

  // State for view mode
  const [viewMode, setViewMode] = useState(0) // 0 = table, 1 = cards

  // State for actions menu
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null)

  // State for expanded help section
  const [expandedHelp, setExpandedHelp] = useState(false)

  // Fetch BOM data on component mount
  useEffect(() => {
    fetchBomData()
  }, [])

  // Calculate stats when bomData changes
  useEffect(() => {
    if (bomData.length > 0) {
      const totalQuantity = bomData.reduce((sum, item) => sum + (Number(item.Quantity) || 0), 0)
      const lowStockItems = bomData.filter((item) => Number(item.Quantity) > 0 && Number(item.Quantity) < 10).length
      const outOfStockItems = bomData.filter((item) => Number(item.Quantity) <= 0).length
      const averageStock = Math.round(totalQuantity / bomData.length)

      setStats({
        totalItems: bomData.length,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        averageStock,
      })
    }
  }, [bomData])

  // Filter and sort data
  const getFilteredAndSortedData = () => {
    let filteredData = [...bomData]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredData = filteredData.filter(
        (item) =>
          item.RawID.toLowerCase().includes(term) ||
          item.Name.toLowerCase().includes(term) ||
          item.UnitMeasure.toLowerCase().includes(term),
      )
    }

    // Apply stock level filters
    filteredData = filteredData.filter((item) => {
      const qty = Number(item.Quantity)
      if (qty <= 0 && !filterOptions.showOutOfStock) return false
      if (qty > 0 && qty < 10 && !filterOptions.showLowStock) return false
      if (qty >= 10 && qty < 50 && !filterOptions.showInStock) return false
      if (qty >= 50 && !filterOptions.showHighStock) return false
      return true
    })

    // Apply sorting
    switch (sortOption) {
      case "name-asc":
        filteredData.sort((a, b) => a.Name.localeCompare(b.Name))
        break
      case "name-desc":
        filteredData.sort((a, b) => b.Name.localeCompare(a.Name))
        break
      case "id-asc":
        filteredData.sort((a, b) => a.RawID.localeCompare(b.RawID))
        break
      case "id-desc":
        filteredData.sort((a, b) => b.RawID.localeCompare(a.RawID))
        break
      case "qty-asc":
        filteredData.sort((a, b) => Number(a.Quantity) - Number(b.Quantity))
        break
      case "qty-desc":
        filteredData.sort((a, b) => Number(b.Quantity) - Number(a.Quantity))
        break
      default:
        break
    }

    return filteredData
  }

  const filteredAndSortedData = getFilteredAndSortedData()

  // Function to fetch BOM data
  const fetchBomData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5002/api/menu/bom")
      if (!response.ok) {
        throw new Error("Failed to fetch BOM data")
      }
      const data = await response.json()
      console.log("Fetched BOM data:", data)
      setBomData(data)
      showNotification("Stock data refreshed successfully", "success")
    } catch (err) {
      setError(err.message)
      showNotification(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  // Function to update BOM data
  const updateBomData = async (updatedData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5002/api/menu/bom", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update BOM data")
      }

      const result = await response.json()
      showNotification("Stock data updated successfully", "success")
      fetchBomData() // Refresh data after update
    } catch (err) {
      setError(err.message)
      showNotification(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  // Function to add new BOM item
  const addBomItem = async (newItemData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5002/api/menu/bom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([newItemData]), // API expects an array
      })

      if (!response.ok) {
        throw new Error("Failed to add BOM item")
      }

      const result = await response.json()
      showNotification("New stock item added successfully", "success")
      fetchBomData() // Refresh data after adding
    } catch (err) {
      setError(err.message)
      showNotification(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  // Function to export data as CSV
  const exportToCSV = () => {
    if (bomData.length === 0) {
      showNotification("No data to export", "warning")
      return
    }

    // Create CSV content
    const headers = ["Raw ID", "Name", "Unit Measure", "Quantity", "Stock Status"]
    const csvContent = [
      headers.join(","),
      ...bomData.map((item) => {
        const stockStatus = getStockLevelLabel(item.Quantity)
        return [
          item.RawID,
          `"${item.Name}"`, // Wrap in quotes to handle commas in names
          `"${item.UnitMeasure}"`,
          item.Quantity,
          `"${stockStatus}"`,
        ].join(",")
      }),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, "-")
    link.setAttribute("download", `stock_inventory_${formattedDate}_${formattedTime}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Inventory data exported successfully", "success")
  }

  // Function to print inventory report
  const printInventory = () => {
    if (bomData.length === 0) {
      showNotification("No data to print", "warning")
      return
    }

    // Create a printable version
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Inventory Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: bold; }
            .date { font-size: 14px; color: #666; }
            .summary { margin: 20px 0; display: flex; gap: 20px; }
            .summary-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .low-stock { background-color: #fff3cd; }
            .out-of-stock { background-color: #f8d7da; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Stock Inventory Report</div>
            <div class="date">Generated on: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="summary">
            <div class="summary-item">Total Items: ${stats.totalItems}</div>
            <div class="summary-item">Total Quantity: ${stats.totalQuantity}</div>
            <div class="summary-item low-stock">Low Stock Items: ${stats.lowStockItems}</div>
            <div class="summary-item out-of-stock">Out of Stock Items: ${stats.outOfStockItems}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Raw ID</th>
                <th>Name</th>
                <th>Unit Measure</th>
                <th>Quantity</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              ${bomData
                .map((item) => {
                  const stockStatus = getStockLevelLabel(item.Quantity)
                  let rowClass = ""
                  if (Number(item.Quantity) <= 0) rowClass = "out-of-stock"
                  else if (Number(item.Quantity) < 10) rowClass = "low-stock"

                  return `
                  <tr class="${rowClass}">
                    <td>${item.RawID}</td>
                    <td>${item.Name}</td>
                    <td>${item.UnitMeasure}</td>
                    <td>${item.Quantity}</td>
                    <td>${stockStatus}</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()">Print Report</button>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()

    showNotification("Print preview opened in new tab", "success")
  }

  // Function to handle edit button click
  const handleEditClick = (item) => {
    setCurrentItem(item)
    setOpenEditDialog(true)
  }

  // Function to handle delete button click
  const handleDeleteClick = (item) => {
    setCurrentItem(item)
    setOpenDeleteDialog(true)
  }

  // Function to handle add button click
  const handleAddClick = () => {
    setNewItem({
      RawID: `RAW${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`, // Generate a default ID
      Name: "",
      UnitMeasure: "",
      Quantity: 0,
    })
    setOpenAddDialog(true)
  }

  // Function to handle edit dialog save
  const handleEditSave = async () => {
    if (!currentItem || !currentItem._id) {
      showNotification("Item ID is missing", "error")
      setOpenEditDialog(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5002/api/menu/bom/${currentItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentItem),
      })

      if (!response.ok) {
        throw new Error("Failed to update BOM item")
      }

      const result = await response.json()
      showNotification(`Item "${currentItem.Name}" updated successfully`, "success")
      fetchBomData() // Refresh data after update
    } catch (err) {
      setError(err.message)
      showNotification(err.message, "error")
    } finally {
      setLoading(false)
      setOpenEditDialog(false)
    }
  }

  // Function to handle add dialog save
  const handleAddSave = () => {
    // Validate form first
    if (!newItem.RawID || !newItem.Name || !newItem.UnitMeasure) {
      showNotification("Please fill all required fields", "error")
      return
    }

    addBomItem(newItem)
    setOpenAddDialog(false)
  }

  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!currentItem || !currentItem._id) {
      showNotification("Item ID is missing", "error")
      setOpenDeleteDialog(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5002/api/menu/bom/${currentItem._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete BOM item")
      }

      const result = await response.json()
      showNotification(`Item "${currentItem.Name}" deleted successfully`, "success")
      fetchBomData() // Refresh data after deletion
    } catch (err) {
      setError(err.message)
      showNotification(err.message, "error")
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
    }
  }

  // Function to show notifications
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  // Function to determine stock level color - dark mode compatible
  const getStockLevelColor = (quantity) => {
    const numQuantity = Number(quantity)
    if (numQuantity <= 0) return theme.palette.error.main // Red for out of stock
    if (numQuantity < 10) return theme.palette.warning.main // Orange for low stock
    if (numQuantity < 50) return theme.palette.success.main // Green for good stock
    return colors.primary // Brand color for high stock
  }

  // Function to get stock level label
  const getStockLevelLabel = (quantity) => {
    const numQuantity = Number(quantity)
    if (numQuantity <= 0) return "Out of Stock"
    if (numQuantity < 10) return "Low Stock"
    if (numQuantity < 50) return "In Stock"
    return "High Stock"
  }

  // Function to get stock level badge content
  const getStockLevelBadge = (item) => {
    const qty = Number(item.Quantity)
    const color = getStockLevelColor(qty)
    const label = getStockLevelLabel(qty)

    // Icon based on stock level
    let StockIcon = CheckCircleIcon
    if (qty <= 0) StockIcon = WarningIcon
    else if (qty < 10) StockIcon = InfoIcon

    return (
      <Chip
        icon={<StockIcon fontSize="small" />}
        label={label}
        size="small"
        sx={{
          backgroundColor: alpha(color, isDarkMode ? 0.2 : 0.1),
          color: color,
          fontWeight: 600,
          fontSize: "0.7rem",
          border: `1px solid ${alpha(color, 0.3)}`,
          px: 1,
          "& .MuiChip-icon": {
            mr: 0.5,
          },
          "& .MuiChip-label": {
            px: 1,
          },
        }}
      />
    )
  }

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterMenuAnchor(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterMenuAnchor(null)
  }

  const handleFilterChange = (filter) => {
    setFilterOptions({
      ...filterOptions,
      [filter]: !filterOptions[filter],
    })
  }

  // Handle sort menu
  const handleSortClick = (event) => {
    setSortMenuAnchor(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortMenuAnchor(null)
  }

  const handleSortChange = (option) => {
    setSortOption(option)
    setSortMenuAnchor(null)
  }

  // Handle actions menu
  const handleActionsClick = (event) => {
    setActionsMenuAnchor(event.currentTarget)
  }

  const handleActionsClose = () => {
    setActionsMenuAnchor(null)
  }

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue)
  }

  // Handle help dialog
  const handleHelpOpen = () => {
    setOpenHelpDialog(true)
  }

  const handleHelpClose = () => {
    setOpenHelpDialog(false)
  }

  // Handle quantity change in edit dialog
  const handleQuantityChange = (e, isCurrentItem = true) => {
    const value = e.target.value === "" ? "" : Number(e.target.value)

    if (isCurrentItem) {
      setCurrentItem({ ...currentItem, Quantity: value })
    } else {
      setNewItem({ ...newItem, Quantity: value })
    }
  }

  return (
    <MainContentWrapper>
      <Box
        sx={{
          position: "relative",
          margin: "0 auto",
          height: "100%",
          overflow: "auto", // Enable scrolling
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3, flexGrow: 1 }}>
          {/* Header Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 4,
              borderRadius: 2,
              background: isDarkMode
                ? "rgba(255, 255, 255, 0.05)"
                : "linear-gradient(135deg, #fff5f0 0%, #ffffff 100%)",
              borderBottom: `3px solid ${colors.primary}`,
              boxShadow: colors.shadow,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    bgcolor: colors.primaryLight,
                    p: 1.5,
                    borderRadius: "12px",
                    display: "flex",
                    mr: 2,
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 36, color: colors.primary }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}
                  >
                    Stock Management
                    <Chip
                      label={`${stats.totalItems} items`}
                      size="small"
                      sx={{
                        ml: 2,
                        bgcolor: colors.primary,
                        color: "white",
                        fontWeight: 600,
                        height: "24px",
                      }}
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Manage your inventory, track stock levels, and update quantities
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <TextField
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: "200px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "white",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm("")}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />

                <Tooltip title="Filter items">
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon sx={{ color: colors.primary }} />}
                    onClick={handleFilterClick}
                    sx={{
                      borderRadius: 2,
                      bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "white",
                      height: "40px",
                      color: colors.primary,
                      borderColor: colors.primary,
                      "&:hover": {
                        borderColor: alpha(colors.primary, 0.8),
                        bgcolor: alpha(colors.primary, 0.05),
                      },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ color: colors.primary }} />}
                  >
                    Filter
                  </Button>
                </Tooltip>

                <Menu
                  anchorEl={filterMenuAnchor}
                  open={Boolean(filterMenuAnchor)}
                  onClose={handleFilterClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      width: 250,
                      padding: 1,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography sx={{ px: 2, py: 1, fontWeight: 600 }}>Stock Status Filter</Typography>
                  <Divider sx={{ mb: 1 }} />

                  <MenuItem dense>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filterOptions.showOutOfStock}
                          onChange={() => handleFilterChange("showOutOfStock")}
                          color="error"
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WarningIcon fontSize="small" color="error" />
                          <Typography variant="body2">Out of Stock</Typography>
                        </Box>
                      }
                    />
                  </MenuItem>

                  <MenuItem dense>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filterOptions.showLowStock}
                          onChange={() => handleFilterChange("showLowStock")}
                          color="warning"
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <InfoIcon fontSize="small" color="warning" />
                          <Typography variant="body2">Low Stock</Typography>
                        </Box>
                      }
                    />
                  </MenuItem>

                  <MenuItem dense>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filterOptions.showInStock}
                          onChange={() => handleFilterChange("showInStock")}
                          color="success"
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                          <Typography variant="body2">In Stock</Typography>
                        </Box>
                      }
                    />
                  </MenuItem>

                  <MenuItem dense>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filterOptions.showHighStock}
                          onChange={() => handleFilterChange("showHighStock")}
                          sx={{
                            "&.Mui-checked": {
                              color: colors.primary,
                            },
                            "& .MuiSwitch-track": {
                              backgroundColor: alpha(colors.primary, 0.5),
                            },
                          }}
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TrendingUpIcon fontSize="small" sx={{ color: colors.primary }} />
                          <Typography variant="body2">High Stock</Typography>
                        </Box>
                      }
                    />
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1 }}>
                    <Button
                      size="small"
                      onClick={handleFilterClose}
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 2, fontSize: "0.75rem" }}
                    >
                      Apply Filters
                    </Button>
                  </Box>
                </Menu>

                <Tooltip title="Sort items">
                  <Button
                    variant="outlined"
                    startIcon={<SortIcon sx={{ color: colors.primary }} />}
                    onClick={handleSortClick}
                    sx={{
                      borderRadius: 2,
                      bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "white",
                      height: "40px",
                      color: colors.primary,
                      borderColor: colors.primary,
                      "&:hover": {
                        borderColor: alpha(colors.primary, 0.8),
                        bgcolor: alpha(colors.primary, 0.05),
                      },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ color: colors.primary }} />}
                  >
                    Sort
                  </Button>
                </Tooltip>

                <Menu
                  anchorEl={sortMenuAnchor}
                  open={Boolean(sortMenuAnchor)}
                  onClose={handleSortClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      width: 200,
                      padding: 1,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography sx={{ px: 2, py: 1, fontWeight: 600 }}>Sort By</Typography>
                  <Divider sx={{ mb: 1 }} />

                  <MenuItem onClick={() => handleSortChange("name-asc")} selected={sortOption === "name-asc"}>
                    <ListItemIcon>
                      <SortIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Name (A-Z)" />
                  </MenuItem>

                  <MenuItem onClick={() => handleSortChange("name-desc")} selected={sortOption === "name-desc"}>
                    <ListItemIcon>
                      <SortIcon fontSize="small" sx={{ transform: "rotate(180deg)" }} />
                    </ListItemIcon>
                    <ListItemText primary="Name (Z-A)" />
                  </MenuItem>

                  <MenuItem onClick={() => handleSortChange("id-asc")} selected={sortOption === "id-asc"}>
                    <ListItemIcon>
                      <SortIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="ID (A-Z)" />
                  </MenuItem>

                  <MenuItem onClick={() => handleSortChange("id-desc")} selected={sortOption === "id-desc"}>
                    <ListItemIcon>
                      <SortIcon fontSize="small" sx={{ transform: "rotate(180deg)" }} />
                    </ListItemIcon>
                    <ListItemText primary="ID (Z-A)" />
                  </MenuItem>

                  <MenuItem onClick={() => handleSortChange("qty-asc")} selected={sortOption === "qty-asc"}>
                    <ListItemIcon>
                      <TrendingUpIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Quantity (Low to High)" />
                  </MenuItem>

                  <MenuItem onClick={() => handleSortChange("qty-desc")} selected={sortOption === "qty-desc"}>
                    <ListItemIcon>
                      <TrendingDownIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Quantity (High to Low)" />
                  </MenuItem>
                </Menu>

                <Tooltip title="View options">
                  <Box
                    sx={{
                      borderRadius: 2,
                      bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "white",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Tabs
                      value={viewMode}
                      onChange={handleViewModeChange}
                      sx={{
                        height: "40px",
                        minHeight: "40px",
                        "& .MuiTab-root": {
                          minHeight: "40px",
                          height: "40px",
                        },
                        "& .Mui-selected": {
                          color: `${colors.primary} !important`,
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: colors.primary,
                        },
                      }}
                    >
                      <Tab
                        icon={<InventoryIcon fontSize="small" />}
                        iconPosition="start"
                        label="Table"
                        sx={{
                          borderRadius: 2,
                          minWidth: "100px",
                        }}
                      />
                      <Tab
                        icon={<ViewIcon fontSize="small" />}
                        iconPosition="start"
                        label="Cards"
                        sx={{
                          borderRadius: 2,
                          minWidth: "100px",
                        }}
                      />
                    </Tabs>
                  </Box>
                </Tooltip>

                <Tooltip title="More actions">
                  <Button
                    variant="outlined"
                    onClick={handleActionsClick}
                    sx={{
                      borderRadius: 2,
                      minWidth: "unset",
                      width: "40px",
                      height: "40px",
                      padding: 0,
                      color: colors.primary,
                      borderColor: colors.primary,
                      "&:hover": {
                        borderColor: alpha(colors.primary, 0.8),
                        bgcolor: alpha(colors.primary, 0.05),
                      },
                    }}
                  >
                    <MoreVertIcon sx={{ color: colors.primary }} />
                  </Button>
                </Tooltip>

                <Menu
                  anchorEl={actionsMenuAnchor}
                  open={Boolean(actionsMenuAnchor)}
                  onClose={handleActionsClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      width: 220,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem onClick={exportToCSV}>
                    <ListItemIcon>
                      <DownloadIcon fontSize="small" sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Export to CSV" />
                  </MenuItem>

                  <MenuItem onClick={printInventory}>
                    <ListItemIcon>
                      <PrintIcon fontSize="small" sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Print Inventory" />
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleHelpOpen}>
                    <ListItemIcon>
                      <HelpIcon fontSize="small" sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Help & Guide" />
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : colors.cardBg,
                  border: `1px solid ${colors.primaryBorder}`,
                  boxShadow: colors.cardShadow,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: colors.shadow,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                        Total Items
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats.totalItems}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: colors.primaryLight,
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                        mr: 2,
                      }}
                    >
                      <InventoryIcon sx={{ color: colors.primary }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Items in inventory
                    </Typography>
                    <Chip
                      label={`${bomData.length} products`}
                      size="small"
                      sx={{
                        bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : alpha(colors.primary, 0.1),
                        color: isDarkMode ? "white" : theme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: "22px",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : colors.cardBg,
                  border: `1px solid ${colors.primaryBorder}`,
                  boxShadow: colors.cardShadow,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: colors.shadow,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                        Total Quantity
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats.totalQuantity}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: isDarkMode ? alpha(colors.primary, 0.1) : alpha(colors.primary, 0.1),
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                      }}
                    >
                      <TrendingUpIcon sx={{ color: colors.primary }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Units across all items
                    </Typography>
                    <Chip
                      label={`Avg: ${stats.averageStock} per item`}
                      size="small"
                      sx={{
                        bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : alpha(colors.primary, 0.1),
                        color: isDarkMode ? "white" : theme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: "22px",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : colors.cardBg,
                  border: `1px solid ${theme.palette.warning.light}`,
                  boxShadow: colors.cardShadow,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: colors.shadow,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                        Low Stock Items
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: stats.lowStockItems > 0 ? theme.palette.warning.main : undefined,
                        }}
                      >
                        {stats.lowStockItems}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: isDarkMode
                          ? alpha(theme.palette.warning.main, 0.1)
                          : alpha(theme.palette.warning.main, 0.1),
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                      }}
                    >
                      <InfoIcon sx={{ color: theme.palette.warning.main }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Items that need restocking
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      color="warning"
                      onClick={() => {
                        setFilterOptions({
                          ...filterOptions,
                          showLowStock: true,
                          showOutOfStock: false,
                          showInStock: false,
                          showHighStock: false,
                        })
                        showNotification("Showing only low stock items", "info")
                      }}
                      sx={{
                        fontSize: "0.7rem",
                        p: 0,
                        minWidth: "auto",
                        fontWeight: 600,
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : colors.cardBg,
                  border: `1px solid ${theme.palette.error.light}`,
                  boxShadow: colors.cardShadow,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: colors.shadow,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                        Out of Stock
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: stats.outOfStockItems > 0 ? theme.palette.error.main : undefined,
                        }}
                      >
                        {stats.outOfStockItems}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: isDarkMode
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        p: 1,
                        borderRadius: "10px",
                        display: "flex",
                      }}
                    >
                      <WarningIcon sx={{ color: theme.palette.error.main }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Items that are out of stock
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={() => {
                        setFilterOptions({
                          ...filterOptions,
                          showLowStock: false,
                          showOutOfStock: true,
                          showInStock: false,
                          showHighStock: false,
                        })
                        showNotification("Showing only out of stock items", "info")
                      }}
                      sx={{
                        fontSize: "0.7rem",
                        p: 0,
                        minWidth: "auto",
                        fontWeight: 600,
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Expanded Help */}
          <Collapse in={expandedHelp}>
            <Paper
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : alpha(colors.primary, 0.1),
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HelpIcon sx={{ color: colors.primary }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Stock Management Guide
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => setExpandedHelp(false)}
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 2, fontSize: "0.75rem" }}
                >
                  Hide Guide
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Managing Stock Items
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      You can add, edit, and delete stock items using the buttons provided. Items with quantity less
                      than 10 are marked as "Low Stock" and items with 0 quantity are marked as "Out of Stock".
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Filtering & Sorting
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Use the filter button to show/hide items based on their stock status. The sort button allows you
                      to sort items by name, ID, or quantity in ascending or descending order.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Exporting & Printing
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Click the export button to download inventory data as a CSV file. The print button generates a
                      printer-friendly version of your inventory that you can print or save as PDF.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>

          {loading && (
            <Box sx={{ width: "100%", mb: 4 }}>
              <LinearProgress
                color="primary"
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : alpha(colors.primary, 0.1),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: colors.primary,
                  },
                }}
              />
            </Box>
          )}

          {error && !loading && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                border: `1px solid ${theme.palette.error.main}`,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              action={
                <Button color="error" size="small" onClick={fetchBomData}>
                  Try Again
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAndSortedData.length === 0 && (
            <Paper
              sx={{
                p: 5,
                textAlign: "center",
                my: 4,
                bgcolor: isDarkMode ? "background.paper" : undefined,
                borderRadius: 3,
                boxShadow: colors.cardShadow,
              }}
            >
              {searchTerm || !Object.values(filterOptions).every(Boolean) ? (
                <>
                  <SearchIcon sx={{ fontSize: 60, color: colors.primary, opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    No Items Match Your Filters
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", maxWidth: "600px", mx: "auto" }}>
                    We couldn't find any items that match your search or filter criteria. Try adjusting your filters or
                    search term.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterOptions({
                        showLowStock: true,
                        showOutOfStock: true,
                        showInStock: true,
                        showHighStock: true,
                      })
                    }}
                    sx={{ borderRadius: 2, mr: 1 }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddClick}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Add New Item
                  </Button>
                </>
              ) : (
                <>
                  <InventoryIcon sx={{ fontSize: 60, color: colors.primary, opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    No Stock Items Available
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", maxWidth: "600px", mx: "auto" }}>
                    Your inventory is empty. Click "Add Item" to start managing your stock and tracking inventory
                    levels.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Your First Item
                  </Button>
                </>
              )}
            </Paper>
          )}

          {/* Content - Table View */}
          {!loading && filteredAndSortedData.length > 0 && viewMode === 0 && (
            <Paper
              sx={{
                mb: 4,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: isDarkMode ? "background.paper" : undefined,
                borderRadius: 2,
                boxShadow: colors.cardShadow,
              }}
            >
              {/* Table Header */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "white",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Inventory Items {searchTerm && `(Filtered: "${searchTerm}")`}
                </Typography>

                <Box>
                  <Badge  color="default" sx={{ mr: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddClick}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Add Item
                    </Button>
                  </Badge>

                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchBomData}
                    disabled={loading}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {/* Table */}
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: isDarkMode ? alpha(colors.primary, 0.1) : colors.primaryLight,
                      }}
                    >
                      <TableCell width="15%">
                        <Typography sx={{ color: colors.primary, fontWeight: 600 }}>Raw ID</Typography>
                      </TableCell>
                      <TableCell width="25%">
                        <Typography sx={{ color: colors.primary, fontWeight: 600 }}>Name</Typography>
                      </TableCell>
                      <TableCell width="15%">
                        <Typography sx={{ color: colors.primary, fontWeight: 600 }}>Unit Measure</Typography>
                      </TableCell>
                      <TableCell width="25%">
                        <Typography sx={{ color: colors.primary, fontWeight: 600 }}>Quantity</Typography>
                      </TableCell>
                      <TableCell width="20%" align="center">
                        <Typography sx={{ color: colors.primary, fontWeight: 600 }}>Actions</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedData.map((item) => {
                      const stockLevelColor = getStockLevelColor(item.Quantity)
                      const stockLevelLabel = getStockLevelLabel(item.Quantity)

                      return (
                        <TableRow
                          key={item._id}
                          sx={{
                            "&:hover": {
                              backgroundColor: colors.tableHoverBg,
                            },
                            borderLeft: `${colors.tableBorderLeft}px solid ${stockLevelColor}`,
                          }}
                        >
                          <TableCell>
                            <Tooltip title={`ID: ${item._id}`}>
                              <Typography variant="body2" fontWeight={500}>
                                {item.RawID}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {item.Name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.UnitMeasure}
                              size="small"
                              sx={{
                                backgroundColor: isDarkMode ? alpha(colors.primary, 0.1) : colors.chipBg,
                                color: isDarkMode ? theme.palette.text.primary : undefined,
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ width: "60%", mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(Number(item.Quantity) / 2, 100)}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: isDarkMode ? alpha("#fff", 0.1) : "#f5f5f5",
                                    "& .MuiLinearProgress-bar": {
                                      backgroundColor: stockLevelColor,
                                    },
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" fontWeight={600} sx={{ mr: 2 }}>
                                {item.Quantity}
                              </Typography>
                              <Tooltip title={`Status: ${stockLevelLabel}`}>{getStockLevelBadge(item)}</Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit item">
                              <IconButton
                                color="primary"
                                onClick={() => handleEditClick(item)}
                                size="small"
                                sx={{
                                  mr: 1,
                                  backgroundColor: isDarkMode ? alpha(colors.primary, 0.1) : colors.primaryLight,
                                  "&:hover": { backgroundColor: isDarkMode ? alpha(colors.primary, 0.2) : "#ffe0d0" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete item">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(item)}
                                size="small"
                                sx={{
                                  backgroundColor: isDarkMode ? alpha(theme.palette.error.main, 0.1) : "#fff5f5",
                                  "&:hover": {
                                    backgroundColor: isDarkMode ? alpha(theme.palette.error.main, 0.2) : "#ffe0e0",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Table Footer */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "white",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredAndSortedData.length} of {bomData.length} items
                </Typography>

                <Box>
                  <Button
                    size="small"
                    startIcon={<HelpIcon />}
                    variant="text"
                    onClick={() => setExpandedHelp(!expandedHelp)}
                    sx={{ borderRadius: 2 }}
                  >
                    {expandedHelp ? "Hide Help" : "Show Help"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Content - Card View */}
          {!loading && filteredAndSortedData.length > 0 && viewMode === 1 && (
            <>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Inventory Items {searchTerm && `(Filtered: "${searchTerm}")`}
                </Typography>

                <Box>
                  <Badge badgeContent={filteredAndSortedData.length} color="primary" sx={{ mr: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddClick}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Add Item
                    </Button>
                  </Badge>

                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchBomData}
                    disabled={loading}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {filteredAndSortedData.map((item) => {
                  const stockLevelColor = getStockLevelColor(item.Quantity)
                  const stockLevelLabel = getStockLevelLabel(item.Quantity)

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: colors.cardShadow,
                          transition: "all 0.2s ease",
                          position: "relative",
                          overflow: "visible",
                          "&:hover": {
                            boxShadow: colors.shadow,
                            transform: "translateY(-3px)",
                          },
                          border: `1px solid ${theme.palette.divider}`,
                          borderLeft: `${colors.tableBorderLeft}px solid ${stockLevelColor}`,
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 2,
                            padding: 0.5,
                          }}
                        >
                          {getStockLevelBadge(item)}
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              ID: {item.RawID}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, pr: 8 }}>
                              {item.Name}
                            </Typography>

                            <Chip
                              label={item.UnitMeasure}
                              size="small"
                              sx={{
                                backgroundColor: isDarkMode ? alpha(colors.primary, 0.1) : colors.chipBg,
                                color: isDarkMode ? theme.palette.text.primary : undefined,
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                mb: 2,
                                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                              }}
                            />

                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Quantity in Stock
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mr: 1 }}>
                                  {item.Quantity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.UnitMeasure}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(Number(item.Quantity) / 2, 100)}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: isDarkMode ? alpha("#fff", 0.1) : "#f5f5f5",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: stockLevelColor,
                                  },
                                }}
                              />
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderTop: `1px solid ${theme.palette.divider}`,
                              pt: 2,
                              mt: 2,
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => handleEditClick(item)}
                              size="small"
                              sx={{ borderRadius: 2, flexGrow: 1, mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(item)}
                              size="small"
                              sx={{ borderRadius: 2 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>

              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: `1px solid ${theme.palette.divider}`,
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredAndSortedData.length} of {bomData.length} items
                </Typography>

                <Box>
                  <Button
                    size="small"
                    startIcon={<HelpIcon />}
                    variant="text"
                    onClick={() => setExpandedHelp(!expandedHelp)}
                    sx={{ borderRadius: 2 }}
                  >
                    {expandedHelp ? "Hide Help" : "Show Help"}
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {/* Edit Dialog */}
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            PaperProps={{
              sx: {
                borderTop: `${colors.dialogBorderTop}px solid ${colors.primary}`,
                borderRadius: "12px",
                width: "500px",
                maxWidth: "100%",
                bgcolor: isDarkMode ? "background.paper" : undefined,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <EditIcon sx={{ color: colors.primary }} />
              Edit Stock Item
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <DialogContentText sx={{ mb: 3, color: theme.palette.text.secondary }}>
                Update the details for this inventory item. All fields are required.
              </DialogContentText>
              {currentItem && (
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    label="Raw ID"
                    value={currentItem.RawID}
                    disabled
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                    helperText="Raw ID cannot be changed"
                  />
                  <TextField
                    label="Name"
                    value={currentItem.Name || ""}
                    onChange={(e) => setCurrentItem({ ...currentItem, Name: e.target.value })}
                    fullWidth
                    required
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                    helperText="Enter a descriptive name"
                  />
                  <TextField
                    label="Unit Measure"
                    value={currentItem.UnitMeasure || ""}
                    onChange={(e) => setCurrentItem({ ...currentItem, UnitMeasure: e.target.value })}
                    fullWidth
                    required
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                    helperText="e.g. kg, pieces, liters, etc."
                  />
                  <TextField
                    label="Quantity"
                    type="number"
                    value={currentItem.Quantity}
                    onChange={(e) => handleQuantityChange(e)}
                    fullWidth
                    required
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: <InputAdornment position="start">#</InputAdornment>,
                      endAdornment: <InputAdornment position="end">{currentItem.UnitMeasure}</InputAdornment>,
                    }}
                    helperText={
                      Number(currentItem.Quantity) <= 0
                        ? "Warning: Item will be marked as Out of Stock"
                        : Number(currentItem.Quantity) < 10
                          ? "Warning: Item will be marked as Low Stock"
                          : "Current stock quantity"
                    }
                    FormHelperTextProps={{
                      sx: {
                        color:
                          Number(currentItem.Quantity) <= 0
                            ? theme.palette.error.main
                            : Number(currentItem.Quantity) < 10
                              ? theme.palette.warning.main
                              : undefined,
                      },
                    }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button onClick={() => setOpenEditDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                variant="contained"
                color="primary"
                disabled={!currentItem || !currentItem.Name || !currentItem.UnitMeasure}
                sx={{ borderRadius: 2 }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Dialog */}
          <Dialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            PaperProps={{
              sx: {
                borderTop: `${colors.dialogBorderTop}px solid ${colors.primary}`,
                borderRadius: "12px",
                width: "500px",
                maxWidth: "100%",
                bgcolor: isDarkMode ? "background.paper" : undefined,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AddIcon sx={{ color: colors.primary }} />
              Add New Stock Item
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <DialogContentText sx={{ mb: 3, color: theme.palette.text.secondary }}>
                Enter the details for the new inventory item. All fields are required.
              </DialogContentText>
              <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
                <TextField
                  label="Raw ID"
                  value={newItem.RawID}
                  onChange={(e) => setNewItem({ ...newItem, RawID: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                  helperText="Unique identifier for this item"
                />
                <TextField
                  label="Name"
                  value={newItem.Name}
                  onChange={(e) => setNewItem({ ...newItem, Name: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                  helperText="Descriptive name of the item"
                />
                <TextField
                  label="Unit Measure"
                  value={newItem.UnitMeasure}
                  onChange={(e) => setNewItem({ ...newItem, UnitMeasure: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                  helperText="e.g. kg, pieces, liters, etc."
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={newItem.Quantity}
                  onChange={(e) => handleQuantityChange(e, false)}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: 2 },
                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    endAdornment: newItem.UnitMeasure ? (
                      <InputAdornment position="end">{newItem.UnitMeasure}</InputAdornment>
                    ) : null,
                  }}
                  helperText={
                    Number(newItem.Quantity) <= 0
                      ? "Warning: Item will be marked as Out of Stock"
                      : Number(newItem.Quantity) < 10
                        ? "Warning: Item will be marked as Low Stock"
                        : "Initial stock quantity"
                  }
                  FormHelperTextProps={{
                    sx: {
                      color:
                        Number(newItem.Quantity) <= 0
                          ? theme.palette.error.main
                          : Number(newItem.Quantity) < 10
                            ? theme.palette.warning.main
                            : undefined,
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button onClick={() => setOpenAddDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSave}
                variant="contained"
                color="primary"
                disabled={!newItem.RawID || !newItem.Name || !newItem.UnitMeasure}
                sx={{ borderRadius: 2 }}
              >
                Add Item
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            PaperProps={{
              sx: {
                borderTop: `${colors.dialogBorderTop}px solid ${theme.palette.error.main}`,
                borderRadius: "12px",
                width: "450px",
                maxWidth: "100%",
                bgcolor: isDarkMode ? "background.paper" : undefined,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: theme.palette.error.main,
                display: "flex",
                alignItems: "center",
                gap: 1,
                pb: 1,
              }}
            >
              <DeleteIcon /> Confirm Delete
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ my: 2 }}>Are you sure you want to delete this item?</DialogContentText>

              {currentItem && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2">ID:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {currentItem.RawID}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {currentItem.Name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2">Quantity:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {currentItem.Quantity} {currentItem.UnitMeasure}
                    </Typography>
                  </Box>
                </Paper>
              )}

              <Alert severity="warning" sx={{ mt: 2 }} variant="outlined">
                This action cannot be undone. All data associated with this item will be permanently removed.
              </Alert>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                Delete Item
              </Button>
            </DialogActions>
          </Dialog>

          {/* Help Dialog */}
          <Dialog
            open={openHelpDialog}
            onClose={handleHelpClose}
            maxWidth="md"
            PaperProps={{
              sx: {
                borderTop: `${colors.dialogBorderTop}px solid ${colors.primary}`,
                borderRadius: "12px",
                bgcolor: isDarkMode ? "background.paper" : undefined,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2,
              }}
            >
              <HelpIcon sx={{ color: colors.primary }} /> Stock Management Help
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Guide to Managing Your Inventory
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.primary }}>
                      <InventoryIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "text-bottom" }} />
                      Managing Stock
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Adding Items:</strong> Click the "Add Item" button to create a new stock item. Fill in all
                      required fields.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Editing Items:</strong> Click the edit button next to any item to modify its details. You
                      cannot change the Raw ID.
                    </Typography>
                    <Typography variant="body2">
                      <strong>Deleting Items:</strong> Click the delete button next to any item. Confirm the deletion in
                      the dialog that appears.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.primary }}>
                      <FilterIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "text-bottom" }} />
                      Searching & Filtering
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Search:</strong> Use the search box to find items by name, ID, or unit measure.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Filtering:</strong> Use the filter button to show or hide items based on their stock level
                      (Out of Stock, Low Stock, etc.).
                    </Typography>
                    <Typography variant="body2">
                      <strong>Sorting:</strong> Use the sort button to order items by name, ID, or quantity in ascending
                      or descending order.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.warning.main }}>
                      <InfoIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "text-bottom" }} />
                      Stock Levels
                    </Typography>
                    <Typography variant="body2" paragraph>
                      The system categorizes stock levels as follows:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.error.main, display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            <WarningIcon fontSize="small" /> Out of Stock
                          </Typography>
                          <Typography variant="body2">Quantity is 0 or less</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.warning.main, display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            <InfoIcon fontSize="small" /> Low Stock
                          </Typography>
                          <Typography variant="body2">Quantity is 1-9 units</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.success.main, display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            <CheckCircleIcon fontSize="small" /> In Stock
                          </Typography>
                          <Typography variant="body2">Quantity is 10-49 units</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(colors.primary, 0.1),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.primary, 0.3)}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: colors.primary, display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            <TrendingUpIcon fontSize="small" /> High Stock
                          </Typography>
                          <Typography variant="body2">Quantity is 50+ units</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button onClick={() => setExpandedHelp(true)} color="primary" sx={{ mr: "auto", borderRadius: 2 }}>
                Show Help Panel
              </Button>
              <Button onClick={handleHelpClose} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
                Got It
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notification Snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleNotificationClose}
              severity={notification.severity}
              sx={{
                width: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: 2,
              }}
              variant="filled"
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </MainContentWrapper>
  )
}

export default StockManagement
