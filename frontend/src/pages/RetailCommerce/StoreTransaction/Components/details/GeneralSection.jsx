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
  Chip,
  useTheme,
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"
import { formatDate, getStatusColor, getPaidStatusColor } from "../../utils/formatUtils"

export default function GeneralSection({ transaction, isOpen, onToggle }) {
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
              General
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mr: 1 }}>
                {transaction.channel || ""}
              </Typography>
              <IconButton size="small" onClick={onToggle} aria-expanded={isOpen} aria-label="show more">
                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
          </Box>
        }
        sx={{ p: 1.5, bgcolor: theme.palette.mode === "dark" ? "#333333" : "#f9f9f9" }}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Transaction ID
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.transactionID || ""}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Transaction Number
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.transactionNumber || ""}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                MongoDB ID
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction._id || ""}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Transaction Date
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={formatDate(transaction.date)}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Payment Method
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.paymentMethod || ""}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Transaction Status
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", height: "40px" }}>
                <Chip
                  label={transaction.transactionStatus || "N/A"}
                  sx={{
                    backgroundColor: getStatusColor(transaction.transactionStatus),
                    color: "#fff",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Payment Status
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", height: "40px" }}>
                <Chip
                  label={transaction.paidStatus || "N/A"}
                  sx={{
                    backgroundColor: getPaidStatusColor(transaction.paidStatus),
                    color: "#fff",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Order Punched
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.orderPunched || ""}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Channel
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.channel || ""}
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
            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "#666", mb: 0.5 }}
              >
                Total Items
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={transaction.items ? transaction.items.length : 0}
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
