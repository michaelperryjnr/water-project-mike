const InventoryItem = require('../models/InventoryItem');
const StockLocation = require('../models/StockLocation');
const StockTransaction = require('../models/StockTransaction');
const {STATUS_CODES} = require("../config/core")
const Logger = require("../utils/logger")

// Get all inventory items with pagination
exports.getAllItems = async (req, res) => {
  try {
    Logger("Fetching all inventory items", req, "inventoryItemController", "info")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.inventoryType) filter.inventoryType = req.query.inventoryType;
    
    // Search by itemCode or description
    if (req.query.search) {
      filter.$or = [
        { itemCode: { $regex: req.query.search, $options: 'i' } },
        { itemDescription: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const items = await InventoryItem.find(filter)
      .populate('category', 'name')
      .populate('taxRate', 'name rate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await InventoryItem.countDocuments(filter);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: items.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: items
    });
  } catch (error) {
    Logger("Failed to fetch inventory items", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch inventory items",
      error: error.message
    });
  }
};

// Get a single inventory item by ID
exports.getItemById = async (req, res) => {
  try {
    Logger("Fetching inventory item by ID", req, "inventoryItemController")
    const item = await InventoryItem.findById(req.params.id)
      .populate('category', 'name description')
      .populate('taxRate', 'name rate appliesTo')
      .populate('suppliers.supplier', 'name contactInfo');
    
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Inventory item not found"
      });
    }
    
    // Get stock across all locations
    const stockLocations = await StockLocation.find({ item: req.params.id });
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        ...item.toObject(),
        stockLocations
      }
    });
  } catch (error) {
    Logger("Error fetching inventory item by ID", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch inventory item",
      error: error.message
    });
  }
};

// Create a new inventory item
exports.createItem = async (req, res) => {
  try {
    Logger("Creating new inventory item", req, "inventoryItemController")
    const newItem = await InventoryItem.create(req.body);
    
    // If initial stock is provided, create stock locations and transactions
    if (req.body.initialStock && req.body.initialStockLocation) {
      const stockLocation = await StockLocation.create({
        item: newItem._id,
        location: req.body.initialStockLocation,
        quantity: req.body.initialStock
      });
      
      await StockTransaction.create({
        item: newItem._id,
        transactionType: 'StockIn',
        quantity: req.body.initialStock,
        location: req.body.initialStockLocation,
        reference: 'Initial stock'
      });
      
      // Update quantityInStock in the item
      newItem.quantityInStock = req.body.initialStock;
      await newItem.save();
    }
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    Logger("Error creating inventory item", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to create inventory item",
      error: error.message
    });
  }
};

// Update an inventory item
exports.updateItem = async (req, res) => {
  try {
    Logger("Updating inventory item", req, "inventoryItemController")
    const item = await InventoryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Inventory item not found"
      });
    }
    
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    Logger("Error updating inventory item", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to update inventory item",
      error: error.message
    });
  }
};

// Delete an inventory item
exports.deleteItem = async (req, res) => {
  try {
    Logger("Deleting inventory item", req, "inventoryItemController")
    const item = await InventoryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Inventory item not found"
      });
    }
    
    // Check if the item has any stock
    const hasStock = await StockLocation.exists({ 
      item: req.params.id,
      quantity: { $gt: 0 }
    });
    
    if (hasStock) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Cannot delete item with existing stock"
      });
    }
    
    // Delete the item, related stock locations, and transactions
    await StockLocation.deleteMany({ item: req.params.id });
    await StockTransaction.deleteMany({ item: req.params.id });
    await InventoryItem.findByIdAndDelete(req.params.id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Inventory item deleted successfully"
    });
  } catch (error) {
    Logger("Error deleting inventory item", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete inventory item",
      error: error.message
    });
  }
};

// Adjust inventory stock
exports.adjustStock = async (req, res) => {
  try {
    Logger("Adjusting inventory stock", req, "inventoryItemController")
    const { quantity, location, reason } = req.body;
    
    if (!quantity || !location) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Quantity and location are required"
      });
    }
    
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Inventory item not found"
      });
    }
    
    // Find or create stock location
    let stockLocation = await StockLocation.findOne({ 
      item: req.params.id,
      location
    });
    
    if (!stockLocation) {
      stockLocation = await StockLocation.create({
        item: req.params.id,
        location,
        quantity: 0
      });
    }
    
    // Calculate new quantities
    const oldQuantity = stockLocation.quantity;
    const newLocationQuantity = oldQuantity + quantity;
    const newTotalQuantity = item.quantityInStock + quantity;
    
    // Prevent negative stock if enabled
    if (newLocationQuantity < 0 || newTotalQuantity < 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Adjustment would result in negative stock"
      });
    }
    
    // Update stock location
    stockLocation.quantity = newLocationQuantity;
    await stockLocation.save();
    
    // Update item total quantity
    item.quantityInStock = newTotalQuantity;
    await item.save();
    
    // Create stock transaction record
    await StockTransaction.create({
      item: req.params.id,
      transactionType: 'Adjustment',
      quantity,
      location,
      reference: reason || 'Manual adjustment'
    });
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Stock adjusted successfully",
      data: {
        item: item._id,
        location,
        previousQuantity: oldQuantity,
        adjustment: quantity,
        newQuantity: newLocationQuantity,
        totalQuantity: newTotalQuantity
      }
    });
  } catch (error) {
    Logger("Error adjusting inventory stock", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to adjust stock",
      error: error.message
    });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    Logger("Fetching low stock items", req, "inventoryItemController")
    const lowStockItems = await InventoryItem.find({
      $where: function() {
        return this.quantityInStock <= this.reorderLevel;
      }
    }).populate('category', 'name');
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error) {
    Logger("Error fetching low stock items", req, "inventoryItemController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch low stock items",
      error: error.message
    });
  }
};