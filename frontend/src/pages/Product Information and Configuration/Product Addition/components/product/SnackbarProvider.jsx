"use client"
import { createContext, useContext, useState } from "react"
import { Alert, Fade, Snackbar } from "@mui/material"
import { PRIMARY_COLOR } from "../../ProductAddition"

// Create context
const SnackbarContext = createContext()

// Custom hook to use the snackbar
export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider")
  }
  return context
}

// Provider component
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const handleClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: 6,
            ...(snackbar.severity === "success" && {
              backgroundColor: PRIMARY_COLOR,
            }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider
