"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import { PRIMARY_COLOR } from "../../ProductAddition"

const ProductFormDialog = ({ open, editMode, product, categories, onClose, onSubmit }) => {
  const theme = useTheme()
  const [currentProduct, setCurrentProduct] = useState(product)
  const [showIngredientForm, setShowIngredientForm] = useState(false)
  const [currentIngredient, setCurrentIngredient] = useState({
    RawID: "",
    Name: "",
    RawConsume: 0,
    UnitMeasure: "g",
  })

  // Update local state when product prop changes
  React.useEffect(() => {
    setCurrentProduct(product)
  }, [product])

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
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setCurrentIngredient({
        ...currentIngredient,
        [name]: value,
      })
    }
  }

  // Add ingredient to current product
  const addIngredient = () => {
    // Validate ingredient
    if (!currentIngredient.RawID || !currentIngredient.Name || currentIngredient.RawConsume <= 0) {
      // Show error (could use a snackbar here)
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
    const updatedIngredients = [...(currentProduct.rawIngredients || [])]
    updatedIngredients.splice(index, 1)

    setCurrentProduct({
      ...currentProduct,
      rawIngredients: updatedIngredients,
    })
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!currentProduct.id || !currentProduct.name || currentProduct.price < 0 || !currentProduct.category) {
      // Show error (could use a snackbar here)
      return
    }

    onSubmit(currentProduct)
  }

  // Ensure category has a default value
  const categoryValue = currentProduct.category || (categories.length > 0 ? categories[0].id : "")

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          backgroundColor: alpha(PRIMARY_COLOR, 0.1),
          borderBottom: `1px solid ${alpha(PRIMARY_COLOR, 0.2)}`,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>
          {editMode ? "Edit Product" : "Add New Product"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {editMode
            ? "Update product details and ingredients"
            : "Fill in the details to add a new product to inventory"}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: PRIMARY_COLOR }}>
            Basic Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <TextField
              name="id"
              label="Product ID"
              value={currentProduct.id}
              onChange={handleInputChange}
              fullWidth
              disabled={editMode}
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: PRIMARY_COLOR,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.3),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            />
            <TextField
              name="name"
              label="Product Name"
              value={currentProduct.name}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: PRIMARY_COLOR,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.3),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={currentProduct.price}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: "$",
                sx: { borderRadius: 1.5 },
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: PRIMARY_COLOR,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.3),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            />
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={currentProduct.stock}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: PRIMARY_COLOR,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.3),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: PRIMARY_COLOR,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.3),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(PRIMARY_COLOR, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={categoryValue}
                onChange={handleInputChange}
                required
                label="Category"
                sx={{ borderRadius: 1.5 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: alpha(PRIMARY_COLOR, 0.2) }} />

        {/* Raw Ingredients Section */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>
              Raw Ingredients
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowIngredientForm(true)}
              size="small"
              sx={{
                borderRadius: 1.5,
                px: 2,
                color: PRIMARY_COLOR,
                borderColor: alpha(PRIMARY_COLOR, 0.5),
                "&:hover": {
                  borderColor: PRIMARY_COLOR,
                  backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                },
              }}
            >
              Add Ingredient
            </Button>
          </Box>

          {showIngredientForm && (
            <Fade in={showIngredientForm}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  borderColor: alpha(PRIMARY_COLOR, 0.3),
                  backgroundColor: alpha(PRIMARY_COLOR, 0.05),
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: PRIMARY_COLOR }}>
                  New Ingredient
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <TextField
                    name="RawID"
                    label="Ingredient ID"
                    type="number"
                    value={currentIngredient.RawID}
                    onChange={handleIngredientChange}
                    fullWidth
                    required
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1.5 },
                    }}
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.3),
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: PRIMARY_COLOR,
                        },
                      },
                    }}
                  />
                  <TextField
                    name="Name"
                    label="Ingredient Name"
                    value={currentIngredient.Name}
                    onChange={handleIngredientChange}
                    fullWidth
                    required
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1.5 },
                    }}
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.3),
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: PRIMARY_COLOR,
                        },
                      },
                    }}
                  />
                  <TextField
                    name="RawConsume"
                    label="Quantity"
                    type="number"
                    value={currentIngredient.RawConsume}
                    onChange={handleIngredientChange}
                    fullWidth
                    required
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1.5 },
                    }}
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.3),
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: PRIMARY_COLOR,
                        },
                      },
                    }}
                  />
                  <FormControl
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.3),
                        },
                        "&:hover fieldset": {
                          borderColor: alpha(PRIMARY_COLOR, 0.5),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: PRIMARY_COLOR,
                        },
                      },
                    }}
                  >
                    <InputLabel id="unit-label">Unit</InputLabel>
                    <Select
                      labelId="unit-label"
                      name="UnitMeasure"
                      value={currentIngredient.UnitMeasure}
                      onChange={handleIngredientChange}
                      label="Unit"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem key="g" value="g">
                        Grams (g)
                      </MenuItem>
                      <MenuItem key="kg" value="kg">
                        Kilograms (kg)
                      </MenuItem>
                      <MenuItem key="ml" value="ml">
                        Milliliters (ml)
                      </MenuItem>
                      <MenuItem key="l" value="l">
                        Liters (l)
                      </MenuItem>
                      <MenuItem key="pcs" value="pcs">
                        Pieces (pcs)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                  <Button onClick={() => setShowIngredientForm(false)} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={addIngredient}
                    sx={{
                      px: 3,
                      borderRadius: 1.5,
                      backgroundColor: PRIMARY_COLOR,
                      "&:hover": {
                        backgroundColor: alpha(PRIMARY_COLOR, 0.9),
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Paper>
            </Fade>
          )}

          {currentProduct.rawIngredients && currentProduct.rawIngredients.length > 0 ? (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 2,
                maxHeight: 300,
                overflow: "auto",
                borderColor: alpha(PRIMARY_COLOR, 0.3),
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>Unit</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProduct.rawIngredients.map((ingredient, index) => (
                    <TableRow
                      key={`ingredient-${index}`}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha(PRIMARY_COLOR, 0.05),
                        },
                      }}
                    >
                      <TableCell>{ingredient.RawID}</TableCell>
                      <TableCell>{ingredient.Name}</TableCell>
                      <TableCell>{ingredient.RawConsume}</TableCell>
                      <TableCell>{ingredient.UnitMeasure}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeIngredient(index)}
                          sx={{
                            backgroundColor: alpha("#f44336", 0.1),
                            "&:hover": {
                              backgroundColor: alpha("#f44336", 0.2),
                            },
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
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                borderStyle: "dashed",
                borderColor: alpha(PRIMARY_COLOR, 0.3),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 40, color: alpha(PRIMARY_COLOR, 0.6), mb: 1 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                No ingredients added yet. Add ingredients to specify what raw materials are needed for this product.
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(PRIMARY_COLOR, 0.2)}` }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            px: 3,
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 1.5,
            px: 3,
            fontWeight: 600,
            backgroundColor: PRIMARY_COLOR,
            "&:hover": {
              backgroundColor: alpha(PRIMARY_COLOR, 0.9),
            },
          }}
        >
          {editMode ? "Update" : "Add"} Product
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductFormDialog
