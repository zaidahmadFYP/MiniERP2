import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Switch,
  InputAdornment,
  Grid,
  alpha,
  Chip,
  Tooltip,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  FormControl,
  Snackbar,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemText,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import {
  KeyboardArrowDown,
  Close,
  Add,
  Person,
  ExpandMore,
  ChevronRight,
  CalendarToday,
  Business,
  AttachMoney,
  Inventory,
  Description,
  Info,
  LocationOn,
  Search,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { format } from "date-fns"

// Styled components with improved aesthetics
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "600px",
    maxWidth: "100%",
    padding: 0,
    boxSizing: "border-box",
    marginTop: "64px", // Add margin to position below app bar
    height: "calc(100% - 64px)", // Adjust height to account for app bar
    zIndex: 1200, // Set z-index higher than backdrop but lower than app bar
    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
    color: theme.palette.mode === "dark" ? "#e0e0e0" : "inherit",
    borderLeft: theme.palette.mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
    boxShadow: theme.palette.mode === "dark" ? "none" : "-5px 0 15px rgba(0,0,0,0.08)",
  },
  "& .MuiBackdrop-root": {
    marginTop: "64px", // Adjust backdrop to start below app bar
    height: "calc(100% - 64px)", // Adjust backdrop height
    backgroundColor: "transparent", // Make the default backdrop transparent
  },
}))

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#e0e0e0"}`,
  backgroundColor: theme.palette.mode === "dark" ? "#252525" : "#f8f8f8",
}))

const DrawerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  overflowY: "auto",
}))

const DrawerFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#e0e0e0"}`,
  backgroundColor: theme.palette.mode === "dark" ? "#252525" : "#f8f8f8",
}))

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1rem",
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#333",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    color: "#f15a22",
  },
}))

const FormLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.mode === "dark" ? "#aaa" : "#666",
  marginBottom: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
}))

const StyledTextField = styled(TextField)(({ theme, readOnly, error }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: error ? "#f44336" : theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: error ? "#d32f2f" : theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "#bdbdbd",
    },
    "&.Mui-focused fieldset": {
      borderColor: error ? "#d32f2f" : "#f15a22",
    },
    "& input, & textarea": {
      color: theme.palette.mode === "dark" ? "#e0e0e0" : "inherit",
      cursor: readOnly ? "default" : "text",
    },
  },
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "dark" ? "#e0e0e0" : "inherit",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: error ? "#d32f2f" : "#f15a22",
  },
  "& .MuiFormHelperText-root": {
    color: error ? "#d32f2f" : theme.palette.mode === "dark" ? "#aaa" : "#666",
  },
}))

const ActionButton = styled(Button)(({ theme, color }) => ({
  textTransform: "none",
  borderRadius: "8px",
  padding: "8px 24px",
  fontWeight: 500,
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
  boxShadow: color === "primary" ? "0 2px 5px rgba(241, 90, 34, 0.3)" : "none",
  "&:disabled": {
    backgroundColor: color === "primary" ? alpha("#f15a22", 0.5) : "transparent",
    color: color === "primary" ? "#fff" : theme.palette.mode === "dark" ? alpha("#e0e0e0", 0.5) : alpha("#333", 0.5),
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.875rem",
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#555",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}))

const CollapsibleSection = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#252525" : "#fff",
  border: theme.palette.mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e0e0e0",
}))

const CollapsibleHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f8f8f8",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
  },
}))

const CollapsibleContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#252525" : "#fff",
}))

const RequiredAsterisk = styled("span")({
  color: "#f44336",
  marginLeft: "2px",
})

const DropdownTable = styled(Box)(({ theme }) => ({
  position: "fixed",
  width: "800px",
  maxHeight: "300px",
  overflowY: "auto",
  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "white",
  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#e0e0e0"}`,
  borderRadius: "8px",
  zIndex: 1400,
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "inherit",
}))

const TableHeader = styled(Box)(({ theme }) => ({
  display: "table-row",
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
  fontWeight: "bold",
}))

const TableCell = styled(Box)(({ theme }) => ({
  display: "table-cell",
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#e0e0e0"}`,
}))

const TableRow = styled(Box)(({ theme }) => ({
  display: "table-row",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#3a3a3a" : "#f9f9f9",
  },
}))

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: "4px",
  fontWeight: 500,
  fontSize: "0.75rem",
}))

// Generate random 6-digit PO number
const generatePONumber = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000) // 6-digit number
  return `PO-${randomNum}`
}

// Departments and cost centers for dropdown options
const departments = [
  { id: "DEPT-001", name: "Finance" },
  { id: "DEPT-002", name: "Operations" },
  { id: "DEPT-003", name: "Human Resources" },
  { id: "DEPT-004", name: "Information Technology" },
  { id: "DEPT-005", name: "Marketing" },
  { id: "DEPT-006", name: "Sales" },
  { id: "DEPT-007", name: "Research & Development" },
  { id: "DEPT-008", name: "Customer Service" },
  { id: "DEPT-009", name: "Legal" },
  { id: "DEPT-010", name: "Administration" },
]

const costCenters = [
  { id: "CC-001", name: "Corporate Headquarters" },
  { id: "CC-002", name: "Regional Office - North" },
  { id: "CC-003", name: "Regional Office - South" },
  { id: "CC-004", name: "Regional Office - East" },
  { id: "CC-005", name: "Regional Office - West" },
  { id: "CC-006", name: "Manufacturing Plant A" },
  { id: "CC-007", name: "Manufacturing Plant B" },
  { id: "CC-008", name: "Distribution Center" },
  { id: "CC-009", name: "Retail Locations" },
  { id: "CC-010", name: "Online Operations" },
]

// Sites and warehouses for dropdown options
const sites = [
  { id: "SITE-001", name: "Main Campus" },
  { id: "SITE-002", name: "North Facility" },
  { id: "SITE-003", name: "South Facility" },
  { id: "SITE-004", name: "East Facility" },
  { id: "SITE-005", name: "West Facility" },
]

const warehouses = [
  { id: "WH-001", name: "Central Warehouse" },
  { id: "WH-002", name: "Raw Materials Storage" },
  { id: "WH-003", name: "Finished Goods Storage" },
  { id: "WH-004", name: "Distribution Center" },
  { id: "WH-005", name: "Overflow Storage" },
]

// Purchase types for dropdown options
const purchaseTypes = [
  { id: "PT-001", name: "Purchase order" },
  { id: "PT-002", name: "Purchase requisition" },
  { id: "PT-003", name: "Direct delivery" },
  { id: "PT-004", name: "Blanket order" },
  { id: "PT-005", name: "Contract" },
]

// Delivery terms for dropdown options
const deliveryTerms = [
  { id: "DT-001", name: "FOB - Destination" },
  { id: "DT-002", name: "FOB - Origin" },
  { id: "DT-003", name: "CIF - Cost, Insurance, Freight" },
  { id: "DT-004", name: "EXW - Ex Works" },
  { id: "DT-005", name: "DDP - Delivered Duty Paid" },
]

// Delivery modes for dropdown options
const deliveryModes = [
  { id: "DM-001", name: "Standard Ground" },
  { id: "DM-002", name: "Express" },
  { id: "DM-003", name: "Air Freight" },
  { id: "DM-004", name: "Ocean Freight" },
  { id: "DM-005", name: "Rail" },
]

