"use client"

import React from "react"
import { Paper, Typography, Button } from "@mui/material"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong with this component.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </Paper>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
