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
  FormControlLabel,
  Switch,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

const EditPosDialog = ({ open, currentPos, setCurrentPos, handleClose, handleSave, loading }) => {
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
        timeBoundEnd: currentPos?.timeBoundEnd || null,
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
          bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontWeight: 600,
          p: 2.5,
        }}
      >
        Edit POS Configuration
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <TextField
            label="Register Number"
            value={currentPos?.id || ""}
            disabled
            fullWidth
            variant="filled"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="POS ID"
            value={currentPos?.posId || ""}
            disabled
            fullWidth
            variant="filled"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth variant="filled">
            <InputLabel shrink>Authority Type</InputLabel>
            <Select
              value={currentPos?.authorityType || ""}
              onChange={(e) => setCurrentPos({ ...currentPos, authorityType: e.target.value })}
              displayEmpty
            >
              <MenuItem value="PRA">PRA</MenuItem>
              <MenuItem value="KPRA">KPRA</MenuItem>
              <MenuItem value="FBR">FBR</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Username"
            value={currentPos?.userName || ""}
            onChange={(e) => setCurrentPos({ ...currentPos, userName: e.target.value })}
            fullWidth
            variant="filled"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
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

          <FormControl fullWidth variant="filled">
            <InputLabel shrink>Status</InputLabel>
            <Select
              value={currentPos?.status || ""}
              onChange={(e) => setCurrentPos({ ...currentPos, status: e.target.value })}
              displayEmpty
            >
              <MenuItem value="ONLINE">ONLINE</MenuItem>
              <MenuItem value="OFFLINE">OFFLINE</MenuItem>
            </Select>
          </FormControl>
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
            bgcolor: theme.palette.primary.main,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
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

export default EditPosDialog
