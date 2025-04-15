import { useState } from "react"
import { Box, Button, Menu, MenuItem, IconButton, useTheme, Paper, Tooltip } from "@mui/material"
import {
  KeyboardArrowDown,
  Search,
  Refresh,
  FilterList,
  Print,
  CloudDownload,
  ArrowBack,
  Person,
} from "@mui/icons-material"

export default function NavBar({ onRefresh, onFilterOpen, onPrint, onExportMenuOpen }) {
  const theme = useTheme()
  const [transactionsAnchorEl, setTransactionsAnchorEl] = useState(null)
  const [reportsAnchorEl, setReportsAnchorEl] = useState(null)
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null)

  const handleTransactionsClick = (event) => {
    setTransactionsAnchorEl(event.currentTarget)
  }

  const handleReportsClick = (event) => {
    setReportsAnchorEl(event.currentTarget)
  }

  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setTransactionsAnchorEl(null)
    setReportsAnchorEl(null)
    setActionsAnchorEl(null)
  }

  // Use a color that adapts to the theme mode
  const navbarBgColor = theme.palette.mode === "dark" ? "#5D4037" : "#8B5A2B"
  const activeTabBgColor = theme.palette.mode === "dark" ? "#6D4C41" : "#A67C52"

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        mb: 2,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: navbarBgColor,
          color: "white",
          height: "48px",
          px: 1,
        }}
      >
        <IconButton sx={{ color: "white", mr: 1 }} size="small">
          <ArrowBack />
        </IconButton>

        {/* Transactions dropdown */}
        <Button
          sx={{
            color: "white",
            textTransform: "none",
            bgcolor: transactionsAnchorEl ? activeTabBgColor : "transparent",
            borderRadius: 0,
            px: 2,
            height: "100%",
            "&:hover": { bgcolor: activeTabBgColor },
          }}
          endIcon={<KeyboardArrowDown />}
          onClick={handleTransactionsClick}
        >
          Transactions
        </Button>
        <Menu anchorEl={transactionsAnchorEl} open={Boolean(transactionsAnchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>View All</MenuItem>
          <MenuItem onClick={handleClose}>Recent</MenuItem>
          <MenuItem onClick={handleClose}>Pending</MenuItem>
          <MenuItem onClick={handleClose}>Completed</MenuItem>
        </Menu>

        {/* Reports dropdown */}
        <Button
          sx={{
            color: "white",
            textTransform: "none",
            bgcolor: reportsAnchorEl ? activeTabBgColor : "transparent",
            borderRadius: 0,
            px: 2,
            height: "100%",
            "&:hover": { bgcolor: activeTabBgColor },
          }}
          endIcon={<KeyboardArrowDown />}
          onClick={handleReportsClick}
        >
          Reports
        </Button>
        <Menu anchorEl={reportsAnchorEl} open={Boolean(reportsAnchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Daily Summary</MenuItem>
          <MenuItem onClick={handleClose}>Weekly Summary</MenuItem>
          <MenuItem onClick={handleClose}>Monthly Summary</MenuItem>
          <MenuItem onClick={handleClose}>Custom Report</MenuItem>
        </Menu>

        {/* Actions dropdown */}
        <Button
          sx={{
            color: "white",
            textTransform: "none",
            bgcolor: actionsAnchorEl ? activeTabBgColor : "transparent",
            borderRadius: 0,
            px: 2,
            height: "100%",
            "&:hover": { bgcolor: activeTabBgColor },
          }}
          endIcon={<KeyboardArrowDown />}
          onClick={handleActionsClick}
        >
          Actions
        </Button>
        <Menu anchorEl={actionsAnchorEl} open={Boolean(actionsAnchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Create Transaction</MenuItem>
          <MenuItem onClick={handleClose}>Import Data</MenuItem>
          <MenuItem onClick={handleClose}>Export Data</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Menu>

        <Box sx={{ flexGrow: 1 }} />

        {/* Action buttons */}
        <Tooltip title="Search">
          <IconButton sx={{ color: "white" }} size="small">
            <Search />
          </IconButton>
        </Tooltip>

        <Tooltip title="Filter">
          <IconButton sx={{ color: "white" }} size="small" onClick={onFilterOpen}>
            <FilterList />
          </IconButton>
        </Tooltip>

        <Tooltip title="Refresh">
          <IconButton sx={{ color: "white" }} size="small" onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>

        <Tooltip title="Print">
          <IconButton sx={{ color: "white" }} size="small" onClick={onPrint}>
            <Print />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export">
          <IconButton sx={{ color: "white" }} size="small" onClick={onExportMenuOpen}>
            <CloudDownload />
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <IconButton sx={{ color: "white" }} size="small">
            <Person />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  )
}
