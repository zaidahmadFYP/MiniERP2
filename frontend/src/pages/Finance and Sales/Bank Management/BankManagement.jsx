import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Box, Button, Container, Snackbar, Alert, Tabs, Tab, Typography } from "@mui/material"
import {
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"

// Import components
import MainContentWrapper from "./Components/MainContentWrapper"
import BankForm from "./Components/BankForm"
import SearchFilter from "./Components/SearchFilter"
import BankList from "./Components/BankList"
import Dashboard from "./Components/Dashboard"
import DeleteConfirmation from "./Components/DeleteConfirmation"
import BankDetails from "./Components/BankDetails"
import ActionsMenu from "./Components/ActionsMenu"
import ImportDialog from "./Components/ImportDialog"
import HelpDialog from "./Components/HelpDialog"

// Initial form state
const initialFormState = {
  name: "",
  code: "",
  address: "",
  isActive: true,
}

// Initial form errors state
const initialFormErrorsState = {
  name: "",
  code: "",
  address: "",
}

const BankManagement = ({ open }) => {
  // Get the current theme mode from MUI
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  // Create CSS variables for theme-dependent colors
  useEffect(() => {
    document.documentElement.style.setProperty("--table-header-bg", isDarkMode ? "rgba(241, 90, 34, 0.15)" : "#fff8f6")
    document.documentElement.style.setProperty("--text-primary", isDarkMode ? "#f5f5f5" : "#333333")
  }, [isDarkMode])

  const [banks, setBanks] = useState([])
  const [filteredBanks, setFilteredBanks] = useState([])
  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState(initialFormErrorsState)
  const [isEditing, setIsEditing] = useState(false)
  const [currentBankId, setCurrentBankId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [bankToDelete, setBankToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [expandedBank, setExpandedBank] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // New state variables for enhanced functionality
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedBankForDetails, setSelectedBankForDetails] = useState(null)
  const [bankDetailsTab, setBankDetailsTab] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedBanks, setSelectedBanks] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  // Fetch all banks on component mount
  useEffect(() => {
    fetchBanks()
  }, [])

  // Apply filters whenever banks, searchTerm, or filterStatus changes
  useEffect(() => {
    applyFilters()
  }, [banks, searchTerm, filterStatus])

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedBanks(filteredBanks.map((bank) => bank._id))
    } else if (selectedBanks.length === filteredBanks.length) {
      setSelectedBanks([])
    }
  }, [selectAll])

  // Apply filters to the banks list
  const applyFilters = useCallback(() => {
    let result = [...banks]

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase()
      result = result.filter(
        (bank) =>
          bank.name.toLowerCase().includes(lowerCaseSearch) ||
          bank.code.toLowerCase().includes(lowerCaseSearch) ||
          (bank.address && bank.address.toLowerCase().includes(lowerCaseSearch)),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      const isActive = filterStatus === "active"
      result = result.filter((bank) => bank.isActive === isActive)
    }

    setFilteredBanks(result)
    setPage(0) // Reset to first page when filters change
  }, [banks, searchTerm, filterStatus])

  // Fetch all banks from the API
  const fetchBanks = async () => {
    try {
      setLoading(true)
      setRefreshing(true)
      const response = await axios.get("/api/banks")

      // Ensure we have proper date objects for createdAt and updatedAt
      const processedBanks = response.data.map((bank) => ({
        ...bank,
        createdAt: bank.createdAt ? new Date(bank.createdAt) : new Date(),
        updatedAt: bank.updatedAt ? new Date(bank.updatedAt) : new Date(),
      }))

      setBanks(processedBanks)
      showSnackbar(`${processedBanks.length} banks loaded successfully`, "success")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch banks"
      showSnackbar(errorMessage, "error")
      console.error("Error fetching banks:", err)
      // Set empty array to prevent errors
      setBanks([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Validate the form data
  const validateForm = () => {
    let isValid = true
    const errors = { ...initialFormErrorsState }

    // Validate bank name
    if (!formData.name.trim()) {
      errors.name = "Bank name is required"
      isValid = false
    } else if (formData.name.trim().length < 2) {
      errors.name = "Bank name must be at least 2 characters"
      isValid = false
    }

    // Validate bank code
    if (!formData.code.trim()) {
      errors.code = "Bank code is required"
      isValid = false
    } else if (!/^[A-Za-z0-9]+$/.test(formData.code)) {
      errors.code = "Bank code must contain only letters and numbers"
      isValid = false
    }

    // If address is provided, ensure it's not too short
    if (formData.address.trim() && formData.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    })

    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Show snackbar message
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Handle search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
  }

  // Handle filter status changes
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
  }

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Toggle expanded bank details
  const toggleExpandBank = (bankId) => {
    setExpandedBank(expandedBank === bankId ? null : bankId)
  }

  // Handle form submission for adding/updating a bank
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      showSnackbar("Please fix the errors in the form", "error")
      return
    }

    try {
      setSubmitting(true)

      if (isEditing) {
        // Update existing bank
        await axios.put(`/api/banks/${currentBankId}`, formData)
        showSnackbar("Bank updated successfully", "success")
      } else {
        // Add new bank
        await axios.post("/api/banks", formData)
        showSnackbar("Bank added successfully", "success")
      }

      // Reset form and state
      resetForm()
      fetchBanks()
    } catch (err) {
      const errorMessage = err.response?.data?.message || (isEditing ? "Failed to update bank" : "Failed to add bank")
      showSnackbar(errorMessage, "error")
      console.error("Error:", err)

      // If server returns validation errors, update form errors
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors
        const formattedErrors = { ...initialFormErrorsState }

        Object.keys(serverErrors).forEach((field) => {
          if (formattedErrors.hasOwnProperty(field)) {
            formattedErrors[field] = serverErrors[field]
          }
        })

        setFormErrors(formattedErrors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Open delete confirmation dialog
  const confirmDelete = (bank) => {
    setBankToDelete(bank)
    setOpenDeleteDialog(true)
  }

  // Handle bank deletion
  const handleDelete = async () => {
    if (!bankToDelete) return

    try {
      setLoading(true)
      await axios.delete(`/api/banks/${bankToDelete._id}`)
      showSnackbar("Bank deleted successfully", "success")
      fetchBanks()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete bank"
      showSnackbar(errorMessage, "error")
      console.error("Error deleting bank:", err)
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
      setBankToDelete(null)
    }
  }

  // Set up editing for a bank
  const handleEdit = (bank) => {
    setFormData({
      name: bank.name,
      code: bank.code,
      address: bank.address || "",
      isActive: bank.isActive,
    })
    setIsEditing(true)
    setCurrentBankId(bank._id)

    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Reset form and editing state
  const resetForm = () => {
    setFormData(initialFormState)
    setFormErrors(initialFormErrorsState)
    setIsEditing(false)
    setCurrentBankId(null)
  }

  // Toggle bank active status
  const toggleActiveStatus = async (bank) => {
    try {
      setLoading(true)
      await axios.put(`/api/banks/${bank._id}`, {
        ...bank,
        isActive: !bank.isActive,
      })
      showSnackbar(`Bank ${bank.name} ${!bank.isActive ? "activated" : "deactivated"} successfully`, "success")
      fetchBanks()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update bank status"
      showSnackbar(errorMessage, "error")
      console.error("Error updating bank status:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get paginated data
  const paginatedData = filteredBanks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // New functions for enhanced functionality

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  // Handle bank details tab change
  const handleBankDetailsTabChange = (event, newValue) => {
    setBankDetailsTab(newValue)
  }

  // Open bank details
  const openBankDetails = (bank) => {
    setSelectedBankForDetails(bank)
    setBankDetailsTab(0)
  }

  // Close bank details
  const closeBankDetails = () => {
    setSelectedBankForDetails(null)
  }

  // Open actions menu
  const handleOpenActionsMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  // Close actions menu
  const handleCloseActionsMenu = () => {
    setAnchorEl(null)
  }

  // Handle export
  const handleExport = (format) => {
    handleCloseActionsMenu()
    showSnackbar(`Exporting banks to ${format.toUpperCase()}...`, "info")

    // Simulate export delay
    setTimeout(() => {
      showSnackbar(`Banks exported to ${format.toUpperCase()} successfully`, "success")
    }, 1500)
  }

  // Handle import
  const handleImport = () => {
    handleCloseActionsMenu()
    setImportDialogOpen(true)
  }

  // Handle bulk action
  const handleBulkAction = (action) => {
    if (selectedBanks.length === 0) {
      showSnackbar("Please select at least one bank", "error")
      return
    }

    showSnackbar(`Performing ${action} on ${selectedBanks.length} banks...`, "info")

    // Simulate bulk action delay
    setTimeout(() => {
      showSnackbar(`${action} completed successfully on ${selectedBanks.length} banks`, "success")
      setSelectedBanks([])
      setSelectAll(false)
    }, 1500)
  }

  // Toggle bank selection
  const toggleBankSelection = (bankId) => {
    if (selectedBanks.includes(bankId)) {
      setSelectedBanks(selectedBanks.filter((id) => id !== bankId))
    } else {
      setSelectedBanks([...selectedBanks, bankId])
    }
  }

  // Toggle select all
  const toggleSelectAll = () => {
    setSelectAll(!selectAll)
  }

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <MainContentWrapper open={open}>
      <Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          {/* Header with tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h4" component="h1" fontWeight="700" sx={{ color: "#f15a22" }}>
                Bank Management
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchBanks}
                  disabled={refreshing}
                  sx={{
                    color: "#f15a22",
                    borderColor: "#f15a22",
                    "&:hover": {
                      borderColor: "#d14a12",
                      backgroundColor: "rgba(241, 90, 34, 0.04)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MoreVertIcon />}
                  onClick={handleOpenActionsMenu}
                  sx={{
                    color: "#f15a22",
                    borderColor: "#f15a22",
                    "&:hover": {
                      borderColor: "#d14a12",
                      backgroundColor: "rgba(241, 90, 34, 0.04)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Actions
                </Button>
              </Box>
            </Box>

            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="bank management tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#f15a22",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#f15a22",
                },
              }}
            >
              <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
              <Tab label="Banks" icon={<BusinessIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Dashboard Tab */}
          {currentTab === 0 && <Dashboard isDarkMode={isDarkMode} banks={banks} />}

          {/* Banks Tab */}
          {currentTab === 1 && (
            <>
              <BankForm
                formData={formData}
                formErrors={formErrors}
                isEditing={isEditing}
                submitting={submitting}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
              />

              <SearchFilter
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                handleSearchChange={handleSearchChange}
                clearSearch={clearSearch}
                handleFilterChange={handleFilterChange}
              />

              <BankList
                loading={loading}
                banks={banks}
                filteredBanks={filteredBanks}
                paginatedData={paginatedData}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                page={page}
                rowsPerPage={rowsPerPage}
                expandedBank={expandedBank}
                isDarkMode={isDarkMode}
                selectedBanks={selectedBanks}
                selectAll={selectAll}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                toggleExpandBank={toggleExpandBank}
                toggleBankSelection={toggleBankSelection}
                toggleSelectAll={toggleSelectAll}
                handleEdit={handleEdit}
                confirmDelete={confirmDelete}
                openBankDetails={openBankDetails}
                setBankDetailsTab={setBankDetailsTab}
                toggleActiveStatus={toggleActiveStatus}
                setSearchTerm={setSearchTerm}
                setFilterStatus={setFilterStatus}
              />
            </>
          )}
        </Container>
      </Box>

      {/* Dialogs and Menus */}
      <DeleteConfirmation
        open={openDeleteDialog}
        bankToDelete={bankToDelete}
        handleClose={() => setOpenDeleteDialog(false)}
        handleDelete={handleDelete}
      />

      <BankDetails
        open={Boolean(selectedBankForDetails)}
        selectedBankForDetails={selectedBankForDetails}
        bankDetailsTab={bankDetailsTab}
        handleBankDetailsTabChange={handleBankDetailsTabChange}
        handleClose={closeBankDetails}
        handleEdit={handleEdit}
        formatCurrency={formatCurrency}
      />

      <ActionsMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        handleClose={handleCloseActionsMenu}
        handleExport={handleExport}
        handleImport={handleImport}
        handleBulkAction={handleBulkAction}
        setHelpDialogOpen={setHelpDialogOpen}
      />

      <ImportDialog
        open={importDialogOpen}
        handleClose={() => setImportDialogOpen(false)}
        handleImport={() => showSnackbar("Import feature is not implemented in this demo", "info")}
      />

      <HelpDialog open={helpDialogOpen} handleClose={() => setHelpDialogOpen(false)} />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            ...(snackbar.severity === "success" && {
              backgroundColor: "#f15a22",
            }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContentWrapper>
  )
}

export default BankManagement
