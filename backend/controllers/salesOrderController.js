const SalesOrder = require('../models/SalesOrder');
const InventoryItem = require('../models/InventoryItem');
const StockTransaction = require('../models/StockTransaction');
const mongoose = require('mongoose');
const {STATUS_CODES} = require("../config/core")
const Logger = require("../utils/logger")

// Generate a unique order number
const generateOrderNumber = async () => {
  const today = new Date();
  const year = today.getFullYear().toString().substr(-2);
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const prefix = `SO${year}${month}`;
  
  // Get the current highest order number with this prefix
  const latestOrder = await SalesOrder.findOne({
    orderNumber: new RegExp(`^${prefix}`)
  }).sort({ orderNumber: -1 });
  
  let sequence = 1;
  if (latestOrder) {
    const currentSequence = parseInt(latestOrder.orderNumber.substr(6));
    sequence = isNaN(currentSequence) ? 1 : currentSequence + 1;
  }
  
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// Get all sales orders with pagination and filtering
exports.getAllSalesOrders = async (req, res) => {
  try {
    Logger("Fetching all sales orders", req, "salesOrderController")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    if (req.query.orderNumber) filter.orderNumber = { $regex: req.query.orderNumber, $options: 'i' };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.customerName) filter['customer.name'] = { $regex: req.query.customerName, $options: 'i' };
    
    // Date range filter for order date
    if (req.query.startDate && req.query.endDate) {
      filter.orderDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.orderDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.orderDate = { $lte: new Date(req.query.endDate) };
    }
    
    // Price range filter
    if (req.query.minAmount && req.query.maxAmount) {
      filter.totalAmount = {
        $gte: parseFloat(req.query.minAmount),
        $lte: parseFloat(req.query.maxAmount)
      };
    } else if (req.query.minAmount) {
      filter.totalAmount = { $gte: parseFloat(req.query.minAmount) };
    } else if (req.query.maxAmount) {
      filter.totalAmount = { $lte: parseFloat(req.query.maxAmount) };
    }
    
    const salesOrders = await SalesOrder.find(filter)
      .populate('items.item', 'itemCode itemDescription')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await SalesOrder.countDocuments(filter);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: salesOrders.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: salesOrders
    });
  } catch (error) {
    Logger("Failed to fetch sales orders", req, "salesOrderController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch sales orders",
      error: error.message
    });
  }
};

// Get single sales order by ID
exports.getSalesOrderById = async (req, res) => {
  try {
    Logger("Fetching sales order by ID", req, "salesOrderController")
    const salesOrder = await SalesOrder.findById(req.params.id)
      .populate('items.item', 'itemCode itemDescription unitOfMeasure saleable');
    
    if (!salesOrder) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Sales order not found'
      });
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: salesOrder
    });
  } catch (error) {
    Logger("Failed to fetch sales order by ID", req, "salesOrderController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch sales order',
      error: error.message
    });
  }
};

