import { useState, useEffect, createContext, useContext } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
  Chip,
  Radio,
  Badge,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Search, KeyboardArrowDown, Refresh, MoreVert, CloudDownload } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import SecondaryNavbar from "./Components/Secondarynavbar"
import NewPurchaseOrder from "./Components/NewPurchaseOrder/Newpurchaseorder"
import PurchaseOrderDetails from "./Components/PurchaseOrderDetails/PurchaseOrderDetails"
import axios from "axios"

// Create a context for theme mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
})

// Custom styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
  color: theme.palette.mode === "dark" ? "#fff" : "#333",
  fontWeight: "bold",
  borderBottom: `2px solid ${alpha("#f15a22", 0.3)}`,
  position: "sticky",
  top: 0,
  zIndex: 10,
}))

// Update the MainContentWrapper styled component to include margin-top
const MainContentWrapper = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  marginLeft: "60px", // Fixed margin for sidebar
  marginTop: "64px", // Base margin for AppBar
  paddingTop: "68px", // Add padding to account for navbar + its margin (48px + 20px)
  transition: theme.transitions.create(["margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f7",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
  height: "calc(100vh - 64px)", // Adjust height to account for AppBar
  maxHeight: "calc(100vh - 64px)", // Adjust max height to account for AppBar
  overflow: "hidden", // Prevent scrolling at the container level
  display: "flex",
  flexDirection: "column",
  width: "calc(100% - 60px)", // Full width minus sidebar
}))

