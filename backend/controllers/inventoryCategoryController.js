const InventoryCategory = require('../models/InventoryCategory');
const InventoryItem = require('../models/InventoryItem');
const {STATUS_CODES} = require("../config/core")

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await InventoryCategory.find()
      .populate('parentCategory', 'name');
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await InventoryCategory.findById(req.params.id)
      .populate('parentCategory', 'name');
    
    if (!category) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Category not found"
      });
    }
    
    // Get subcategories
    const subcategories = await InventoryCategory.find({ 
      parentCategory: req.params.id 
    });
    
    // Count items in this category
    const itemCount = await InventoryItem.countDocuments({ 
      category: req.params.id 
    });
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
        itemCount
      }
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message
    });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    // If parentCategory is provided, check if it exists
    if (req.body.parentCategory) {
      const parentExists = await InventoryCategory.findById(req.body.parentCategory);
      if (!parentExists) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Parent category not found"
        });
      }
    }
    
    const newCategory = await InventoryCategory.create(req.body);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    // Check if category exists
    const category = await InventoryCategory.findById(req.params.id);
    if (!category) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Category not found"
      });
    }
    
    // Prevent circular references (category can't be its own parent)
    if (req.body.parentCategory === req.params.id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Category cannot be its own parent"
      });
    }
    
    // Check if new parent exists if provided
    if (req.body.parentCategory) {
      const parentExists = await InventoryCategory.findById(req.body.parentCategory);
      if (!parentExists) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Parent category not found"
        });
      }
      
      // Prevent circular reference chain
      let currentParent = parentExists;
      while (currentParent.parentCategory) {
        if (currentParent.parentCategory.toString() === req.params.id) {
          return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Circular reference detected in category hierarchy"
          });
        }
        currentParent = await InventoryCategory.findById(currentParent.parentCategory);
      }
    }
    
    const updatedCategory = await InventoryCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category exists
    const category = await InventoryCategory.findById(req.params.id);
    if (!category) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Category not found"
      });
    }
    
    // Check if there are subcategories
    const hasSubcategories = await InventoryCategory.exists({ 
      parentCategory: req.params.id 
    });
    
    if (hasSubcategories) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Cannot delete category with subcategories"
      });
    }
    
    // Check if there are items in this category
    const hasItems = await InventoryItem.exists({ 
      category: req.params.id 
    });
    
    if (hasItems) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Cannot delete category with items"
      });
    }
    
    await InventoryCategory.findByIdAndDelete(req.params.id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete category",
      error: error.message
    });
  }
};

// Get category hierarchy
exports.getCategoryHierarchy = async (req, res) => {
  try {
    // Get all root categories (those without a parent)
    const rootCategories = await InventoryCategory.find({ 
      parentCategory: null 
    });
    
    // Function to recursively build category tree
    const buildCategoryTree = async (categories) => {
      const result = [];
      
      for (const category of categories) {
        const subcategories = await InventoryCategory.find({ 
          parentCategory: category._id 
        });
        
        const itemCount = await InventoryItem.countDocuments({ 
          category: category._id 
        });
        
        const node = {
          _id: category._id,
          name: category.name,
          description: category.description,
          itemCount
        };
        
        if (subcategories.length > 0) {
          node.children = await buildCategoryTree(subcategories);
        }
        
        result.push(node);
      }
      
      return result;
    };
    
    const categoryTree = await buildCategoryTree(rootCategories);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: categoryTree
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch category hierarchy",
      error: error.message
    });
  }
};