// Create new sales order
exports.createSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    Logger("Creating new sales order", req, "salesOrderController")
    const { 
      customer, 
      items, 
      subtotal,
      taxAmount, 
      totalAmount, 
      paymentStatus,
      paymentMethod,
      deliveryDate
    } = req.body;
    
    // Generate unique order number
    const orderNumber = await generateOrderNumber();
    
    // Validate and process items
    const processedItems = [];
    let calculatedSubtotal = 0;
    
    for (const item of items) {
      // Check if inventory item exists and has enough stock
      const inventoryItem = await InventoryItem.findById(item.item).session(session);
      
      if (!inventoryItem) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: `Inventory item with ID ${item.item} not found`
        });
      }
      
      if (!inventoryItem.saleable) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: `Item ${inventoryItem.itemCode} is not saleable`
        });
      }
      
      if (inventoryItem.quantityInStock < item.quantity) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: `Insufficient stock for item ${inventoryItem.itemCode}. Available: ${inventoryItem.quantityInStock}, Requested: ${item.quantity}`
        });
      }
      
      // Validate serial numbers if the item is serialized
      if (inventoryItem.serialization && (!item.serialNumbers || item.serialNumbers.length !== item.quantity)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: `Item ${inventoryItem.itemCode} requires ${item.quantity} serial numbers`
        });
      }
      
      // Calculate total price for the item
      const totalPrice = item.quantity * item.unitPrice;
      calculatedSubtotal += totalPrice;
      
      processedItems.push({
        item: item.item,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
        serialNumbers: item.serialNumbers || []
      });
      
      // Update inventory quantity
      inventoryItem.quantityInStock -= item.quantity;
      await inventoryItem.save({ session });
      
      // Create stock transaction
      const stockTransaction = new StockTransaction({
        item: item.item,
        transactionType: 'StockOut',
        quantity: item.quantity,
        location: 'RetailStore', // Default location for sales
        reference: `Sales Order: ${orderNumber}`
      });
      
      await stockTransaction.save({ session });
    }
    
    // Validate calculated amounts
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `Subtotal mismatch. Calculated: ${calculatedSubtotal}, Provided: ${subtotal}`
      });
    }
    
    const calculatedTotal = calculatedSubtotal + (taxAmount || 0);
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `Total amount mismatch. Calculated: ${calculatedTotal}, Provided: ${totalAmount}`
      });
    }
    
    // Create sales order
    const salesOrder = new SalesOrder({
      orderNumber,
      customer,
      items: processedItems,
      subtotal,
      taxAmount: taxAmount || 0,
      totalAmount,
      paymentStatus,
      paymentMethod,
      deliveryDate
    });
    
    await salesOrder.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: salesOrder
    });
  } catch (error) {
    Logger("Failed to create sales order", req, "salesOrderController", "error", error)
    await session.abortTransaction();
    session.endSession();
    
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create sales order',
      error: error.message
    });
  }
};

// Update sales order
exports.updateSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    Logger("Updating sales order", req, "salesOrderController")
    const { id } = req.params;
    
    // Get original sales order
    const originalOrder = await SalesOrder.findById(id)
      .populate('items.item')
      .session(session);
    
    if (!originalOrder) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Sales order not found'
      });
    }
    
    // Check if order can be updated
    if (['Delivered', 'Cancelled'].includes(originalOrder.status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `Cannot update a sales order with status: ${originalOrder.status}`
      });
    }
    
    const { status, paymentStatus, paymentMethod, deliveryDate } = req.body;
    
    // Updates only allowed for these fields
    const updates = {};
    
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (deliveryDate) updates.deliveryDate = new Date(deliveryDate);
    
    // Handle order cancellation
    if (status === 'Cancelled' && originalOrder.status !== 'Cancelled') {
      // Return items to inventory
      for (const item of originalOrder.items) {
        const inventoryItem = await InventoryItem.findById(item.item._id).session(session);
        if (inventoryItem) {
          inventoryItem.quantityInStock += item.quantity;
          await inventoryItem.save({ session });
          
          // Create stock transaction for the return
          const stockTransaction = new StockTransaction({
            item: item.item._id,
            transactionType: 'Return',
            quantity: item.quantity,
            location: 'RetailStore',
            reference: `Cancelled Sales Order: ${originalOrder.orderNumber}`
          });
          
          await stockTransaction.save({ session });
        }
      }
    }
    
    // Update the order
    const updatedOrder = await SalesOrder.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, session }
    ).populate('items.item', 'itemCode itemDescription');
    
    await session.commitTransaction();
    session.endSession();

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    Logger("Failed to update sales order", req, "salesOrderController", "error", error)
    await session.abortTransaction();
    session.endSession();
    
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update sales order',
      error: error.message
    });
  }
};

