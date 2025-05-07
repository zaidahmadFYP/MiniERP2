import { useState, useEffect } from "react"
import axios from "axios"
import MainContentWrapper from "./MainContentWrapper"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
  Chip,
  Tooltip,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  Breadcrumbs,
  Link,
  LinearProgress,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  Storage as StorageIcon,
  ViewModule as ViewModuleIcon,
  Map as MapIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as TransferIcon,
  BarChart as BarChartIcon,
  Home as HomeIcon,
} from "@mui/icons-material"

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002/api"

// Mock data for warehouse layout and branches
const warehouseLocations = [
  { id: "A", name: "Section A", type: "section" },
  { id: "B", name: "Section B", type: "section" },
  { id: "C", name: "Section C", type: "section" },
  { id: "D", name: "Section D", type: "section" },
  { id: "A-1", name: "Aisle A-1", parentId: "A", type: "aisle" },
  { id: "A-2", name: "Aisle A-2", parentId: "A", type: "aisle" },
  { id: "A-3", name: "Aisle A-3", parentId: "A", type: "aisle" },
  { id: "B-1", name: "Aisle B-1", parentId: "B", type: "aisle" },
  { id: "B-2", name: "Aisle B-2", parentId: "B", type: "aisle" },
  { id: "C-1", name: "Aisle C-1", parentId: "C", type: "aisle" },
  { id: "C-2", name: "Aisle C-2", parentId: "C", type: "aisle" },
  { id: "D-1", name: "Aisle D-1", parentId: "D", type: "aisle" },
  { id: "A-1-1", name: "Rack A-1-1", parentId: "A-1", type: "rack" },
  { id: "A-1-2", name: "Rack A-1-2", parentId: "A-1", type: "rack" },
  { id: "A-2-1", name: "Rack A-2-1", parentId: "A-2", type: "rack" },
  { id: "B-1-1", name: "Rack B-1-1", parentId: "B-1", type: "rack" },
  { id: "B-1-2", name: "Rack B-1-2", parentId: "B-1", type: "rack" },
  { id: "C-1-1", name: "Rack C-1-1", parentId: "C-1", type: "rack" },
  { id: "A-1-1-1", name: "Shelf A-1-1-1", parentId: "A-1-1", type: "shelf" },
  { id: "A-1-1-2", name: "Shelf A-1-1-2", parentId: "A-1-1", type: "shelf" },
  { id: "A-1-1-3", name: "Shelf A-1-1-3", parentId: "A-1-1", type: "shelf" },
  { id: "A-1-2-1", name: "Shelf A-1-2-1", parentId: "A-1-2", type: "shelf" },
  { id: "B-1-1-1", name: "Shelf B-1-1-1", parentId: "B-1-1", type: "shelf" },
  { id: "B-1-1-2", name: "Shelf B-1-1-2", parentId: "B-1-1", type: "shelf" },
  { id: "C-1-1-1", name: "Shelf C-1-1-1", parentId: "C-1-1", type: "shelf" },
]

const branches = [
  { id: "main", name: "Main Warehouse", address: "123 Main St, City" },
  { id: "north", name: "North Branch", address: "456 North Ave, City" },
  { id: "south", name: "South Branch", address: "789 South Blvd, City" },
  { id: "east", name: "East Branch", address: "101 East Rd, City" },
]

// Mock transaction history data
const transactionHistory = [
  {
    id: 1,
    rawId: "RM-1001",
    type: "Received",
    quantity: 100,
    date: "2023-05-01T10:30:00",
    branch: "main",
    user: "John Doe",
    notes: "Initial stock",
  },
  {
    id: 2,
    rawId: "RM-1002",
    type: "Received",
    quantity: 50,
    date: "2023-05-02T11:15:00",
    branch: "main",
    user: "Jane Smith",
    notes: "Vendor delivery",
  },
  {
    id: 3,
    rawId: "RM-1001",
    type: "Transferred",
    quantity: 20,
    date: "2023-05-03T14:45:00",
    branch: "north",
    user: "John Doe",
    notes: "Transfer to North branch",
  },
  {
    id: 4,
    rawId: "RM-1003",
    type: "Consumed",
    quantity: 15,
    date: "2023-05-04T09:30:00",
    branch: "main",
    user: "Mike Johnson",
    notes: "Used in production",
  },
  {
    id: 5,
    rawId: "RM-1002",
    type: "Adjusted",
    quantity: -5,
    date: "2023-05-05T16:20:00",
    branch: "main",
    user: "Jane Smith",
    notes: "Inventory correction",
  },
  {
    id: 6,
    rawId: "RM-1004",
    type: "Received",
    quantity: 75,
    date: "2023-05-06T13:10:00",
    branch: "south",
    user: "Sarah Williams",
    notes: "New supplier",
  },
  {
    id: 7,
    rawId: "RM-1001",
    type: "Consumed",
    quantity: 30,
    date: "2023-05-07T10:45:00",
    branch: "north",
    user: "Mike Johnson",
    notes: "Weekly production",
  },
]

// The main orange accent color
const ACCENT_COLOR = "#f15a22"

