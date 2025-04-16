import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

const NewPosDialog = ({ open, currentPos, setCurrentPos, handleClose, handleSave, loading }) => {
  const theme = useTheme()
  
  // Custom orange color
  const orangeColor = "#f15a22"

  // Handle time bound toggle
  const handleTimeBoundToggle = (event) => {
    const isEnabled = event.target.checked

    if (isEnabled) {
      // If enabled, set current date as time in bound
      setCurrentPos({
        ...currentPos,
        timeBoundEnabled: true,
        timeBoundStart: new Date(),
        timeBoundEnd: null,
      })
    } else {
      // If disabled, clear time bound dates
      setCurrentPos({
        ...currentPos,
        timeBoundEnabled: false,
        timeBoundStart: null,
        timeBoundEnd: null,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.1)" : "rgba(241, 90, 34, 0.05)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontWeight: 600,
          p: 2.5,
          color: theme.palette.mode === "dark" ? "#fff" : "#333",
        }}
      >
        New POS Configuration
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "grid", gap: 3, mt: 1 }}>
          <Card
            variant="outlined"
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.08)" : "rgba(241, 90, 34, 0.05)",
              p: 2,
              borderRadius: 2,
              borderColor: theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.3)" : theme.palette.divider,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: orangeColor }}>
                Auto-generated Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="POS ID"
                    value={currentPos?.posId || ""}
                    fullWidth
                    variant="filled"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    helperText="Automatically generated 5-digit number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Registration Number"
                    value={currentPos?.id || ""}
                    fullWidth
                    variant="filled"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    helperText="Automatically generated 6-digit number"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <FormControl fullWidth variant="filled">
            <InputLabel shrink>Authority Type</InputLabel>
            <Select
              value={currentPos?.authorityType || "PRA"}
              onChange={(e) => setCurrentPos({ ...currentPos, authorityType: e.target.value })}
              displayEmpty
            >
              <MenuItem value="PRA">PRA</MenuItem>
              <MenuItem value="KPRA">KPRA</MenuItem>
              <MenuItem value="FBR">FBR</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Username (Optional)"
            value={currentPos?.userName || ""}
            onChange={(e) => setCurrentPos({ ...currentPos, userName: e.target.value })}
            fullWidth
            variant="filled"
            InputLabelProps={{ shrink: true }}
            placeholder="Enter username if needed"
          />

          <TextField
            label="Password (Optional)"
            type="password"
            value={currentPos?.password || ""}
            onChange={(e) => {
              // Limit to 6 characters
              const value = e.target.value.slice(0, 6)
              setCurrentPos({ ...currentPos, password: value })
            }}
            inputProps={{ maxLength: 6 }}
            fullWidth
            variant="filled"
            InputLabelProps={{ shrink: true }}
            placeholder="Enter password if needed"
            helperText="Maximum 6 characters"
          />

          {/* Time Bound Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={currentPos?.timeBoundEnabled || false}
                onChange={handleTimeBoundToggle}
                color="primary"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: orangeColor,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: orangeColor,
                  },
                }}
              />
            }
            label="Enable Time Bound"
          />

          {/* Time Bound Date Pickers - Only shown when time bound is enabled */}
          {currentPos?.timeBoundEnabled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Time Bound Start"
                    value={currentPos?.timeBoundStart || null}
                    onChange={(date) => setCurrentPos({ ...currentPos, timeBoundStart: date })}
                    slotProps={{
                      textField: {
                        variant: "filled",
                        fullWidth: true,
                        InputLabelProps: { shrink: true },
                        helperText: "Auto-set to current date",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Time Bound End"
                    value={currentPos?.timeBoundEnd || null}
                    onChange={(date) => setCurrentPos({ ...currentPos, timeBoundEnd: date })}
                    slotProps={{
                      textField: {
                        variant: "filled",
                        fullWidth: true,
                        InputLabelProps: { shrink: true },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          )}

          <Typography variant="body2" color="textSecondary">
            Status will be set to ONLINE by default
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: orangeColor,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#d94d1a", // Darker shade of the orange color
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewPosDialog
