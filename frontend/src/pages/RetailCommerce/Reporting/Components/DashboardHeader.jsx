import { Box, Typography, Tooltip, IconButton, CircularProgress, useTheme, alpha } from "@mui/material"
import { BarChart, Refresh, Download, Print } from "@mui/icons-material"
import { useState } from "react"
import PrintReportDialog from "./PrintReportDialog"

const DashboardHeader = ({
  loading,
  handleRefresh,
  transactions,
  filteredTransactions,
  posConfigs,
  startDate,
  endDate,
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"
  const [printDialogOpen, setPrintDialogOpen] = useState(false)

  const handleExportReport = () => {
    // Create CSV content from the filtered transactions
    const headers = ["Date", "Transaction ID", "Total", "Payment Method", "Items"]

    const csvRows = [
      headers.join(","),
      ...filteredTransactions.map((transaction) => {
        const itemsText = transaction.items.map((item) => `${item.itemName}(${item.itemQuantity})`).join("; ")

        return [
          new Date(transaction.date).toLocaleDateString(),
          transaction.id,
          transaction.total.toFixed(2),
          transaction.paymentMethod,
          `"${itemsText}"`,
        ].join(",")
      }),
    ]

    const csvContent = csvRows.join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    // Set up download attributes
    link.setAttribute("href", url)
    link.setAttribute("download", `POS_Report_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    // Append to document, trigger download and clean up
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenPrintDialog = () => {
    setPrintDialogOpen(true)
  }

  const handleClosePrintDialog = () => {
    setPrintDialogOpen(false)
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        pb: 2,
        borderBottom: `2px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          display: "flex",
          alignItems: "center",
          fontWeight: 700,
          color: primaryColor,
          letterSpacing: "-0.5px",
        }}
      >
        <BarChart sx={{ mr: 1.5, color: primaryColor }} />
        POS Reporting Dashboard
      </Typography>
      <Box>
        <Tooltip title="Refresh data">
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              mr: 1,
              backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
              color: primaryColor,
              "&:hover": {
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.3 : 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Export report">
          <IconButton
            onClick={handleExportReport}
            disabled={loading}
            sx={{
              mr: 1,
              backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
              color: primaryColor,
              "&:hover": {
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.3 : 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            <Download />
          </IconButton>
        </Tooltip>
        <Tooltip title="Print report">
          <IconButton
            onClick={handleOpenPrintDialog}
            disabled={loading}
            sx={{
              backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
              color: primaryColor,
              "&:hover": {
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.3 : 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            <Print />
          </IconButton>
        </Tooltip>
      </Box>

      <PrintReportDialog
        open={printDialogOpen}
        onClose={handleClosePrintDialog}
        transactions={transactions}
        posConfigs={posConfigs}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />
    </Box>
  )
}

export default DashboardHeader
