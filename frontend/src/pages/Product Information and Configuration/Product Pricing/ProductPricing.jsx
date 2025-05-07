import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Drawer,
  Button,
  Chip,
  Paper,
  useTheme,
  alpha,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "axios";
import MainContentWrapper from "./MainContentWrapper";

// Base URL for API calls
const API_BASE_URL = "http://localhost:5002/api/menu";

const ProductPricing = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Theme-aware colors
  const BRAND_COLOR = "#f15a22";
  const THEME_COLOR = BRAND_COLOR;
  const THEME_COLOR_LIGHT = alpha(BRAND_COLOR, isDarkMode ? 0.2 : 0.1);
  const TEXT_PRIMARY = theme.palette.text.primary;
  const TEXT_SECONDARY = theme.palette.text.secondary;
  const BG_COLOR = isDarkMode ? "#121212" : "#f5f5f7";
  const CARD_BG = theme.palette.background.paper;
  const TABLE_BG = isDarkMode ? "#1e1e1e" : "white";
  const TABLE_HEADER_BG = isDarkMode ? "#2d2d2d" : "white";
  const TABLE_HOVER_BG = isDarkMode ? "#2a2a2a" : alpha(THEME_COLOR, 0.02);
  const TABLE_BORDER = isDarkMode ? "1px solid #333" : "1px solid #eaeaea";
  const SEARCH_BG = isDarkMode ? "#2d2d2d" : "white";

  // State for products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Stats for the pricing overview
  const [stats, setStats] = useState({
    totalProducts: 0,
    averagePrice: 0,
    highestPrice: 0,
    lowestPrice: 0,
    totalCategories: 0,
  });

  // State for drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.id?.toLowerCase().includes(query) ||
        (product.categoryName &&
          product.categoryName.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  // Calculate statistics
  const calculateStats = (productList) => {
    if (!productList || productList.length === 0) return;

    const prices = productList.map((p) => p.price).filter((p) => !isNaN(p));
    const uniqueCategories = new Set(
      productList.map((p) => p.category || p.categoryName).filter(Boolean)
    );

    setStats({
      totalProducts: productList.length,
      averagePrice: prices.length
        ? (
            prices.reduce((sum, price) => sum + price, 0) / prices.length
          ).toFixed(2)
        : 0,
      highestPrice: prices.length ? Math.max(...prices).toFixed(2) : 0,
      lowestPrice: prices.length ? Math.min(...prices).toFixed(2) : 0,
      totalCategories: uniqueCategories.size,
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories and products in parallel
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories`),
          axios.get(`${API_BASE_URL}/finishedgoods`),
        ]);

        // Handle the categories response format which includes pagination
        const fetchedCategories =
          categoriesResponse.data.categories || categoriesResponse.data;
        setCategories(fetchedCategories);

        const fetchedProducts = productsResponse.data;
        setProducts(fetchedProducts);

        // Calculate statistics
        calculateStats(fetchedProducts);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/finishedgoods`);
      setProducts(response.data);
      calculateStats(response.data);
      setLoading(false);

      setSnackbar({
        open: true,
        message: "Products refreshed successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error refreshing products:", err);
      setError("Failed to refresh data. Please try again later.");
      setLoading(false);
    }
  };

  // Handle edit price
  const handleEditPrice = (product) => {
    setSelectedProduct(product);
    setNewPrice(product.price.toString());
    setDrawerOpen(true);
  };

  // Handle price change
  const handlePriceChange = (e) => {
    setNewPrice(e.target.value);
  };

  // Handle save price
  const handleSavePrice = async () => {
    try {
      // Validate price
      const updatedPrice = Number.parseFloat(newPrice);
      if (isNaN(updatedPrice) || updatedPrice < 0) {
        setSnackbar({
          open: true,
          message: "Please enter a valid price",
          severity: "error",
        });
        return;
      }

      setSavingPrice(true);

      // Prepare updated product data
      const updatedProduct = {
        ...selectedProduct,
        price: updatedPrice,
      };

      // Send update to API
      const response = await axios.put(
        `${API_BASE_URL}/finishedgoods/${selectedProduct._id}`,
        updatedProduct
      );

      // Update local state
      const updatedProducts = products.map((p) =>
        p._id === selectedProduct._id ? { ...p, price: updatedPrice } : p
      );
      setProducts(updatedProducts);
      calculateStats(updatedProducts);

      // Close drawer and reset state
      setDrawerOpen(false);
      setSelectedProduct(null);
      setNewPrice("");
      setSavingPrice(false);

      // Show success message
      setSnackbar({
        open: true,
        message: "Price updated successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating product price:", err);
      setSnackbar({
        open: true,
        message: "Failed to update price. Please try again.",
        severity: "error",
      });
      setSavingPrice(false);
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  // Get category display (either from categoryName or by looking up the ID)
  const getCategoryDisplay = (product) => {
    if (product.categoryName) {
      return product.categoryName;
    }
    return getCategoryName(product.category);
  };

  // Determine if a price is high (above average)
  const isPriceHigh = (price) => {
    return price > stats.averagePrice;
  };

  // Render loading state
  if (loading) {
    return (
      <MainContentWrapper open={true}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress sx={{ color: THEME_COLOR }} />
        </Box>
      </MainContentWrapper>
    );
  }

  // Render error state
  if (error) {
    return (
      <MainContentWrapper open={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            gap: 2,
          }}
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{
              maxWidth: "600px",
              width: "100%",
              borderRadius: 2,
              boxShadow: theme.shadows[3],
            }}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: THEME_COLOR,
              "&:hover": { bgcolor: alpha(THEME_COLOR, 0.8) },
              borderRadius: "8px",
              px: 3,
              py: 1,
              mt: 2,
            }}
          >
            Retry
          </Button>
        </Box>
      </MainContentWrapper>
    );
  }

  return (
    <MainContentWrapper open={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          bgcolor: BG_COLOR,
        }}
      >
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 0,
            borderLeft: `4px solid ${THEME_COLOR}`,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            bgcolor: CARD_BG,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: alpha(THEME_COLOR, isDarkMode ? 0.2 : 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <AttachMoneyIcon sx={{ color: THEME_COLOR, fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    width: 60,
                    height: 3,
                    bgcolor: THEME_COLOR,
                    borderRadius: 4,
                  },
                }}
              >
                Product Pricing
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Manage your product prices
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: TEXT_SECONDARY }} />
                ),
                sx: {
                  borderRadius: "8px",
                  bgcolor: SEARCH_BG,
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: THEME_COLOR,
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: THEME_COLOR,
                      borderWidth: "1px",
                    },
                  },
                },
              }}
              sx={{
                flexGrow: 1,
                minWidth: { xs: "100%", sm: 240 },
              }}
            />
            <Tooltip title="Refresh Products">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  color: THEME_COLOR,
                  "&:hover": {
                    bgcolor: alpha(THEME_COLOR, isDarkMode ? 0.2 : 0.1),
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Stats Overview */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 0,
            bgcolor: CARD_BG,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: TEXT_PRIMARY }}
          >
            Pricing Overview
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: { xs: "center", sm: "space-between" },
            }}
          >
            <Box
              sx={{
                minWidth: "150px",
                flex: "1 1 0",
                p: 1.5,
                bgcolor: isDarkMode
                  ? alpha(THEME_COLOR, 0.1)
                  : alpha(THEME_COLOR, 0.05),
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Products
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: TEXT_PRIMARY }}
              >
                {stats.totalProducts}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: "150px",
                flex: "1 1 0",
                p: 1.5,
                bgcolor: isDarkMode
                  ? alpha(THEME_COLOR, 0.1)
                  : alpha(THEME_COLOR, 0.05),
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Average Price
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: THEME_COLOR }}
              >
                ${stats.averagePrice}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: "150px",
                flex: "1 1 0",
                p: 1.5,
                bgcolor: isDarkMode
                  ? alpha(THEME_COLOR, 0.1)
                  : alpha(THEME_COLOR, 0.05),
                borderRadius: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Highest Price
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: theme.palette.success.main }}
                >
                  ${stats.highestPrice}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                minWidth: "150px",
                flex: "1 1 0",
                p: 1.5,
                bgcolor: isDarkMode
                  ? alpha(THEME_COLOR, 0.1)
                  : alpha(THEME_COLOR, 0.05),
                borderRadius: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Lowest Price
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingDownIcon sx={{ color: theme.palette.error.main }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: theme.palette.error.main }}
                >
                  ${stats.lowestPrice}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                minWidth: "150px",
                flex: "1 1 0",
                p: 1.5,
                bgcolor: isDarkMode
                  ? alpha(THEME_COLOR, 0.1)
                  : alpha(THEME_COLOR, 0.05),
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Categories
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: TEXT_PRIMARY }}
              >
                {stats.totalCategories}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Products Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            mx: 0,
            width: "100%",
            bgcolor: CARD_BG,
          }}
        >
          <TableContainer
            sx={{
              height: "calc(100vh - 380px)", // Adjusted height to account for the header and stats
              maxHeight: "none", // Remove maxHeight constraint
              width: "100%",
              overflow: "auto", // Ensure scrolling works
            }}
          >
            <Table
              stickyHeader
              aria-label="product pricing table"
              sx={{ minWidth: 650, tableLayout: "fixed" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      bgcolor: TABLE_HEADER_BG,
                      width: "15%",
                      borderBottom: TABLE_BORDER,
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      bgcolor: TABLE_HEADER_BG,
                      width: "30%",
                      borderBottom: TABLE_BORDER,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      bgcolor: TABLE_HEADER_BG,
                      width: "25%",
                      borderBottom: TABLE_BORDER,
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      bgcolor: TABLE_HEADER_BG,
                      width: "15%",
                      borderBottom: TABLE_BORDER,
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      bgcolor: TABLE_HEADER_BG,
                      width: "15%",
                      borderBottom: TABLE_BORDER,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: TABLE_BG }}>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, borderBottom: TABLE_BORDER }}
                    >
                      <Typography variant="h6" sx={{ color: TEXT_SECONDARY }}>
                        {searchQuery
                          ? "No matching products found"
                          : "No products found"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: TEXT_SECONDARY,
                          maxWidth: 400,
                          textAlign: "center",
                          mx: "auto",
                          mt: 1,
                        }}
                      >
                        {searchQuery
                          ? "Try adjusting your search criteria"
                          : "Add products to get started with pricing management"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product._id}
                      sx={{
                        "&:hover": { bgcolor: TABLE_HOVER_BG },
                        transition: "background-color 0.2s",
                        borderBottom: TABLE_BORDER,
                      }}
                    >
                      <TableCell sx={{ borderBottom: TABLE_BORDER }}>
                        <Chip
                          label={product.id}
                          size="small"
                          sx={{
                            bgcolor: alpha(THEME_COLOR, isDarkMode ? 0.2 : 0.1),
                            color: THEME_COLOR,
                            fontFamily: "monospace",
                            fontWeight: 500,
                            borderRadius: "4px",
                            border: "none",
                            px: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 500, borderBottom: TABLE_BORDER }}
                      >
                        {product.name}
                      </TableCell>
                      <TableCell sx={{ borderBottom: TABLE_BORDER }}>
                        {getCategoryDisplay(product)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: TABLE_BORDER }}>
                        <Tooltip
                          title={
                            isPriceHigh(product.price)
                              ? "Above average price"
                              : "Below average price"
                          }
                          arrow
                        >
                          <Chip
                            label={`$${product.price.toFixed(2)}`}
                            size="small"
                            icon={
                              isPriceHigh(product.price) ? (
                                <TrendingUpIcon
                                  sx={{
                                    fontSize: "16px !important",
                                    color: "inherit",
                                  }}
                                />
                              ) : (
                                <TrendingDownIcon
                                  sx={{
                                    fontSize: "16px !important",
                                    color: "inherit",
                                  }}
                                />
                              )
                            }
                            sx={{
                              bgcolor: isDarkMode
                                ? alpha(THEME_COLOR, 0.2)
                                : "white",
                              color: THEME_COLOR,
                              fontWeight: "bold",
                              border: `1px solid ${alpha(THEME_COLOR, 0.3)}`,
                              borderRadius: "4px",
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ borderBottom: TABLE_BORDER }}
                      >
                        <IconButton
                          sx={{
                            color: THEME_COLOR,
                            "&:hover": {
                              bgcolor: alpha(
                                THEME_COLOR,
                                isDarkMode ? 0.2 : 0.1
                              ),
                            },
                          }}
                          onClick={() => handleEditPrice(product)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Table Footer with Info */}
        <Paper
          elevation={0}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 0,
            bgcolor: CARD_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: TABLE_BORDER,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoIcon sx={{ color: TEXT_SECONDARY, fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} of {products.length} products
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Price Edit Drawer */}
      {/* Price Edit Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => !savingPrice && setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            p: 0,
            bgcolor: CARD_BG,
            // Fixed positioning with proper top margin
            top: 64, // Hard-coding the app bar height to 64px
            height: `calc(100% - 64px)`, // Hard-coding the app bar height to 64px
            boxShadow: theme.shadows[5],
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            top: 64, // Hard-coding the app bar height to 64px
            height: `calc(100% - 64px)`, // Hard-coding the app bar height to 64px
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          zIndex: theme.zIndex.drawer, // Keep drawer below app bar but above content
        }}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
      >
        {selectedProduct && (
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderBottom: `1px solid ${alpha(
                  theme.palette.divider,
                  isDarkMode ? 0.2 : 0.1
                )}`,
                bgcolor: alpha(THEME_COLOR, isDarkMode ? 0.2 : 0.05),
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Edit Price
              </Typography>
              <IconButton
                onClick={() => !savingPrice && setDrawerOpen(false)}
                disabled={savingPrice}
                sx={{ color: TEXT_SECONDARY }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Rest of the drawer content remains the same */}
            <Box sx={{ p: 3, overflowY: "auto" }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Product ID
                </Typography>
                <Chip
                  label={selectedProduct.id}
                  sx={{
                    bgcolor: alpha(THEME_COLOR, isDarkMode ? 0.2 : 0.1),
                    color: THEME_COLOR,
                    fontFamily: "monospace",
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                    px: 1,
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Product Name
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {selectedProduct.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Category
                </Typography>
                <Typography>{getCategoryDisplay(selectedProduct)}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Current Price
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: THEME_COLOR,
                    fontWeight: "bold",
                  }}
                >
                  ${selectedProduct.price.toFixed(2)}
                </Typography>

                {/* Price comparison */}
                <Box
                  sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  {isPriceHigh(selectedProduct.price) ? (
                    <>
                      <TrendingUpIcon
                        sx={{ color: theme.palette.success.main, fontSize: 16 }}
                      />
                      <Typography
                        variant="body2"
                        color={theme.palette.success.main}
                      >
                        $
                        {(selectedProduct.price - stats.averagePrice).toFixed(
                          2
                        )}{" "}
                        above average
                      </Typography>
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon
                        sx={{ color: theme.palette.error.main, fontSize: 16 }}
                      />
                      <Typography
                        variant="body2"
                        color={theme.palette.error.main}
                      >
                        $
                        {(stats.averagePrice - selectedProduct.price).toFixed(
                          2
                        )}{" "}
                        below average
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  New Price
                </Typography>
                <TextField
                  fullWidth
                  value={newPrice}
                  onChange={handlePriceChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    sx: {
                      borderRadius: "8px",
                      bgcolor: isDarkMode ? alpha("#fff", 0.05) : "white",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                          borderWidth: "2px",
                        },
                      },
                    },
                  }}
                  disabled={savingPrice}
                  autoFocus
                />

                {/* Price change indicator */}
                {newPrice && !isNaN(Number.parseFloat(newPrice)) && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {Number.parseFloat(newPrice) > selectedProduct.price ? (
                      <>
                        <TrendingUpIcon
                          sx={{
                            color: theme.palette.success.main,
                            fontSize: 16,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={theme.palette.success.main}
                        >
                          Price increase of $
                          {(
                            Number.parseFloat(newPrice) - selectedProduct.price
                          ).toFixed(2)}
                        </Typography>
                      </>
                    ) : Number.parseFloat(newPrice) < selectedProduct.price ? (
                      <>
                        <TrendingDownIcon
                          sx={{ color: theme.palette.error.main, fontSize: 16 }}
                        />
                        <Typography
                          variant="body2"
                          color={theme.palette.error.main}
                        >
                          Price decrease of $
                          {(
                            selectedProduct.price - Number.parseFloat(newPrice)
                          ).toFixed(2)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color={TEXT_SECONDARY}>
                        No price change
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              {/* Pricing recommendations */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: isDarkMode
                    ? alpha(THEME_COLOR, 0.1)
                    : alpha(THEME_COLOR, 0.05),
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Pricing Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Average price in this category: ${stats.averagePrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Recommended range: ${(stats.averagePrice * 0.9).toFixed(2)}{" "}
                  - ${(stats.averagePrice * 1.1).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: "auto",
                p: 3,
                borderTop: `1px solid ${alpha(
                  theme.palette.divider,
                  isDarkMode ? 0.2 : 0.1
                )}`,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={handleSavePrice}
                disabled={savingPrice}
                startIcon={
                  savingPrice ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  bgcolor: THEME_COLOR,
                  "&:hover": {
                    bgcolor: alpha(THEME_COLOR, 0.8),
                  },
                  borderRadius: "8px",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {savingPrice ? "Saving..." : "Save Price"}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: theme.shadows[6],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContentWrapper>
  );
};

export default ProductPricing;
