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

// Retail and Commerce Imports
import StoreTransaction from "./pages/RetailCommerce/StoreTransaction/StoreTransaction";
import PosConfiguration from "./pages/RetailCommerce/PosConfiguration/PosConfiguration";
import Reporting from "./pages/RetailCommerce/Reporting/Reporting";

// Finance And Sales Imports
import FinanceAndSales from "./pages/Finance and Sales/FinanceAndSales";
import AccountsPayable from "./pages/Finance and Sales/AccountsPayable/AccountsPayable";
import AccountsReceivable from "./pages/Finance and Sales/Accounts Recievable/AccountsRecievable";
import BankManagement from "./pages/Finance and Sales/Bank Management/BankManagement";
import FinanceReport from "./pages/Finance and Sales/FinanceReport/FinanceReport";

// Product Information and Configuration Imports
import ProductInformationConfiguration from "./pages/Product Information and Configuration/ProductInformationConfiguration";
import ProductAddition from "./pages/Product Information and Configuration/Product Addition/ProductAddition";
import ProductCategory from "./pages/Product Information and Configuration/Product Categories/ProductCategory";
import ProductPricing from "./pages/Product Information and Configuration/Product Pricing/ProductPricing";

// Inventory Management Imports
import InventoryManagement from "./pages/Inventory Management/InventoryManagement";
import StockManagement from "./pages/Inventory Management/Stock Management/StockManagement";
import WarehouseManagement from "./pages/Inventory Management/Warehouse Management/WarehouseManagement";
import ReportsAnalytics from "./pages/Report and Analytics/ReportAnalytics";

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
    // ------------ Retail and Commerce ------------
    {
      name: "Retail and Commerce",
      path: "/RetailCommerce",
      category: "Modules > Retail and Commerce",
    },
    // ------------ Retail and Commerce Submodules ------------
    {
      name: "Store Transactions",
      path: "/RetailCommerce/StoreTransactions",
      category: "Modules > Retail and Commerce > Store Transactions",
    },
    {
      name: "POS Configuration",
      path: "/RetailCommerce/PosConfiguration",
      category: "Modules > Retail and Commerce > POS Configuration",
    },
    {
      name: "Retail and Commerce Reports",
      path: "/RetailCommerce/Reporting",
      category: "Modules > Retail and Commerce > Reporting",
    },

    // ------------ Finance and Sales ------------
    {
      name: "Finance and Sales",
      path: "/FinanceandSales",
      category: "Modules > Finance and Sales",
    },
    // ------------ Finance and Sales Submodules ------------
    {
      name: "Accounts Payable",
      path: "/FinanceandSales/AccountsPayable",
      category: "Modules > Finance and Sales > Accounts Payable",
    },

    {
      name: "Accounts Receivable",
      path: "/FinanceandSales/AccountsRecievable",
      category: "Modules > Finance and Sales > Accounts Receivable",
    },

    {
      name: "Bank Management",
      path: "/FinanceandSales/BankManagement",
      category: "Modules > Finance and Sales > Bank Management",
    },

    {
      name: "Finance and Sales Reports",
      path: "/FinanceandSales/FinanceReport",
      category: "Modules > Finance and Sales > Reporting",
    },

    // ------------ Product Information and Configuration ------------

    {
      name: "Product Information and Configuration",
      path: "/ProductInformationConfiguration",
      category: "Modules > Product Information and Configuration",
    },
    // ------------ Product Information and Configuration Submodules ------------
    {
      name: "Product Addition",
      path: "/ProductInformationConfiguration/ProductAddition",
      category:
        "Modules > Product Information and Configuration > Product Addition",
    },
    {
      name: "Product Categories",
      path: "/ProductInformationConfiguration/ProductCategory",
      category:
        "Modules > Product Information and Configuration > Product Categories",
    },
    {
      name: "Product Pricing",
      path: "/ProductInformationConfiguration/ProductPricing",
      category:
        "Modules > Product Information and Configuration > Product Pricing",
    },
    // ------------ Inventory Management ------------
    {
      name: "Inventory Management",
      path: "/InventoryManagement",
      category: "Modules > Inventory Management",
    },
    // ------------ Inventory Management Submodules ------------
    {
      name: "Stock Management",
      path: "/InventoryManagement/StockManagement",
      category: "Modules > Inventory Management > Stock Management",
    },

    {
      name: "Warehouse Management",
      path: "/InventoryManagement/WarehouseManagement",
      category: "Modules > Inventory Management > Warehouse Management",
    },
    // ------------ User Management ------------
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

          <Route
            path="/RetailCommerce/PosConfiguration"
            element={
              isAuthenticated ? (
                <PosConfiguration user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/RetailCommerce/Reporting/"
            element={
              isAuthenticated ? (
                <Reporting user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ------------Finance and Sales ----------- */}

          <Route
            path="/FinanceandSales"
            element={
              isAuthenticated ? (
                <FinanceAndSales user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/FinanceandSales/AccountsPayable"
            element={
              isAuthenticated ? (
                <AccountsPayable user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/FinanceandSales/AccountsRecievable"
            element={
              isAuthenticated ? (
                <AccountsReceivable user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/FinanceandSales/BankManagement"
            element={
              isAuthenticated ? (
                <BankManagement user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/FinanceandSales/Reporting"
            element={
              isAuthenticated ? (
                <FinanceReport user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ------------ Product Information and Configuration ------------ */}

          <Route
            path="/ProductInformationConfiguration"
            element={
              isAuthenticated ? (
                <ProductInformationConfiguration user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/ProductInformationConfiguration/ProductAddition"
            element={
              isAuthenticated ? (
                <ProductAddition user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/ProductInformationConfiguration/ProductCategory"
            element={
              isAuthenticated ? (
                <ProductCategory user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/ProductInformationConfiguration/ProductPricing"
            element={
              isAuthenticated ? (
                <ProductPricing user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ------------ Inventory Management ------------ */}

          <Route
            path="/InventoryManagement"
            element={
              isAuthenticated ? (
                <InventoryManagement user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/InventoryManagement/StockManagement"
            element={
              isAuthenticated ? (
                <StockManagement user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/InventoryManagement/WarehouseManagement"
            element={
              isAuthenticated ? (
                <WarehouseManagement user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ------------ Reports and Analytics ------------ */}

          <Route
            path="/ReportsAnalytics"
            element={
              isAuthenticated ? (
                <ReportsAnalytics user={user} />
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
