const StockTransaction = require('../models/StockTransaction');
const InventoryItem = require('../models/InventoryItem');
const {STATUS_CODES} = require("../config/core")
const Logger = require("../utils/logger");

// Get all transactions with pagination and filtering
exports.getAllTransactions = async (req, res) => {
  try {
    Logger("Fetching all transactions", req, "stockTransactionController");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    if (req.query.item) filter.item = req.query.item;
    if (req.query.transactionType) filter.transactionType = req.query.transactionType;
    if (req.query.location) filter.location = req.query.location.toLowerCase();
    if (req.query.reference) filter.reference = { $regex: req.query.reference, $options: 'i' };

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.createdAt = { $lte: new Date(req.query.endDate) };
    }
    
    const transactions = await StockTransaction.find(filter)
      .populate('item', 'itemCode itemDescription')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await StockTransaction.countDocuments(filter);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: transactions.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: transactions
    });
  } catch (error) {
    Logger("Failed to fetch transactions", req, "stockTransactionController", "error", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};

// Get single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    Logger("Fetching transaction by ID", req, "stockTransactionController");
    const transaction = await StockTransaction.findById(req.params.id)
      .populate('item', 'itemCode itemDescription unitOfMeasure unitCost');
    
    if (!transaction) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    Logger("Failed to fetch transaction by ID", req, "stockTransactionController", "error", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

// Create new transaction
exports.createTransaction = async (req, res) => {

  try {
    Logger("Creating new transaction", req, "stockTransactionController");
    const { item, transactionType, quantity, location, reference } = req.body;

    // Validate item exists
    const inventoryItem = await InventoryItem.findById(item);
    if (!inventoryItem) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Create transaction
    const transaction = new StockTransaction({
      item,
      transactionType,
      quantity,
      location: location.toLowerCase(),
      reference
    });

    // Update inventory quantity based on transaction type
    if (transactionType === 'stockin' || transactionType === 'return') {
      inventoryItem.quantityInStock += quantity;
    } else if (transactionType === 'stockout') {
      // Check if enough stock
      if (inventoryItem.quantityInStock < quantity) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }
      inventoryItem.quantityInStock -= quantity;
    } else if (transactionType === 'adjustment') {
      // For adjustments, quantity can be positive or negative
      inventoryItem.quantityInStock += quantity;
      // Prevent negative inventory
      if (inventoryItem.quantityInStock < 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'adjustment would result in negative inventory'
        });
      }
    }

    // Save both changes
    await transaction.save();
    await inventoryItem.save();
    

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    Logger("Failed to create transaction", req, "stockTransactionController", "error", error);
    
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    Logger("Updating transaction", req, "stockTransactionController");
    const { id } = req.params;
    
    // Get the original transaction
    const originalTransaction = await StockTransaction.findById(id);
    if (!originalTransaction) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Get inventory item
    const inventoryItem = await InventoryItem.findById(originalTransaction.item);
    if (!inventoryItem) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Revert the original transaction's effect on inventory
    if (originalTransaction.transactionType === 'stockin' || originalTransaction.transactionType === 'return') {
      inventoryItem.quantityInStock -= originalTransaction.quantity;
    } else if (originalTransaction.transactionType === 'stockout') {
      inventoryItem.quantityInStock += originalTransaction.quantity;
    } else if (originalTransaction.transactionType === 'adjustment') {
      inventoryItem.quantityInStock -= originalTransaction.quantity;
    }

    // Apply the updated transaction
    const { transactionType, quantity } = req.body;
    
    if (transactionType === 'stockin' || transactionType === 'return') {
      inventoryItem.quantityInStock += quantity;
    } else if (transactionType === 'stockout') {
      // Check if enough stock
      if (inventoryItem.quantityInStock < quantity) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Insufficient stock available for updated transaction'
        });
      }
      inventoryItem.quantityInStock -= quantity;
    } else if (transactionType === 'adjustment') {
      inventoryItem.quantityInStock += quantity;
      // Prevent negative inventory
      if (inventoryItem.quantityInStock < 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'adjustment would result in negative inventory'
        });
      }
    }

    // Update the transaction
    const updatedTransaction = await StockTransaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true}
    );

    // Save inventory changes
    await inventoryItem.save();

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    Logger("Failed to update transaction", req, "stockTransactionController", "error", error);
    
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    Logger("Deleting transaction", req, "stockTransactionController");
    const { id } = req.params;
    
    // Get the transaction
    const transaction = await StockTransaction.findById(id);
    if (!transaction) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Get inventory item
    const inventoryItem = await InventoryItem.findById(transaction.item);
    if (!inventoryItem) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Revert the transaction's effect on inventory
    if (transaction.transactionType === 'stockin' || transaction.transactionType === 'return') {
      inventoryItem.quantityInStock -= transaction.quantity;
      // Prevent negative inventory
      if (inventoryItem.quantityInStock < 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Cannot delete transaction as it would result in negative inventory'
        });
      }
    } else if (transaction.transactionType === 'stockout') {
      inventoryItem.quantityInStock += transaction.quantity;
    } else if (transaction.transactionType === 'adjustment') {
      inventoryItem.quantityInStock -= transaction.quantity;
      // Prevent negative inventory
      if (inventoryItem.quantityInStock < 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Cannot delete transaction as it would result in negative inventory'
        });
      }
    }

    // Delete the transaction
    await StockTransaction.findByIdAndDelete(id);
    
    // Save inventory changes
    await inventoryItem.save();

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    Logger("Failed to delete transaction", req, "stockTransactionController", "error", error);
    
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};

// Get inventory item stock balance
exports.getItemStockBalance = async (req, res) => {
  try {
    Logger("Fetching stock balance for item", req, "stockTransactionController");
    const { itemId } = req.params;
    
    const inventoryItem = await InventoryItem.findById(itemId).select('itemCode itemDescription quantityInStock reorderLevel');
    
    if (!inventoryItem) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    // Get recent transactions for this item
    const recentTransactions = await StockTransaction.find({ item: itemId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get stock by location
    const stockByLocation = await StockTransaction.aggregate([
      { $match: { item: itemId } },
      { $group: {
          _id: "$location",
          totalIn: { 
            $sum: {
              $cond: [
                { $or: [
                  { $eq: ["$transactionType", "stockin"] },
                  { $eq: ["$transactionType", "return"] }
                ]},
                "$quantity", 
                0
              ]
            }
          },
          totalOut: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "stockout"] },
                "$quantity", 
                0
              ]
            }
          },
          adjustments: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "adjustment"] },
                "$quantity", 
                0
              ]
            }
          }
        }
      },
      { $project: {
          location: "$_id",
          balance: { $subtract: [{ $add: ["$totalIn", "$adjustments"] }, "$totalOut"] },
          _id: 0
        }
      }
    ]);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        item: inventoryItem,
        recentTransactions,
        stockByLocation
      }
    });
  } catch (error) {
    Logger("Failed to fetch stock balance for item", req, "stockTransactionController", "error", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stock balance',
      error: error.message
    });
  }
};

const mongoose = require('mongoose');