const Supplier = require('../models/Supplier');
const InventoryItem = require('../models/InventoryItem');
const {STATUS_CODES} = require("../config/core")

// Get all suppliers with pagination
exports.getAllSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    // Search by name
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    
    const suppliers = await Supplier.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Supplier.countDocuments(filter);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: suppliers.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: suppliers
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch suppliers",
      error: error.message
    });
  }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Supplier not found"
      });
    }
    
    // Get items supplied by this supplier
    const suppliedItems = await InventoryItem.find({
      'suppliers.supplier': req.params.id
    }).select('itemCode itemDescription quantityInStock');
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        ...supplier.toObject(),
        suppliedItems
      }
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch supplier",
      error: error.message
    });
  }
};

// Create a new supplier
exports.createSupplier = async (req, res) => {
  try {
    const newSupplier = await Supplier.create(req.body);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newSupplier
    });
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to create supplier",
      error: error.message
    });
  }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Supplier not found"
      });
    }
    
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedSupplier
    });
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to update supplier",
      error: error.message
    });
  }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Supplier not found"
      });
    }
    
    // Check if there are items linked to this supplier
    const hasItems = await InventoryItem.exists({ 
      'suppliers.supplier': req.params.id 
    });
    
    if (hasItems) {
      // Option 1: Prevent deletion
      /*
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Cannot delete supplier with linked items"
      });
      */
      
      // Option 2: Remove supplier reference from items
      await InventoryItem.updateMany(
        { 'suppliers.supplier': req.params.id },
        { $pull: { suppliers: { supplier: req.params.id } } }
      );
    }
    
    await Supplier.findByIdAndDelete(req.params.id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Supplier deleted successfully"
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete supplier",
      error: error.message
    });
  }
};

// Change supplier status (active/inactive)
exports.changeSupplierStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid status. Must be 'Active' or 'Inactive'"
      });
    }
    
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Supplier not found"
      });
    }
    
    supplier.status = status;
    await supplier.save();
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: `Supplier status changed to ${status}`,
      data: supplier
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to change supplier status",
      error: error.message
    });
  }
};