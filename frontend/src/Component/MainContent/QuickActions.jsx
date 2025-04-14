// QuickActions.jsx
import React from "react";
import { Box, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";

const QuickActions = ({ isMobile }) => {
  const theme = useTheme();

  const actions = [
    { label: "Update Inventory", onClick: () => console.log("Update Inventory clicked") },
    { label: "Store Transactions", onClick: () => console.log("Store Transactions clicked") },
    { label: "BOM Management", onClick: () => console.log("BOM Management clicked") },
  ];

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {actions.map((action, index) => (
          <Grid item xs={6} sm={4} key={index}>
            <Box
              onClick={action.onClick}
              sx={{
                p: 1.5, // Consistent padding for rectangular shape
                backgroundColor: "#f15a22", // Uniform orange color for all buttons
                borderRadius: "12px", // Curved corners
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: theme.palette.mode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: theme.palette.mode === "dark" ? "0 8px 20px rgba(0, 0, 0, 0.5)" : "0 8px 20px rgba(0, 0, 0, 0.15)",
                },
                width: "100%", // Ensure buttons take full width of Grid item
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff", // White text
                  fontWeight: 500,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                }}
              >
                {action.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;