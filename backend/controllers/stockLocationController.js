const StockLocation = require('../models/StockLocation');
const InventoryItem = require('../models/InventoryItem');
const StockTransaction = require('../models/StockTransaction');
const { STATUS_CODES } = require("../config/core");
const Logger = require("../utils/logger");

// Get stock by location
exports.getStockByLocation = async (req, res) => {
  try {
    Logger("Fetching stock by location", req, "stockLocationController");
    const { location } = req.params;
    
    // Validate location
    const validLocations = ['warehouse', 'finishedgoodsstore', 'retailstore', 'transit'];
    if (!validLocations.includes(location.toLowerCase())) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid location"
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { location: location.toLowerCase()  };
    // Only show items with stock by default, unless showAll=true
    if (req.query.showAll !== 'true') {
      filter.quantity = { $gt: 0 };
    }
    
    const stockItems = await StockLocation.find(filter)
      .populate({
        path: 'item',
        select: 'itemCode itemDescription category',
        populate: { path: 'category', select: 'name' }
      })
      .sort({ quantity: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await StockLocation.countDocuments(filter);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: stockItems.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      location: location.toLowerCase(),
      data: stockItems
    });
  } catch (error) {
    Logger("Failed to fetch stock by location", req, "stockLocationController", "error", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch stock by location",
      error: error.message
    });
  }
};

// Get stock by item
exports.getStockByItem = async (req, res) => {
  try {
    Logger("Fetching stock by item", req, "stockLocationController");
    const { itemId } = req.params;
    
    // Check if item exists
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Item not found"
      });
    }
    
    // Get stock across all locations
    const stockLocations = await StockLocation.find({ item: itemId });
    
    // Get recent transactions
    const recentTransactions = await StockTransaction.find({ item: itemId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        item: {
          _id: item._id,
          itemCode: item.itemCode,
          itemDescription: item.itemDescription,
          quantityInStock: item.quantityInStock
        },
        stockLocations,
        recentTransactions
      }
    });
  } catch (error) {
    Logger("Failed to fetch stock by item", req, "stockLocationController", "error", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch stock by item",
      error: error.message
    });
  }
};

// Transfer stock between locations
exports.transferStock = async (req, res) => {
  try {
    Logger("Transferring stock", req, "stockLocationController");
    const { itemId } = req.params;
    const { fromLocation, toLocation, quantity, reason } = req.body;
    
    // Validate request
    if (!fromLocation || !toLocation || !quantity || quantity <= 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "From location, to location, and positive quantity are required"
      });
    }
    
    const validLocations = ['warehouse', 'finishedgoodsstore', 'retailstore', 'transit'];
    if (!validLocations.includes(fromLocation.toLowerCase()) || !validLocations.includes(toLocation.toLowerCase())) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid location"
      });
    }
    
    if (fromLocation.toLowerCase() === toLocation.toLowerCase()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Source and destination locations cannot be the same"
      });
    }
    
    // Check if item exists
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Item not found"
      });
    }
    
    // Check source location has enough stock
    let sourceLocation = await StockLocation.findOne({
      item: itemId,
      location: fromLocation.toLowerCase()
    });
    
    if (!sourceLocation || sourceLocation.quantity < quantity) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Not enough stock in source location"
      });
    }
    
    // Get or create destination location
    let destLocation = await StockLocation.findOne({
      item: itemId,
      location: toLocation.toLowerCase()
    });
    
    if (!destLocation) {
      destLocation = new StockLocation({
        item: itemId,
        location: toLocation.toLowerCase(),
        quantity: 0
      });
    }
    
    // Perform the transfer
    sourceLocation.quantity -= quantity;
    destLocation.quantity += quantity;
    
    // Save both locations
    await sourceLocation.save();
    await destLocation.save();
    
    // Create transaction records
    const transactionRef = `Transfer-${Date.now()}`;
    
    await StockTransaction.create({
      item: itemId,
      transactionType: 'stockout',
      quantity: -quantity,
      location: fromLocation.toLowerCase(),
      reference: transactionRef
    });
    
    await StockTransaction.create({
      item: itemId,
      transactionType: 'stockin',
      quantity: quantity,
      location: toLocation.toLowerCase(),
      reference: transactionRef
    });
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Stock transferred successfully",
      data: {
        item: itemId,
        fromLocation,
        toLocation,
        quantity,
        transactionRef
      }
    });
  } catch (error) {
    Logger("Failed to transfer stock", req, "stockLocationController", "error", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to transfer stock",
      error: error.message
    });
  }
};