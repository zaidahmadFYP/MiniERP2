import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Typography,
  Box,
  IconButton,
  Grid,
  TextField,
  useTheme,
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"
import { formatCurrency } from "../../utils/formatUtils"

export default function AmountSection({ transaction, isOpen, onToggle }) {
  const theme = useTheme()

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        bgcolor: theme.palette.mode === "dark" ? "#262626" : "#ffffff",
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}
            >
              Amount
            </Typography>
            <IconButton size="small" onClick={onToggle} aria-expanded={isOpen} aria-label="show more">
              {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
        }
        sx={{ p: 1.5, bgcolor: theme.palette.mode === "dark" ? "#333333" : "#f9f9f9" }}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.mode === "dark" ? "#b0b0b0" : "#555" }}
          >
            AMOUNTS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Total Amount
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={formatCurrency(transaction.total)}
                InputProps={{
                  readOnly: true,
                  sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "inherit",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Item Count
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.items ? transaction.items.reduce((sum, item) => sum + item.itemQuantity, 0) : 0}
                InputProps={{
                  readOnly: true,
                  sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "inherit",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Average Item Price
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={formatCurrency(
                  transaction.total /
                    Math.max(
                      1,
                      transaction.items ? transaction.items.reduce((sum, item) => sum + item.itemQuantity, 0) : 1,
                    ),
                )}
                InputProps={{
                  readOnly: true,
                  sx: { color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "inherit",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  )
}
