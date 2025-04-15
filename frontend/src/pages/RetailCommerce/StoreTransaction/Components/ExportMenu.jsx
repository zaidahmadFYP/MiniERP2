import { Menu, MenuItem } from "@mui/material"

export default function ExportMenu({ anchorEl, open, onClose, onExportCSV, onExportJSON }) {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={onExportCSV}>Export as CSV</MenuItem>
      <MenuItem onClick={onExportJSON}>Export as JSON</MenuItem>
    </Menu>
  )
}
