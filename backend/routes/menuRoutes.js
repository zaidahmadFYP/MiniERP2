const express = require("express")
const router = express.Router()
const MenuItem = require("../models/menuItem")
const MenuCategory = require("../models/menuCategory")
const FinishedGoods = require("../models/finishedGoods")
const BOM = require("../models/bom")
const mongoose = require("mongoose")

// Get all menu categories with their items
router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuCategory.find().sort("order")
    const items = await MenuItem.find({ isAvailable: true }).populate("category")

    const menuData = categories.map((category) => ({
      id: category.id,
      name: category.name,
      columns: category.columns,
      smallText: category.smallText,
      items: items
        .filter((item) => item.category && item.category._id.toString() === category._id.toString())
        .map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          isPizza: item.isPizza,
        })),
    }))

    res.json(menuData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/finishedgoods", async (req, res) => {
  try {
    // Populate the category field to get category information
    const finishedGoods = await FinishedGoods.find().populate("category", "name id _id")

    // Map the data to ensure consistent format for frontend
    const mappedGoods = finishedGoods.map((item) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      price: item.price || 0,
      stock: item.stock || 0,
      category: item.category ? item.category._id : null, // Use category._id for consistency
      categoryName: item.category ? item.category.name : "Uncategorized",
      rawIngredients: item.rawIngredients,
    }))

    res.json(mappedGoods)
  } catch (error) {
    console.error("Error fetching FinishedGoods:", error)
    res.status(500).json({ message: "Error fetching FinishedGoods" })
  }
})

// Add new route to create a new finished good
router.post("/finishedgoods", async (req, res) => {
  try {
    const productData = req.body

    // Create a new FinishedGoods document
    const newProduct = new FinishedGoods({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      category: productData.category || null,
      rawIngredients: productData.rawIngredients || [],
    })

    // If there's a categoryName but no category ID, try to find or create the category
    if (!productData.category && productData.categoryName) {
      // Try to find an existing category with this name
      let category = await MenuCategory.findOne({ name: productData.categoryName })

      // If category doesn't exist, create a new one
      if (!category) {
        category = new MenuCategory({
          name: productData.categoryName,
          id: `CAT${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          order: 999, // Default order at the end
        })
        await category.save()
      }

      // Set the category ID on the product
      newProduct.category = category._id
    }

    // Save the product
    const savedProduct = await newProduct.save()

    // Populate the category information for the response
    const populatedProduct = await FinishedGoods.findById(savedProduct._id).populate("category", "name id _id")

    // Format the response to match the expected format from the GET endpoint
    const response = {
      _id: populatedProduct._id,
      id: populatedProduct.id,
      name: populatedProduct.name,
      price: populatedProduct.price || 0,
      stock: populatedProduct.stock || 0,
      category: populatedProduct.category ? populatedProduct.category._id : null,
      categoryName: populatedProduct.category ? populatedProduct.category.name : "Uncategorized",
      rawIngredients: populatedProduct.rawIngredients || [],
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Error creating finished good:", error)
    res.status(500).json({ message: "Error creating finished good", error: error.message })
  }
})

// Add route to update an existing finished good
router.put("/finishedgoods/:id", async (req, res) => {
  try {
    const productId = req.params.id
    const productData = req.body

    // If there's a categoryName but no category ID, try to find or create the category
    if (!productData.category && productData.categoryName) {
      // Try to find an existing category with this name
      let category = await MenuCategory.findOne({ name: productData.categoryName })

      // If category doesn't exist, create a new one
      if (!category) {
        category = new MenuCategory({
          name: productData.categoryName,
          id: `CAT${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          order: 999, // Default order at the end
        })
        await category.save()
      }

      // Set the category ID on the product
      productData.category = category._id
    }

    // Update the product
    const updatedProduct = await FinishedGoods.findByIdAndUpdate(
      productId,
      productData,
      { new: true }, // Return the updated document
    ).populate("category", "name id _id")

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Format the response to match the expected format
    const response = {
      _id: updatedProduct._id,
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price || 0,
      stock: updatedProduct.stock || 0,
      category: updatedProduct.category ? updatedProduct.category._id : null,
      categoryName: updatedProduct.category ? updatedProduct.category.name : "Uncategorized",
      rawIngredients: updatedProduct.rawIngredients || [],
    }

    res.json(response)
  } catch (error) {
    console.error("Error updating finished good:", error)
    res.status(500).json({ message: "Error updating finished good", error: error.message })
  }
})

// Add route to delete a finished good
router.delete("/finishedgoods/:id", async (req, res) => {
  try {
    const productId = req.params.id

    const deletedProduct = await FinishedGoods.findByIdAndDelete(productId)

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting finished good:", error)
    res.status(500).json({ message: "Error deleting finished good", error: error.message })
  }
})

// Route to fetch BOM data
router.get("/bom", async (req, res) => {
  try {
    const bomData = await BOM.find() // Fetch data from BOM collection
    console.log("Fetched BOM Data:", bomData) // Log BOM data for debugging
    res.json(bomData) // Return BOM data as response
  } catch (error) {
    console.error("Error fetching BOM data:", error)
    res.status(500).json({ message: "Error fetching BOM data" })
  }
})

router.put("/bom", async (req, res) => {
  try {
    const updatedBomData = req.body

    // Create a bulk operation array
    const bulkOps = updatedBomData.map((item) => {
      return {
        updateOne: {
          filter: { RawID: item.RawID },
          update: { $set: { Quantity: item.Quantity } },
          upsert: false,
        },
      }
    })

    // Execute bulk operation
    const result = await BOM.bulkWrite(bulkOps)

    console.log("Updated BOM Data:", result)
    res.json({
      message: "BOM data updated successfully",
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error("Error updating BOM data:", error)
    res.status(500).json({ message: "Error updating BOM data" })
  }
})

// Route to post BOM data
router.post("/bom", async (req, res) => {
  try {
    const bomData = req.body // The raw BOM data sent in the request
    await BOM.insertMany(bomData) // Insert data into BOM collection
    res.status(201).json({ message: "BOM data inserted successfully" })
  } catch (error) {
    console.error("Error inserting BOM data:", error)
    res.status(500).json({ message: "Error inserting BOM data" })
  }
})

// Route to update a single BOM item by ID
router.put("/bom/:id", async (req, res) => {
  try {
    const bomId = req.params.id;
    const updatedData = req.body;
    
    // Find the BOM item by ID and update it
    const updatedBom = await BOM.findByIdAndUpdate(
      bomId,
      updatedData,
      { new: true } // Return the updated document
    );
    
    if (!updatedBom) {
      return res.status(404).json({ message: "BOM item not found" });
    }
    
    console.log("Updated BOM Item:", updatedBom);
    res.json({
      message: "BOM item updated successfully",
      item: updatedBom
    });
  } catch (error) {
    console.error("Error updating BOM item:", error);
    res.status(500).json({ message: "Error updating BOM item", error: error.message });
  }
});

// Route to delete a BOM item by ID
router.delete("/bom/:id", async (req, res) => {
  try {
    const bomId = req.params.id;
    
    // Find the BOM item by ID and delete it
    const deletedBom = await BOM.findByIdAndDelete(bomId);
    
    if (!deletedBom) {
      return res.status(404).json({ message: "BOM item not found" });
    }
    
    console.log("Deleted BOM Item:", deletedBom);
    res.json({ 
      message: "BOM item deleted successfully",
      item: deletedBom
    });
  } catch (error) {
    console.error("Error deleting BOM item:", error);
    res.status(500).json({ message: "Error deleting BOM item", error: error.message });
  }
});

module.exports = router
