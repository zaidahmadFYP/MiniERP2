// src/App.js

import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";

// Component Imports
import SignInPage from "./Component/Signin/Signin";
import AppBarComponent from "./Component/AppBarComponent/AppBarComponent";
import DrawerComponent from "./Component/DrawerComponent/DrawerComponent";
import MainContent from "./Component/MainContent/MainContent";
import SessionTimeout from "./SessionTimeout";

import RetailCommerce from "./pages/RetailCommerce/RetailCommerce";

// User Management Imports
import ActiveUsers from "./pages/UserManagement/ActiveUsers";
import StoreTransaction from "./pages/RetailCommerce/StoreTransaction/StoreTransaction";

function App() {
  // ------------ Authentication ------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // user data

  // ------------ Drawer States ------------
  // mobileOpen => for small screens (temporary drawer)
  const [mobileOpen, setMobileOpen] = useState(false);
  // desktopOpen => for large screens (mini vs. full permanent drawer)
  const [desktopOpen, setDesktopOpen] = useState(false);

  // ------------ Dark Mode ------------
  const [darkMode, setDarkMode] = useState(false);

  // ------------ Search ------------
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // This array is for search logic (you can adapt as needed)
  const items = [
    {
      name: "Licenses",
      path: "/Licenses/Licensepage",
      category: "Modules > Licenses",
    },
    // sub-modules
    {
      name: "Trade Licenses",
      path: "/Licenses/Licensepage",
      category: "Modules > Licenses > Trade Licenses",
    },
    {
      name: "Staff Medicals",
      path: "/UserManagement",
      category: "Modules > Licenses > Staff Medicals",
    },
    {
      name: "Toursim Licenses",
      path: "/UserManagement",
      category: "Modules > Licenses > Tourism Licenses",
    },
    {
      name: "Labour Licenses",
      path: "/UserManagement",
      category: "Modules > Licenses > Labour Licenses",
    },

    {
      name: "Approvals",
      path: "/Approval/Approvalpage",
      category: "Modules > Approvals",
    },
    // sub-modules
    {
      name: "Outer Spaces",
      path: "/Approval/Approvalpage",
      category: "Modules > Approvals > Outer Spaces",
    },

    {
      name: "Vehicles",
      path: "/Vehicles/Vehiclepage",
      category: "Modules > Vehicles",
    },
    // sub-modules
    {
      name: "Maintenance",
      path: "/Vehicles/Vehiclepage",
      category: "Modules > Vehicles > Maintenance",
    },
    {
      name: "Route Permits",
      path: "/Vehicles/Vehiclepage",
      category: "Modules > Vehicles > Route Permits",
    },
    {
      name: "Token Taxes",
      path: "/Vehicles/Vehiclepage",
      category: "Modules > Vehicles > Token Taxes",
    },

    {
      name: "User Requests",
      path: "/UserRequests",
      category: "Modules > User Requests",
    },

    {
      name: "Health Safety Environment",
      path: "/Hse/Hse",
      category: "Modules > Health Safety Environment",
    },
    // sub-modules
    {
      name: "Monthly Inspection",
      path: "/Hse/Hse",
      category: "Modules > Health Safety Environment > Monthly Inspection",
    },
    {
      name: "Quarterly Audit",
      path: "/Hse/Hse",
      category: "Modules > Health Safety Environment > Quarterly Audit",
    },
    {
      name: "Training Status",
      path: "/Hse/Hse",
      category: "Modules > Health Safety Environment > Training Status",
    },
    {
      name: "Incidents",
      path: "/Hse/Hse",
      category: "Modules > Health Safety Environment > Incidents",
    },

    {
      name: "Taxation",
      path: "/Taxation/Taxationpage",
      category: "Modules > Taxation",
    },
    // sub-modules
    {
      name: "Marketing / BillBoards Taxes",
      path: "/Taxation/Taxationpage",
      category: "Modules > Taxation > Marketing / BillBoards Taxes",
    },
    {
      name: "Profession Taxes",
      path: "/Taxation/Taxationpage",
      category: "Modules > Taxation > Profession Taxes",
    },

    {
      name: "Certificates",
      path: "/Certificate/Certificatepage",
      category: "Modules > Certificates",
    },
    // sub-modules
    {
      name: "Electric Fitness Test",
      path: "/Certificate/Certificatepage",
      category: "Modules > Certificates > Electric Fitness Test",
    },

    {
      name: "Security",
      path: "/Security/GuardTraining",
      category: "Modules > Security",
    },

    {
      name: "Admin Policies and SOPs",
      path: "/AdminPolicies",
      category: "Modules > Admin Policies",
    },

    {
      name: "Rental Agreements",
      path: "/RentalAgreements",
      category: "Modules > Rental Agreements",
    },

    {
      name: "User Management",
      path: "/UserManagement/",
      category: "Modules > User Management",
    },
  ];

  // ------------ Handlers ------------
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", "your-auth-token");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally redirect to login
    window.location.href = "/login";
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && user?.registeredModules) {
      const lowerQuery = query.toLowerCase();
      const results = items.filter((item) => {
        const hasAccess = user.registeredModules.some((module) =>
          module.includes(item.name)
        );
        return hasAccess && item.name.toLowerCase().includes(lowerQuery);
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // ------------ Theme ------------
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#FFFFFF",
      },
    },
  });

  // -------------------------------- RENDER --------------------------------
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Session Timeout if user is authenticated */}
        {isAuthenticated && (
          <SessionTimeout timeout={15 * 60 * 1000} onLogout={handleLogout} />
        )}

        {/* Show AppBar if logged in */}
        {isAuthenticated && (
          <AppBarComponent
            darkMode={darkMode}
            handleDarkModeToggle={handleDarkModeToggle}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            searchResults={searchResults}
            user={user}
            // Drawer states to allow toggling from the AppBar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            desktopOpen={desktopOpen}
            setDesktopOpen={setDesktopOpen}
          />
        )}

        {/* Single Drawer for the entire app, shown if logged in */}
        {isAuthenticated && (
          <DrawerComponent
            user={user}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            desktopOpen={desktopOpen}
            setDesktopOpen={setDesktopOpen}
          />
        )}

        <Routes>
          {/* ------------ Public Route (Login) ------------ */}
          <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />

          {/* ------------ Main Content or Redirect ------------ */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <MainContent user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ------------ RetailCommerce Page ------------ */}
          <Route
            path="/RetailCommerce"
            element={
              isAuthenticated ? (
                <RetailCommerce user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/RetailCommerce/StoreTransactions"
            element={
              isAuthenticated ? (
                <StoreTransaction user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ------------ User Management ------------ */}
          <Route
            path="/UserManagement/"
            element={
              isAuthenticated ? <ActiveUsers /> : <Navigate to="/login" />
            }
          />

          {/* (Add any other routes not covered above) */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