const AccountsPayableComponent = () => {
  const colorMode = useContext(ColorModeContext)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterText, setFilterText] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getStatusChip = (status) => {
    const color = "default"
    let backgroundColor = ""
    let textColor = ""

    switch (status) {
      case "Confirmed":
        backgroundColor = alpha("#4caf50", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = "#4caf50"
        break
      case "In review":
        backgroundColor = alpha("#ff9800", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = "#ff9800"
        break
      case "Draft":
        backgroundColor = alpha("#9e9e9e", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = colorMode.mode === "dark" ? "#bdbdbd" : "#9e9e9e"
        break
      case "Approved":
        backgroundColor = alpha("#2196f3", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = "#2196f3"
        break
      default:
        backgroundColor = alpha("#9e9e9e", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = colorMode.mode === "dark" ? "#bdbdbd" : "#9e9e9e"
    }

    return (
      <Chip
        size="small"
        label={status}
        sx={{
          backgroundColor,
          color: textColor,
          fontWeight: 500,
          borderRadius: "4px",
        }}
      />
    )
  }

  const getOrderStatusChip = (status) => {
    let backgroundColor = ""
    let textColor = ""

    switch (status) {
      case "Open order":
        backgroundColor = alpha("#f15a22", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = "#f15a22"
        break
      case "Received":
        backgroundColor = alpha("#4caf50", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = "#4caf50"
        break
      case "Invoiced":
        backgroundColor = alpha("#2196f3", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = "#2196f3"
        break
      default:
        backgroundColor = alpha("#9e9e9e", colorMode.mode === "dark" ? 0.2 : 0.1)
        textColor = colorMode.mode === "dark" ? "#bdbdbd" : "#9e9e9e"
    }

    return (
      <Chip
        size="small"
        label={status}
        sx={{
          backgroundColor,
          color: textColor,
          fontWeight: 500,
          borderRadius: "4px",
        }}
      />
    )
  }

  // Filter orders based on search text
  const filteredOrders = purchaseOrders.filter((order) => {
    if (!filterText) return true
    const searchText = filterText.toLowerCase()
    return (
      order.orderNumber?.toLowerCase().includes(searchText) ||
      order.vendorName?.toLowerCase().includes(searchText) ||
      order.vendorId?.toLowerCase().includes(searchText) ||
      order.approvalStatus?.toLowerCase().includes(searchText) ||
      order.orderStatus?.toLowerCase().includes(searchText)
    )
  })

  const handleNewOrderClick = () => {
    setDrawerOpen(true)
  }

  const handleNewOrderClose = () => {
    setDrawerOpen(false)
  }

  const fetchPurchaseOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/purchase-orders")
      setPurchaseOrders(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching purchase orders:", err)
      setError("Failed to load purchase orders. Please try again.")
      setPurchaseOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Add useEffect to fetch purchase orders when the component mounts
  useEffect(() => {
    fetchPurchaseOrders()
  }, [])

  // Update the handleNewOrderSubmit function to directly show the PurchaseOrderDetails component
  const handleNewOrderSubmit = (data) => {
    try {
      // Set the order data directly
      setOrderData(data)
      setShowOrderDetails(true)
    } catch (error) {
      console.error("Error creating purchase order:", error)
      alert("Error creating purchase order. Please try again.")
    }
  }

  // Handle clicking on a purchase order to view details
  const handleViewOrderDetails = async (order) => {
    setLoading(true)
    try {
      // Fetch the complete order details including line items
      let completeOrderData = order

      // If we have an ID, fetch the complete order from the backend
      if (order._id) {
        const response = await axios.get(`/api/purchase-orders/${order._id}`)
        completeOrderData = response.data
      } else if (order.orderNumber) {
        // Try to fetch by order number if we don't have an ID
        try {
          const response = await axios.get(`/api/purchase-orders/number/${order.orderNumber}`)
          completeOrderData = response.data
        } catch (err) {
          console.log("Order not found by number, using provided data")
        }
      }

      setOrderData(completeOrderData)
      setShowOrderDetails(true)
      setError(null)
    } catch (err) {
      console.error("Error fetching order details:", err)
      setError("Failed to load order details. Please try again.")
      // Still show the details with what we have
      setOrderData(order)
      setShowOrderDetails(true)
    } finally {
      setLoading(false)
    }
  }

  // Handle going back to the purchase orders list
  const handleBackToList = () => {
    setShowOrderDetails(false)
    setOrderData(null)
    // Refresh the purchase orders list when returning from details
    fetchPurchaseOrders()
  }

  if (showOrderDetails && orderData) {
    return <PurchaseOrderDetails orderData={orderData} onBack={handleBackToList} />
  }

  return (
    <>
      {/* Secondary Navigation Bar - Below AppBar */}
      <SecondaryNavbar onNewOrderClick={handleNewOrderClick} />

      {/* Main Content - Using MainContentWrapper with adjusted top margin */}
      <MainContentWrapper open={drawerOpen}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mt: 2 }}>
            All purchase orders
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            Standard view
            <KeyboardArrowDown sx={{ ml: 0.5, color: "#f15a22" }} />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              placeholder="Filter"
              variant="outlined"
              size="small"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{
                width: "250px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#f15a22",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#f15a22",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "#f15a22" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Refresh">
              <IconButton sx={{ color: "#f15a22" }} onClick={fetchPurchaseOrders}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export">
              <IconButton>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton>
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
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

        {/* Table Container with overflow auto */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: "8px",
              height: "100%",
              backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff"),
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell padding="checkbox">
                    <Radio
                      checked={false}
                      sx={{
                        "&.Mui-checked": {
                          color: "#f15a22",
                        },
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell
                    onClick={() => handleSort("orderNumber")}
                    sx={{ cursor: "pointer", "&:hover": { color: "#f15a22" } }}
                  >
                    Purchase order {sortColumn === "orderNumber" && (sortDirection === "asc" ? "↑" : "↓")}
                  </StyledTableCell>
                  <StyledTableCell>Vendor account</StyledTableCell>
                  <StyledTableCell>Invoice account</StyledTableCell>
                  <StyledTableCell
                    onClick={() => handleSort("vendorName")}
                    sx={{ cursor: "pointer", "&:hover": { color: "#f15a22" } }}
                  >
                    Vendor name {sortColumn === "vendorName" && (sortDirection === "asc" ? "↑" : "↓")}
                  </StyledTableCell>
                  <StyledTableCell>Purchase type</StyledTableCell>
                  <StyledTableCell
                    onClick={() => handleSort("approvalStatus")}
                    sx={{ cursor: "pointer", "&:hover": { color: "#f15a22" } }}
                  >
                    Approval status {sortColumn === "approvalStatus" && (sortDirection === "asc" ? "↑" : "↓")}
                  </StyledTableCell>
                  <StyledTableCell
                    onClick={() => handleSort("orderStatus")}
                    sx={{ cursor: "pointer", "&:hover": { color: "#f15a22" } }}
                  >
                    Purchase order status {sortColumn === "orderStatus" && (sortDirection === "asc" ? "↑" : "↓")}
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    onClick={() => handleSort("totalAmount")}
                    sx={{ cursor: "pointer", "&:hover": { color: "#f15a22" } }}
                  >
                    Po Total Amount {sortColumn === "totalAmount" && (sortDirection === "asc" ? "↑" : "↓")}
                  </StyledTableCell>
                  <StyledTableCell align="right">Total Receipt</StyledTableCell>
                  <StyledTableCell>Currency</StyledTableCell>
                  <StyledTableCell
                    onClick={() => handleSort("requestedDate")}
                    sx={{ cursor: "pointer", "&:hover": { color: "#f15a22" } }}
                  >
                    Requested receipt date {sortColumn === "requestedDate" && (sortDirection === "asc" ? "↑" : "↓")}
                  </StyledTableCell>
                  <StyledTableCell>Mode of delivery</StyledTableCell>
                  <StyledTableCell>Delivery terms</StyledTableCell>
                  <StyledTableCell>Purchase status</StyledTableCell>
                  <StyledTableCell>Quality order status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={16}
                      align="center"
                      sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#e0e0e0" : "inherit") }}
                    >
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order._id || order.orderNumber}
                      hover
                      selected={selectedOrder === order._id}
                      onClick={() => {
                        setSelectedOrder(order._id || order.orderNumber)
                        handleViewOrderDetails(order)
                      }}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&.Mui-selected": {
                          backgroundColor: alpha("#f15a22", 0.08),
                          "&:hover": {
                            backgroundColor: alpha("#f15a22", 0.12),
                          },
                        },
                        "&:hover": {
                          backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? alpha("#333", 0.5) : alpha("#f5f5f5", 0.8),
                        },
                        transition: "background-color 0.2s ease",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Radio
                          checked={selectedOrder === (order._id || order.orderNumber)}
                          onChange={() => setSelectedOrder(order._id || order.orderNumber)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#f15a22",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          color: "#f15a22",
                          fontWeight: 500,
                        }}
                      >
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.vendorId}</TableCell>
                      <TableCell>{order.invoiceAccount}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{order.vendorName}</TableCell>
                      <TableCell>{order.purchaseType || "Purchase order"}</TableCell>
                      <TableCell>{getStatusChip(order.confirmation || "Confirmed")}</TableCell>
                      <TableCell>{getOrderStatusChip(order.status || "Open order")}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        {typeof order.totalAmount === "number"
                          ? order.totalAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : order.totalAmount || "0.00"}
                      </TableCell>
                      <TableCell align="right">
                        {typeof order.totalReceipt === "number"
                          ? order.totalReceipt.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : order.totalReceipt || "0.00"}
                      </TableCell>
                      <TableCell>{order.currency}</TableCell>
                      <TableCell>{order.requestedDate}</TableCell>
                      <TableCell>{order.modeOfDelivery || ""}</TableCell>
                      <TableCell>{order.deliveryTerms || ""}</TableCell>
                      <TableCell>{order.purchaseStatus || ""}</TableCell>
                      <TableCell>{order.qualityOrderStatus || ""}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Status bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            p: 1,
            borderTop: (theme) => `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"}`,
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "transparent"),
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filteredOrders.length} items • Last updated: {new Date().toLocaleString()}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Badge
              badgeContent={filteredOrders.filter((o) => o.confirmation === "In review").length || 0}
              color="error"
              sx={{ "& .MuiBadge-badge": { backgroundColor: "#f15a22" } }}
            >
              {/* <Chip label="Pending Approval" size="small" /> */}
            </Badge>
            <Badge badgeContent={filteredOrders.filter((o) => o.status === "Open order").length || 0} color="success">
              <Chip label="Open Orders" size="small" />
            </Badge>
          </Box>
        </Box>
      </MainContentWrapper>

      {/* New Purchase Order Drawer */}
      <NewPurchaseOrder open={drawerOpen} onClose={handleNewOrderClose} onSubmit={handleNewOrderSubmit} />
    </>
  )
}

export default function AccountsPayablePreview() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* The actual components */}
      <AccountsPayableComponent />
    </Box>
  )
}