// Modify the NewPurchaseOrder component to accept a navigate prop
const NewPurchaseOrder = ({ open, onClose, onSubmit }) => {
  // Add console logs to track execution
  console.log("NewPurchaseOrder rendered, open:", open)

  // Form validation state
  const [formErrors, setFormErrors] = useState({})
  const [formTouched, setFormTouched] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    administration: false,
    unplannedPurchases: false,
    delivery: false,
    payment: false,
  })

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedInvoiceVendor, setSelectedInvoiceVendor] = useState(null)
  const [vendorName, setVendorName] = useState("")
  const [vendorContact, setVendorContact] = useState("")
  const [deliveryName, setDeliveryName] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [poNumber, setPONumber] = useState(generatePONumber())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [requestedDate, setRequestedDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // Default to 1 week from now
  const [searchTerm, setSearchTerm] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [invoiceDropdownOpen, setInvoiceDropdownOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(null)
  const [currencies, setCurrencies] = useState([])
  const [loadingCurrencies, setLoadingCurrencies] = useState(false)
  const [isOneTimeSupplier, setIsOneTimeSupplier] = useState(false)
  const [isIntercompany, setIsIntercompany] = useState(false)
  const [allowUnplannedPurchases, setAllowUnplannedPurchases] = useState(false)
  const [notes, setNotes] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedCostCenter, setSelectedCostCenter] = useState("")
  const [selectedSite, setSelectedSite] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [purchaseType, setPurchaseType] = useState("Purchase order")
  const [projectId, setProjectId] = useState("")
  const [purchaseAgreement, setPurchaseAgreement] = useState("")
  const [deliveryTerm, setDeliveryTerm] = useState("")
  const [deliveryMode, setDeliveryMode] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [contactPersons, setContactPersons] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  const [newContactEmail, setNewContactEmail] = useState("")
  const [newContactPhone, setNewContactPhone] = useState("")

  const vendorFieldRef = useRef(null)
  const dropdownRef = useRef(null)
  const invoiceFieldRef = useRef(null)
  const invoiceDropdownRef = useRef(null)
  const currencyFieldRef = useRef(null)
  const currencyDropdownRef = useRef(null)

  // Mark form as dirty when any field changes
  useEffect(() => {
    setIsFormDirty(true)
  }, [
    vendorName,
    vendorContact,
    deliveryName,
    deliveryAddress,
    selectedVendor,
    selectedInvoiceVendor,
    selectedCurrency,
    isOneTimeSupplier,
    isIntercompany,
    allowUnplannedPurchases,
    notes,
    selectedDepartment,
    selectedCostCenter,
    selectedSite,
    selectedWarehouse,
    purchaseType,
    projectId,
    purchaseAgreement,
    deliveryTerm,
    deliveryMode,
    paymentTerms,
    selectedContact,
    requestedDate,
    currentDate,
  ])

  // Reset form when drawer is opened
  useEffect(() => {
    if (open) {
      // Reset form state
      setFormErrors({})
      setFormTouched({})
      setFormSubmitted(false)
      setIsFormDirty(false)

      // Generate a new PO number
      setPONumber(generatePONumber())

      // Reset dates
      setCurrentDate(new Date())
      setRequestedDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    }
  }, [open])

  // Add this useEffect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        vendorFieldRef.current &&
        !vendorFieldRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false)
      }

      if (
        invoiceDropdownOpen &&
        invoiceFieldRef.current &&
        !invoiceFieldRef.current.contains(event.target) &&
        invoiceDropdownRef.current &&
        !invoiceDropdownRef.current.contains(event.target)
      ) {
        setInvoiceDropdownOpen(false)
      }

      if (
        currencyDropdownOpen &&
        currencyFieldRef.current &&
        !currencyFieldRef.current.contains(event.target) &&
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target)
      ) {
        setCurrencyDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen, invoiceDropdownOpen, currencyDropdownOpen])

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  // Fetch vendors from the backend API
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      try {
        // Use your actual backend API endpoint
        const response = await axios.get("/api/vendors")
        setVendors(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching vendors:", err)
        setError("Failed to load vendors. Please try again.")
        setVendors([])
      } finally {
        setLoading(false)
      }
    }

    // Fetch currencies from the backend API
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true)
      try {
        // Use your actual backend API endpoint for currencies
        const response = await axios.get("/api/currencies")
        setCurrencies(response.data)
      } catch (err) {
        console.error("Error fetching currencies:", err)
        // Set default currencies if API fails
        setCurrencies([
          { code: "PKR", name: "Pakistani Rupee" },
          { code: "USD", name: "US Dollar" },
        ])
      } finally {
        setLoadingCurrencies(false)
      }
    }

    if (open) {
      fetchVendors()
      fetchCurrencies()
    }
  }, [open])

  // Select vendor and populate fields
  const selectVendor = async (vendor) => {
    setSelectedVendor(vendor)
    setVendorName(vendor.vendorName || "")
    setFormTouched({ ...formTouched, vendorId: true })

    try {
      // Fetch detailed vendor information from your backend
      const response = await axios.get(`/api/vendors/${vendor.vendorId}`)
      const vendorDetails = response.data

      // Auto-fill form fields with vendor details
      setVendorContact(vendorDetails.contactPerson || "")
      setDeliveryName(vendorDetails.deliveryName || vendorDetails.name || "")
      setDeliveryAddress(vendorDetails.address || "")

      // If this vendor has a default currency, select it
      if (vendorDetails.currency) {
        const vendorCurrency = currencies.find((c) => c.code === vendorDetails.currency)
        if (vendorCurrency) {
          setSelectedCurrency(vendorCurrency)
        }
      }

      // Set the invoice vendor to be the same as the selected vendor by default
      setSelectedInvoiceVendor(vendorDetails)

      // Set contact persons if available
      if (vendorDetails.contacts && vendorDetails.contacts.length > 0) {
        setContactPersons(vendorDetails.contacts)
        setSelectedContact(vendorDetails.contacts[0])
      } else {
        // Create a default contact from the vendor information
        const defaultContact = {
          id: "default",
          name: vendorDetails.contactPerson || "",
          email: vendorDetails.email || "",
          phone: vendorDetails.phone || "",
        }
        setContactPersons([defaultContact])
        setSelectedContact(defaultContact)
      }

      // Show success message
      showSnackbar("Vendor details loaded successfully", "success")
    } catch (err) {
      console.error("Error fetching vendor details:", err)
      showSnackbar("Could not load complete vendor details", "warning")
      // Continue with basic information we already have
    }

    setDropdownOpen(false)
  }

  // Select invoice vendor
  const selectInvoiceVendor = (vendor) => {
    setSelectedInvoiceVendor(vendor)
    setInvoiceDropdownOpen(false)
    setFormTouched({ ...formTouched, invoiceAccount: true })
  }

  // Select currency
  const selectCurrency = (currency) => {
    setSelectedCurrency(currency)
    setCurrencyDropdownOpen(false)
    setFormTouched({ ...formTouched, currency: true })
  }

  // Calculate dropdown position
  const getDropdownPosition = (ref) => {
    if (!ref.current) return {}

    const rect = ref.current.getBoundingClientRect()
    return {
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    }
  }

  const dropdownPosition = getDropdownPosition(vendorFieldRef)
  const invoiceDropdownPosition = getDropdownPosition(invoiceFieldRef)
  const currencyDropdownPosition = getDropdownPosition(currencyFieldRef)

  // Helper function to show snackbar messages
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Validate form fields
  const validateForm = () => {
    const errors = {}

    // Required fields validation
    if (!selectedVendor && !isOneTimeSupplier) {
      errors.vendorId = "Vendor is required"
    }

    if (!vendorName) {
      errors.vendorName = "Vendor name is required"
    }

    if (!selectedInvoiceVendor && !isOneTimeSupplier) {
      errors.invoiceAccount = "Invoice account is required"
    }

    if (!selectedCurrency) {
      errors.currency = "Currency is required"
    }

    if (!deliveryName) {
      errors.deliveryName = "Delivery name is required"
    }

    if (!deliveryAddress) {
      errors.deliveryAddress = "Delivery address is required"
    }

    // Date validation
    if (!currentDate) {
      errors.currentDate = "Accounting date is required"
    }

    if (!requestedDate) {
      errors.requestedDate = "Requested receipt date is required"
    } else if (requestedDate < new Date()) {
      errors.requestedDate = "Requested date cannot be in the past"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle field blur for validation
  const handleFieldBlur = (field) => {
    setFormTouched({ ...formTouched, [field]: true })
  }

  // Handle adding a new contact
  const handleAddContact = () => {
    if (!newContactName) {
      showSnackbar("Contact name is required", "error")
      return
    }

    const newContact = {
      id: `contact-${Date.now()}`,
      name: newContactName,
      email: newContactEmail,
      phone: newContactPhone,
    }

    setContactPersons([...contactPersons, newContact])
    setSelectedContact(newContact)
    setNewContactName("")
    setNewContactEmail("")
    setNewContactPhone("")
    setContactDialogOpen(false)
    showSnackbar("Contact added successfully", "success")
  }

  // Update the handleSubmit function to include vendor products and send to backend
  const handleSubmit = async () => {
    setFormSubmitted(true)

    // Validate form
    const isValid = validateForm()
    if (!isValid) {
      showSnackbar("Please fill in all required fields", "error")
      return
    }

    console.log("Submitting purchase order...")
    setLoading(true)

    try {
      // Get vendor details including products
      let vendorDetails = selectedVendor

      // If we don't have the product list yet, fetch it
      if (selectedVendor && !selectedVendor.productList) {
        try {
          const response = await axios.get(`/api/vendors/${selectedVendor.vendorId}`)
          vendorDetails = response.data
        } catch (err) {
          console.error("Error fetching vendor details:", err)
        }
      }

      const orderData = {
        orderNumber: poNumber,
        vendorId: selectedVendor?.vendorId || "ONE-TIME-SUPPLIER",
        vendorName: vendorName,
        vendorContact: vendorContact,
        deliveryName: deliveryName,
        deliveryAddress: deliveryAddress,
        currency: selectedCurrency?.code || "PKR",
        currencyName: selectedCurrency?.name || "Pakistani Rupee",
        invoiceAccount: selectedInvoiceVendor?.vendorId || selectedVendor?.vendorId || "ONE-TIME-SUPPLIER",
        invoiceName: selectedInvoiceVendor?.vendorName || selectedVendor?.vendorName || vendorName,
        requestedDate: format(requestedDate, "MM/dd/yyyy"),
        accountingDate: format(currentDate, "MM/dd/yyyy"),
        status: "Open order",
        confirmation: "Confirmed",
        productList: vendorDetails?.productList || [],
        purchaseType: purchaseType,
        projectId: projectId,
        purchaseAgreement: purchaseAgreement,
        site: selectedSite?.id || "",
        siteName: selectedSite?.name || "",
        warehouse: selectedWarehouse?.id || "",
        warehouseName: selectedWarehouse?.name || "",
        department: selectedDepartment?.id || "",
        departmentName: selectedDepartment?.name || "",
        costCenter: selectedCostCenter?.id || "",
        costCenterName: selectedCostCenter?.name || "",
        notes: notes,
        isOneTimeSupplier: isOneTimeSupplier,
        isIntercompany: isIntercompany,
        allowUnplannedPurchases: allowUnplannedPurchases,
        deliveryTerm: deliveryTerm?.id || "",
        deliveryTermName: deliveryTerm?.name || "",
        deliveryMode: deliveryMode?.id || "",
        deliveryModeName: deliveryMode?.name || "",
        paymentTerms: paymentTerms,
        contactPerson: selectedContact?.name || "",
        contactEmail: selectedContact?.email || "",
        contactPhone: selectedContact?.phone || "",
      }

      console.log("Sending order data to API:", orderData)

      // Send the order data to the backend
      const response = await axios.post("/api/purchase-orders", orderData)

      if (response.status === 201) {
        console.log("Order created successfully:", response.data)
        showSnackbar("Purchase order created successfully", "success")
        setIsFormDirty(false)

        // First close the drawer
        onClose()

        // If successful, pass the data to the parent component
        if (onSubmit) {
          console.log("Calling onSubmit with data:", response.data)
          onSubmit(response.data)
        }
      }
    } catch (error) {
      console.error("Error creating purchase order:", error)
      setError("Failed to create purchase order. Please try again.")
      showSnackbar("Failed to create purchase order. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel with confirmation if form is dirty
  const handleCancel = () => {
    if (isFormDirty) {
      setConfirmDialogOpen(true)
    } else {
      onClose()
    }
  }

  // Handle confirm dialog actions
  const handleConfirmClose = () => {
    setConfirmDialogOpen(false)
  }

  const handleConfirmCancel = () => {
    setConfirmDialogOpen(false)
    onClose()
  }

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.city && vendor.city.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return {
          bg: "#e6f7ed",
          color: "#00a854",
        }
      case "Pending Review":
        return {
          bg: "#fff7e6",
          color: "#fa8c16",
        }
      case "Inactive":
        return {
          bg: "#ffeaea",
          color: "#f5222d",
        }
      default:
        return {
          bg: "#f5f5f5",
          color: "#8c8c8c",
        }
    }
  }

  // Get error message for a field
  const getErrorMessage = (field) => {
    if ((formTouched[field] || formSubmitted) && formErrors[field]) {
      return formErrors[field]
    }
    return ""
  }

  // Check if a field has an error
  const hasError = (field) => {
    return Boolean(getErrorMessage(field))
  }

  return (
    <>
      <StyledDrawer
        anchor="right"
        open={open}
        onClose={handleCancel}
        ModalProps={{
          BackdropProps: {
            invisible: true, // We're using our custom backdrop
          },
        }}
      >
        {/* Header */}
        <DrawerHeader>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ mr: 1, color: (theme) => (theme.palette.mode === "dark" ? "#aaa" : "#666") }}
              >
                Standard view
              </Typography>
              <KeyboardArrowDown
                fontSize="small"
                sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#aaa" : "#666") }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create purchase order
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" onClick={handleCancel}>
              <Close />
            </IconButton>
          </Box>
        </DrawerHeader>

        {/* Form Content - Scrollable */}
        <DrawerContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Vendor Section */}
          <SectionHeader>
            <Business fontSize="small" />
            Vendor
          </SectionHeader>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FormLabel sx={{ mb: 0, mr: 2 }}>One-time supplier</FormLabel>
              <Switch
                size="small"
                checked={isOneTimeSupplier}
                onChange={(e) => setIsOneTimeSupplier(e.target.checked)}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {isOneTimeSupplier ? "Yes" : "No"}
              </Typography>
            </Box>

            {/* Vendor account field with dropdown */}
            <FormLabel>
              Vendor account
              {!isOneTimeSupplier && <RequiredAsterisk>*</RequiredAsterisk>}
            </FormLabel>
            <Box sx={{ position: "relative", mb: 2 }} ref={vendorFieldRef}>
              <StyledTextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Select a vendor account"
                value={selectedVendor ? `${selectedVendor.vendorId} - ${selectedVendor.vendorName}` : ""}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? <CircularProgress size={20} /> : <KeyboardArrowDown />}
                    </InputAdornment>
                  ),
                  sx: { cursor: "pointer" },
                }}
                onClick={() => !loading && !isOneTimeSupplier && setDropdownOpen(!dropdownOpen)}
                disabled={isOneTimeSupplier}
                error={hasError("vendorId")}
                helperText={getErrorMessage("vendorId")}
                onBlur={() => handleFieldBlur("vendorId")}
              />
            </Box>

            {/* Dropdown for vendor selection */}
            {dropdownOpen && (
              <DropdownTable
                ref={dropdownRef}
                sx={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: "550px",
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderBottom: (theme) => `1px solid ${theme.palette.mode === "dark" ? "#444" : "#e0e0e0"}`,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "table",
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <TableHeader>
                    <TableCell sx={{ width: "100px" }}>Vendor ID</TableCell>
                    <TableCell sx={{ width: "180px" }}>Name</TableCell>
                    <TableCell sx={{ width: "100px" }}>City</TableCell>
                    <TableCell sx={{ width: "100px" }}>Status</TableCell>
                  </TableHeader>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                        <CircularProgress size={24} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <TableRow key={vendor.vendorId} onClick={() => selectVendor(vendor)}>
                        <TableCell>{vendor.vendorId}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1,
                                bgcolor: "#f15a22",
                                fontSize: "0.8rem",
                              }}
                            >
                              {vendor.vendorName ? vendor.vendorName.charAt(0) : "?"}
                            </Avatar>
                            {vendor.vendorName || ""}
                          </Box>
                        </TableCell>
                        <TableCell>{vendor.city || ""}</TableCell>
                        <TableCell>
                          <StatusChip
                            label={vendor.status || "Active"}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(vendor.status || "Active").bg,
                              color: getStatusColor(vendor.status || "Active").color,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                        No vendors found matching your search
                      </TableCell>
                    </TableRow>
                  )}
                </Box>
              </DropdownTable>
            )}

            <FormLabel>
              Name<RequiredAsterisk>*</RequiredAsterisk>
            </FormLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              size="small"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              error={hasError("vendorName")}
              helperText={getErrorMessage("vendorName")}
              onBlur={() => handleFieldBlur("vendorName")}
            />

            <FormLabel>Contact</FormLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              size="small"
              value={vendorContact}
              onChange={(e) => setVendorContact(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setContactDialogOpen(true)}>
                      <Person fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Address Section */}
          <SectionHeader>
            <LocationOn fontSize="small" />
            Address
          </SectionHeader>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormLabel>
                Delivery name<RequiredAsterisk>*</RequiredAsterisk>
              </FormLabel>
              <StyledTextField
                fullWidth
                variant="outlined"
                size="small"
                multiline
                rows={3}
                value={deliveryName}
                onChange={(e) => setDeliveryName(e.target.value)}
                error={hasError("deliveryName")}
                helperText={getErrorMessage("deliveryName")}
                onBlur={() => handleFieldBlur("deliveryName")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel>
                Address<RequiredAsterisk>*</RequiredAsterisk>
              </FormLabel>
              <StyledTextField
                fullWidth
                variant="outlined"
                size="small"
                multiline
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                error={hasError("deliveryAddress")}
                helperText={getErrorMessage("deliveryAddress")}
                onBlur={() => handleFieldBlur("deliveryAddress")}
              />
            </Grid>
          </Grid>

          <FormLabel>Delivery address</FormLabel>
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <FormControl fullWidth>
              <Select
                size="small"
                displayEmpty
                value={selectedContact ? selectedContact.id : ""}
                onChange={(e) => {
                  const contact = contactPersons.find((c) => c.id === e.target.value)
                  setSelectedContact(contact)
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select contact</em>
                  }
                  const contact = contactPersons.find((c) => c.id === selected)
                  return contact ? `${contact.name} (${contact.email || "No email"})` : ""
                }}
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem disabled value="">
                  <em>Select contact</em>
                </MenuItem>
                {contactPersons.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    <ListItemText primary={contact.name} secondary={contact.email || "No email"} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Select contact">
              <IconButton
                sx={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
                onClick={() => {
                  if (contactPersons.length > 0) {
                    setSelectedContact(contactPersons[0])
                  }
                }}
              >
                <Person fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add new contact">
              <IconButton
                sx={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
                onClick={() => setContactDialogOpen(true)}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Collapsible Sections */}
          <Box sx={{ mt: 3 }}>
            {/* General Section */}
            <CollapsibleSection>
              <CollapsibleHeader onClick={() => toggleSection("general")}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  General
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip
                    label={poNumber}
                    size="small"
                    sx={{
                      mr: 1,
                      backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#333" : "#e3f2fd"),
                      color: (theme) => (theme.palette.mode === "dark" ? "#90caf9" : "#1976d2"),
                      fontWeight: 500,
                      borderRadius: "4px",
                    }}
                  />
                  <IconButton size="small">{expandedSections.general ? <ExpandMore /> : <ChevronRight />}</IconButton>
                </Box>
              </CollapsibleHeader>
              {expandedSections.general && (
                <CollapsibleContent>
                  <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={6}>
                      {/* PURCHASE ORDER Section */}
                      <SectionTitle>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Description fontSize="small" sx={{ mr: 1, color: "#f15a22" }} />
                          Purchase Order
                        </Box>
                      </SectionTitle>

                      <FormLabel>Purchase order</FormLabel>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={poNumber}
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <FormLabel>Purchase type</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={purchaseType}
                          onChange={(e) => setPurchaseType(e.target.value)}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          {purchaseTypes.map((type) => (
                            <MenuItem key={type.id} value={type.name}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormLabel>
                        Invoice account<RequiredAsterisk>*</RequiredAsterisk>
                      </FormLabel>
                      <Box sx={{ position: "relative", mb: 2 }} ref={invoiceFieldRef}>
                        <StyledTextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          placeholder="Select an invoice account"
                          value={
                            selectedInvoiceVendor
                              ? `${selectedInvoiceVendor.vendorId} - ${selectedInvoiceVendor.vendorName}`
                              : ""
                          }
                          required
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <KeyboardArrowDown />
                              </InputAdornment>
                            ),
                            sx: { cursor: "pointer" },
                          }}
                          onClick={() => !isOneTimeSupplier && setInvoiceDropdownOpen(!invoiceDropdownOpen)}
                          disabled={isOneTimeSupplier}
                          error={hasError("invoiceAccount")}
                          helperText={getErrorMessage("invoiceAccount")}
                          onBlur={() => handleFieldBlur("invoiceAccount")}
                        />
                      </Box>

                      {/* Invoice Account Dropdown */}
                      {invoiceDropdownOpen && (
                        <DropdownTable
                          ref={invoiceDropdownRef}
                          sx={{
                            top: invoiceDropdownPosition.top,
                            left: invoiceDropdownPosition.left,
                            width: "550px",
                          }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderBottom: (theme) =>
                                `1px solid ${theme.palette.mode === "dark" ? "#444" : "#e0e0e0"}`,
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Search vendors..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Search fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                },
                              }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "table",
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <TableHeader>
                              <TableCell sx={{ width: "100px" }}>Vendor ID</TableCell>
                              <TableCell sx={{ width: "180px" }}>Name</TableCell>
                              <TableCell sx={{ width: "100px" }}>City</TableCell>
                              <TableCell sx={{ width: "100px" }}>Status</TableCell>
                            </TableHeader>
                            {filteredVendors.length > 0 ? (
                              filteredVendors.map((vendor) => (
                                <TableRow key={vendor.vendorId} onClick={() => selectInvoiceVendor(vendor)}>
                                  <TableCell>{vendor.vendorId}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <Avatar
                                        sx={{
                                          width: 24,
                                          height: 24,
                                          mr: 1,
                                          bgcolor: "#f15a22",
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        {vendor.vendorName ? vendor.vendorName.charAt(0) : "?"}
                                      </Avatar>
                                      {vendor.vendorName || ""}
                                    </Box>
                                  </TableCell>
                                  <TableCell>{vendor.city || ""}</TableCell>
                                  <TableCell>
                                    <StatusChip
                                      label={vendor.status || "Active"}
                                      size="small"
                                      sx={{
                                        backgroundColor: getStatusColor(vendor.status || "Active").bg,
                                        color: getStatusColor(vendor.status || "Active").color,
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                                  No vendors found matching your search
                                </TableCell>
                              </TableRow>
                            )}
                          </Box>
                        </DropdownTable>
                      )}

                      <FormLabel>Name</FormLabel>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={selectedInvoiceVendor?.vendorName || ""}
                        InputProps={{ readOnly: true }}
                      />

                      {/* REFERENCES Section */}
                      <SectionTitle>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Info fontSize="small" sx={{ mr: 1, color: "#f15a22" }} />
                          References
                        </Box>
                      </SectionTitle>

                      <FormLabel>Project ID</FormLabel>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                      />

                      <FormLabel>Purchase agreement</FormLabel>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={purchaseAgreement}
                        onChange={(e) => setPurchaseAgreement(e.target.value)}
                      />

                      {/* CURRENCY Section */}
                      <SectionTitle>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AttachMoney fontSize="small" sx={{ mr: 1, color: "#f15a22" }} />
                          Currency
                        </Box>
                      </SectionTitle>

                      <FormLabel>
                        Currency<RequiredAsterisk>*</RequiredAsterisk>
                      </FormLabel>
                      <Box sx={{ position: "relative", mb: 2 }} ref={currencyFieldRef}>
                        <StyledTextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          placeholder="Select currency"
                          value={selectedCurrency ? `${selectedCurrency.code} - ${selectedCurrency.name}` : ""}
                          required
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                {loadingCurrencies ? <CircularProgress size={20} /> : <KeyboardArrowDown />}
                              </InputAdornment>
                            ),
                            sx: { cursor: "pointer" },
                          }}
                          onClick={() => !loadingCurrencies && setCurrencyDropdownOpen(!currencyDropdownOpen)}
                          error={hasError("currency")}
                          helperText={getErrorMessage("currency")}
                          onBlur={() => handleFieldBlur("currency")}
                        />
                      </Box>

                      {/* Currency Dropdown */}
                      {currencyDropdownOpen && (
                        <DropdownTable
                          ref={currencyDropdownRef}
                          sx={{
                            top: currencyDropdownPosition.top,
                            left: currencyDropdownPosition.left,
                            width: "300px",
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
                              <TableCell sx={{ width: "80px" }}>Code</TableCell>
                              <TableCell>Currency</TableCell>
                            </TableHeader>
                            {loadingCurrencies ? (
                              <TableRow>
                                <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                                  <CircularProgress size={24} sx={{ my: 2 }} />
                                </TableCell>
                              </TableRow>
                            ) : currencies.length > 0 ? (
                              currencies.map((currency) => (
                                <TableRow key={currency.code} onClick={() => selectCurrency(currency)}>
                                  <TableCell>{currency.code}</TableCell>
                                  <TableCell>{currency.name}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                                  No currencies available
                                </TableCell>
                              </TableRow>
                            )}
                          </Box>
                        </DropdownTable>
                      )}
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={6}>
                      {/* STORAGE DIMENSIONS Section */}
                      <SectionTitle>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Inventory fontSize="small" sx={{ mr: 1, color: "#f15a22" }} />
                          Storage Dimensions
                        </Box>
                      </SectionTitle>

                      <FormLabel>Site</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={selectedSite ? selectedSite.id : ""}
                          onChange={(e) => {
                            const site = sites.find((s) => s.id === e.target.value)
                            setSelectedSite(site || null)
                          }}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <em>Select site</em>
                          </MenuItem>
                          {sites.map((site) => (
                            <MenuItem key={site.id} value={site.id}>
                              {site.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormLabel>Warehouse</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={selectedWarehouse ? selectedWarehouse.id : ""}
                          onChange={(e) => {
                            const warehouse = warehouses.find((w) => w.id === e.target.value)
                            setSelectedWarehouse(warehouse || null)
                          }}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <em>Select warehouse</em>
                          </MenuItem>
                          {warehouses.map((warehouse) => (
                            <MenuItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* DATES Section */}
                      <SectionTitle>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarToday fontSize="small" sx={{ mr: 1, color: "#f15a22" }} />
                          Dates
                        </Box>
                      </SectionTitle>

                      <FormLabel>
                        Accounting date<RequiredAsterisk>*</RequiredAsterisk>
                      </FormLabel>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={currentDate}
                          onChange={(newDate) => setCurrentDate(newDate)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: { mb: 2 },
                              error: hasError("currentDate"),
                              helperText: getErrorMessage("currentDate"),
                              onBlur: () => handleFieldBlur("currentDate"),
                            },
                          }}
                        />
                      </LocalizationProvider>

                      <FormLabel>
                        Requested receipt date<RequiredAsterisk>*</RequiredAsterisk>
                      </FormLabel>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={requestedDate}
                          onChange={(newDate) => setRequestedDate(newDate)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: { mb: 2 },
                              error: hasError("requestedDate"),
                              helperText: getErrorMessage("requestedDate"),
                              onBlur: () => handleFieldBlur("requestedDate"),
                            },
                          }}
                        />
                      </LocalizationProvider>

                      {/* INTERCOMPANY Section */}
                      <SectionTitle>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Business fontSize="small" sx={{ mr: 1, color: "#f15a22" }} />
                          Intercompany
                        </Box>
                      </SectionTitle>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <FormLabel sx={{ mb: 0, mr: 2 }}>Intercompany</FormLabel>
                        <Switch
                          size="small"
                          checked={isIntercompany}
                          onChange={(e) => setIsIntercompany(e.target.checked)}
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {isIntercompany ? "Yes" : "No"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CollapsibleContent>
              )}
            </CollapsibleSection>

            {/* Administration Section */}
            <CollapsibleSection>
              <CollapsibleHeader onClick={() => toggleSection("administration")}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Administration
                </Typography>
                <IconButton size="small">
                  {expandedSections.administration ? <ExpandMore /> : <ChevronRight />}
                </IconButton>
              </CollapsibleHeader>
              {expandedSections.administration && (
                <CollapsibleContent>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormLabel>Department</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={selectedDepartment ? selectedDepartment.id : ""}
                          onChange={(e) => {
                            const dept = departments.find((d) => d.id === e.target.value)
                            setSelectedDepartment(dept || null)
                          }}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <em>Select department</em>
                          </MenuItem>
                          {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormLabel>Cost center</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={selectedCostCenter ? selectedCostCenter.id : ""}
                          onChange={(e) => {
                            const cc = costCenters.find((c) => c.id === e.target.value)
                            setSelectedCostCenter(cc || null)
                          }}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <em>Select cost center</em>
                          </MenuItem>
                          {costCenters.map((cc) => (
                            <MenuItem key={cc.id} value={cc.id}>
                              {cc.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormLabel>Notes</FormLabel>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        multiline
                        rows={3}
                        placeholder="Add any additional notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CollapsibleContent>
              )}
            </CollapsibleSection>

            {/* Delivery Section */}
            <CollapsibleSection>
              <CollapsibleHeader onClick={() => toggleSection("delivery")}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Delivery
                </Typography>
                <IconButton size="small">{expandedSections.delivery ? <ExpandMore /> : <ChevronRight />}</IconButton>
              </CollapsibleHeader>
              {expandedSections.delivery && (
                <CollapsibleContent>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormLabel>Delivery terms</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={deliveryTerm ? deliveryTerm.id : ""}
                          onChange={(e) => {
                            const term = deliveryTerms.find((t) => t.id === e.target.value)
                            setDeliveryTerm(term || null)
                          }}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <em>Select delivery terms</em>
                          </MenuItem>
                          {deliveryTerms.map((term) => (
                            <MenuItem key={term.id} value={term.id}>
                              {term.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormLabel>Mode of delivery</FormLabel>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          size="small"
                          value={deliveryMode ? deliveryMode.id : ""}
                          onChange={(e) => {
                            const mode = deliveryModes.find((m) => m.id === e.target.value)
                            setDeliveryMode(mode || null)
                          }}
                          displayEmpty
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="">
                            <em>Select delivery mode</em>
                          </MenuItem>
                          {deliveryModes.map((mode) => (
                            <MenuItem key={mode.id} value={mode.id}>
                              {mode.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CollapsibleContent>
              )}
            </CollapsibleSection>

            {/* Payment Section */}
            <CollapsibleSection>
              <CollapsibleHeader onClick={() => toggleSection("payment")}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Payment
                </Typography>
                <IconButton size="small">{expandedSections.payment ? <ExpandMore /> : <ChevronRight />}</IconButton>
              </CollapsibleHeader>
              {expandedSections.payment && (
                <CollapsibleContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormLabel>Payment terms</FormLabel>
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        placeholder="e.g., Net 30, 2/10 Net 30"
                      />
                    </Grid>
                  </Grid>
                </CollapsibleContent>
              )}
            </CollapsibleSection>

            {/* Unplanned Purchases Section */}
            <CollapsibleSection>
              <CollapsibleHeader onClick={() => toggleSection("unplannedPurchases")}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Unplanned purchases
                </Typography>
                <IconButton size="small">
                  {expandedSections.unplannedPurchases ? <ExpandMore /> : <ChevronRight />}
                </IconButton>
              </CollapsibleHeader>
              {expandedSections.unplannedPurchases && (
                <CollapsibleContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <FormLabel sx={{ mb: 0, mr: 2 }}>Allow unplanned purchases</FormLabel>
                        <Switch
                          size="small"
                          checked={allowUnplannedPurchases}
                          onChange={(e) => setAllowUnplannedPurchases(e.target.checked)}
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {allowUnplannedPurchases ? "Yes" : "No"}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Enabling this option allows items to be added to the purchase order that were not originally
                        planned.
                      </Typography>
                    </Grid>
                  </Grid>
                </CollapsibleContent>
              )}
            </CollapsibleSection>
          </Box>
        </DrawerContent>

        {/* Footer with action buttons */}
        <DrawerFooter>
          <ActionButton color="secondary" onClick={handleCancel}>
            Cancel
          </ActionButton>
          <ActionButton color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Order"
            )}
          </ActionButton>
        </DrawerFooter>
      </StyledDrawer>

      {/* Add Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormLabel>
              Name<RequiredAsterisk>*</RequiredAsterisk>
            </FormLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              size="small"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              error={!newContactName && formSubmitted}
              helperText={!newContactName && formSubmitted ? "Name is required" : ""}
              sx={{ mb: 2 }}
            />

            <FormLabel>Email</FormLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              size="small"
              value={newContactEmail}
              onChange={(e) => setNewContactEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormLabel>Phone</FormLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              size="small"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddContact}
            variant="contained"
            sx={{ bgcolor: "#f15a22", "&:hover": { bgcolor: alpha("#f15a22", 0.8) } }}
          >
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to close this form and discard your changes?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Continue Editing</Button>
          <Button onClick={handleConfirmCancel} color="error">
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default NewPurchaseOrder
