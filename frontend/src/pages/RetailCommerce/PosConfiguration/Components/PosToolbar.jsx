import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Popover,
  MenuItem,
  ListItemIcon,
  TextField,
  InputAdornment,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Edit, Add, Delete, MoreVert, Refresh, FileDownload, Print, Search } from "@mui/icons-material"

const PosToolbar = ({
  selected,
  loading,
  filterText,
  setFilterText,
  handleEdit,
  handleNew,
  handleDelete,
  optionsAnchorEl,
  handleOptionsClick,
  handleOptionsClose,
  handleRefresh,
  handleExport,
  handlePrint,
}) => {
  const theme = useTheme()
  
  // Custom orange color
  const orangeColor = "#f15a22"

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Tooltip title="Edit selected POS">
        <Button
          variant="contained"
          size="small"
          startIcon={<Edit fontSize="small" />}
          onClick={handleEdit}
          disabled={loading}
          sx={{
            bgcolor: selected.length === 1 ? theme.palette.primary.main : theme.palette.action.disabledBackground,
            color: selected.length === 1 ? theme.palette.primary.contrastText : theme.palette.text.disabled,
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              bgcolor: selected.length === 1 ? theme.palette.primary.dark : theme.palette.action.hover,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          }}
        >
          Edit
        </Button>
      </Tooltip>

      <Tooltip title="Add new POS">
        <Button
          variant="contained"
          size="small"
          startIcon={<Add fontSize="small" />}
          onClick={handleNew}
          disabled={loading}
          sx={{
            ml: 1,
            bgcolor: orangeColor,
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#d94d1a", // Darker shade of the orange color
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          }}
        >
          New
        </Button>
      </Tooltip>

      <Tooltip title="Delete selected POS">
        <Button
          variant="contained"
          size="small"
          startIcon={<Delete fontSize="small" />}
          onClick={handleDelete}
          disabled={loading}
          sx={{
            ml: 1,
            bgcolor: selected.length > 0 ? theme.palette.error.main : theme.palette.action.disabledBackground,
            color: selected.length > 0 ? theme.palette.error.contrastText : theme.palette.text.disabled,
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              bgcolor: selected.length > 0 ? theme.palette.error.dark : theme.palette.action.hover,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          }}
        >
          Delete
        </Button>
      </Tooltip>

      <Tooltip title="More options">
        <IconButton
          size="small"
          onClick={handleOptionsClick}
          disabled={loading}
          sx={{
            ml: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(optionsAnchorEl)}
        anchorEl={optionsAnchorEl}
        onClose={handleOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 1,
            mt: 0.5,
            boxShadow: theme.shadows[3],
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <MenuItem onClick={handleRefresh} sx={{ fontSize: "14px" }}>
          <ListItemIcon>
            <Refresh fontSize="small" sx={{ color: theme.palette.text.secondary }} />
          </ListItemIcon>
          Refresh data
        </MenuItem>
        <MenuItem onClick={handleExport} sx={{ fontSize: "14px" }}>
          <ListItemIcon>
            <FileDownload fontSize="small" sx={{ color: theme.palette.text.secondary }} />
          </ListItemIcon>
          Export data
        </MenuItem>
        <MenuItem onClick={handlePrint} sx={{ fontSize: "14px" }}>
          <ListItemIcon>
            <Print fontSize="small" sx={{ color: orangeColor }} />
          </ListItemIcon>
          Print
        </MenuItem>
      </Popover>

      <Box sx={{ flexGrow: 1 }} />

      <TextField
        placeholder="Search..."
        size="small"
        variant="outlined"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
          sx: {
            fontSize: "14px",
            height: "36px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.divider,
              borderRadius: "8px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: orangeColor,
              borderWidth: "1px",
            },
          },
        }}
        sx={{
          width: "220px",
          "& .MuiInputBase-root": {
            height: "36px",
          },
        }}
      />
    </Box>
  )
}

export default PosToolbar
