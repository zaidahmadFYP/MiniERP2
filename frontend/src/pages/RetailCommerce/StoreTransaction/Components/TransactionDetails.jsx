import { useState } from "react"
import { Box, Typography, Button, IconButton, Grid, Chip, useTheme } from "@mui/material"
import { Print, CloudDownload, MoreVert } from "@mui/icons-material"
import { getStatusColor, getPaidStatusColor } from "../utils/formatUtils"
import GeneralSection from "./details/GeneralSection"
import AmountSection from "./details/AmountSection"
import ItemsSection from "./details/ItemsSection"

export default function TransactionDetails({ transaction, onPrint, onExportMenuOpen }) {
  // UI state for collapsible sections
  const [generalOpen, setGeneralOpen] = useState(true)
  const [amountOpen, setAmountOpen] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(true)
  const theme = useTheme()

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666" }}>
              Transaction details
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}
            >
              ID: {transaction.transactionID} | Number: {transaction.transactionNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Print />}
              sx={{ textTransform: "none" }}
              onClick={onPrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudDownload />}
              sx={{ textTransform: "none" }}
              onClick={onExportMenuOpen}
            >
              Export
            </Button>
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666" }}>
              Transaction ID
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}
            >
              {transaction.transactionID}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666" }}>
              Payment Method
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}
            >
              {transaction.paymentMethod}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666" }}>
              Status
            </Typography>
            <Chip
              label={transaction.transactionStatus}
              size="small"
              sx={{
                backgroundColor: getStatusColor(transaction.transactionStatus),
                color: "#fff",
                fontSize: "0.7rem",
                height: "20px",
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666" }}>
              Payment Status
            </Typography>
            <Chip
              label={transaction.paidStatus}
              size="small"
              sx={{
                backgroundColor: getPaidStatusColor(transaction.paidStatus),
                color: "#fff",
                fontSize: "0.7rem",
                height: "20px",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* General section */}
        <GeneralSection transaction={transaction} isOpen={generalOpen} onToggle={() => setGeneralOpen(!generalOpen)} />

        {/* Amount section */}
        <AmountSection transaction={transaction} isOpen={amountOpen} onToggle={() => setAmountOpen(!amountOpen)} />

        {/* Details section - Items */}
        <ItemsSection transaction={transaction} isOpen={detailsOpen} onToggle={() => setDetailsOpen(!detailsOpen)} />
      </Box>
    </>
  )
}
