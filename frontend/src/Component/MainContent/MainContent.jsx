import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Banner from "../BannerComponent/BannerComponent";
import TilesGrid from "../TileGrid/TileGrid";
import CalendarComponent from "./CalandarComponent";

const MainContent = ({ user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const headingColor = theme.palette.mode === "dark" ? "#f5a623" : "#000000"; // Adjusted to a more vibrant orange for contrast
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Track window resize for responsive control
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Get responsive font size for title and subtitle
  const getFontSize = (type) => {
    const size = getResponsiveSize();
    switch (type) {
      case "title":
        return size === "xs"
          ? "1.1rem"
          : size === "sm"
          ? "1.25rem"
          : size === "md-compact"
          ? "1.4rem"
          : "1.5rem";
      case "subtitle":
        return size === "xs"
          ? "0.9rem"
          : size === "sm"
          ? "1rem"
          : size === "md-compact"
          ? "1.1rem"
          : "1.25rem";
      default:
        return size === "md-compact" ? "0.9rem" : "0.95rem";
    }
  };

  // Determine screen size based on width
  const getResponsiveSize = () => {
    if (windowWidth < 600) return "xs";
    if (windowWidth < 960) return "sm";
    if (windowWidth <= 1366) return "md-compact";
    return "md";
  };

  // Get vertical spacing based on screen size and compact height
  const getVerticalSpacing = (type) => {
    const isCompactHeight = windowHeight <= 768;
    if (isCompactHeight) {
      switch (type) {
        case "header":
          return "1rem";
        case "categories":
          return "0.5rem";
        case "section":
          return "1rem";
        default:
          return "1rem";
      }
    } else {
      switch (type) {
        case "header":
          return "1.5rem";
        case "categories":
          return "1rem";
        case "section":
          return "1.5rem";
        default:
          return "1.5rem";
      }
    }
  };

  const tiles = useMemo(() => {
    const allTiles = [
      { name: "Retail and Commerce", image: "/images/retail_and_commerce.png" },
      {
        name: "Product Information and Configuration",
        image: "/images/product_management.png",
      },
      { name: "Finance and Sales", image: "/images/finance_and_sales.png" },
      { name: "Inventory Management", image: "/images/inventory_management.png" },
      { name: "Reports and Analytics", image: "/images/report_and_analytics.png" },
      { name: "User Management", image: "/images/user_management.png" },
    ];
    return allTiles.filter((tile) =>
      user.registeredModules.some((module) => module.startsWith(tile.name))
    );
  }, [user]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/announcements/latest`)
      .then((response) => response.json())
      .then((data) => setLatestAnnouncement(data))
      .catch((error) =>
        console.error("Error fetching the latest announcement:", error)
      );
  }, []);

  const handleTileClick = (tileName) => {
    const paths = {
      RetailCommerce: "/RetailCommerce/RetailCommerce",
      "User Management": "/UserManagement/UserManagement",
    };
    navigate(paths[tileName], { state: { tileName } });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: isMobile ? 2 : 4,
        marginLeft: isMobile ? 0 : 1,
        transition: "margin-left 0.3s ease", // Smoother transition
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5", // Dark background for dark mode
        overflow: "hidden", // Prevent scrolling for the entire page
        height: "100vh",
      }}
    >
      {/* Banner with gradient for visual appeal */}
      <Banner
        sx={{
          background: "linear-gradient(135deg, #6B48FF 0%, #A855F7 100%)",
        }}
      />

      {/* Modules Heading */}
      <Typography
        variant="h4"
        sx={{
          color: "#f15a22", // Orange color
          mt: 1, // Adjust margin-top for spacing
          mb: 3, // Adjust margin between heading and bottom border
          textAlign: "left", // Align text to the left
          ml: isMobile ? 2 : 6, // Adjust left margin based on screen size
          fontSize: getFontSize("title"), // Adjust font size dynamically
          fontFamily: "TanseekModernPro-Bold, Arial, sans-serif", // Font family as per your preference
          fontWeight: "bold", // Bold font weight
          letterSpacing: "1px", // Add letter spacing for a modern touch
          textTransform: "uppercase", // Uppercase text transform for consistency
          display: "flex",
          alignItems: "center",
          borderBottom: "2px solid #333333", // Border at the bottom
          paddingBottom: "15px", // Padding between text and bottom border
        }}
      >
        <Box
          sx={{
            height: "25px",
            width: "3px",
            backgroundColor: "#f15a22",
            marginRight: "4px",
          }}
        />
        Modules
      </Typography>

      {/* Main content container */}
      <Box
        sx={{
          height: "calc(100vh - 180px)", // Adjust based on your banner and header height
          overflow: "hidden",
          position: "relative", // Add position relative for absolute positioning of children
        }}
      >
        <Grid 
          container 
          spacing={isMobile ? 2 : 3} 
          alignItems="flex-start"
          sx={{ height: '100%' }}
        >
          {/* Tiles Grid */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                ml: isMobile ? 0 : 6,
                display: "flex",
                flexWrap: "wrap",
                gap: 2, // Add gap between tiles for better spacing
                mb: getVerticalSpacing("section"), // Ensure spacing between sections
              }}
            >
              <TilesGrid
                tiles={tiles}
                onTileClick={handleTileClick}
                sx={{
                  "& .tile": {
                    // Assuming TilesGrid renders tiles with a "tile" class
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    borderRadius: "12px", // Rounded corners for a modern look
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                        : "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff", // Card-like background
                    "&:hover": {
                      transform: "translateY(-5px)", // Lift effect on hover
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 8px 20px rgba(0, 0, 0, 0.5)"
                          : "0 8px 20px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
                    },
                  },
                  "& .tile-text": {
                    // Assuming tile text has a "tile-text" class
                    fontSize: "16px",
                    fontWeight: 500,
                    color: theme.palette.mode === "dark" ? "#ffffff" : "#333333",
                    textAlign: "center",
                    mt: 1,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Calendar Section - Fixed position to prevent going below page */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <Box
              sx={{
                ml: isMobile ? 0 : 10,
                mr: isMobile ? 0 : 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                borderRadius: "12px",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                    : "0 4px 12px rgba(0, 0, 0, 0.1)",
                p: 2,
                height: isMobile ? "auto" : "calc(100% - 20px)", // Adjust based on padding
                maxHeight: isMobile ? "50vh" : "66%",
                position: "relative", // Position relative for proper sizing
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <Typography
                variant="h6"
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: theme.palette.mode === "dark" ? "#ffffff" : "#333333",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Calendar
              </Typography> */}
              
              <Box
                sx={{ 
                  flexGrow: 1,
                  overflow: "hidden" // Prevent scrolling within calendar box
                }}
              >
                <CalendarComponent
                  isMobile={isMobile}
                  sx={{
                    "& .calendar-header": {
                      fontSize: "18px",
                      fontWeight: 600,
                      color: theme.palette.mode === "dark" ? "#ffffff" : "#333333",
                      mb: 1,
                    },
                    "& .calendar-day": {
                      borderRadius: "50%",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#f5a623" : "#e0e0e0",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainContent;