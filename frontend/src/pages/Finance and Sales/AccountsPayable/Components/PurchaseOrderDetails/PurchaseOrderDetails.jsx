import { useState, useEffect } from "react"
import {
  Checkbox,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  Radio,
  Button,
  TextField,
  Collapse,
  Switch,
  alpha,
  Breadcrumbs,
  Link,
  InputAdornment,
  FormLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  MenuItem,
  Menu,
} from "@mui/material"
import {
  KeyboardArrowDown,
  Add,
  ChevronLeft,
  ExpandMore,
  Menu as MenuIcon,
  Delete,
  KeyboardArrowRight,
  Print,
  FileDownload,
  FileCopy,
  CheckCircle,
  FileUpload,
  FilterAlt,
  MoreVert,
  Visibility,
  Edit,
  AttachFile,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import SecondaryNavbar from "../Secondarynavbar"

// Styled components
const MainContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: "60px", // Fixed margin for sidebar
  marginTop: "64px", // Base margin for AppBar
  paddingTop: "68px", // Add padding to account for navbar + its margin (48px + 20px)
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f7",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
  height: "calc(100vh - 64px)", // Adjust height to account for AppBar
  maxHeight: "calc(100vh - 64px)", // Adjust max height to account for AppBar
  overflow: "hidden", // Prevent scrolling at the container level
  width: "calc(100% - 60px)", // Full width minus sidebar
  position: "relative", // Add position relative
}))

// Add a scrollable container
const ScrollableContent = styled(Box)(({ theme }) => ({
  height: "100%",
  overflowY: "auto", // Make this container scrollable
  paddingBottom: theme.spacing(4), // Add some padding at the bottom
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  fontWeight: 500,
  marginRight: theme.spacing(3),
  padding: theme.spacing(1, 0),
  color: theme.palette.mode === "dark" ? "#aaa" : "#666",
  "&.Mui-selected": {
    color: "#f15a22",
  },
}))

const SectionPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f8f8f8",
  borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#e0e0e0"}`,
}))

const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#252525" : "#fff",
}))

const StyledTableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#e0e0e0"}`,
  fontSize: "0.875rem",
}))

const StyledTableHeadCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
  borderBottom: `2px solid ${alpha("#f15a22", 0.3)}`,
  fontWeight: 600,
  fontSize: "0.875rem",
}))

const ActionButton = styled(Button)(({ theme, color }) => ({
  textTransform: "none",
  borderRadius: "4px",
  padding: "4px 12px",
  fontWeight: 500,
  fontSize: "0.8125rem",
  backgroundColor: color === "primary" ? "#f15a22" : "transparent",
  color: color === "primary" ? "#fff" : theme.palette.mode === "dark" ? "#e0e0e0" : "#333",
  border: color === "primary" ? "none" : `1px solid ${theme.palette.mode === "dark" ? "#555" : "#ccc"}`,
  "&:hover": {
    backgroundColor:
      color === "primary"
        ? alpha("#f15a22", 0.8)
        : theme.palette.mode === "dark"
          ? alpha("#555", 0.2)
          : alpha("#f5f5f5", 0.8),
  },
}))

const DetailTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  fontWeight: 500,
  marginRight: theme.spacing(1),
  padding: theme.spacing(1, 2),
  color: theme.palette.mode === "dark" ? "#aaa" : "#666",
  "&.Mui-selected": {
    color: "#f15a22",
  },
}))

const DetailField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.mode === "dark" ? "#aaa" : "#666",
  marginBottom: theme.spacing(0.5),
}))

const DetailValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#333",
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    fontSize: "0.875rem",
    "& fieldset": {
      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#e0e0e0",
    },
  },
}))

const TableHeader = styled("div")(({ theme }) => ({
  display: "table-header-group",
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
}))

const TableRow = styled("div")(({ theme }) => ({
  display: "table-row",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
  cursor: "pointer",
}))

const TableCell = styled("div")(({ theme }) => ({
  display: "table-cell",
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: "left",
}))

const DropdownTable = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}))

const DetailTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    fontSize: "0.875rem",
    "& fieldset": {
      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#e0e0e0",
    },
  },
}))

