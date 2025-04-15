import { createTheme } from "@mui/material/styles"

// Create a theme instance for both light and dark modes
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f7",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
        panel: mode === "dark" ? "#262626" : "#f9f9f9",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#333333",
        secondary: mode === "dark" ? "#b0b0b0" : "#666666",
      },
      divider: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              backgroundColor: mode === "dark" ? "#262626" : "#f5f5f7",
              color: mode === "dark" ? "#ffffff" : "#333333",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          filled: {
            color: "#ffffff",
          },
        },
      },
    },
  })