// Delete sales order (only allowed for Pending orders)
exports.deleteSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    Logger("Deleting sales order", req, "salesOrderController")
    const { id } = req.params;
    
    const salesOrder = await SalesOrder.findById(id)
      .populate('items.item')
      .session(session);
    
    if (!salesOrder) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Sales order not found'
      });
    }
    
    // Only allow deletion of Pending orders
    if (salesOrder.status !== 'Pending') {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `Cannot delete a sales order with status: ${salesOrder.status}. Only Pending orders can be deleted.`
      });
    }
    
    // Return items to inventory
    for (const item of salesOrder.items) {
      const inventoryItem = await InventoryItem.findById(item.item._id).session(session);
      if (inventoryItem) {
        inventoryItem.quantityInStock += item.quantity;
        await inventoryItem.save({ session });
        
        // Create stock transaction for the return
        const stockTransaction = new StockTransaction({
          item: item.item._id,
          transactionType: 'Return',
          quantity: item.quantity,
          location: 'RetailStore',
          reference: `Deleted Sales Order: ${salesOrder.orderNumber}`
        });
        
        await stockTransaction.save({ session });
      }
    }
    
    // Delete the order
    await SalesOrder.findByIdAndDelete(id, { session });
    
    await session.commitTransaction();
    session.endSession();

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Sales order deleted successfully'
    });
  } catch (error) {
    Logger("Failed to delete sales order", req, "salesOrderController", "error", error)
    await session.abortTransaction();
    session.endSession();
    
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete sales order',
      error: error.message
    });
  }
};

// Get sales summary statistics
exports.getSalesSummary = async (req, res) => {
  try {
    Logger("Fetching sales summary", req, "salesOrderController")
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      dateFilter.orderDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.orderDate = { $lte: new Date(endDate) };
    }
    
    // Overall statistics
    const totalSales = await SalesOrder.countDocuments(dateFilter);
    
    const salesByStatus = await SalesOrder.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const salesByPaymentStatus = await SalesOrder.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top selling items
    const topSellingItems = await SalesOrder.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      { $unwind: "$items" },
      { $group: {
          _id: "$items.item",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
          averageUnitPrice: { $avg: "$items.unitPrice" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: 'inventoryitems',
          localField: '_id',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      { $project: {
          _id: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          averageUnitPrice: 1,
          itemCode: { $arrayElemAt: ["$itemDetails.itemCode", 0] },
          itemDescription: { $arrayElemAt: ["$itemDetails.itemDescription", 0] }
        }
      }
    ]);
    
    // Sales trends (daily/monthly based on range)
    const useDailyGrouping = !startDate || !endDate || (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) <= 31;
    
    const salesTrend = await SalesOrder.aggregate([
      { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
      { $group: {
          _id: useDailyGrouping 
            ? { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }
            : { $dateToString: { format: "%Y-%m", date: "$orderDate" } },
          orderCount: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        totalSales,
        salesByStatus,
        salesByPaymentStatus,
        topSellingItems,
        salesTrend
      }
    });
  } catch (error) {
    Logger("Failed to fetch sales summary", req, "salesOrderController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch sales summary',
      error: error.message
    });
  }
};

// Get customer purchase history
exports.getCustomerPurchaseHistory = async (req, res) => {
  try {
    Logger("Fetching customer purchase history", req, "salesOrderController")
    const { customerName, customerEmail } = req.query;
    
    if (!customerName && !customerEmail) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Please provide either customer name or email'
      });
    }
    
    const filter = {};
    if (customerName) filter['customer.name'] = { $regex: customerName, $options: 'i' };
    if (customerEmail) filter['customer.email'] = customerEmail;
    
    const orders = await SalesOrder.find(filter)
      .populate('items.item', 'itemCode itemDescription')
      .sort({ orderDate: -1 });
    
    // Calculate customer statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get frequently purchased items
    const itemFrequency = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemId = item.item._id.toString();
        if (!itemFrequency[itemId]) {
          itemFrequency[itemId] = {
            itemCode: item.item.itemCode,
            itemDescription: item.item.itemDescription,
            totalQuantity: 0,
            totalSpent: 0,
            orderCount: 0
          };
        }
        itemFrequency[itemId].totalQuantity += item.quantity;
        itemFrequency[itemId].totalSpent += item.totalPrice;
        itemFrequency[itemId].orderCount += 1;
      });
    });
    
    const frequentlyPurchasedItems = Object.values(itemFrequency)
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        customer: orders.length > 0 ? orders[0].customer : null,
        totalOrders,
        totalSpent,
        orders,
        frequentlyPurchasedItems
      }
    });
  } catch (error) {
    Logger("Failed to fetch customer purchase history", req, "salesOrderController", "error", error)
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch customer purchase history',
      error: error.message
    });
  }
};