"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  Autocomplete,
  Avatar,
  useTheme,
  alpha,
  useMediaQuery,
  Badge,
  Fade,
  Zoom,
  Skeleton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"
import InventoryIcon from "@mui/icons-material/Inventory"
import CategoryIcon from "@mui/icons-material/Category"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import InfoIcon from "@mui/icons-material/Info"
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"
import WarningIcon from "@mui/icons-material/Warning"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import SearchIcon from "@mui/icons-material/Search"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ReceiptIcon from "@mui/icons-material/Receipt"
import axios from "axios"
import MainContentWrapper from "./MainContentWrapper"

// Base URL for API calls
const API_BASE_URL = "http://localhost:5002/api/menu"

// Brand color
const BRAND_COLOR = "#f15a22"

const ProductAddition = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isMedium = useMediaQuery(theme.breakpoints.down("md"))

  // Theme-aware colors
  const THEME_COLOR = BRAND_COLOR
  const THEME_COLOR_LIGHT = alpha(BRAND_COLOR, 0.1)
  const THEME_COLOR_LIGHTER = alpha(BRAND_COLOR, 0.05)
  const THEME_COLOR_DARK = "#d94a1a"
  const BG_COLOR = theme.palette.mode === "dark" ? theme.palette.background.default : "#f9f9f9"
  const CARD_BG = theme.palette.background.paper
  const TEXT_PRIMARY = theme.palette.text.primary
  const TEXT_SECONDARY = theme.palette.text.secondary
  const BORDER_COLOR = theme.palette.mode === "dark" ? alpha(theme.palette.divider, 0.3) : "#eee"
  const TABLE_HOVER_COLOR = theme.palette.mode === "dark" ? alpha(BRAND_COLOR, 0.1) : "#fff8f5"
  const TABLE_ODD_ROW = theme.palette.mode === "dark" ? alpha(theme.palette.background.paper, 0.6) : "#fafafa"

  // State for products and categories
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [rawIngredients, setRawIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    totalValue: 0,
  })

  // State for form handling
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    name: "",
    price: 0,
    stock: 0,
    category: "",
    categoryName: "",
    rawIngredients: [],
  })

  // State for raw ingredient form
  const [showIngredientForm, setShowIngredientForm] = useState(false)
  const [currentIngredient, setCurrentIngredient] = useState({
    RawID: "",
    Name: "",
    RawConsume: 0,
    UnitMeasure: "g",
  })
  const [loadingIngredients, setLoadingIngredients] = useState(false)

  // State for operations
  const [processingAction, setProcessingAction] = useState(null)
  const [actionItemId, setActionItemId] = useState(null)

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products

    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        (product.categoryName && product.categoryName.toLowerCase().includes(query)),
    )
  }, [products, searchQuery])

  // Calculate statistics from products
  const calculateStats = (productList) => {
    const stats = {
      totalProducts: productList.length,
      outOfStock: productList.filter((p) => p.stock === 0).length,
      lowStock: productList.filter((p) => p.stock > 0 && p.stock <= 10).length,
      totalValue: productList.reduce((sum, p) => sum + p.price * p.stock, 0),
    }
    setStats(stats)
  }

  // Fetch raw ingredients from backend
  const fetchRawIngredients = async () => {
    try {
      setLoadingIngredients(true)
      const response = await axios.get(`${API_BASE_URL}/bom`)
      setRawIngredients(response.data)
      setLoadingIngredients(false)
    } catch (err) {
      console.error("Error fetching raw ingredients:", err)
      setSnackbar({
        open: true,
        message: "Failed to load ingredients. Please try again.",
        severity: "error",
      })
      setLoadingIngredients(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories, products, and raw ingredients in parallel
        const [categoriesResponse, productsResponse, rawIngredientsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories`),
          axios.get(`${API_BASE_URL}/finishedgoods`),
          axios.get(`${API_BASE_URL}/bom`),
        ])

        const fetchedCategories = categoriesResponse.data
        setCategories(fetchedCategories)

        // Create category options for Autocomplete - include both objects and strings
        const options = fetchedCategories.map((cat) => ({
          id: cat._id,
          label: cat.name,
          type: "existing",
        }))
        setCategoryOptions(options)

        const fetchedProducts = productsResponse.data
        setProducts(fetchedProducts)
        calculateStats(fetchedProducts)

        setRawIngredients(rawIngredientsResponse.data)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle dialog open/close
  const handleClickOpen = () => {
    setOpen(true)
    setEditMode(false)
    setCurrentProduct({
      id: generateId(),
      name: "",
      price: 0,
      stock: 0,
      category: "",
      categoryName: "",
      rawIngredients: [],
    })
  }

  const handleClose = () => {
    setOpen(false)
    setShowIngredientForm(false)
  }

  // Generate a unique ID for new products
  const generateId = () => {
    return (
      "FG" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
    )
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Convert price and stock to numbers
    if (name === "price" || name === "stock") {
      setCurrentProduct({
        ...currentProduct,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value,
      })
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle category change from Autocomplete
  const handleCategoryChange = (event, newValue) => {
    if (!newValue) {
      setCurrentProduct({
        ...currentProduct,
        category: "",
        categoryName: "",
      })
      return
    }

    if (typeof newValue === "string") {
      // User entered a custom category
      setCurrentProduct({
        ...currentProduct,
        category: "",
        categoryName: newValue,
      })
    } else if (newValue.type === "existing") {
      // User selected an existing category
      setCurrentProduct({
        ...currentProduct,
        category: newValue.id,
        categoryName: newValue.label,
      })
    } else {
      // User created a new category option
      setCurrentProduct({
        ...currentProduct,
        category: "",
        categoryName: newValue.label,
      })
    }
  }

  // Handle raw ingredient selection
  const handleRawIngredientChange = (event, selectedIngredient) => {
    if (selectedIngredient) {
      setCurrentIngredient({
        ...currentIngredient,
        RawID: selectedIngredient.id || selectedIngredient.RawID,
        Name: selectedIngredient.name || selectedIngredient.Name,
      })
    } else {
      setCurrentIngredient({
        ...currentIngredient,
        RawID: "",
        Name: "",
      })
    }
  }

  // Handle ingredient form input changes
  const handleIngredientChange = (e) => {
    const { name, value } = e.target

    if (name === "RawConsume") {
      setCurrentIngredient({
        ...currentIngredient,
        [name]: Number.parseFloat(value) || 0,
      })
    } else if (name === "RawID") {
      setCurrentIngredient({
        ...currentIngredient,
        [name]: value,
      })
    } else {
      setCurrentIngredient({
        ...currentIngredient,
        [name]: value,
      })
    }
  }

  // Handle unit measure change
  const handleUnitMeasureChange = (e) => {
    setCurrentIngredient({
      ...currentIngredient,
      UnitMeasure: e.target.value,
    })
  }

  // Add ingredient to current product
  const addIngredient = () => {
    // Validate ingredient
    if (!currentIngredient.RawID || !currentIngredient.Name || currentIngredient.RawConsume <= 0) {
      setSnackbar({
        open: true,
        message: "Please fill all ingredient fields correctly",
        severity: "error",
      })
      return
    }

    // Add ingredient to current product
    setCurrentProduct({
      ...currentProduct,
      rawIngredients: [...(currentProduct.rawIngredients || []), { ...currentIngredient }],
    })

    // Reset ingredient form
    setCurrentIngredient({
      RawID: "",
      Name: "",
      RawConsume: 0,
      UnitMeasure: "g",
    })

    setShowIngredientForm(false)
  }

  // Remove ingredient from current product
  const removeIngredient = (index) => {
    if (!currentProduct.rawIngredients) return

    const updatedIngredients = [...currentProduct.rawIngredients]
    updatedIngredients.splice(index, 1)

    setCurrentProduct({
      ...currentProduct,
      rawIngredients: updatedIngredients,
    })
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!currentProduct.id || !currentProduct.name || (currentProduct.price || 0) < 0) {
        setSnackbar({
          open: true,
          message: "Please fill all required fields",
          severity: "error",
        })
        return
      }

      // Ensure we have either a category ID or a category name
      if (!currentProduct.category && !currentProduct.categoryName) {
        setSnackbar({
          open: true,
          message: "Please select or enter a category",
          severity: "error",
        })
        return
      }

      // Prepare the product data for submission
      const productData = { ...currentProduct }

      if (editMode) {
        // Set processing state
        setProcessingAction("update")
        setActionItemId(currentProduct._id || null)

        // Update existing product
        const response = await axios.put(`${API_BASE_URL}/finishedgoods/${currentProduct._id}`, productData)

        // Update local state with the response data
        const updatedProducts = products.map((product) =>
          product._id === currentProduct._id ? response.data : product,
        )
        setProducts(updatedProducts)
        calculateStats(updatedProducts)

        setSnackbar({
          open: true,
          message: "Product updated successfully",
          severity: "success",
        })
      } else {
        // Set processing state
        setProcessingAction("create")

        // Create new product
        const response = await axios.post(`${API_BASE_URL}/finishedgoods`, productData)

        // Update local state with the response that includes the MongoDB _id
        const updatedProducts = [...products, response.data]
        setProducts(updatedProducts)
        calculateStats(updatedProducts)

        setSnackbar({
          open: true,
          message: "Product added successfully",
          severity: "success",
        })
      }

      // Clear processing state
      setProcessingAction(null)
      setActionItemId(null)
      handleClose()
    } catch (err) {
      console.error("Error saving product:", err)
      setSnackbar({
        open: true,
        message: `Failed to save product: ${err.response?.data?.message || err.message || "Unknown error"}`,
        severity: "error",
      })
      setProcessingAction(null)
      setActionItemId(null)
    }
  }

  // Handle edit product
  const handleEdit = (product) => {
    // Ensure the product has categoryName if it has a category
    const productToEdit = { ...product }
    if (product.category && !product.categoryName) {
      const category = categories.find((cat) => cat._id === product.category)
      if (category) {
        productToEdit.categoryName = category.name
      }
    }

    setCurrentProduct(productToEdit)
    setEditMode(true)
    setOpen(true)
  }

  // Handle delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Set processing state
        setProcessingAction("delete")
        setActionItemId(id)

        // Delete product from backend
        await axios.delete(`${API_BASE_URL}/finishedgoods/${id}`)

        // Update local state
        const updatedProducts = products.filter((product) => product._id !== id)
        setProducts(updatedProducts)
        calculateStats(updatedProducts)

        setSnackbar({
          open: true,
          message: "Product deleted successfully",
          severity: "success",
        })
      } catch (err) {
        console.error("Error deleting product:", err)
        setSnackbar({
          open: true,
          message: `Failed to delete product: ${err.response?.data?.message || err.message || "Unknown error"}`,
          severity: "error",
        })
      } finally {
        // Clear processing state
        setProcessingAction(null)
        setActionItemId(null)
      }
    }
  }

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  // Get category display (either from categoryName or by looking up the ID)
  const getCategoryDisplay = (product) => {
    if (product.categoryName) {
      return product.categoryName
    }
    return getCategoryName(product.category)
  }

  // Show ingredient form and fetch ingredients if needed
  const handleShowIngredientForm = () => {
    setShowIngredientForm(true)
    if (rawIngredients.length === 0) {
      fetchRawIngredients()
    }
  }

  // Render loading state
  if (loading) {
    return (
      <MainContentWrapper open={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "auto",
            bgcolor: BG_COLOR,
            p: { xs: 2, sm: 3 },
            gap: 3,
          }}
        >
          {/* Header Skeleton */}
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, width: "100%" }} animation="wave" />

          {/* Stats Skeletons */}
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2, flex: "1 1 200px", minWidth: { xs: "100%", sm: "200px" } }}
                animation="wave"
              />
            ))}
          </Box>

          {/* Table Skeleton */}
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 2, width: "100%", flexGrow: 1 }}
            animation="wave"
          />
        </Box>
      </MainContentWrapper>
    )
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
              "&:hover": { bgcolor: THEME_COLOR_DARK },
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
    )
  }

  return (
    <MainContentWrapper open={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
          bgcolor: BG_COLOR,
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Header Section */}
        <Card
          elevation={1}
          sx={{
            mb: 3,
            borderRadius: 2,
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                p: 3,
                bgcolor: CARD_BG,
                borderLeft: `4px solid ${THEME_COLOR}`,
                gap: { xs: 2, sm: 0 },
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "150px",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${alpha(THEME_COLOR, 0.03)})`,
                  display: { xs: "none", md: "block" },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", zIndex: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: THEME_COLOR,
                    width: 56,
                    height: 56,
                    mr: 2,
                    boxShadow: `0 0 0 4px ${alpha(THEME_COLOR, 0.2)}`,
                  }}
                >
                  <RestaurantMenuIcon sx={{ fontSize: 28 }} />
                </Avatar>
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
                        width: "40%",
                        height: 3,
                        bgcolor: THEME_COLOR,
                        borderRadius: 4,
                      },
                    }}
                  >
                    Product Addition
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Manage your menu items, prices, ingredients, and inventory
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                sx={{
                  bgcolor: THEME_COLOR,
                  "&:hover": { bgcolor: THEME_COLOR_DARK },
                  borderRadius: "8px",
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  alignSelf: { xs: "stretch", sm: "auto" },
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(THEME_COLOR, 0.3)}`,
                  zIndex: 1,
                  transition: "all 0.2s",
                  "&:active": {
                    transform: "translateY(2px)",
                    boxShadow: `0 2px 6px ${alpha(THEME_COLOR, 0.3)}`,
                  },
                }}
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
              >
                ADD NEW PRODUCT
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Zoom in={true} style={{ transitionDelay: "100ms" }}>
            <Card
              elevation={1}
              sx={{
                borderRadius: 2,
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: "200px" },
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: THEME_COLOR,
                        width: 40,
                        height: 40,
                        mr: 1.5,
                        boxShadow: `0 0 0 3px ${alpha(THEME_COLOR, 0.2)}`,
                      }}
                    >
                      <InventoryIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Total Products
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: THEME_COLOR,
                      mb: 1,
                      mt: 1,
                      textShadow: `0 2px 4px ${alpha(THEME_COLOR, 0.2)}`,
                    }}
                  >
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items in your inventory
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          <Zoom in={true} style={{ transitionDelay: "200ms" }}>
            <Card
              elevation={1}
              sx={{
                borderRadius: 2,
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: "200px" },
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.error.main,
                        width: 40,
                        height: 40,
                        mr: 1.5,
                        boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.2)}`,
                      }}
                    >
                      <WarningIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Out of Stock
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.error.main,
                      mb: 1,
                      mt: 1,
                      textShadow: `0 2px 4px ${alpha(theme.palette.error.main, 0.2)}`,
                    }}
                  >
                    {stats.outOfStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products needing restock
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          <Zoom in={true} style={{ transitionDelay: "300ms" }}>
            <Card
              elevation={1}
              sx={{
                borderRadius: 2,
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: "200px" },
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        width: 40,
                        height: 40,
                        mr: 1.5,
                        boxShadow: `0 0 0 3px ${alpha(theme.palette.warning.main, 0.2)}`,
                      }}
                    >
                      <InfoIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Low Stock
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.warning.main,
                      mb: 1,
                      mt: 1,
                      textShadow: `0 2px 4px ${alpha(theme.palette.warning.main, 0.2)}`,
                    }}
                  >
                    {stats.lowStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products with 10 or fewer units
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          <Zoom in={true} style={{ transitionDelay: "400ms" }}>
            <Card
              elevation={1}
              sx={{
                borderRadius: 2,
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: "200px" },
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.success.main,
                        width: 40,
                        height: 40,
                        mr: 1.5,
                        boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.2)}`,
                      }}
                    >
                      <AttachMoneyIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Inventory Value
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.success.main,
                      mb: 1,
                      mt: 1,
                      textShadow: `0 2px 4px ${alpha(theme.palette.success.main, 0.2)}`,
                    }}
                  >
                    ${stats.totalValue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total value of current stock
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Box>

        {/* Products Table Card */}
        <Card
          elevation={1}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            flexGrow: 1,
            transition: "box-shadow 0.2s",
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              p: 2,
              pl: 3,
              bgcolor: CARD_BG,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              gap: 2,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "2px",
                background: `linear-gradient(90deg, ${THEME_COLOR}, transparent)`,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Badge
                badgeContent={filteredProducts.length}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: THEME_COLOR,
                    fontWeight: "bold",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(THEME_COLOR, 0.1),
                    color: THEME_COLOR,
                    width: 40,
                    height: 40,
                    mr: 0,
                  }}
                >
                  <ShoppingBasketIcon fontSize="small" />
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
                  Product Inventory
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {filteredProducts.length} of {stats.totalProducts} products
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}>
              <TextField
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: TEXT_SECONDARY }} />,
                  sx: {
                    borderRadius: "8px",
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
                sx={{
                  flexGrow: 1,
                  maxWidth: { xs: "100%", md: "300px" },
                }}
              />
              {/* <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                sx={{
                  color: THEME_COLOR,
                  borderColor: THEME_COLOR,
                  "&:hover": {
                    borderColor: THEME_COLOR_DARK,
                    bgcolor: THEME_COLOR_LIGHT,
                    transform: "translateY(-2px)",
                  },
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                ADD PRODUCT
              </Button> */}
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: "calc(100vh - 400px)", minHeight: "200px" }}>
            <Table stickyHeader aria-label="product table">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.background.default : "#fafafa",
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      fontWeight: "bold",
                      color: TEXT_PRIMARY,
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Ingredients</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <InventoryIcon sx={{ fontSize: 48, color: TEXT_SECONDARY }} />
                        <Typography variant="h6" sx={{ color: TEXT_SECONDARY }}>
                          {searchQuery ? "No matching products found" : "No products found"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: TEXT_SECONDARY, maxWidth: 400, textAlign: "center" }}>
                          {searchQuery
                            ? "Try adjusting your search criteria"
                            : "Add a new product to get started with your inventory management"}
                        </Typography>
                        {!searchQuery && (
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleClickOpen}
                            sx={{
                              mt: 1,
                              color: THEME_COLOR,
                              borderColor: THEME_COLOR,
                              "&:hover": { borderColor: THEME_COLOR_DARK, bgcolor: THEME_COLOR_LIGHT },
                              borderRadius: "8px",
                            }}
                          >
                            Add First Product
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product._id}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: TABLE_ODD_ROW },
                        "&:hover": { bgcolor: TABLE_HOVER_COLOR },
                        transition: "background-color 0.2s",
                        position: "relative",
                        ...(processingAction === "delete" &&
                          actionItemId === product._id && {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }),
                        ...(processingAction === "update" &&
                          actionItemId === product._id && {
                            bgcolor: alpha(THEME_COLOR, 0.05),
                          }),
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: "medium",
                            color: THEME_COLOR,
                            display: "inline-block",
                            bgcolor: alpha(THEME_COLOR, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {product.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium" }}>{product.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={`$${product.price.toFixed(2)}`}
                          size="small"
                          sx={{
                            bgcolor: THEME_COLOR_LIGHT,
                            color: THEME_COLOR,
                            fontWeight: "bold",
                            border: `1px solid ${THEME_COLOR}`,
                            borderRadius: "4px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor:
                              product.stock > 10
                                ? alpha(theme.palette.success.main, 0.1)
                                : product.stock > 0
                                  ? alpha(theme.palette.warning.main, 0.1)
                                  : alpha(theme.palette.error.main, 0.1),
                            color:
                              product.stock > 10
                                ? theme.palette.success.main
                                : product.stock > 0
                                  ? theme.palette.warning.main
                                  : theme.palette.error.main,
                          }}
                        >
                          {product.stock > 0 ? (
                            <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          ) : (
                            <WarningIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          )}
                          {product.stock}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CategoryIcon sx={{ fontSize: "16px !important" }} />}
                          label={getCategoryDisplay(product)}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.background.default, 0.6),
                            borderRadius: "4px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {product.rawIngredients && product.rawIngredients.length > 0 ? (
                          <Tooltip
                            title={
                              <Box sx={{ p: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                                  Ingredients:
                                </Typography>
                                {product.rawIngredients.map((ing, i) => (
                                  <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                                    • {ing.Name}: {ing.RawConsume} {ing.UnitMeasure}
                                  </Typography>
                                ))}
                              </Box>
                            }
                          >
                            <Chip
                              label={`${product.rawIngredients.length} ingredients`}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.background.default, 0.6),
                                "&:hover": { bgcolor: alpha(theme.palette.background.default, 0.8) },
                                borderRadius: "4px",
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" sx={{ color: TEXT_SECONDARY, fontStyle: "italic" }}>
                            No ingredients
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          sx={{
                            color: THEME_COLOR,
                            "&:hover": {
                              bgcolor: THEME_COLOR_LIGHT,
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s",
                          }}
                          onClick={() => handleEdit(product)}
                          size="small"
                          disabled={processingAction === "delete" && actionItemId === product._id}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(product._id)}
                          size="small"
                          sx={{
                            "&:hover": {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s",
                            ml: 1,
                          }}
                          disabled={processingAction === "delete" && actionItemId === product._id}
                        >
                          {processingAction === "delete" && actionItemId === product._id ? (
                            <CircularProgress size={20} color="error" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: theme.shadows[10],
          },
        }}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle
          sx={{
            bgcolor: THEME_COLOR,
            color: "white",
            py: 2,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {editMode ? (
            <>
              <EditIcon sx={{ mr: 1 }} /> Edit Product: {currentProduct.name}
            </>
          ) : (
            <>
              <AddIcon sx={{ mr: 1 }} /> Add New Product
            </>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: CARD_BG }}>
          <Box sx={{ mt: 1 }}>
            {/* Basic Information Card */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                mb: 3,
                overflow: "hidden",
                borderColor: alpha(THEME_COLOR, 0.2),
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: `0 0 0 1px ${alpha(THEME_COLOR, 0.2)}`,
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : "#f9f9f9",
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  px: 3,
                  py: 2,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    width: "60px",
                    height: "2px",
                    bgcolor: THEME_COLOR,
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                  <ReceiptIcon sx={{ mr: 1, color: THEME_COLOR }} /> Basic Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter the core details of your product
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <TextField
                    name="id"
                    label="Product ID"
                    value={currentProduct.id}
                    onChange={handleInputChange}
                    sx={{
                      flex: "1 1 200px",
                      minWidth: "200px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: editMode ? TEXT_SECONDARY : THEME_COLOR,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: editMode ? TEXT_SECONDARY : THEME_COLOR,
                        },
                      },
                    }}
                    disabled={editMode}
                    required
                    InputLabelProps={{ sx: { color: editMode ? TEXT_SECONDARY : THEME_COLOR } }}
                    inputProps={{
                      sx: { fontFamily: "monospace" },
                    }}
                    helperText="Unique identifier for this product"
                  />
                  <TextField
                    name="name"
                    label="Product Name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    sx={{
                      flex: "1 1 300px",
                      minWidth: "300px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                      },
                    }}
                    required
                    InputLabelProps={{ sx: { color: THEME_COLOR } }}
                    helperText="Name as it will appear on the menu"
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  <TextField
                    name="price"
                    label="Price"
                    type="number"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    sx={{
                      flex: "1 1 200px",
                      minWidth: "200px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                      },
                    }}
                    required
                    InputProps={{
                      startAdornment: "$",
                    }}
                    InputLabelProps={{ sx: { color: THEME_COLOR } }}
                    helperText="Selling price of the product"
                  />
                  <TextField
                    name="stock"
                    label="Stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                    sx={{
                      flex: "1 1 200px",
                      minWidth: "200px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: THEME_COLOR,
                        },
                      },
                    }}
                    InputLabelProps={{ sx: { color: THEME_COLOR } }}
                    helperText="Current inventory quantity"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Autocomplete
                    freeSolo
                    options={categoryOptions}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option
                      }
                      return option.label || ""
                    }}
                    value={
                      currentProduct.categoryName ||
                      (currentProduct.category
                        ? categoryOptions.find((opt) => opt.id === currentProduct.category)
                        : null)
                    }
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        required
                        InputLabelProps={{ sx: { color: THEME_COLOR } }}
                        helperText="Select an existing category or type a new one"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: THEME_COLOR,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: THEME_COLOR,
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Card>

            {/* Ingredients Card */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                borderColor: alpha(THEME_COLOR, 0.2),
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: `0 0 0 1px ${alpha(THEME_COLOR, 0.2)}`,
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : "#f9f9f9",
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  px: 3,
                  py: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    width: "60px",
                    height: "2px",
                    bgcolor: THEME_COLOR,
                  },
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                    <LocalShippingIcon sx={{ mr: 1, color: THEME_COLOR }} /> Raw Ingredients
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Specify what raw materials are needed for this product
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleShowIngredientForm}
                  size="small"
                  sx={{
                    color: THEME_COLOR,
                    borderColor: THEME_COLOR,
                    "&:hover": {
                      borderColor: THEME_COLOR_DARK,
                      bgcolor: THEME_COLOR_LIGHT,
                      transform: "translateY(-2px)",
                    },
                    borderRadius: "8px",
                    transition: "all 0.2s",
                  }}
                >
                  Add Ingredient
                </Button>
              </Box>
              <Box sx={{ p: 3 }}>
                {showIngredientForm && (
                  <Fade in={showIngredientForm}>
                    <Box
                      sx={{
                        p: 3,
                        border: `1px solid ${alpha(THEME_COLOR, 0.2)}`,
                        borderRadius: 2,
                        mb: 3,
                        bgcolor:
                          theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.2) : "#fafafa",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "4px",
                          height: "100%",
                          bgcolor: THEME_COLOR,
                          borderRadius: "4px 0 0 4px",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 2,
                          color: THEME_COLOR,
                          fontWeight: "medium",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <AddIcon sx={{ mr: 1, fontSize: 18 }} /> New Ingredient
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Autocomplete
                          options={rawIngredients}
                          getOptionLabel={(option) =>
                            `${option.name || option.Name} (ID: ${option.id || option.RawID})`
                          }
                          loading={loadingIngredients}
                          onChange={handleRawIngredientChange}
                          sx={{ flex: "1 1 300px", minWidth: "300px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Ingredient"
                              required
                              size="small"
                              InputLabelProps={{ sx: { color: THEME_COLOR } }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingIngredients ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: THEME_COLOR,
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: THEME_COLOR,
                                  },
                                },
                              }}
                            />
                          )}
                        />
                        <TextField
                          name="RawConsume"
                          label="Quantity"
                          type="number"
                          value={currentIngredient.RawConsume}
                          onChange={handleIngredientChange}
                          sx={{
                            flex: "1 1 100px",
                            minWidth: "100px",
                            "& .MuiOutlinedInput-root": {
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: THEME_COLOR,
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: THEME_COLOR,
                              },
                            },
                          }}
                          required
                          size="small"
                          InputLabelProps={{ sx: { color: THEME_COLOR } }}
                        />
                        <FormControl
                          sx={{
                            flex: "1 1 100px",
                            minWidth: "100px",
                            "& .MuiOutlinedInput-root": {
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: THEME_COLOR,
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: THEME_COLOR,
                              },
                            },
                          }}
                          size="small"
                        >
                          <InputLabel id="unit-label" sx={{ color: THEME_COLOR }}>
                            Unit
                          </InputLabel>
                          <Select
                            labelId="unit-label"
                            name="UnitMeasure"
                            value={currentIngredient.UnitMeasure}
                            onChange={handleUnitMeasureChange}
                            label="Unit"
                          >
                            <MenuItem value="g">Grams (g)</MenuItem>
                            <MenuItem value="kg">Kilograms (kg)</MenuItem>
                            <MenuItem value="ml">Milliliters (ml)</MenuItem>
                            <MenuItem value="l">Liters (l)</MenuItem>
                            <MenuItem value="pcs">Pieces (pcs)</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                          onClick={() => setShowIngredientForm(false)}
                          sx={{
                            mr: 1,
                            color: TEXT_SECONDARY,
                            "&:hover": {
                              bgcolor: alpha(TEXT_SECONDARY, 0.1),
                            },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={addIngredient}
                          sx={{
                            bgcolor: THEME_COLOR,
                            "&:hover": {
                              bgcolor: THEME_COLOR_DARK,
                              transform: "translateY(-2px)",
                            },
                            borderRadius: "8px",
                            boxShadow: `0 4px 8px ${alpha(THEME_COLOR, 0.3)}`,
                            transition: "all 0.2s",
                            "&:active": {
                              transform: "translateY(2px)",
                              boxShadow: `0 2px 4px ${alpha(THEME_COLOR, 0.3)}`,
                            },
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                )}

                {currentProduct.rawIngredients && currentProduct.rawIngredients.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${BORDER_COLOR}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            "& th": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.background.default, 0.4)
                                  : "#fafafa",
                              borderBottom: `1px solid ${BORDER_COLOR}`,
                              fontWeight: "bold",
                              color: TEXT_PRIMARY,
                            },
                          }}
                        >
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Unit</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentProduct.rawIngredients.map((ingredient, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:nth-of-type(odd)": { bgcolor: TABLE_ODD_ROW },
                              "&:hover": { bgcolor: TABLE_HOVER_COLOR },
                              transition: "background-color 0.2s",
                            }}
                          >
                            <TableCell sx={{ color: THEME_COLOR, fontFamily: "monospace" }}>
                              {ingredient.RawID}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "medium" }}>{ingredient.Name}</TableCell>
                            <TableCell>{ingredient.RawConsume}</TableCell>
                            <TableCell>{ingredient.UnitMeasure}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeIngredient(index)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s",
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.2) : "#f5f5f5",
                      textAlign: "center",
                      border: `1px dashed ${BORDER_COLOR}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <InventoryIcon sx={{ color: TEXT_SECONDARY, fontSize: 32 }} />
                    <Typography variant="body2" color="text.secondary">
                      No ingredients added yet. Add ingredients to specify what raw materials are needed for this
                      product.
                    </Typography>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={handleShowIngredientForm}
                      size="small"
                      sx={{
                        color: THEME_COLOR,
                        mt: 1,
                        "&:hover": {
                          bgcolor: THEME_COLOR_LIGHTER,
                        },
                      }}
                    >
                      Add First Ingredient
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.background.default, 0.4) : "#fafafa",
            borderTop: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: TEXT_SECONDARY,
              "&:hover": {
                bgcolor: alpha(TEXT_SECONDARY, 0.1),
              },
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={processingAction === "create" || processingAction === "update"}
            sx={{
              bgcolor: THEME_COLOR,
              "&:hover": {
                bgcolor: THEME_COLOR_DARK,
                transform: "translateY(-2px)",
              },
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
              boxShadow: `0 4px 8px ${alpha(THEME_COLOR, 0.3)}`,
              transition: "all 0.2s",
              "&:active": {
                transform: "translateY(2px)",
                boxShadow: `0 2px 4px ${alpha(THEME_COLOR, 0.3)}`,
              },
            }}
            startIcon={
              processingAction === "create" || processingAction === "update" ? (
                <CircularProgress size={20} color="inherit" />
              ) : editMode ? (
                <EditIcon />
              ) : (
                <AddIcon />
              )
            }
          >
            {editMode ? "Update" : "Add"} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: theme.shadows[6],
            ...(snackbar.severity === "success" && {
              bgcolor:
                theme.palette.mode === "dark" ? alpha(theme.palette.success.main, 0.8) : theme.palette.success.main,
            }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContentWrapper>
  )
}

export default ProductAddition
