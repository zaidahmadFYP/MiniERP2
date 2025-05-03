"use client"
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import InventoryIcon from "@mui/icons-material/Inventory"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { PRIMARY_COLOR } from "../../ProductAddition"

const ActionMenu = ({ anchorEl, open, selected, products, onClose, onEdit, onAdjustStock, onDuplicate, onDelete }) => {
  // Find the selected product
  const selectedProduct = selected.length === 1 ? products.find((p) => p._id === selected[0]) : null

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 180,
        },
      }}
    >
      <MenuItem
        onClick={() => {
          if (selectedProduct) {
            onEdit(selectedProduct)
          }
        }}
        disabled={!selectedProduct}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (selectedProduct) {
            onAdjustStock(selectedProduct)
          }
        }}
        disabled={!selectedProduct}
      >
        <ListItemIcon>
          <InventoryIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} />
        </ListItemIcon>
        <ListItemText>Adjust Stock</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (selectedProduct) {
            onDuplicate(selectedProduct)
          }
        }}
        disabled={!selectedProduct}
      >
        <ListItemIcon>
          <ContentCopyIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem onClick={onDelete} disabled={selected.length === 0}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
      </MenuItem>
    </Menu>
  )
}

export default ActionMenu
