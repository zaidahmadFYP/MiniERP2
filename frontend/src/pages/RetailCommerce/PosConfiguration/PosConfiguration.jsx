import { useState, useEffect } from "react"
import { Card, Snackbar, Alert } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import MainContentWrapper from "./MainContentWrapper"
import PosToolbar from "./Components/PosToolbar"
import PosHeader from "./Components/PosHeader"
import PosTable from "./Components/PosTable"
import PosStatusBar from "./Components/PosStatusBar"
import EditPosDialog from "./dialogs/EditPosDialog"
import NewPosDialog from "./dialogs/NewPosDialog"
import DeletePosDialog from "./dialogs/DeletePosDialog"
import {
  getAllPosConfigs,
  createPosConfig,
  updatePosConfig,
  formatPosConfigForBackend,
  formatPosConfigForFrontend,
} from "./utils/posConfigService"

const PosConfiguration = ({ open = true }) => {
  const theme = useTheme()
  const [posData, setPosData] = useState([])
  const [selected, setSelected] = useState([])
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null)
  const [filterText, setFilterText] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [currentPos, setCurrentPos] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [visiblePasswords, setVisiblePasswords] = useState({})

  // Custom orange color
  const orangeColor = "#f15a22"

  // Fetch POS configurations on component mount
  useEffect(() => {
    fetchPosConfigurations()
  }, [])

  // Fetch POS configurations from the backend
  const fetchPosConfigurations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllPosConfigs()
      // Transform backend data to frontend format
      const formattedData = data.map((item) => formatPosConfigForFrontend(item))
      setPosData(formattedData)
    } catch (err) {
      console.error("Failed to fetch POS configurations:", err)
      setError("Failed to load POS configurations. Please try again.")
      setSnackbar({
        open: true,
        message: "Failed to load POS configurations",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = () => {
    fetchPosConfigurations()
    handleOptionsClose()
  }

  // Filter data based on search text
  const filteredData = posData.filter(
    (row) =>
      row.id.toLowerCase().includes(filterText.toLowerCase()) ||
      row.posId.toLowerCase().includes(filterText.toLowerCase()) ||
      row.authorityType.toLowerCase().includes(filterText.toLowerCase()) ||
      row.status.toLowerCase().includes(filterText.toLowerCase()),
  )

  // Handle row selection
  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = [...selected, id]
    } else {
      newSelected = selected.filter((item) => item !== id)
    }

    setSelected(newSelected)
  }

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((row) => row.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  // Options menu handlers
  const handleOptionsClick = (event) => {
    setOptionsAnchorEl(event.currentTarget)
  }

  const handleOptionsClose = () => {
    setOptionsAnchorEl(null)
  }

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Copy password to clipboard
  const copyPasswordToClipboard = (password, id) => {
    if (!password) return

    navigator.clipboard.writeText(password).then(
      () => {
        setSnackbar({
          open: true,
          message: "Password copied to clipboard",
          severity: "success",
        })
      },
      (err) => {
        console.error("Could not copy password: ", err)
        setSnackbar({
          open: true,
          message: "Failed to copy password",
          severity: "error",
        })
      },
    )
  }

  // Edit handler
  const handleEdit = () => {
    if (selected.length !== 1) {
      setSnackbar({
        open: true,
        message: "Please select exactly one item to edit",
        severity: "warning",
      })
      return
    }

    const posToEdit = posData.find((pos) => pos.id === selected[0])

    // Check if time bound is enabled based on existing dates
    const timeBoundEnabled = !!(posToEdit.timeBoundStart || posToEdit.timeBoundEnd)

    setCurrentPos({
      ...posToEdit,
      timeBoundEnabled,
    })

    setEditDialogOpen(true)
  }

  // Save edit changes
  const handleSaveEdit = async () => {
    try {
      setLoading(true)

      // Create a copy of currentPos for backend formatting
      const posToUpdate = { ...currentPos }

      // If time bound is disabled, clear the dates before sending to backend
      if (!posToUpdate.timeBoundEnabled) {
        posToUpdate.timeBoundStart = null
        posToUpdate.timeBoundEnd = null
      }

      // Format data for backend
      const backendData = formatPosConfigForBackend(posToUpdate)

      // Send update to backend
      await updatePosConfig(posToUpdate.posId, backendData)

      // Update local state
      setPosData(posData.map((pos) => (pos.id === posToUpdate.id ? posToUpdate : pos)))

      setEditDialogOpen(false)
      setSnackbar({
        open: true,
        message: "POS configuration updated successfully",
        severity: "success",
      })

      // Refresh data from backend to ensure consistency
      fetchPosConfigurations()
    } catch (err) {
      console.error("Failed to update POS configuration:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to update POS configuration",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // New POS handler
  const handleNew = () => {
    // Generate random 5-digit POS ID
    const randomPosId = Math.floor(10000 + Math.random() * 90000).toString()

    // Generate random 6-digit Registration Number
    const randomRegNumber = Math.floor(100000 + Math.random() * 900000).toString()

    setCurrentPos({
      id: randomRegNumber,
      posId: randomPosId,
      authorityType: "PRA",
      token: "",
      offlineToken: "",
      userName: "", // Optional
      password: "", // Optional
      timeBoundEnabled: false, // Time bound disabled by default
      timeBoundStart: null,
      timeBoundEnd: null,
      status: "ONLINE",
    })
    setNewDialogOpen(true)
  }

  // Save new POS
  const handleSaveNew = async () => {
    try {
      setLoading(true)

      // Create a copy of currentPos for backend formatting
      const posToCreate = { ...currentPos }

      // If time bound is disabled, ensure the dates are null before sending to backend
      if (!posToCreate.timeBoundEnabled) {
        posToCreate.timeBoundStart = null
        posToCreate.timeBoundEnd = null
      }

      // Format data for backend
      const backendData = formatPosConfigForBackend(posToCreate)

      // Ensure status is set to ONLINE for new POS configurations
      if (!backendData.POSStatus) {
        backendData.POSStatus = "ONLINE"
      }

      // Send to backend
      await createPosConfig(backendData)

      setNewDialogOpen(false)
      setSnackbar({
        open: true,
        message: "New POS configuration added successfully",
        severity: "success",
      })

      // Refresh data from backend
      fetchPosConfigurations()
    } catch (err) {
      console.error("Failed to create POS configuration:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to create POS configuration",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete handler - Note: Backend doesn't have a delete endpoint, so this is just UI functionality
  const handleDelete = () => {
    if (selected.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one item to delete",
        severity: "warning",
      })
      return
    }
    setDeleteDialogOpen(true)
  }

  // Confirm delete - This would need a backend endpoint to be fully implemented
  const handleConfirmDelete = () => {
    // This is just UI functionality since there's no delete endpoint
    setPosData(posData.filter((pos) => !selected.includes(pos.id)))
    setSelected([])
    setDeleteDialogOpen(false)
    setSnackbar({
      open: true,
      message: `${selected.length} item(s) deleted successfully`,
      severity: "success",
    })
  }

  // Export data
  const handleExport = () => {
    // Create CSV content
    const headers = ["Register Number", "POS ID", "Authority Type", "Status", "Username", "Password", "Time Bound"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) => {
        const timeBound = row.timeBoundEnabled
          ? `${row.timeBoundStart ? new Date(row.timeBoundStart).toLocaleDateString() : "N/A"} - ${row.timeBoundEnd ? new Date(row.timeBoundEnd).toLocaleDateString() : "N/A"}`
          : "Not enabled"
        return [row.id, row.posId, row.authorityType, row.status, row.userName, row.password, timeBound].join(",")
      }),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "pos_configurations.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setSnackbar({
      open: true,
      message: "Data exported successfully",
      severity: "success",
    })
    handleOptionsClose()
  }

  // Improved print functionality
  const handlePrint = () => {
    // Create a printable version of the table
    const printContent = document.createElement("div")
    printContent.style.width = "100%"
    printContent.style.padding = "20px"

    // Add title
    const title = document.createElement("h1")
    title.textContent = "POS Configurations"
    title.style.fontSize = "24px"
    title.style.marginBottom = "20px"
    title.style.color = orangeColor
    title.style.fontFamily = "Arial, sans-serif"
    printContent.appendChild(title)

    // Add date
    const date = document.createElement("p")
    date.textContent = `Generated on: ${new Date().toLocaleString()}`
    date.style.marginBottom = "20px"
    date.style.fontFamily = "Arial, sans-serif"
    printContent.appendChild(date)

    // Create table
    const table = document.createElement("table")
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.fontFamily = "Arial, sans-serif"

    // Create header row
    const headerRow = document.createElement("tr")
    const headers = ["Register Number", "POS ID", "Authority Type", "Username", "Password", "Time Bound", "Status"]

    headers.forEach((headerText) => {
      const header = document.createElement("th")
      header.textContent = headerText
      header.style.border = "1px solid #ddd"
      header.style.padding = "8px"
      header.style.backgroundColor = orangeColor
      header.style.color = "white"
      header.style.textAlign = "left"
      headerRow.appendChild(header)
    })

    table.appendChild(headerRow)

    // Add data rows
    filteredData.forEach((row) => {
      const dataRow = document.createElement("tr")

      // Register Number
      const cell1 = document.createElement("td")
      cell1.textContent = row.id
      cell1.style.border = "1px solid #ddd"
      cell1.style.padding = "8px"
      dataRow.appendChild(cell1)

      // POS ID
      const cell2 = document.createElement("td")
      cell2.textContent = row.posId
      cell2.style.border = "1px solid #ddd"
      cell2.style.padding = "8px"
      dataRow.appendChild(cell2)

      // Authority Type
      const cell3 = document.createElement("td")
      cell3.textContent = row.authorityType
      cell3.style.border = "1px solid #ddd"
      cell3.style.padding = "8px"
      dataRow.appendChild(cell3)

      // Username
      const cell4 = document.createElement("td")
      cell4.textContent = row.userName || "-"
      cell4.style.border = "1px solid #ddd"
      cell4.style.padding = "8px"
      dataRow.appendChild(cell4)

      // Password
      const cell5 = document.createElement("td")
      cell5.textContent = row.password || "-"
      cell5.style.border = "1px solid #ddd"
      cell5.style.padding = "8px"
      dataRow.appendChild(cell5)

      // Time Bound
      const cell6 = document.createElement("td")
      if (row.timeBoundEnabled) {
        const startDate = row.timeBoundStart ? new Date(row.timeBoundStart).toLocaleDateString() : "N/A"
        const endDate = row.timeBoundEnd ? new Date(row.timeBoundEnd).toLocaleDateString() : "N/A"
        cell6.textContent = `${startDate} - ${endDate}`
      } else {
        cell6.textContent = "Not enabled"
      }
      cell6.style.border = "1px solid #ddd"
      cell6.style.padding = "8px"
      dataRow.appendChild(cell6)

      // Status
      const cell7 = document.createElement("td")
      cell7.textContent = row.status
      cell7.style.border = "1px solid #ddd"
      cell7.style.padding = "8px"
      cell7.style.color = row.status === "ONLINE" ? "green" : "red"
      dataRow.appendChild(cell7)

      table.appendChild(dataRow)
    })

    printContent.appendChild(table)

    // Add footer
    const footer = document.createElement("p")
    footer.textContent = `Total items: ${filteredData.length}`
    footer.style.marginTop = "20px"
    footer.style.fontFamily = "Arial, sans-serif"
    printContent.appendChild(footer)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    printWindow.document.write("<html><head><title>POS Configurations</title></head><body>")
    printWindow.document.write(printContent.outerHTML)
    printWindow.document.write("</body></html>")
    printWindow.document.close()

    // Add print styles
    const style = printWindow.document.createElement("style")
    style.textContent = `
      @media print {
        body { margin: 0; padding: 20px; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
      }
    `
    printWindow.document.head.appendChild(style)

    // Print and close
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)

    handleOptionsClose()
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <MainContentWrapper open={open}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Navigation Bar */}
        <PosToolbar
          selected={selected}
          loading={loading}
          filterText={filterText}
          setFilterText={setFilterText}
          handleEdit={handleEdit}
          handleNew={handleNew}
          handleDelete={handleDelete}
          optionsAnchorEl={optionsAnchorEl}
          handleOptionsClick={handleOptionsClick}
          handleOptionsClose={handleOptionsClose}
          handleRefresh={handleRefresh}
          handleExport={handleExport}
          handlePrint={handlePrint}
        />

        {/* Title */}
        <PosHeader />

        {/* Table */}
        <PosTable
          filteredData={filteredData}
          loading={loading}
          error={error}
          selected={selected}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          visiblePasswords={visiblePasswords}
          togglePasswordVisibility={togglePasswordVisibility}
          copyPasswordToClipboard={copyPasswordToClipboard}
          fetchPosConfigurations={fetchPosConfigurations}
        />

        {/* Status bar */}
        <PosStatusBar selected={selected} filteredData={filteredData} />
      </Card>

      {/* Edit Dialog */}
      <EditPosDialog
        open={editDialogOpen}
        currentPos={currentPos}
        setCurrentPos={setCurrentPos}
        handleClose={() => setEditDialogOpen(false)}
        handleSave={handleSaveEdit}
        loading={loading}
      />

      {/* New Dialog */}
      <NewPosDialog
        open={newDialogOpen}
        currentPos={currentPos}
        setCurrentPos={setCurrentPos}
        handleClose={() => setNewDialogOpen(false)}
        handleSave={handleSaveNew}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <DeletePosDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirmDelete={handleConfirmDelete}
        loading={loading}
        selectedCount={selected.length}
      />

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
          sx={{
            width: "100%",
            boxShadow: theme.shadows[3],
            borderRadius: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? snackbar.severity === "success"
                  ? "rgba(46, 125, 50, 0.9)"
                  : snackbar.severity === "error"
                    ? "rgba(211, 47, 47, 0.9)"
                    : "rgba(237, 108, 2, 0.9)"
                : undefined,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContentWrapper>
  )
}

export default PosConfiguration
