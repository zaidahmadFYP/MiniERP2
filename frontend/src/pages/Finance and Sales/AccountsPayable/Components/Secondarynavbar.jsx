"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  Button,
  alpha,
  IconButton,
  Tooltip,
  Divider,
  Backdrop,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import NewPurchaseOrder from "./NewPurchaseOrder/Newpurchaseorder"

// Custom styled components
const NavItem = styled(Typography)(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  fontWeight: 500,
  cursor: "pointer",
  color: active ? "#f15a22" : theme.palette.mode === "dark" ? "#e0e0e0" : "inherit",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: active ? "#f15a22" : alpha("#f15a22", 0.7),
  },
}))

const CategoryHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.9rem",
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#333",
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
}))

const ActionButton = styled(Button)(({ theme, active }) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  color: active ? "#f15a22" : theme.palette.mode === "dark" ? "#e0e0e0" : "#555",
  padding: theme.spacing(0.5, 1),
  fontSize: "0.8125rem",
  fontWeight: active ? 500 : 400,
  borderRadius: "4px",
  border: active ? "1px solid #f15a22" : "none",
  backgroundColor: active ? alpha("#f15a22", 0.05) : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? alpha("#333", 0.8) : alpha("#f5f5f5", 0.8),
    color: "#f15a22",
  },
}))

const DisabledAction = styled(Typography)(({ theme }) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "#aaa",
  padding: theme.spacing(0.5, 1),
  fontSize: "0.8125rem",
  fontWeight: 400,
}))

// Custom styled backdrop for blur effect
const BlurBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: 1050, // Higher than regular backdrop but lower than drawer
  backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
  backdropFilter: "blur(4px)", // Apply blur effect
  WebkitBackdropFilter: "blur(4px)", // For Safari support
  marginTop: "64px", // Start below the AppBar
  height: "calc(100% - 64px)", // Adjust height to account for AppBar
}))