const PurchaseOrderDetails = ({ orderData, onBack }) => {
  const [mainTab, setMainTab] = useState(0)
  const [detailTab, setDetailTab] = useState(0)
  const [expandHeader, setExpandHeader] = useState(true)
  const [expandLines, setExpandLines] = useState(true)
  const [expandLineDetails, setExpandLineDetails] = useState(true)
  const [selectedLine, setSelectedLine] = useState(1)
  const [lineItems, setLineItems] = useState([])
  const [showAddLineForm, setShowAddLineForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [vendorProducts, setVendorProducts] = useState([])
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // New state for additional functionality
  const [multiSelectActive, setMultiSelectActive] = useState(false)
  const [selectedLines, setSelectedLines] = useState([])
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [anchorElMenu, setAnchorElMenu] = useState(null)
  const [showAddMultipleForm, setShowAddMultipleForm] = useState(false)
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [financialsMenuAnchor, setFinancialsMenuAnchor] = useState(null)
  const [inventoryMenuAnchor, setInventoryMenuAnchor] = useState(null)
  const [productSupplyMenuAnchor, setProductSupplyMenuAnchor] = useState(null)
  const [warehouseMenuAnchor, setWarehouseMenuAnchor] = useState(null)
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [currentEditingItem, setCurrentEditingItem] = useState(null)
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)

  // Use the order data passed from the parent component
  const {
    _id = "",
    orderNumber = "",
    vendorId = "",
    vendorName = "",
    vendorContact = "",
    deliveryName = "",
    deliveryAddress = "",
    currency = "",
    currencyName = "",
    invoiceAccount = "",
    invoiceName = "",
    requestedDate = "",
    status = "",
    confirmation = "",
  } = orderData || {}

  // Fetch order details and line items
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true)
      try {
        // If we have line items in the order data, use them
        if (orderData.lineItems && orderData.lineItems.length > 0) {
          setLineItems(orderData.lineItems)
        } else if (orderData._id) {
          // If we have an ID but no line items, fetch the complete order
          const response = await axios.get(`/api/purchase-orders/${orderData._id}`)
          if (response.data && response.data.lineItems) {
            setLineItems(response.data.lineItems)
          }
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load line items. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderData])

  useEffect(() => {
    if (orderData && orderData.productList) {
      setVendorProducts(orderData.productList)
    } else if (orderData && orderData.vendorId) {
      // Fetch vendor products if not included in order data
      const fetchVendorProducts = async () => {
        try {
          console.log("Fetching products for vendor:", orderData.vendorId)
          const response = await axios.get(`/api/vendors/${orderData.vendorId}`)
          if (response.data && response.data.productList) {
            console.log("Products found:", response.data.productList)
            setVendorProducts(response.data.productList)
          } else {
            console.log("No products found in response:", response.data)
            setVendorProducts([])
          }
        } catch (err) {
          console.error("Error fetching vendor products:", err)
          setVendorProducts([])
        }
      }

      fetchVendorProducts()
    }
  }, [orderData])

  // Update the handleAddLine function to properly calculate and update totalAmount
  const handleAddLine = async () => {
    if (!selectedProduct) return

    setLoading(true)

    const newLine = {
      id: lineItems.length + 1,
      itemNumber: selectedProduct.productId,
      productName: selectedProduct.productName,
      prAccount: "SERVICES RENOVATION",
      procurementCategory: "SERVICES RENOVATION",
      quantity: Number.parseFloat(quantity),
      unit: selectedProduct.measure || "JOB",
      unitPrice: Number.parseFloat(selectedProduct.price),
      lastPurchPrice: Number.parseFloat(selectedProduct.price),
      percentage: 0,
      lastPurchaseDate: new Date().toLocaleDateString("en-US"),
      adjustedUnitCost: 0,
      discount: 0,
      lineAmount: Number.parseFloat(quantity) * Number.parseFloat(selectedProduct.price),
    }

    try {
      // First update local state for immediate UI feedback
      const updatedLineItems = [...lineItems, newLine]
      setLineItems(updatedLineItems)

      // Calculate the new total amount
      const newTotalAmount = updatedLineItems.reduce((total, item) => {
        return total + item.quantity * item.unitPrice
      }, 0)

      // Then save to backend
      const purchaseOrderData = {
        orderNumber,
        vendorId,
        vendorName,
        vendorContact,
        deliveryName,
        deliveryAddress,
        currency,
        currencyName,
        invoiceAccount: invoiceAccount || vendorId,
        invoiceName: invoiceName || vendorName,
        requestedDate,
        status,
        confirmation,
        lineItems: updatedLineItems,
        totalAmount: newTotalAmount,
        totalReceipt: orderData.totalReceipt || 0,
      }

      // Check if we have an existing order ID
      if (orderData._id) {
        await axios.put(`/api/purchase-orders/${orderData._id}`, purchaseOrderData)
      } else {
        // Create a new order if it doesn't exist yet
        const response = await axios.post("/api/purchase-orders", purchaseOrderData)
        // Update the order ID in the parent component if needed
        if (orderData.onOrderCreated && typeof orderData.onOrderCreated === "function") {
          orderData.onOrderCreated(response.data)
        }
      }

      setShowAddLineForm(false)
      setSelectedProduct(null)
      setQuantity(1)
      setError(null)

      // Show success message
      showSnackbar("Line item added successfully")
    } catch (err) {
      console.error("Error saving line item:", err)
      setError("Failed to save line item. Please try again.")
      // Rollback the state change if the API call fails
      setLineItems(lineItems)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSelectedLines = async () => {
    if (multiSelectActive && selectedLines.length === 0) {
      setError("Please select at least one line item to remove")
      return
    } else if (!multiSelectActive && selectedLine === null) {
      setError("Please select a line item to remove")
      return
    }

    setLoading(true)

    try {
      let updatedLineItems

      if (multiSelectActive) {
        // Remove multiple selected items
        updatedLineItems = lineItems.filter((_, index) => !selectedLines.includes(index + 1))
      } else {
        // Remove only the currently selected item
        updatedLineItems = lineItems.filter((_, index) => index !== selectedLine - 1)
      }

      // Update local state first for immediate UI feedback
      setLineItems(updatedLineItems)

      // Then update in the backend
      if (orderData._id) {
        const purchaseOrderData = {
          orderNumber,
          vendorId,
          vendorName,
          vendorContact,
          deliveryName,
          deliveryAddress,
          currency,
          currencyName,
          invoiceAccount: invoiceAccount || vendorId,
          invoiceName: invoiceName || vendorName,
          requestedDate,
          status,
          confirmation,
          lineItems: updatedLineItems,
        }

        await axios.put(`/api/purchase-orders/${orderData._id}`, purchaseOrderData)
      }

      // Reset selected line if needed
      if (selectedLine > updatedLineItems.length) {
        setSelectedLine(updatedLineItems.length > 0 ? 1 : null)
      }

      // Reset multi-select
      if (multiSelectActive) {
        setSelectedLines([])
      }

      setError(null)
      showSnackbar("Line item(s) removed successfully")
    } catch (err) {
      console.error("Error removing line item:", err)
      setError("Failed to remove line item. Please try again.")
      // Rollback the state change if the API call fails
      setLineItems(lineItems)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLines = async () => {
    if (selectedLine === null && !multiSelectActive) {
      setError("Please select a line item to update")
      return
    }

    setLoading(true)

    try {
      // For now, we'll just update the backend with the current state
      if (orderData._id) {
        const purchaseOrderData = {
          orderNumber,
          vendorId,
          vendorName,
          vendorContact,
          deliveryName,
          deliveryAddress,
          currency,
          currencyName,
          invoiceAccount: invoiceAccount || vendorId,
          invoiceName: invoiceName || vendorName,
          requestedDate,
          status,
          confirmation,
          lineItems: lineItems,
        }

        await axios.put(`/api/purchase-orders/${orderData._id}`, purchaseOrderData)
        setError(null)
        // Show success message
        showSnackbar("Line items updated successfully")
      }
    } catch (err) {
      console.error("Error updating line items:", err)
      setError("Failed to update line items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (product) => {
    console.log("Selected product:", product)
    setSelectedProduct(product)
    setProductDropdownOpen(false)
  }

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue)
  }

  const handleDetailTabChange = (event, newValue) => {
    setDetailTab(newValue)
  }

  // Function to handle line selection with support for multi-select
  const handleLineSelect = (index) => {
    if (multiSelectActive) {
      // Toggle selection in multi-select mode
      if (selectedLines.includes(index)) {
        setSelectedLines(selectedLines.filter((lineIndex) => lineIndex !== index))
      } else {
        setSelectedLines([...selectedLines, index])
      }
    } else {
      // Single select mode
      setSelectedLine(index)
    }
  }

  // Toggle multi-select mode
  const toggleMultiSelect = () => {
    setMultiSelectActive(!multiSelectActive)
    setSelectedLines([])
  }

  // Handle opening the "Add Products" dialog
  const handleAddProducts = () => {
    setShowAddMultipleForm(true)
  }

  // Handle opening menu
  const handleMenuOpen = (event) => {
    setAnchorElMenu(event.currentTarget)
  }

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorElMenu(null)
  }

  // Handle menu item click
  const handleMenuItemClick = (action) => {
    handleMenuClose()

    switch (action) {
      case "print":
        showSnackbar("Printing purchase order...")
        // Simulate printing functionality
        setTimeout(() => {
          showSnackbar("Purchase order sent to printer")
        }, 1500)
        break
      case "export":
        setShowExportDialog(true)
        break
      case "copy":
        showSnackbar("Purchase order copied to clipboard")
        break
      case "duplicate":
        showSnackbar("Creating duplicate purchase order...")
        // Simulate duplication
        setTimeout(() => {
          showSnackbar("Purchase order duplicated")
        }, 1500)
        break
      default:
        break
    }
  }

  // Function to show snackbar messages
  const showSnackbar = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  // Handle financials menu
  const handleFinancialsMenuOpen = (event) => {
    setFinancialsMenuAnchor(event.currentTarget)
  }

  const handleFinancialsMenuClose = () => {
    setFinancialsMenuAnchor(null)
  }

  // Handle inventory menu
  const handleInventoryMenuOpen = (event) => {
    setInventoryMenuAnchor(event.currentTarget)
  }

  const handleInventoryMenuClose = () => {
    setInventoryMenuAnchor(null)
  }

  // Handle product & supply menu
  const handleProductSupplyMenuOpen = (event) => {
    setProductSupplyMenuAnchor(event.currentTarget)
  }

  const handleProductSupplyMenuClose = () => {
    setProductSupplyMenuAnchor(null)
  }

  // Handle warehouse menu
  const handleWarehouseMenuOpen = (event) => {
    setWarehouseMenuAnchor(event.currentTarget)
  }

  const handleWarehouseMenuClose = () => {
    setWarehouseMenuAnchor(null)
  }

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null)
  }

  // Handle receiving items
  const handleReceiveItems = () => {
    setShowReceiveDialog(true)
  }

  // Complete receiving process
  const completeReceiving = () => {
    setShowReceiveDialog(false)
    showSnackbar("Items received successfully")

    // Update line items to show as received
    const updatedLines = lineItems.map((item, index) => {
      if (multiSelectActive && selectedLines.includes(index + 1)) {
        return { ...item, received: true }
      } else if (!multiSelectActive && index === selectedLine - 1) {
        return { ...item, received: true }
      }
      return item
    })

    setLineItems(updatedLines)
  }

  // Toggle edit mode for line items
  const toggleEditMode = () => {
    if (editMode) {
      // Save changes when exiting edit mode
      handleUpdateLines()
    }
    setEditMode(!editMode)
  }

  // Handle line item field changes
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...lineItems]

    // Update the specific field
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      [field]: value,
    }

    // If quantity or price changed, update line amount
    if (field === "quantity" || field === "unitPrice") {
      const qty = field === "quantity" ? Number.parseFloat(value) : updatedLineItems[index].quantity
      const price = field === "unitPrice" ? Number.parseFloat(value) : updatedLineItems[index].unitPrice
      updatedLineItems[index].lineAmount = qty * price
    }

    setLineItems(updatedLineItems)
  }

  // Handle file selection for attachments
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  // Add attachment to purchase order
  const addAttachment = () => {
    if (selectedFile) {
      const newAttachment = {
        id: attachments.length + 1,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadDate: new Date().toLocaleDateString(),
      }

      setAttachments([...attachments, newAttachment])
      setSelectedFile(null)
      showSnackbar("Attachment added successfully")
    }
  }

  return (
    <>
      <SecondaryNavbar />
      <MainContentWrapper>
        <ScrollableContent>
          {/* Breadcrumb and back navigation */}
          <Box sx={{ display: "flex", alignItems: "center", mt:1,mb: 2,ml:-1.1 }}>
            <IconButton sx={{ mr: 0 }} onClick={onBack}>
              <ChevronLeft />
            </IconButton>
            <Breadcrumbs separator={<KeyboardArrowRight fontSize="small" />} aria-label="breadcrumb">
              <Link
                href="#"
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
                onClick={onBack}
              >
                <MenuIcon fontSize="small" sx={{ mr: 0.5 }} />
                All purchase orders
              </Link>
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                {orderNumber}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Purchase Order Title and Status with Action Menu */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {orderNumber} : {vendorId} - {vendorName}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip
                label={status || "Open order"}
                sx={{
                  backgroundColor: alpha("#f15a22", 0.1),
                  color: "#f15a22",
                  fontWeight: 500,
                  borderRadius: "4px",
                }}
              />
              <Chip
                label={confirmation || "Confirmed"}
                sx={{
                  backgroundColor: alpha("#4caf50", 0.1),
                  color: "#4caf50",
                  fontWeight: 500,
                  borderRadius: "4px",
                }}
              />
              <Tooltip title="Actions">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleMenuItemClick("print")}>
                  <Print fontSize="small" sx={{ mr: 1 }} /> Print
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("export")}>
                  <FileDownload fontSize="small" sx={{ mr: 1 }} /> Export
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("copy")}>
                  <FileCopy fontSize="small" sx={{ mr: 1 }} /> Copy
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("duplicate")}>
                  <FileCopy fontSize="small" sx={{ mr: 1 }} /> Duplicate PO
                </MenuItem>
                <MenuItem onClick={() => setAttachmentDialogOpen(true)}>
                  <AttachFile fontSize="small" sx={{ mr: 1 }} /> Attachments
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Main Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={mainTab} onChange={handleMainTabChange} aria-label="purchase order tabs">
              <StyledTab label="Lines" />
              <StyledTab label="Header" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {mainTab === 0 && (
            <>
              {/* Purchase Order Header Section */}
              <SectionPaper>
                <SectionHeader>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Purchase order header
                  </Typography>
                  <IconButton size="small" onClick={() => setExpandHeader(!expandHeader)}>
                    <ExpandMore
                      sx={{
                        transform: expandHeader ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </IconButton>
                </SectionHeader>
                <Collapse in={expandHeader}>
                  <SectionContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <DetailField>
                          <DetailLabel>Vendor account</DetailLabel>
                          <DetailValue>{vendorId}</DetailValue>
                        </DetailField>
                        <DetailField>
                          <DetailLabel>Vendor name</DetailLabel>
                          <DetailValue>{vendorName}</DetailValue>
                        </DetailField>
                        <DetailField>
                          <DetailLabel>Contact</DetailLabel>
                          <DetailValue>{vendorContact || "Not specified"}</DetailValue>
                        </DetailField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailField>
                          <DetailLabel>Invoice account</DetailLabel>
                          <DetailValue>{invoiceAccount || vendorId}</DetailValue>
                        </DetailField>
                        <DetailField>
                          <DetailLabel>Currency</DetailLabel>
                          <DetailValue>
                            {currency} - {currencyName}
                          </DetailValue>
                        </DetailField>
                        <DetailField>
                          <DetailLabel>Requested receipt date</DetailLabel>
                          <DetailValue>{requestedDate}</DetailValue>
                        </DetailField>
                      </Grid>
                    </Grid>
                  </SectionContent>
                </Collapse>
              </SectionPaper>

              {/* Purchase Order Lines Section */}
              <SectionPaper>
                <SectionHeader>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Purchase order lines
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip title="Toggle edit mode">
                      <IconButton size="small" onClick={toggleEditMode} sx={{ mr: 1 }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle multi-select">
                      <Switch size="small" checked={multiSelectActive} onChange={toggleMultiSelect} sx={{ mr: 1 }} />
                    </Tooltip>
                    <IconButton size="small" onClick={() => setExpandLines(!expandLines)}>
                      <ExpandMore
                        sx={{
                          transform: expandLines ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </IconButton>
                  </Box>
                </SectionHeader>
                <Collapse in={expandLines}>
                  <SectionContent>
                    {/* Action buttons */}
                    <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                      <ActionButton startIcon={<Add />} onClick={() => setShowAddLineForm(true)}>
                        Add line
                      </ActionButton>
                      <ActionButton startIcon={<Add />} onClick={handleAddProducts}>
                        Add lines
                      </ActionButton>
                      <ActionButton startIcon={<Add />} onClick={() => setShowImportDialog(true)}>
                        Add products
                      </ActionButton>
                      <ActionButton
                        startIcon={<Delete />}
                        onClick={handleRemoveSelectedLines}
                        disabled={multiSelectActive ? selectedLines.length === 0 : selectedLine === null}
                      >
                        Remove
                      </ActionButton>
                      <Divider orientation="vertical" flexItem />
                      <ActionButton endIcon={<KeyboardArrowDown />}>Purchase order line</ActionButton>
                      <ActionButton endIcon={<KeyboardArrowDown />} onClick={handleFinancialsMenuOpen}>
                        Financials
                      </ActionButton>
                      <Menu
                        anchorEl={financialsMenuAnchor}
                        open={Boolean(financialsMenuAnchor)}
                        onClose={handleFinancialsMenuClose}
                      >
                        <MenuItem onClick={handleFinancialsMenuClose}>Invoice details</MenuItem>
                        <MenuItem onClick={handleFinancialsMenuClose}>Payment schedule</MenuItem>
                        <MenuItem onClick={handleFinancialsMenuClose}>Calculate taxes</MenuItem>
                      </Menu>
                      <ActionButton endIcon={<KeyboardArrowDown />} onClick={handleInventoryMenuOpen}>
                        Inventory
                      </ActionButton>
                      <Menu
                        anchorEl={inventoryMenuAnchor}
                        open={Boolean(inventoryMenuAnchor)}
                        onClose={handleInventoryMenuClose}
                      >
                        <MenuItem onClick={handleReceiveItems}>Receive items</MenuItem>
                        <MenuItem onClick={handleInventoryMenuClose}>Inventory dimensions</MenuItem>
                        <MenuItem onClick={handleInventoryMenuClose}>View stock</MenuItem>
                      </Menu>
                      <ActionButton endIcon={<KeyboardArrowDown />} onClick={handleProductSupplyMenuOpen}>
                        Product and supply
                      </ActionButton>
                      <Menu
                        anchorEl={productSupplyMenuAnchor}
                        open={Boolean(productSupplyMenuAnchor)}
                        onClose={handleProductSupplyMenuClose}
                      >
                        <MenuItem onClick={handleProductSupplyMenuClose}>Product details</MenuItem>
                        <MenuItem onClick={handleProductSupplyMenuClose}>Supply forecast</MenuItem>
                        <MenuItem onClick={handleProductSupplyMenuClose}>Item specifications</MenuItem>
                      </Menu>
                      <ActionButton endIcon={<KeyboardArrowDown />} onClick={handleUpdateLines}>
                        Update line
                      </ActionButton>
                      <ActionButton endIcon={<KeyboardArrowDown />} onClick={handleWarehouseMenuOpen}>
                        Warehouse
                      </ActionButton>
                      <Menu
                        anchorEl={warehouseMenuAnchor}
                        open={Boolean(warehouseMenuAnchor)}
                        onClose={handleWarehouseMenuClose}
                      >
                        <MenuItem onClick={handleWarehouseMenuClose}>Warehouse details</MenuItem>
                        <MenuItem onClick={handleWarehouseMenuClose}>Storage locations</MenuItem>
                        <MenuItem onClick={handleWarehouseMenuClose}>Shipment tracking</MenuItem>
                      </Menu>
                    </Box>

                    {/* Filter and search */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <ActionButton startIcon={<FilterAlt />} onClick={handleFilterMenuOpen}>
                        Filter
                      </ActionButton>
                      <Menu
                        anchorEl={filterMenuAnchor}
                        open={Boolean(filterMenuAnchor)}
                        onClose={handleFilterMenuClose}
                      >
                        <MenuItem onClick={handleFilterMenuClose}>By product</MenuItem>
                        <MenuItem onClick={handleFilterMenuClose}>By price range</MenuItem>
                        <MenuItem onClick={handleFilterMenuClose}>By status</MenuItem>
                      </Menu>
                      <StyledTextField
                        placeholder="Search line items..."
                        size="small"
                        sx={{ width: "300px" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Visibility fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {/* Lines Table */}
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <MuiTableRow>
                            <StyledTableHeadCell padding="checkbox">
                              {multiSelectActive ? (
                                <Tooltip title="Select/Deselect All">
                                  <Checkbox
                                    size="small"
                                    checked={lineItems.length > 0 && selectedLines.length === lineItems.length}
                                    indeterminate={selectedLines.length > 0 && selectedLines.length < lineItems.length}
                                    onChange={() => {
                                      if (selectedLines.length === lineItems.length) {
                                        setSelectedLines([])
                                      } else {
                                        setSelectedLines(lineItems.map((_, i) => i + 1))
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ) : (
                                <Radio size="small" disabled />
                              )}
                            </StyledTableHeadCell>
                            <StyledTableHeadCell>Budget check</StyledTableHeadCell>
                            <StyledTableHeadCell>Line number</StyledTableHeadCell>
                            <StyledTableHeadCell>Item number</StyledTableHeadCell>
                            <StyledTableHeadCell>Product name</StyledTableHeadCell>
                            <StyledTableHeadCell>PR MainAccount</StyledTableHeadCell>
                            <StyledTableHeadCell>Procurement category</StyledTableHeadCell>
                            <StyledTableHeadCell>Variant number</StyledTableHeadCell>
                            <StyledTableHeadCell>CW quantity</StyledTableHeadCell>
                            <StyledTableHeadCell>CW unit</StyledTableHeadCell>
                            <StyledTableHeadCell>Quantity</StyledTableHeadCell>
                            <StyledTableHeadCell>Unit</StyledTableHeadCell>
                            <StyledTableHeadCell>Unit price</StyledTableHeadCell>
                            <StyledTableHeadCell>Last Purch price</StyledTableHeadCell>
                            <StyledTableHeadCell>Percentage</StyledTableHeadCell>
                            <StyledTableHeadCell>Last Purchase Date</StyledTableHeadCell>
                            <StyledTableHeadCell>Adjusted unit cost</StyledTableHeadCell>
                            <StyledTableHeadCell>Discount</StyledTableHeadCell>
                            <StyledTableHeadCell>Status</StyledTableHeadCell>
                          </MuiTableRow>
                        </TableHead>
                        <TableBody>
                          {lineItems.length === 0 ? (
                            <MuiTableRow>
                              <StyledTableCell colSpan={20} align="center">
                                No line items found. Click "Add line" to add items to this purchase order.
                              </StyledTableCell>
                            </MuiTableRow>
                          ) : (
                            lineItems.map((item, index) => (
                              <MuiTableRow
                                key={item._id || index}
                                hover
                                selected={
                                  multiSelectActive ? selectedLines.includes(index + 1) : selectedLine === index + 1
                                }
                                onClick={() => handleLineSelect(index + 1)}
                                sx={{
                                  "&.Mui-selected": {
                                    backgroundColor: alpha("#f15a22", 0.08),
                                    "&:hover": {
                                      backgroundColor: alpha("#f15a22", 0.12),
                                    },
                                  },
                                }}
                              >
                                <StyledTableCell padding="checkbox">
                                  {multiSelectActive ? (
                                    <Checkbox
                                      size="small"
                                      checked={selectedLines.includes(index + 1)}
                                      onChange={() => handleLineSelect(index + 1)}
                                      sx={{
                                        "&.Mui-checked": {
                                          color: "#f15a22",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <Radio
                                      size="small"
                                      checked={selectedLine === index + 1}
                                      onChange={() => setSelectedLine(index + 1)}
                                      sx={{
                                        "&.Mui-checked": {
                                          color: "#f15a22",
                                        },
                                      }}
                                    />
                                  )}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {item.budgetChecked && <CheckCircle fontSize="small" color="success" />}
                                </StyledTableCell>
                                <StyledTableCell>{index + 1}</StyledTableCell>
                                <StyledTableCell sx={{ color: "#f15a22", fontWeight: 500 }}>
                                  {item.itemNumber}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {editMode && selectedLine === index + 1 ? (
                                    <StyledTextField
                                      fullWidth
                                      size="small"
                                      value={item.productName}
                                      onChange={(e) => handleLineItemChange(index, "productName", e.target.value)}
                                    />
                                  ) : (
                                    item.productName
                                  )}
                                </StyledTableCell>
                                <StyledTableCell>{item.prAccount}</StyledTableCell>
                                <StyledTableCell>{item.procurementCategory}</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="right">
                                  {editMode && selectedLine === index + 1 ? (
                                    <StyledTextField
                                      size="small"
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => handleLineItemChange(index, "quantity", e.target.value)}
                                      sx={{ width: "80px" }}
                                    />
                                  ) : (
                                    item.quantity.toFixed(2)
                                  )}
                                </StyledTableCell>
                                <StyledTableCell>{item.unit}</StyledTableCell>
                                <StyledTableCell align="right">
                                  {editMode && selectedLine === index + 1 ? (
                                    <StyledTextField
                                      size="small"
                                      type="number"
                                      value={item.unitPrice}
                                      onChange={(e) => handleLineItemChange(index, "unitPrice", e.target.value)}
                                      sx={{ width: "100px" }}
                                    />
                                  ) : (
                                    item.unitPrice.toLocaleString()
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="right">{item.lastPurchPrice.toLocaleString()}</StyledTableCell>
                                <StyledTableCell align="right">{item.percentage.toFixed(2)}</StyledTableCell>
                                <StyledTableCell>{item.lastPurchaseDate}</StyledTableCell>
                                <StyledTableCell align="right">{item.adjustedUnitCost.toFixed(2)}</StyledTableCell>
                                <StyledTableCell align="right">
                                  {editMode && selectedLine === index + 1 ? (
                                    <StyledTextField
                                      size="small"
                                      type="number"
                                      value={item.discount}
                                      onChange={(e) => handleLineItemChange(index, "discount", e.target.value)}
                                      sx={{ width: "80px" }}
                                    />
                                  ) : (
                                    item.discount.toFixed(2)
                                  )}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {item.received ? (
                                    <Chip
                                      label="Received"
                                      size="small"
                                      sx={{
                                        bgcolor: alpha("#4caf50", 0.1),
                                        color: "#4caf50",
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      label="Pending"
                                      size="small"
                                      sx={{
                                        bgcolor: alpha("#f15a22", 0.1),
                                        color: "#f15a22",
                                      }}
                                    />
                                  )}
                                </StyledTableCell>
                              </MuiTableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {showAddLineForm && (
                      <Box sx={{ mt: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                          Add New Line
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <FormLabel>Product</FormLabel>
                            <Box sx={{ position: "relative", mb: 2 }}>
                              <StyledTextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Select a product"
                                value={
                                  selectedProduct ? `${selectedProduct.productId} - ${selectedProduct.productName}` : ""
                                }
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <KeyboardArrowDown />
                                    </InputAdornment>
                                  ),
                                  sx: { cursor: "pointer" },
                                }}
                                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                              />

                              {productDropdownOpen && (
                                <DropdownTable
                                  sx={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    width: "100%",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                    zIndex: 1400,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "table",
                                      width: "100%",
                                      borderCollapse: "collapse",
                                    }}
                                  >
                                    <TableHeader>
                                      <TableCell>Product ID</TableCell>
                                      <TableCell>Name</TableCell>
                                      <TableCell>Price</TableCell>
                                    </TableHeader>
                                    {vendorProducts.length > 0 ? (
                                      vendorProducts.map((product) => (
                                        <TableRow key={product.productId} onClick={() => handleProductSelect(product)}>
                                          <TableCell>{product.productId}</TableCell>
                                          <TableCell>{product.productName}</TableCell>
                                          <TableCell>{product.price}</TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                                          No products available for this vendor
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Box>
                                </DropdownTable>
                              )}
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <FormLabel>Quantity</FormLabel>
                            <StyledTextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <FormLabel>Unit Price</FormLabel>
                            <StyledTextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={selectedProduct ? selectedProduct.price : ""}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                              <ActionButton color="secondary" onClick={() => setShowAddLineForm(false)}>
                                Cancel
                              </ActionButton>
                              <ActionButton color="primary" onClick={handleAddLine} disabled={!selectedProduct}>
                                Add Line
                              </ActionButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Total Amount: {calculateTotal().toLocaleString()} {currency}
                      </Typography>
                    </Box>
                  </SectionContent>
                </Collapse>
              </SectionPaper>

              {/* Line Details Section */}
              <SectionPaper>
                <SectionHeader>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Line details
                  </Typography>
                  <IconButton size="small" onClick={() => setExpandLineDetails(!expandLineDetails)}>
                    <ExpandMore
                      sx={{
                        transform: expandLineDetails ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </IconButton>
                </SectionHeader>
                <Collapse in={expandLineDetails}>
                  <SectionContent>
                    {/* Detail Tabs */}
                    <Tabs
                      value={detailTab}
                      onChange={handleDetailTabChange}
                      aria-label="line detail tabs"
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                    >
                      <DetailTab label="General" />
                      {/* <DetailTab label="Setup" />
                      <DetailTab label="Address" />
                      <DetailTab label="Product" />
                      <DetailTab label="Delivery" />
                      <DetailTab label="Picking" />
                      <DetailTab label="Price and discount" />
                      <DetailTab label="Project" />
                      <DetailTab label="Product packages" />
                      <DetailTab label="Variants" />
                      <DetailTab label="Foreign trade" />
                      <DetailTab label="Fixed assets" />
                      <DetailTab label="Financial dimensions" />
                      <DetailTab label="Loads" /> */}
                    </Tabs>

                    {/* Detail Tab Content */}
                    {detailTab === 0 && (
                      <Grid container spacing={4}>
                        {/* Request for Quotation Section */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: "uppercase" }}>
                            REQUEST FOR QUOTATION
                          </Typography>
                          <DetailField>
                            <DetailLabel>RFQ number</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>RFQ reply number</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>RFQ line number</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>

                        {/* Order Line Section */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: "uppercase" }}>
                            ORDER LINE
                          </Typography>
                          <DetailField>
                            <DetailLabel>Procurement category</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value="SERVICES RENOVATION"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Product name</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={lineItems[selectedLine - 1]?.productName || ""}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Text</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              multiline
                              rows={2}
                              value={lineItems[selectedLine - 1]?.productName || ""}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>

                        {/* Purchase Requisition Section */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: "uppercase" }}>
                            PURCHASE REQUISITION
                          </Typography>
                          <DetailField>
                            <DetailLabel>Purchase requisition</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Requisition product name</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Supplier part auxiliary ID</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>

                        {/* Intercompany Section */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: "uppercase" }}>
                            INTERCOMPANY
                          </Typography>
                          <DetailField>
                            <DetailLabel>Origin (intercompany orders)</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>External</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Origin</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value="Purchase"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>

                        {/* Delivery Reference Section */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: "uppercase" }}>
                            DELIVERY REFERENCE
                          </Typography>
                          <DetailField>
                            <DetailLabel>Customer requisition</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Customer reference</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>

                        {/* Status Section */}
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: "uppercase" }}>
                            STATUS
                          </Typography>
                          <DetailField>
                            <DetailLabel>Line status</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value="Open order"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>

                        {/* Flags Section */}
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Switch size="small" checked={false} />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                Stopped
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Switch size="small" checked={false} />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                Finalized
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Switch size="small" checked={false} />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                Prevent partial delivery
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Switch size="small" checked={false} />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                Added by POS receiving
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <DetailLabel>State</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value="Not submitted"
                              InputProps={{ readOnly: true }}
                            />
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <DetailLabel>Quality order status</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                    {detailTab === 6 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            PRICE DETAILS
                          </Typography>
                          <DetailField>
                            <DetailLabel>Unit price</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={lineItems[selectedLine - 1]?.unitPrice.toLocaleString() || "0.00"}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Line amount</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={lineItems[selectedLine - 1]?.lineAmount.toLocaleString() || "0.00"}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            DISCOUNT
                          </Typography>
                          <DetailField>
                            <DetailLabel>Line discount</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={lineItems[selectedLine - 1]?.discount.toFixed(2) || "0.00"}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Discount percent</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value="0.00"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>
                      </Grid>
                    )}
                    {detailTab === 4 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            DELIVERY INFORMATION
                          </Typography>
                          <DetailField>
                            <DetailLabel>Delivery date</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={requestedDate}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Delivery address</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={deliveryAddress || "Not specified"}
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                          <DetailField>
                            <DetailLabel>Delivery method</DetailLabel>
                            <DetailTextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value="Standard delivery"
                              InputProps={{ readOnly: true }}
                            />
                          </DetailField>
                        </Grid>
                      </Grid>
                    )}
                  </SectionContent>
                </Collapse>
              </SectionPaper>
            </>
          )}

          {mainTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">Header information</Typography>
              <Typography variant="body2" color="text.secondary">
                This tab contains detailed information about the purchase order header.
              </Typography>

              {/* Header Details */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <SectionPaper>
                    <SectionHeader>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Vendor Information
                      </Typography>
                    </SectionHeader>
                    <SectionContent>
                      <DetailField>
                        <DetailLabel>Vendor ID</DetailLabel>
                        <DetailValue>{vendorId}</DetailValue>
                      </DetailField>
                      <DetailField>
                        <DetailLabel>Vendor Name</DetailLabel>
                        <DetailValue>{vendorName}</DetailValue>
                      </DetailField>
                      <DetailField>
                        <DetailLabel>Contact Person</DetailLabel>
                        <DetailValue>{vendorContact || "Not specified"}</DetailValue>
                      </DetailField>
                      <DetailField>
                        <DetailLabel>Delivery Address</DetailLabel>
                        <DetailValue>{deliveryAddress || "Not specified"}</DetailValue>
                      </DetailField>
                    </SectionContent>
                  </SectionPaper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <SectionPaper>
                    <SectionHeader>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Order Information
                      </Typography>
                    </SectionHeader>
                    <SectionContent>
                      <DetailField>
                        <DetailLabel>Order Number</DetailLabel>
                        <DetailValue>{orderNumber}</DetailValue>
                      </DetailField>
                      <DetailField>
                        <DetailLabel>Order Date</DetailLabel>
                        <DetailValue>{requestedDate}</DetailValue>
                      </DetailField>
                      <DetailField>
                        <DetailLabel>Currency</DetailLabel>
                        <DetailValue>
                          {currency} - {currencyName}
                        </DetailValue>
                      </DetailField>
                      <DetailField>
                        <DetailLabel>Status</DetailLabel>
                        <DetailValue>{status || "Open order"}</DetailValue>
                      </DetailField>
                    </SectionContent>
                  </SectionPaper>
                </Grid>
              </Grid>
            </Box>
          )}
        </ScrollableContent>
      </MainContentWrapper>

      {/* Dialogs and popovers */}

      {/* Import Products Dialog */}
      <Dialog open={showImportDialog} onClose={() => setShowImportDialog(false)}>
        <DialogTitle>Import Products</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a file to import products from your inventory system.
          </Typography>
          <Button variant="outlined" component="label" startIcon={<FileUpload />} sx={{ mb: 2 }}>
            Choose File
            <input type="file" hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowImportDialog(false)
              showSnackbar("Products imported successfully")
            }}
            sx={{ bgcolor: "#f15a22", "&:hover": { bgcolor: alpha("#f15a22", 0.8) } }}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
        <DialogTitle>Export Purchase Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Choose a format to export this purchase order:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button variant="outlined" startIcon={<FileDownload />}>
              Export as PDF
            </Button>
            <Button variant="outlined" startIcon={<FileDownload />}>
              Export as Excel
            </Button>
            <Button variant="outlined" startIcon={<FileDownload />}>
              Export as CSV
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Receive Items Dialog */}
      <Dialog open={showReceiveDialog} onClose={() => setShowReceiveDialog(false)}>
        <DialogTitle>Receive Items</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Confirm receipt of the following items:
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <MuiTableRow>
                  <StyledTableHeadCell>Item</StyledTableHeadCell>
                  <StyledTableHeadCell>Quantity</StyledTableHeadCell>
                  <StyledTableHeadCell>Status</StyledTableHeadCell>
                </MuiTableRow>
              </TableHead>
              <TableBody>
                {multiSelectActive
                  ? selectedLines.map((lineIndex) => (
                      <MuiTableRow key={lineIndex}>
                        <StyledTableCell>{lineItems[lineIndex - 1].productName}</StyledTableCell>
                        <StyledTableCell>{lineItems[lineIndex - 1].quantity}</StyledTableCell>
                        <StyledTableCell>
                          <Chip label="To Receive" size="small" color="primary" />
                        </StyledTableCell>
                      </MuiTableRow>
                    ))
                  : selectedLine && (
                      <MuiTableRow>
                        <StyledTableCell>{lineItems[selectedLine - 1]?.productName}</StyledTableCell>
                        <StyledTableCell>{lineItems[selectedLine - 1]?.quantity}</StyledTableCell>
                        <StyledTableCell>
                          <Chip label="To Receive" size="small" color="primary" />
                        </StyledTableCell>
                      </MuiTableRow>
                    )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceiveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={completeReceiving}
            sx={{ bgcolor: "#f15a22", "&:hover": { bgcolor: alpha("#f15a22", 0.8) } }}
          >
            Confirm Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Multiple Products Form */}
      <Dialog open={showAddMultipleForm} onClose={() => setShowAddMultipleForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Multiple Products</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select multiple products from this vendor to add to your purchase order:
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <MuiTableRow>
                  <StyledTableHeadCell padding="checkbox">
                    <Checkbox size="small" />
                  </StyledTableHeadCell>
                  <StyledTableHeadCell>Product ID</StyledTableHeadCell>
                  <StyledTableHeadCell>Product Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Price</StyledTableHeadCell>
                  <StyledTableHeadCell>Quantity</StyledTableHeadCell>
                </MuiTableRow>
              </TableHead>
              <TableBody>
                {vendorProducts.length > 0 ? (
                  vendorProducts.map((product) => (
                    <MuiTableRow key={product.productId}>
                      <StyledTableCell padding="checkbox">
                        <Checkbox size="small" />
                      </StyledTableCell>
                      <StyledTableCell>{product.productId}</StyledTableCell>
                      <StyledTableCell>{product.productName}</StyledTableCell>
                      <StyledTableCell>{product.price}</StyledTableCell>
                      <StyledTableCell>
                        <StyledTextField size="small" type="number" defaultValue={1} sx={{ width: "80px" }} />
                      </StyledTableCell>
                    </MuiTableRow>
                  ))
                ) : (
                  <MuiTableRow>
                    <StyledTableCell colSpan={5} align="center">
                      No products available for this vendor
                    </StyledTableCell>
                  </MuiTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMultipleForm(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowAddMultipleForm(false)
              showSnackbar("Multiple products added to purchase order")
            }}
            sx={{ bgcolor: "#f15a22", "&:hover": { bgcolor: alpha("#f15a22", 0.8) } }}
          >
            Add Selected Products
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attachments Dialog */}
      <Dialog open={attachmentDialogOpen} onClose={() => setAttachmentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Purchase Order Attachments</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Upload New Attachment
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label" startIcon={<AttachFile />}>
                Choose File
                <input type="file" hidden onChange={handleFileSelect} />
              </Button>
              {selectedFile && (
                <Typography variant="body2">
                  {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </Typography>
              )}
              <Button
                variant="contained"
                disabled={!selectedFile}
                onClick={addAttachment}
                sx={{
                  bgcolor: "#f15a22",
                  "&:hover": { bgcolor: alpha("#f15a22", 0.8) },
                  "&.Mui-disabled": { bgcolor: alpha("#f15a22", 0.5) },
                }}
              >
                Upload
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Current Attachments
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <MuiTableRow>
                  <StyledTableHeadCell>Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Type</StyledTableHeadCell>
                  <StyledTableHeadCell>Size</StyledTableHeadCell>
                  <StyledTableHeadCell>Upload Date</StyledTableHeadCell>
                  <StyledTableHeadCell>Actions</StyledTableHeadCell>
                </MuiTableRow>
              </TableHead>
              <TableBody>
                {attachments.length > 0 ? (
                  attachments.map((attachment) => (
                    <MuiTableRow key={attachment.id}>
                      <StyledTableCell>{attachment.name}</StyledTableCell>
                      <StyledTableCell>{attachment.type}</StyledTableCell>
                      <StyledTableCell>{Math.round(attachment.size / 1024)} KB</StyledTableCell>
                      <StyledTableCell>{attachment.uploadDate}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <FileDownload fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </StyledTableCell>
                    </MuiTableRow>
                  ))
                ) : (
                  <MuiTableRow>
                    <StyledTableCell colSpan={5} align="center">
                      No attachments found
                    </StyledTableCell>
                  </MuiTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttachmentDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  )
}

export default PurchaseOrderDetails
