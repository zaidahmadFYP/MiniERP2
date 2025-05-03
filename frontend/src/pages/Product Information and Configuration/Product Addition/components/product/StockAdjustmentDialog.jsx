"use client"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart"
import { PRIMARY_COLOR } from "../../ProductAddition"

const StockAdjustmentDialog = ({ open, currentStock, newStock, onClose, onChange, onSubmit }) => {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          backgroundColor: alpha(PRIMARY_COLOR, 0.1),
          borderBottom: `1px solid ${alpha(PRIMARY_COLOR, 0.2)}`,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>
          Adjust Stock
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Current Stock"
            value={currentStock}
            disabled
            fullWidth
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
          />
          <TextField
            label="New Stock"
            type="number"
            value={newStock}
            onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
            fullWidth
            variant="outlined"
            autoFocus
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
            sx={{
              "& .MuiInputLabel-root.Mui-focused": {
                color: PRIMARY_COLOR,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: alpha(PRIMARY_COLOR, 0.3),
                },
                "&:hover fieldset": {
                  borderColor: alpha(PRIMARY_COLOR, 0.5),
                },
                "&.Mui-focused fieldset": {
                  borderColor: PRIMARY_COLOR,
                },
              },
            }}
          />
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<RemoveShoppingCartIcon />}
              onClick={() => onChange(Math.max(0, newStock - 1))}
              sx={{
                borderRadius: 1.5,
                color: PRIMARY_COLOR,
                borderColor: alpha(PRIMARY_COLOR, 0.5),
                "&:hover": {
                  borderColor: PRIMARY_COLOR,
                  backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                },
              }}
            >
              Decrease
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              onClick={() => onChange(newStock + 1)}
              sx={{
                borderRadius: 1.5,
                color: PRIMARY_COLOR,
                borderColor: alpha(PRIMARY_COLOR, 0.5),
                "&:hover": {
                  borderColor: PRIMARY_COLOR,
                  backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                },
              }}
            >
              Increase
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(PRIMARY_COLOR, 0.2)}` }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 1.5,
            color: theme.palette.text.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            borderRadius: 1.5,
            px: 3,
            backgroundColor: PRIMARY_COLOR,
            "&:hover": {
              backgroundColor: alpha(PRIMARY_COLOR, 0.9),
            },
          }}
        >
          Update Stock
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StockAdjustmentDialog