// Define dropdown menu content for each nav item based on screenshots
const menuItems = {
  workflow: {
    title: "Workflow",
    categories: [
      {
        name: "New",
        actions: [{ text: "From a sales order", active: true }],
      },
      {
        name: "Maintain",
        actions: [
          { text: "Request change", active: false },
          { text: "Cancel", active: false },
        ],
      },
      {
        name: "Copy",
        actions: [
          { text: "From all", active: false },
          { text: "From journal", active: false },
        ],
      },
      {
        name: "View",
        actions: [{ text: "Totals", active: false }],
      },
      {
        name: "Clean up",
        actions: [{ text: "Clean up purchase update history", active: false }],
      },
    ],
  },
  purchase: {
    title: "Purchase",
    categories: [
      {
        name: "View",
        actions: [{ text: "Line amounts", active: true }],
      },
      {
        name: "Budget",
        actions: [{ text: "Budget", active: false, hasDropdown: true }],
      },
      {
        name: "Intercompany tracing",
        actions: [
          { text: "Intercompany sales order", active: false, disabled: true },
          { text: "Original sales order", active: false, disabled: true },
          { text: "Packing slip journal", active: false, disabled: true },
          { text: "Invoice journal", active: false, disabled: true },
        ],
      },
      {
        name: "History",
        actions: [
          { text: "Compare to recent version", active: false, disabled: true },
          { text: "View purchase order versions", active: false, disabled: true },
        ],
      },
    ],
  },
  manage: {
    title: "Manage",
    categories: [
      {
        name: "Set up",
        actions: [
          { text: "Print management", active: true },
          { text: "Summary", active: false },
        ],
      },
      {
        name: "Vendor",
        actions: [
          { text: "Trade agreement", active: false, hasDropdown: true },
          { text: "Activities", active: false, hasDropdown: true },
          { text: "Cases", active: false, hasDropdown: true },
          { text: "Contact details", active: false, disabled: true },
        ],
      },
      {
        name: "Maintain",
        actions: [{ text: "Supplementary items", active: false }],
      },
      {
        name: "Related information",
        actions: [
          { text: "Related orders", active: false },
          { text: "Postings", active: false },
          { text: "Line quantity", active: false },
          { text: "Committed costs", active: false, disabled: true },
          { text: "Purchase agreement", active: false, disabled: true },
          { text: "Approved to supply", active: false, disabled: true },
        ],
      },
    ],
  },
  receive: {
    title: "Receive",
    categories: [
      {
        name: "View",
        actions: [{ text: "Line amounts", active: true }],
      },
      {
        name: "Budget",
        actions: [{ text: "Budget", active: false, hasDropdown: true }],
      },
      {
        name: "Intercompany tracing",
        actions: [
          { text: "Intercompany sales order", active: false, disabled: true },
          { text: "Original sales order", active: false, disabled: true },
          { text: "Packing slip journal", active: false, disabled: true },
          { text: "Invoice journal", active: false, disabled: true },
        ],
      },
    ],
  },
  invoice: {
    title: "Invoice",
    categories: [
      {
        name: "Generate",
        actions: [
          { text: "Invoice", active: true },
          { text: "Pro forma invoice", active: false },
          { text: "Prepayment invoice", active: false, disabled: true },
        ],
      },
      {
        name: "Bill",
        actions: [
          { text: "Payment schedule", active: false, disabled: true },
          { text: "Cash flow forecasts", active: false },
        ],
      },
      {
        name: "Settle",
        actions: [{ text: "Open transactions", active: false }],
      },
      {
        name: "Introduce",
        actions: [{ text: "Credit invoicing", active: false }],
      },
      {
        name: "Journals",
        actions: [
          { text: "Invoice", active: false, disabled: true },
          { text: "Pending invoices", active: false, disabled: true },
        ],
      },
    ],
  },
  transportation: {
    title: "Transportation",
    categories: [
      {
        name: "Shipping",
        actions: [
          { text: "Shipping carriers", active: false },
          { text: "Shipping routes", active: false },
        ],
      },
      {
        name: "Planning",
        actions: [
          { text: "Load planning", active: false },
          { text: "Route optimization", active: false },
        ],
      },
    ],
  },
  general: {
    title: "General",
    categories: [
      {
        name: "Set up",
        actions: [
          { text: "Print management", active: true },
          { text: "Summary", active: false },
        ],
      },
      {
        name: "Vendor",
        actions: [
          { text: "Trade agreement", active: false, hasDropdown: true },
          { text: "Activities", active: false, hasDropdown: true },
          { text: "Cases", active: false, hasDropdown: true },
          { text: "Contact details", active: false, disabled: true },
        ],
      },
      {
        name: "Maintain",
        actions: [{ text: "Supplementary items", active: false }],
      },
      {
        name: "Related information",
        actions: [
          { text: "Related orders", active: false },
          { text: "Postings", active: false },
          { text: "Line quantity", active: false },
          { text: "Committed costs", active: false, disabled: true },
          { text: "Purchase agreement", active: false, disabled: true },
          { text: "Approved to supply", active: false, disabled: true },
        ],
      },
    ],
  },
  options: {
    title: "Options",
    categories: [
      {
        name: "Personalize",
        actions: [
          { text: "Always open for editing", active: true },
          { text: "Personalize this page", active: false },
          { text: "Add to workspace", active: false, hasDropdown: true },
        ],
      },
      {
        name: "Page options",
        actions: [
          { text: "Security diagnostics", active: false },
          { text: "Advanced filter or sort", active: false },
          { text: "Record info", active: false },
          { text: "Go to", active: false, hasDropdown: true },
        ],
      },
      {
        name: "Share",
        actions: [
          { text: "Get a link", active: false, hasDropdown: true },
          { text: "Create a custom alert", active: false, hasDropdown: true },
          { text: "Manage my alerts", active: false },
        ],
      },
    ],
  },
}

