"use client"
import React from "react"
import { Box, Button, Typography, Paper } from "@mui/material"
import { PRIMARY_COLOR } from "../../ProductAddition"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: "center",
              borderRadius: 2,
              border: `1px solid ${PRIMARY_COLOR}`,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: PRIMARY_COLOR, fontWeight: 600 }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              An error occurred while rendering this component.
            </Typography>
            {this.state.error && (
              <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(0,0,0,0.05)", borderRadius: 1, textAlign: "left" }}>
                <Typography variant="body2" component="pre" sx={{ fontFamily: "monospace", overflowX: "auto" }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: PRIMARY_COLOR,
                "&:hover": {
                  bgcolor: PRIMARY_COLOR,
                  opacity: 0.9,
                },
              }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
