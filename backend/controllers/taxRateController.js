const TaxRate = require('../models/TaxRate');
const {STATUS_CODES} = require("../config/core")

// Get all tax rates with optional filtering
exports.getAllTaxRates = async (req, res) => {
  try {
    // Build filter
    const filter = {};
    
    if (req.query.appliesTo) filter.appliesTo = req.query.appliesTo;
    
    // Rate range filter
    if (req.query.minRate && req.query.maxRate) {
      filter.rate = {
        $gte: parseFloat(req.query.minRate),
        $lte: parseFloat(req.query.maxRate)
      };
    } else if (req.query.minRate) {
      filter.rate = { $gte: parseFloat(req.query.minRate) };
    } else if (req.query.maxRate) {
      filter.rate = { $lte: parseFloat(req.query.maxRate) };
    }

    // Name search
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    
    const taxRates = await TaxRate.find(filter).sort({ name: 1 });
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      count: taxRates.length,
      data: taxRates
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch tax rates",
      error: error.message
    });
  }
};

// Get single tax rate by ID
exports.getTaxRateById = async (req, res) => {
  try {
    const taxRate = await TaxRate.findById(req.params.id);
    
    if (!taxRate) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Tax rate not found'
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: taxRate
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch tax rate',
      error: error.message
    });
  }
};

// Create new tax rate
exports.createTaxRate = async (req, res) => {
  try {
    const { name, rate, appliesTo } = req.body;
    
    // Check if tax rate with the same name already exists
    const existingTaxRate = await TaxRate.findOne({ name });
    if (existingTaxRate) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Tax rate with this name already exists'
      });
    }
    
    // Create new tax rate
    const taxRate = new TaxRate({
      name,
      rate,
      appliesTo
    });
    
    await taxRate.save();
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: taxRate
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create tax rate',
      error: error.message
    });
  }
};

// Update tax rate
exports.updateTaxRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rate, appliesTo } = req.body;
    
    // Check if tax rate with the same name already exists (excluding current one)
    if (name) {
      const existingTaxRate = await TaxRate.findOne({ 
        name, 
        _id: { $ne: id } 
      });
      
      if (existingTaxRate) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Tax rate with this name already exists'
        });
      }
    }
    
    const updatedTaxRate = await TaxRate.findByIdAndUpdate(
      id,
      { name, rate, appliesTo },
      { new: true, runValidators: true }
    );
    
    if (!updatedTaxRate) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Tax rate not found'
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedTaxRate
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update tax rate',
      error: error.message
    });
  }
};

// Delete tax rate
exports.deleteTaxRate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tax rate is being referenced by inventory items
    const InventoryItem = require('../models/InventoryItem');
    const itemsUsingTaxRate = await InventoryItem.countDocuments({ taxRate: id });
    
    if (itemsUsingTaxRate > 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `Cannot delete tax rate. It is being used by ${itemsUsingTaxRate} inventory items.`
      });
    }
    
    const taxRate = await TaxRate.findByIdAndDelete(id);
    
    if (!taxRate) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Tax rate not found'
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Tax rate deleted successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete tax rate',
      error: error.message
    });
  }
};

// Bulk create tax rates
exports.bulkCreateTaxRates = async (req, res) => {
  try {
    const taxRates = req.body;
    
    if (!Array.isArray(taxRates) || taxRates.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Please provide an array of tax rates'
      });
    }
    
    // Validate each tax rate
    for (const taxRate of taxRates) {
      if (!taxRate.name || taxRate.rate === undefined || !taxRate.appliesTo) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Each tax rate must have a name, rate, and appliesTo field'
        });
      }
      
      if (taxRate.rate < 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Tax rate cannot be negative'
        });
      }
      
      if (!['Purchase', 'Sale', 'Both'].includes(taxRate.appliesTo)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'appliesTo must be one of: Purchase, Sale, Both'
        });
      }
    }
    
    // Check for duplicate names within the input
    const names = taxRates.map(tr => tr.name);
    if (new Set(names).size !== names.length) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Duplicate tax rate names in input'
      });
    }
    
    // Check for existing tax rates with the same names
    const existingNames = await TaxRate.find({ name: { $in: names } }).distinct('name');
    if (existingNames.length > 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `The following tax rates already exist: ${existingNames.join(', ')}`
      });
    }
    
    // Create all tax rates
    const createdTaxRates = await TaxRate.insertMany(taxRates);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      count: createdTaxRates.length,
      data: createdTaxRates
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create tax rates',
      error: error.message
    });
  }
};

// Calculate tax amount based on value and tax rate ID
exports.calculateTax = async (req, res) => {
  try {
    const { taxRateId, value, type } = req.body;
    
    if (!taxRateId || value === undefined) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Tax rate ID and value are required'
      });
    }
    
    if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Value must be a non-negative number'
      });
    }
    
    const taxRate = await TaxRate.findById(taxRateId);
    
    if (!taxRate) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Tax rate not found'
      });
    }
    
    // Check if tax applies to the specified transaction type
    if (type && (type === 'Purchase' || type === 'Sale')) {
      if (taxRate.appliesTo !== type && taxRate.appliesTo !== 'Both') {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: `This tax rate does not apply to ${type} transactions`
        });
      }
    }
    
    const numericValue = parseFloat(value);
    const taxAmount = numericValue * (taxRate.rate / 100);
    const totalWithTax = numericValue + taxAmount;
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        taxRate: taxRate.rate,
        baseValue: numericValue,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        totalWithTax: parseFloat(totalWithTax.toFixed(2))
      }
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to calculate tax',
      error: error.message
    });
  }
};