const SecondaryNavbar = () => {
  const [activeItem, setActiveItem] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [newOrderDrawerOpen, setNewOrderDrawerOpen] = useState(false)

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget)
    setActiveItem(item)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setActiveItem(null)
  }

  const handleNewOrderClick = () => {
    setNewOrderDrawerOpen(true)
    // Close any open dropdown menu when opening the drawer
    if (activeItem) {
      handleMenuClose()
    }
  }

  const handleNewOrderClose = (submitted = false) => {
    setNewOrderDrawerOpen(false)
    // If the form was submitted, we don't need to do anything as the NewPurchaseOrder component will handle navigation
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"),
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#fff"),
          position: "fixed",
          top: "64px", // Position right below the AppBar
          marginTop: "20px", // Add margin-top to create the gap
          left: "60px", // Account for sidebar width
          right: 0,
          height: "48px",
          zIndex: 1090,
          boxShadow: (theme) =>
            theme.palette.mode === "dark" ? "0 2px 4px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
          borderRadius: "8px",
          mx: 2,
          width: "calc(100% - 64px - 16px)",
          backdropFilter: newOrderDrawerOpen ? "blur(4px)" : "none", // Apply blur when drawer is open
          WebkitBackdropFilter: newOrderDrawerOpen ? "blur(4px)" : "none", // For Safari support
          transition: "backdrop-filter 0.3s ease, background-color 0.3s ease",
          backgroundColor: (theme) =>
            newOrderDrawerOpen
              ? theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.8)"
                : "rgba(255, 255, 255, 0.8)"
              : theme.palette.mode === "dark"
                ? "#1e1e1e"
                : "#fff",
        }}
      >
        {/* New, Edit, Delete icons */}
        <Tooltip title="New">
          <IconButton sx={{ color: "#f15a22" }} onClick={handleNewOrderClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton sx={{ color: "#f15a22" }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton sx={{ color: "#f15a22" }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ 
          mx: 1,
          backgroundColor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : undefined 
        }} />

        {/* Navigation items */}
        {Object.keys(menuItems).map((key) => (
          <NavItem
            key={key}
            variant="button"
            active={activeItem === key ? 1 : 0}
            onClick={(e) => handleMenuOpen(e, key)}
            sx={{
              borderBottom: activeItem === key ? "2px solid #f15a22" : "2px solid transparent",
            }}
          >
            {menuItems[key].title}
            <KeyboardArrowDown
              fontSize="small"
              sx={{
                ml: 0.5,
                color: activeItem === key ? "#f15a22" : "inherit",
                transition: "transform 0.2s",
                transform: activeItem === key ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </NavItem>
        ))}
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        disablePortal
        modifiers={[
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              boundary: "viewport",
            },
          },
        ]}
        style={{
          zIndex: 1080,
          width: "calc(100vw - 60px - 32px)",
          left: "60px", // Align with the sidebar
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "left top" }}>
            <Paper
              elevation={3}
              sx={{
                mt: 0.5,
                width: "calc(100vw - 60px - 32px)",
                borderTop: "1px solid",
                borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"),
                borderRadius: "8px",
                py: 2,
                position: "relative",
                left: 0,
                backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#fff"),
              }}
            >
              <ClickAwayListener onClickAway={handleMenuClose}>
                <Box sx={{ px: 3, display: "flex" }}>
                  {activeItem && (
                    <>
                      {menuItems[activeItem].categories.map((category, index) => (
                        <Box
                          key={index}
                          sx={{
                            minWidth: "180px",
                            borderRight: (theme) => 
                              index < menuItems[activeItem].categories.length - 1 
                                ? `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"}` 
                                : "none",
                            pr: 3,
                            mr: 3,
                          }}
                        >
                          <CategoryHeading>{category.name}</CategoryHeading>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            {category.actions.map((action, actionIndex) =>
                              action.disabled ? (
                                <DisabledAction key={actionIndex}>{action.text}</DisabledAction>
                              ) : (
                                <ActionButton
                                  key={actionIndex}
                                  active={action.active ? 1 : 0}
                                  endIcon={action.hasDropdown ? <KeyboardArrowDown fontSize="small" /> : null}
                                >
                                  {action.text}
                                </ActionButton>
                              ),
                            )}
                          </Box>
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Blur Backdrop when drawer is open */}
      <BlurBackdrop open={newOrderDrawerOpen} />

      {/* New Purchase Order Drawer */}
      <NewPurchaseOrder
        open={newOrderDrawerOpen}
        onClose={handleNewOrderClose}
        onSubmit={() => handleNewOrderClose(true)}
      />
    </>
  )
}

export default SecondaryNavbar