const WarehouseManagement = () => {
  // Dark Mode or Light Mode
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  // State management
  const [bomData, setBomData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [currentTab, setCurrentTab] = useState(0)
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [openDialog, setOpenDialog] = useState({ open: false, type: "", id: null })
  const [newItem, setNewItem] = useState({
    RawID: "",
    Name: "",
    Description: "",
    Category: "",
    Unit: "",
    Quantity: 0,
    MinimumQuantity: 0,
    Location: "",
    ShelfLife: "",
    BatchNumber: "",
    SupplierID: "",
    CostPerUnit: 0,
    DateReceived: new Date().toISOString().split("T")[0],
    BranchID: "main",
    ShelfID: "",
    ExpiryDate: "",
    QualityStatus: "Good",
    Notes: "",
  })
  const [editedData, setEditedData] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState("main")
  const [viewMode, setViewMode] = useState("list")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationPath, setLocationPath] = useState([])
  const [transferData, setTransferData] = useState({
    rawId: "",
    quantity: 0,
    fromBranch: "main",
    toBranch: "",
    notes: "",
  })
  const [showExpired, setShowExpired] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")

  // Fetch BOM data from the API
  const fetchBomData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/menu/bom`)

      // Enhanced Data
      const enhancedData = response.data.map((item) => ({
        ...item,
        ShelfLife: item.ShelfLife || "365 days",
        BatchNumber: item.BatchNumber || `B-${Math.floor(Math.random() * 10000)}`,
        SupplierID: item.SupplierID || `SUP-${Math.floor(Math.random() * 100)}`,
        CostPerUnit: item.CostPerUnit || Number.parseFloat((Math.random() * 100).toFixed(2)),
        DateReceived:
          item.DateReceived ||
          new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        BranchID: item.BranchID || "main",
        ShelfID:
          item.ShelfID ||
          warehouseLocations.filter((loc) => loc.type === "shelf")[
            Math.floor(Math.random() * warehouseLocations.filter((loc) => loc.type === "shelf").length)
          ].id,
        ExpiryDate:
          item.ExpiryDate ||
          new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        QualityStatus: item.QualityStatus || "Good",
        Notes: item.Notes || "",
      }))

      setBomData(enhancedData)
      setFilteredData(enhancedData)
      setSnackbar({
        open: true,
        message: "Inventory data loaded successfully",
        severity: "success",
      })
    } catch (error) {
      console.error("Error fetching BOM data:", error)
      setSnackbar({
        open: true,
        message: "Failed to load inventory data",
        severity: "error",
      })

      // For demo, mock data if API fails
      const mockData = [
        {
          _id: "1",
          RawID: "RM-1001",
          Name: "Organic Flour",
          Description: "High-quality organic wheat flour",
          Category: "Baking Ingredients",
          Unit: "kg",
          Quantity: 500,
          MinimumQuantity: 100,
          Location: "Section A, Aisle 1",
          ShelfLife: "365 days",
          BatchNumber: "B-1234",
          SupplierID: "SUP-001",
          CostPerUnit: 2.5,
          DateReceived: "2023-04-15",
          BranchID: "main",
          ShelfID: "A-1-1-1",
          ExpiryDate: "2024-04-15",
          QualityStatus: "Good",
          Notes: "Premium quality from trusted supplier",
        },
        {
          _id: "2",
          RawID: "RM-1002",
          Name: "Granulated Sugar",
          Description: "Fine granulated white sugar",
          Category: "Baking Ingredients",
          Unit: "kg",
          Quantity: 350,
          MinimumQuantity: 75,
          Location: "Section A, Aisle 2",
          ShelfLife: "730 days",
          BatchNumber: "B-2345",
          SupplierID: "SUP-002",
          CostPerUnit: 1.75,
          DateReceived: "2023-03-20",
          BranchID: "main",
          ShelfID: "A-1-1-2",
          ExpiryDate: "2025-03-20",
          QualityStatus: "Good",
          Notes: "",
        },
        {
          _id: "3",
          RawID: "RM-1003",
          Name: "Cocoa Powder",
          Description: "Dutch-processed cocoa powder",
          Category: "Baking Ingredients",
          Unit: "kg",
          Quantity: 120,
          MinimumQuantity: 30,
          Location: "Section B, Aisle 1",
          ShelfLife: "365 days",
          BatchNumber: "B-3456",
          SupplierID: "SUP-003",
          CostPerUnit: 5.25,
          DateReceived: "2023-05-10",
          BranchID: "main",
          ShelfID: "B-1-1-1",
          ExpiryDate: "2024-05-10",
          QualityStatus: "Good",
          Notes: "Premium dark cocoa",
        },
        {
          _id: "4",
          RawID: "RM-1004",
          Name: "Vanilla Extract",
          Description: "Pure vanilla extract",
          Category: "Flavorings",
          Unit: "L",
          Quantity: 45,
          MinimumQuantity: 15,
          Location: "Section B, Aisle 2",
          ShelfLife: "730 days",
          BatchNumber: "B-4567",
          SupplierID: "SUP-004",
          CostPerUnit: 12.5,
          DateReceived: "2023-02-15",
          BranchID: "north",
          ShelfID: "B-1-1-2",
          ExpiryDate: "2025-02-15",
          QualityStatus: "Good",
          Notes: "Imported from Madagascar",
        },
        {
          _id: "5",
          RawID: "RM-1005",
          Name: "Baking Powder",
          Description: "Double-acting baking powder",
          Category: "Baking Ingredients",
          Unit: "kg",
          Quantity: 80,
          MinimumQuantity: 20,
          Location: "Section C, Aisle 1",
          ShelfLife: "365 days",
          BatchNumber: "B-5678",
          SupplierID: "SUP-002",
          CostPerUnit: 3.25,
          DateReceived: "2023-04-05",
          BranchID: "main",
          ShelfID: "C-1-1-1",
          ExpiryDate: "2024-04-05",
          QualityStatus: "Good",
          Notes: "",
        },
        {
          _id: "6",
          RawID: "RM-1006",
          Name: "Salt",
          Description: "Fine sea salt",
          Category: "Baking Ingredients",
          Unit: "kg",
          Quantity: 150,
          MinimumQuantity: 30,
          Location: "Section A, Aisle 3",
          ShelfLife: "1825 days",
          BatchNumber: "B-6789",
          SupplierID: "SUP-005",
          CostPerUnit: 1.2,
          DateReceived: "2023-01-10",
          BranchID: "south",
          ShelfID: "A-1-2-1",
          ExpiryDate: "2028-01-10",
          QualityStatus: "Good",
          Notes: "",
        },
        {
          _id: "7",
          RawID: "RM-1007",
          Name: "Butter",
          Description: "Unsalted butter",
          Category: "Dairy",
          Unit: "kg",
          Quantity: 100,
          MinimumQuantity: 40,
          Location: "Section D, Aisle 1",
          ShelfLife: "90 days",
          BatchNumber: "B-7890",
          SupplierID: "SUP-006",
          CostPerUnit: 8.75,
          DateReceived: "2023-05-01",
          BranchID: "main",
          ShelfID: "D-1-1-1",
          ExpiryDate: "2023-07-30",
          QualityStatus: "Good",
          Notes: "Keep refrigerated",
        },
      ]

      setBomData(mockData)
      setFilteredData(mockData)
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchBomData()
  }, [])

  // Filter data based on search query, branch, category, location, and expired status
  useEffect(() => {
    let filtered = bomData

    // Filter by branch
    if (selectedBranch !== "all") {
      filtered = filtered.filter((item) => item.BranchID === selectedBranch)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        return (
          (item.RawID && item.RawID.toLowerCase().includes(lowercasedQuery)) ||
          (item.Name && item.Name.toLowerCase().includes(lowercasedQuery)) ||
          (item.Description && item.Description.toLowerCase().includes(lowercasedQuery)) ||
          (item.Category && item.Category.toLowerCase().includes(lowercasedQuery)) ||
          (item.Location && item.Location.toLowerCase().includes(lowercasedQuery)) ||
          (item.BatchNumber && item.BatchNumber.toLowerCase().includes(lowercasedQuery))
        )
      })
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.Category === categoryFilter)
    }

    // Filter by location (shelf)
    if (locationFilter) {
      filtered = filtered.filter((item) => item.ShelfID === locationFilter)
    }

    // Filter by expiry status
    if (!showExpired) {
      const today = new Date()
      filtered = filtered.filter((item) => {
        const expiryDate = new Date(item.ExpiryDate)
        return expiryDate > today
      })
    }

    setFilteredData(filtered)
    setPage(0)
  }, [searchQuery, bomData, selectedBranch, categoryFilter, locationFilter, showExpired])

  // Update location path when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      const path = []
      let currentId = selectedLocation

      while (currentId) {
        const location = warehouseLocations.find((loc) => loc.id === currentId)
        if (location) {
          path.unshift(location)
          currentId = location.parentId
        } else {
          currentId = null
        }
      }

      setLocationPath(path)
    } else {
      setLocationPath([])
    }
  }, [selectedLocation])

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  // Handle branch change
  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value)
  }

  // Handle category filter change
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value)
  }

  // Handle location filter change
  const handleLocationFilterChange = (event) => {
    setLocationFilter(event.target.value)
  }

  // Handle expired items toggle
  const handleExpiredToggle = (event) => {
    setShowExpired(event.target.checked)
  }

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  // Handle location selection
  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId)
  }

  // Handle menu open/close
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Handle dialog open/close
  const handleOpenDialog = (type, id = null) => {
    setOpenDialog({ open: true, type, id })

    if (type === "edit" && id) {
      const itemToEdit = bomData.find((item) => item._id === id)
      setEditedData({ ...itemToEdit })
    } else if (type === "transfer" && id) {
      const item = bomData.find((item) => item._id === id)
      setTransferData({
        rawId: item.RawID,
        itemId: item._id,
        quantity: 0,
        fromBranch: item.BranchID,
        toBranch: "",
        notes: "",
      })
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog({ open: false, type: "", id: null })
    setEditedData({})
    setNewItem({
      RawID: "",
      Name: "",
      Description: "",
      Category: "",
      Unit: "",
      Quantity: 0,
      MinimumQuantity: 0,
      Location: "",
      ShelfLife: "",
      BatchNumber: "",
      SupplierID: "",
      CostPerUnit: 0,
      DateReceived: new Date().toISOString().split("T")[0],
      BranchID: "main",
      ShelfID: "",
      ExpiryDate: "",
      QualityStatus: "Good",
      Notes: "",
    })
    setTransferData({
      rawId: "",
      quantity: 0,
      fromBranch: "main",
      toBranch: "",
      notes: "",
    })
  }

  // Handle form input changes for new item
  const handleNewItemChange = (event) => {
    const { name, value } = event.target
    setNewItem({
      ...newItem,
      [name]: ["Quantity", "MinimumQuantity", "CostPerUnit"].includes(name) ? Number(value) : value,
    })
  }

  // Handle form input changes for edited item
  const handleEditedDataChange = (event) => {
    const { name, value } = event.target
    setEditedData({
      ...editedData,
      [name]: ["Quantity", "MinimumQuantity", "CostPerUnit"].includes(name) ? Number(value) : value,
    })
  }

  // Handle transfer data changes
  const handleTransferDataChange = (event) => {
    const { name, value } = event.target
    setTransferData({
      ...transferData,
      [name]: name === "quantity" ? Number(value) : value,
    })
  }

  // Handle inline edit for quantity
  const handleInlineQuantityChange = (id, value) => {
    const updatedData = bomData.map((item) => (item._id === id ? { ...item, Quantity: Number(value) } : item))
    setBomData(updatedData)
  }

  // Toggle bulk edit mode
  const toggleBulkEditMode = () => {
    setBulkEditMode(!bulkEditMode)
    if (bulkEditMode) {
      // Reset any unsaved changes
      fetchBomData()
    }
  }

  // Add new BOM item
  const addBomItem = async () => {
    try {
      setLoading(true)

      // Calculate expiry date if not provided
      let expiryDate = newItem.ExpiryDate
      if (!expiryDate && newItem.ShelfLife && newItem.DateReceived) {
        const shelfLifeDays = Number.parseInt(newItem.ShelfLife)
        const receivedDate = new Date(newItem.DateReceived)
        expiryDate = new Date(receivedDate.setDate(receivedDate.getDate() + shelfLifeDays)).toISOString().split("T")[0]
      }

      const itemToAdd = {
        ...newItem,
        ExpiryDate: expiryDate,
      }

      await axios.post(`${API_BASE_URL}/menu/bom`, [itemToAdd])
      setSnackbar({
        open: true,
        message: "Item added successfully",
        severity: "success",
      })
      handleCloseDialog()
      fetchBomData()
    } catch (error) {
      console.error("Error adding BOM item:", error)
      setSnackbar({
        open: true,
        message: "Failed to add item",
        severity: "error",
      })

      // For demo purposes, add the item to local state if API fails
      const newId = Math.max(...bomData.map((item) => Number.parseInt(item._id))) + 1
      const newItemWithId = {
        ...newItem,
        _id: newId.toString(),
      }

      setBomData([...bomData, newItemWithId])
    } finally {
      setLoading(false)
    }
  }

  // Update BOM item
  const updateBomItem = async () => {
    try {
      setLoading(true)
      await axios.put(`${API_BASE_URL}/menu/bom/${editedData._id}`, editedData)
      setSnackbar({
        open: true,
        message: "Item updated successfully",
        severity: "success",
      })
      handleCloseDialog()
      fetchBomData()
    } catch (error) {
      console.error("Error updating BOM item:", error)
      setSnackbar({
        open: true,
        message: "Failed to update item",
        severity: "error",
      })

      // For demo purposes, update the item in local state if API fails
      const updatedData = bomData.map((item) => (item._id === editedData._id ? editedData : item))
      setBomData(updatedData)
    } finally {
      setLoading(false)
    }
  }

  // Delete BOM item
  const deleteBomItem = async () => {
    try {
      setLoading(true)
      await axios.delete(`${API_BASE_URL}/menu/bom/${openDialog.id}`)
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      })
      handleCloseDialog()
      fetchBomData()
    } catch (error) {
      console.error("Error deleting BOM item:", error)
      setSnackbar({
        open: true,
        message: "Failed to delete item",
        severity: "error",
      })

      // For demo purposes, delete the item from local state if API fails
      const filteredData = bomData.filter((item) => item._id !== openDialog.id)
      setBomData(filteredData)
    } finally {
      setLoading(false)
    }
  }

  // Transfer inventory between branches
  const transferInventory = async () => {
    try {
      setLoading(true)

      // Find the item to transfer
      const item = bomData.find((item) => item._id === transferData.itemId)

      if (!item) {
        throw new Error("Item not found")
      }

      if (item.Quantity < transferData.quantity) {
        throw new Error("Transfer quantity exceeds available quantity")
      }

      // Create a copy of the item for the destination branch
      const transferredItem = {
        ...item,
        _id: `${item._id}-transfer-${Date.now()}`,
        BranchID: transferData.toBranch,
        Quantity: transferData.quantity,
        DateReceived: new Date().toISOString().split("T")[0],
        Notes:
          `${item.Notes ? item.Notes + " | " : ""}Transferred from ${transferData.fromBranch} branch on ${new Date().toLocaleDateString()}. ${transferData.notes}`.trim(),
      }

      // Update the source item quantity
      const updatedSourceItem = {
        ...item,
        Quantity: item.Quantity - transferData.quantity,
      }

      // In a real application, this would be an API call
      // await axios.post(`${API_BASE_URL}/menu/bom/transfer`, {
      //   sourceItemId: item._id,
      //   destinationBranch: transferData.toBranch,
      //   quantity: transferData.quantity,
      //   notes: transferData.notes
      // });

      // Update the data
      const updatedData = bomData.map((i) => (i._id === item._id ? updatedSourceItem : i))

      setBomData([...updatedData, transferredItem])

      setSnackbar({
        open: true,
        message: `Successfully transferred ${transferData.quantity} ${item.Unit} of ${item.Name} to ${branches.find((b) => b.id === transferData.toBranch)?.name}`,
        severity: "success",
      })

      handleCloseDialog()
    } catch (error) {
      console.error("Error transferring inventory:", error)
      setSnackbar({
        open: true,
        message: error.message || "Failed to transfer inventory",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Save bulk edits
  const saveBulkEdits = async () => {
    try {
      setLoading(true)
      const dataToUpdate = bomData.map(({ _id, RawID, Quantity }) => ({ _id, RawID, Quantity }))
      await axios.put(`${API_BASE_URL}/menu/bom`, dataToUpdate)
      setSnackbar({
        open: true,
        message: "Bulk update successful",
        severity: "success",
      })
      setBulkEditMode(false)
      fetchBomData()
    } catch (error) {
      console.error("Error updating BOM data:", error)
      setSnackbar({
        open: true,
        message: "Failed to update items",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate warehouse statistics
  const calculateStats = () => {
    const totalItems = bomData.length
    const totalQuantity = bomData.reduce((sum, item) => sum + (item.Quantity || 0), 0)
    const totalValue = bomData.reduce((sum, item) => sum + (item.Quantity || 0) * (item.CostPerUnit || 0), 0)

    const today = new Date()
    const expiringItems = bomData.filter((item) => {
      const expiryDate = new Date(item.ExpiryDate)
      const diffTime = expiryDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 && diffDays <= 30
    }).length

    const expiredItems = bomData.filter((item) => {
      const expiryDate = new Date(item.ExpiryDate)
      return expiryDate < today
    }).length

    const lowStockItems = bomData.filter((item) => (item.Quantity || 0) < (item.MinimumQuantity || 10)).length

    const categories = [...new Set(bomData.map((item) => item.Category).filter(Boolean))]

    const branchStats = branches.map((branch) => {
      const branchItems = bomData.filter((item) => item.BranchID === branch.id)
      return {
        id: branch.id,
        name: branch.name,
        itemCount: branchItems.length,
        totalQuantity: branchItems.reduce((sum, item) => sum + (item.Quantity || 0), 0),
        totalValue: branchItems.reduce((sum, item) => sum + (item.Quantity || 0) * (item.CostPerUnit || 0), 0),
      }
    })

    return {
      totalItems,
      totalQuantity,
      totalValue,
      expiringItems,
      expiredItems,
      lowStockItems,
      categories,
      branchStats,
    }
  }

  const stats = calculateStats()

  // Get shelf utilization data
  const getShelfUtilization = () => {
    const shelves = warehouseLocations.filter((loc) => loc.type === "shelf")

    return shelves.map((shelf) => {
      const itemsOnShelf = bomData.filter((item) => item.ShelfID === shelf.id)
      const totalItems = itemsOnShelf.length
      const totalQuantity = itemsOnShelf.reduce((sum, item) => sum + (item.Quantity || 0), 0)

      // Assuming each shelf has a capacity of 1000 units
      const capacityUsed = Math.min(totalQuantity / 1000, 1)

      return {
        id: shelf.id,
        name: shelf.name,
        itemCount: totalItems,
        totalQuantity,
        capacityUsed,
        items: itemsOnShelf,
      }
    })
  }

  const shelfUtilization = getShelfUtilization()


  // Render dashboard tab
  const renderDashboard = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 5 },
                bgcolor: theme.palette.background.paper,
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Items
                </Typography>
                <Typography variant="h4" sx={{ color: ACCENT_COLOR }}>
                  {stats.totalItems}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Across all branches
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 5 },
                bgcolor: theme.palette.background.paper,
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Quantity
                </Typography>
                <Typography variant="h4" sx={{ color: ACCENT_COLOR }}>
                  {stats.totalQuantity.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Units in stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 5 },
                bgcolor: theme.palette.background.paper,
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Inventory Value
                </Typography>
                <Typography variant="h4" sx={{ color: ACCENT_COLOR }}>
                  ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Total inventory cost
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                bgcolor:
                  stats.lowStockItems > 0
                    ? alpha(ACCENT_COLOR, isDarkMode ? 0.15 : 0.1)
                    : theme.palette.background.paper,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 5 },
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Attention Required
                </Typography>
                <Typography variant="h4" color={stats.lowStockItems > 0 ? ACCENT_COLOR : "inherit"}>
                  {stats.lowStockItems + stats.expiringItems}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stats.lowStockItems} low stock, {stats.expiringItems} expiring soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Branch Statistics */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: 600 }}>
                  Branch Inventory Overview
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Items
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Value
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Utilization
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.branchStats.map((branch) => (
                        <TableRow
                          key={branch.id}
                          hover
                          sx={{ "&:hover": { backgroundColor: alpha(ACCENT_COLOR, 0.05) } }}
                        >
                          <TableCell>{branch.name}</TableCell>
                          <TableCell align="right">{branch.itemCount}</TableCell>
                          <TableCell align="right">{branch.totalQuantity.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            $
                            {branch.totalValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell align="right">
                            <LinearProgress
                              variant="determinate"
                              value={Math.min((branch.totalQuantity / 5000) * 100, 100)}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: alpha(ACCENT_COLOR, 0.2),
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor:
                                    branch.totalQuantity > 4000
                                      ? "#f44336"
                                      : branch.totalQuantity > 3000
                                        ? "#ff9800"
                                        : ACCENT_COLOR,
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: theme.palette.background.paper }}>
                          Raw ID
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: theme.palette.background.paper }}>
                          Action
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", backgroundColor: theme.palette.background.paper }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: theme.palette.background.paper }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: theme.palette.background.paper }}>
                          Branch
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionHistory.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          hover
                          sx={{ "&:hover": { backgroundColor: alpha(ACCENT_COLOR, 0.05) } }}
                        >
                          <TableCell>{transaction.rawId}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={transaction.type}
                              sx={{
                                backgroundColor:
                                  transaction.type === "Received"
                                    ? "#4caf50"
                                    : transaction.type === "Consumed"
                                      ? "#f44336"
                                      : transaction.type === "Transferred"
                                        ? ACCENT_COLOR
                                        : "#9e9e9e",
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {transaction.type === "Consumed" ||
                            (transaction.type === "Adjusted" && transaction.quantity < 0)
                              ? "-"
                              : "+"}
                            {Math.abs(transaction.quantity)}
                          </TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                          <TableCell>
                            {branches.find((b) => b.id === transaction.branch)?.name || transaction.branch}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Shelf Utilization */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: 600 }}>
                  Warehouse Shelf Utilization
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {shelfUtilization
                    .filter((shelf) => shelf.itemCount > 0)
                    .map((shelf) => (
                      <Card
                        key={shelf.id}
                        sx={{
                          width: 200,
                          boxShadow: 2,
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: 4,
                          },
                          bgcolor: theme.palette.background.paper,
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {shelf.name}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={shelf.capacityUsed * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              my: 1,
                              backgroundColor: alpha(ACCENT_COLOR, 0.2),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor:
                                  shelf.capacityUsed > 0.9
                                    ? "#f44336"
                                    : shelf.capacityUsed > 0.7
                                      ? "#ff9800"
                                      : ACCENT_COLOR,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {shelf.itemCount} items, {shelf.totalQuantity} units
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                shelf.capacityUsed > 0.9
                                  ? "#f44336"
                                  : shelf.capacityUsed > 0.7
                                    ? "#ff9800"
                                    : ACCENT_COLOR,
                              fontWeight: 500,
                            }}
                          >
                            {Math.round(shelf.capacityUsed * 100)}% capacity used
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  // Render warehouse layout tab
  const renderWarehouseLayout = () => {
    // Get child locations of the selected location or root locations
    const getChildLocations = () => {
      if (!selectedLocation) {
        return warehouseLocations.filter((loc) => loc.type === "section")
      }

      return warehouseLocations.filter((loc) => loc.parentId === selectedLocation)
    }

    // Get items in the current location (including all child locations)
    const getItemsInLocation = () => {
      if (!selectedLocation) {
        return []
      }

      // Get all child location IDs recursively
      const getAllChildIds = (locationId) => {
        const directChildren = warehouseLocations.filter((loc) => loc.parentId === locationId).map((loc) => loc.id)
        let allChildren = [...directChildren]

        directChildren.forEach((childId) => {
          allChildren = [...allChildren, ...getAllChildIds(childId)]
        })

        return allChildren
      }

      const allLocationIds = [selectedLocation, ...getAllChildIds(selectedLocation)]

      // Filter items by location
      return bomData.filter((item) => allLocationIds.includes(item.ShelfID))
    }

    const childLocations = getChildLocations()
    const itemsInLocation = getItemsInLocation()

    return (
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2, mb: 3, boxShadow: 3, bgcolor: theme.palette.background.paper }}>
          {/* Breadcrumb navigation */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => setSelectedLocation(null)}
              sx={{ display: "flex", alignItems: "center", color: ACCENT_COLOR }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Warehouse
            </Link>
            {locationPath.map((location, index) => (
              <Link
                key={location.id}
                component="button"
                underline={index === locationPath.length - 1 ? "none" : "hover"}
                color={index === locationPath.length - 1 ? "text.primary" : "inherit"}
                onClick={() => setSelectedLocation(location.id)}
                aria-current={index === locationPath.length - 1 ? "page" : undefined}
                sx={{ color: index === locationPath.length - 1 ? ACCENT_COLOR : "inherit" }}
              >
                {location.name}
              </Link>
            ))}
          </Breadcrumbs>

          {/* Location grid */}
          <Grid container spacing={2}>
            {childLocations.map((location) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={location.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-5px)",
                      "& .MuiSvgIcon-root": {
                        color: ACCENT_COLOR,
                      },
                    },
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    bgcolor: theme.palette.background.paper,
                  }}
                  onClick={() => handleLocationSelect(location.id)}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    {location.type === "section" && (
                      <ViewModuleIcon sx={{ fontSize: 40, color: ACCENT_COLOR, transition: "color 0.2s" }} />
                    )}
                    {location.type === "aisle" && (
                      <MapIcon sx={{ fontSize: 40, color: ACCENT_COLOR, transition: "color 0.2s" }} />
                    )}
                    {location.type === "rack" && (
                      <WarehouseIcon sx={{ fontSize: 40, color: ACCENT_COLOR, transition: "color 0.2s" }} />
                    )}
                    {location.type === "shelf" && (
                      <StorageIcon sx={{ fontSize: 40, color: ACCENT_COLOR, transition: "color 0.2s" }} />
                    )}
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Items in location */}
          {selectedLocation && itemsInLocation.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: 600 }}>
                Items in {locationPath[locationPath.length - 1]?.name || selectedLocation}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Raw ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Quantity
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Expiry Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsInLocation.map((item) => (
                      <TableRow key={item._id} hover sx={{ "&:hover": { backgroundColor: alpha(ACCENT_COLOR, 0.05) } }}>
                        <TableCell>{item.RawID}</TableCell>
                        <TableCell>{item.Name}</TableCell>
                        <TableCell>{item.Category}</TableCell>
                        <TableCell align="right">{item.Quantity}</TableCell>
                        <TableCell>{item.Unit}</TableCell>
                        <TableCell>{item.ExpiryDate}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={item.QualityStatus}
                            sx={{
                              backgroundColor:
                                item.QualityStatus === "Good"
                                  ? "#4caf50"
                                  : item.QualityStatus === "Damaged"
                                    ? "#f44336"
                                    : "#ff9800",
                              color: "#fff",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Box>
    )
  }

  // Render inventory tab
  const renderInventory = () => {
    // Get unique categories
    const categories = [...new Set(bomData.map((item) => item.Category).filter(Boolean))]

    // Get unique shelf locations
    const shelves = warehouseLocations.filter((loc) => loc.type === "shelf")

    return (
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ width: "100%", mb: 2, boxShadow: 3, bgcolor: theme.palette.background.paper }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: alpha(ACCENT_COLOR, isDarkMode ? 0.15 : 0.05),
            }}
          >
            <Typography variant="h6" component="div" sx={{ color: ACCENT_COLOR, fontWeight: 600 }}>
              Raw Materials Inventory
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: ACCENT_COLOR }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: ACCENT_COLOR,
                    },
                  },
                }}
              />
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchBomData}
                  sx={{ color: theme.palette.text.secondary, "&:hover": { color: ACCENT_COLOR } }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new item">
                <IconButton
                  onClick={() => handleOpenDialog("add")}
                  sx={{ color: ACCENT_COLOR, "&:hover": { bgcolor: alpha(ACCENT_COLOR, 0.1) } }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={bulkEditMode ? "Cancel bulk edit" : "Bulk edit quantities"}>
                <IconButton
                  onClick={toggleBulkEditMode}
                  sx={{
                    color: bulkEditMode ? "#f44336" : theme.palette.text.secondary,
                    "&:hover": { color: bulkEditMode ? "#f44336" : ACCENT_COLOR },
                  }}
                >
                  {bulkEditMode ? <CancelIcon /> : <EditIcon />}
                </IconButton>
              </Tooltip>
              {bulkEditMode && (
                <Tooltip title="Save all changes">
                  <IconButton onClick={saveBulkEdits} sx={{ color: "#4caf50", "&:hover": { color: "#388e3c" } }}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    setSnackbar({
                      open: true,
                      message: "Export feature not implemented in this demo",
                      severity: "info",
                    })
                  }}
                >
                  <FileDownloadIcon fontSize="small" sx={{ mr: 1, color: ACCENT_COLOR }} />
                  Export to CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    setSnackbar({
                      open: true,
                      message: "Print feature not implemented in this demo",
                      severity: "info",
                    })
                  }}
                >
                  <PrintIcon fontSize="small" sx={{ mr: 1, color: ACCENT_COLOR }} />
                  Print Inventory
                </MenuItem>
              </Menu>
            </Stack>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: alpha(ACCENT_COLOR, isDarkMode ? 0.05 : 0.02),
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: ACCENT_COLOR,
                      },
                    },
                  }}
                >
                  <InputLabel id="branch-select-label">Branch</InputLabel>
                  <Select
                    labelId="branch-select-label"
                    value={selectedBranch}
                    label="Branch"
                    onChange={handleBranchChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: theme.palette.background.paper,
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">All Branches</MenuItem>
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: ACCENT_COLOR,
                      },
                    },
                  }}
                >
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryFilterChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: theme.palette.background.paper,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category, index) => (
                      <MenuItem key={index} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: ACCENT_COLOR,
                      },
                    },
                  }}
                >
                  <InputLabel id="location-select-label">Shelf Location</InputLabel>
                  <Select
                    labelId="location-select-label"
                    value={locationFilter}
                    label="Shelf Location"
                    onChange={handleLocationFilterChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: theme.palette.background.paper,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {shelves.map((shelf) => (
                      <MenuItem key={shelf.id} value={shelf.id}>
                        {shelf.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showExpired}
                      onChange={handleExpiredToggle}
                      color="warning"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: ACCENT_COLOR,
                          "&:hover": {
                            backgroundColor: alpha(ACCENT_COLOR, 0.08),
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: ACCENT_COLOR,
                        },
                      }}
                    />
                  }
                  label="Show Expired Items"
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer sx={{ maxHeight: "calc(100vh - 350px)", overflow: "auto" }}>
            <Table sx={{ minWidth: 750 }} size="medium" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(ACCENT_COLOR, isDarkMode ? 0.15 : 0.05) }}>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Raw ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>
                    Shelf Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Branch</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Batch #</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>
                    Expiry Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: theme.palette.background.paper }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <CircularProgress size={24} sx={{ color: ACCENT_COLOR }} />
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Box sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No inventory data found
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          sx={{
                            mt: 2,
                            borderColor: ACCENT_COLOR,
                            color: ACCENT_COLOR,
                            "&:hover": {
                              borderColor: isDarkMode ? alpha(ACCENT_COLOR, 0.8) : alpha(ACCENT_COLOR, 0.7),
                              backgroundColor: alpha(ACCENT_COLOR, 0.08),
                            },
                          }}
                          onClick={() => handleOpenDialog("add")}
                        >
                          Add your first item
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                    const isExpired = new Date(item.ExpiryDate) < new Date()
                    const isExpiringSoon =
                      !isExpired && new Date(item.ExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    const isLowStock = (item.Quantity || 0) < (item.MinimumQuantity || 10)

                    return (
                      <TableRow
                        key={item._id}
                        hover
                        sx={{
                          bgcolor: isExpired
                            ? alpha("#f44336", isDarkMode ? 0.2 : 0.1)
                            : isExpiringSoon
                              ? alpha(ACCENT_COLOR, isDarkMode ? 0.2 : 0.1)
                              : "inherit",
                          "&:hover": { backgroundColor: alpha(ACCENT_COLOR, 0.05) },
                        }}
                      >
                        <TableCell>{item.RawID}</TableCell>
                        <TableCell>{item.Name}</TableCell>
                        <TableCell>{item.Category}</TableCell>
                        <TableCell>
                          {warehouseLocations.find((loc) => loc.id === item.ShelfID)?.name || item.ShelfID}
                        </TableCell>
                        <TableCell>
                          {branches.find((branch) => branch.id === item.BranchID)?.name || item.BranchID}
                        </TableCell>
                        <TableCell align="right">
                          {bulkEditMode ? (
                            <TextField
                              type="number"
                              size="small"
                              value={item.Quantity || 0}
                              onChange={(e) => handleInlineQuantityChange(item._id, e.target.value)}
                              InputProps={{ inputProps: { min: 0 } }}
                              sx={{
                                width: "80px",
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": {
                                    borderColor: ACCENT_COLOR,
                                  },
                                },
                              }}
                            />
                          ) : (
                            item.Quantity || 0
                          )}
                        </TableCell>
                        <TableCell>{item.Unit}</TableCell>
                        <TableCell>{item.BatchNumber}</TableCell>
                        <TableCell>
                          {item.ExpiryDate}
                          {isExpired && (
                            <Chip
                              size="small"
                              label="Expired"
                              sx={{ ml: 1, backgroundColor: "#f44336", color: "#fff", fontWeight: 500 }}
                            />
                          )}
                          {isExpiringSoon && !isExpired && (
                            <Chip
                              size="small"
                              label="Expiring Soon"
                              sx={{ ml: 1, backgroundColor: ACCENT_COLOR, color: "#fff", fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {isLowStock ? (
                            <Chip
                              size="small"
                              icon={<WarningIcon sx={{ color: "#fff !important" }} />}
                              label="Low Stock"
                              sx={{ backgroundColor: "#ff9800", color: "#fff", fontWeight: 500 }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label={item.QualityStatus}
                              sx={{ backgroundColor: "#4caf50", color: "#fff", fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Transfer">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog("transfer", item._id)}
                              sx={{ color: ACCENT_COLOR, "&:hover": { bgcolor: alpha(ACCENT_COLOR, 0.1) } }}
                            >
                              <TransferIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-selectIcon": {
                color: ACCENT_COLOR,
              },
            }}
          />
        </Paper>
      </Box>
    )
  }

  return (
    <MainContentWrapper open={true}>
      <Box sx={{ my: 4, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Paper sx={{ p: 2, mb: 4, boxShadow: 3, borderRadius: "12px", bgcolor: theme.palette.background.paper }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InventoryIcon sx={{ mr: 2, color: ACCENT_COLOR, fontSize: 32 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0, color: ACCENT_COLOR }}>
                Warehouse Management
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* <Paper sx={{ 
        boxShadow: 3, 
        borderRadius: '12px', 
        overflow: 'hidden', 
        bgcolor: theme.palette.background.paper,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}/> */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              py: 2,
            },
            "& .Mui-selected": {
              color: `${ACCENT_COLOR} !important`,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: ACCENT_COLOR,
            },
          }}
        >
          <Tab label="Dashboard" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Inventory" icon={<InventoryIcon />} iconPosition="start" />
          <Tab label="Warehouse Layout" icon={<WarehouseIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
          {currentTab === 0 && renderDashboard()}
          {currentTab === 1 && renderInventory()}
          {currentTab === 2 && renderWarehouseLayout()}
        </Box>

        {/* Transfer Dialog */}
        <Dialog
          open={openDialog.open && openDialog.type === "transfer"}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              bgcolor: isDarkMode ? "#3a3a3a" : theme.palette.background.paper,
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: alpha(ACCENT_COLOR, isDarkMode ? 0.15 : 0.05),
              color: ACCENT_COLOR,
              fontWeight: 600,
            }}
          >
            Transfer Inventory
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Raw ID: {transferData.rawId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Branch:{" "}
                  {branches.find((b) => b.id === transferData.fromBranch)?.name || transferData.fromBranch}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="quantity"
                  label="Quantity to Transfer"
                  type="number"
                  fullWidth
                  value={transferData.quantity}
                  onChange={handleTransferDataChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: ACCENT_COLOR,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: ACCENT_COLOR,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: ACCENT_COLOR,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: ACCENT_COLOR,
                    },
                  }}
                >
                  <InputLabel id="transfer-branch-label">Destination Branch</InputLabel>
                  <Select
                    labelId="transfer-branch-label"
                    name="toBranch"
                    value={transferData.toBranch}
                    label="Destination Branch"
                    onChange={handleTransferDataChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: theme.palette.background.paper,
                        },
                      },
                    }}
                  >
                    {branches
                      .filter((branch) => branch.id !== transferData.fromBranch)
                      .map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Transfer Notes"
                  fullWidth
                  value={transferData.notes}
                  onChange={handleTransferDataChange}
                  multiline
                  rows={2}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: ACCENT_COLOR,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: ACCENT_COLOR,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: theme.palette.text.secondary }}>
              CANCEL
            </Button>
            <Button
              onClick={transferInventory}
              variant="contained"
              sx={{
                bgcolor: ACCENT_COLOR,
                "&:hover": {
                  bgcolor: isDarkMode ? alpha(ACCENT_COLOR, 0.8) : alpha(ACCENT_COLOR, 0.7),
                },
              }}
              disabled={!transferData.toBranch || transferData.quantity <= 0}
            >
              TRANSFER
            </Button>
          </DialogActions>
        </Dialog>

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
              boxShadow: 3,
              borderRadius: "8px",
              bgcolor: theme.palette.background.paper,
              "& .MuiAlert-icon": {
                color:
                  snackbar.severity === "success"
                    ? "#4caf50"
                    : snackbar.severity === "error"
                      ? "#f44336"
                      : snackbar.severity === "warning"
                        ? "#ff9800"
                        : ACCENT_COLOR,
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainContentWrapper>
  )
}

export default WarehouseManagement
