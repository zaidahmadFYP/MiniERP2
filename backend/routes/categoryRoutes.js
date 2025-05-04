const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuCategory = require('../models/menuCategory');

/**
 * @route   GET /api/menu/categories
 * @desc    Get all menu categories with pagination and sorting
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'order';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;
    
    const categories = await MenuCategory.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const totalCategories = await MenuCategory.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);
    
    res.json({
      categories,
      currentPage: page,
      totalPages,
      totalCategories
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

/**
 * @route   GET /api/menu/categories/:id
 * @desc    Get a single menu category by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await MenuCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Server error while fetching category' });
  }
});

/**
 * @route   POST /api/menu/categories
 * @desc    Create a new menu category
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { id, name, columns, smallText, order } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category with same ID already exists
    const existingCategory = await MenuCategory.findOne({ id });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this ID already exists' });
    }
    
    const newCategory = new MenuCategory({
      id,
      name,
      columns: columns || 2,
      smallText: smallText || false,
      order: order || 0
    });
    
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Server error while creating category' });
  }
});

/**
 * @route   PUT /api/menu/categories/:id
 * @desc    Update a menu category
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, columns, smallText, order } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Find and update the category
    const updatedCategory = await MenuCategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        columns,
        smallText,
        order
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error while updating category' });
  }
});

/**
 * @route   DELETE /api/menu/categories/:id
 * @desc    Delete a menu category
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await MenuCategory.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
});

/**
 * @route   PUT /api/menu/categories/reorder
 * @desc    Update the order of multiple categories at once
 * @access  Private
 */
router.put('/reorder', async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories array is required' });
    }
    
    // Use a transaction to ensure all updates succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      for (const category of categories) {
        if (!category._id || !category.order) {
          throw new Error('Each category must have _id and order');
        }
        
        await MenuCategory.findByIdAndUpdate(
          category._id,
          { order: category.order },
          { session }
        );
      }
      
      await session.commitTransaction();
      session.endSession();
      
      res.json({ message: 'Categories reordered successfully' });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error('Error reordering categories:', err);
    res.status(500).json({ message: 'Server error while reordering categories' });
  }
});

/**
 * @route   GET /api/menu/categories/stats
 * @desc    Get statistics about categories
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const totalCategories = await MenuCategory.countDocuments();
    const smallTextCategories = await MenuCategory.countDocuments({ smallText: true });
    
    const columnsAggregation = await MenuCategory.aggregate([
      {
        $group: {
          _id: null,
          averageColumns: { $avg: "$columns" },
          maxColumns: { $max: "$columns" },
          minColumns: { $min: "$columns" }
        }
      }
    ]);
    
    const stats = {
      total: totalCategories,
      withSmallText: smallTextCategories,
      averageColumns: columnsAggregation.length > 0 ? columnsAggregation[0].averageColumns.toFixed(1) : 0,
      columnRange: columnsAggregation.length > 0 ? {
        min: columnsAggregation[0].minColumns,
        max: columnsAggregation[0].maxColumns
      } : { min: 0, max: 0 }
    };
    
    res.json(stats);
  } catch (err) {
    console.error('Error fetching category stats:', err);
    res.status(500).json({ message: 'Server error while fetching category statistics' });
  }
});

module.exports = router;
