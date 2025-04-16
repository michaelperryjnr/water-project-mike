const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true, trim: true, index: true },
  itemDescription: { type: String, required: true, trim: true },
  inventoryType: { type: String, enum: ["Physical", "Service"], required: true },
  unitOfMeasure: { type: String, enum: ["Piece", "Set", "Box", "Bundle", "Kg", "Liter"], required: true },
  saleable: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryCategory", required: true, index: true},
  unitCost: { type: Number, required: true, min: 0 },
  lastPurchasePrice: { type: Number, min: 0 },
  lastPurchasedAt: { type: Date },
  sellingPrice: {
    retail: { type: Number, min: 0 },
    wholesale: { type: Number, min: 0 }
  },
  suppliers: [{
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    supplierItemCode: { type: String, trim: true },
    leadTimeDays: { type: Number, min: 0 }
  }],
  pictures: [{
    url: { type: String, trim: true },
    caption: { type: String, trim: true }
  }],
  serialization: { type: Boolean, default: false },
  barcode: { type: String, trim: true },
  taxableOnPurchase: { type: Boolean, default: false },
  taxableOnSale: { type: Boolean, default: true },
  taxRate: { type: mongoose.Schema.Types.ObjectId, ref: "TaxRate" },
  specialPrice: { type: Number, min: 0 },
  specialPriceDuration: { type: Number, min: 0 },
  specialPriceDurationPeriod: { type: String, enum: ["Days", "Weeks", "Months", "Years"] },
  specialPriceStartDate: { type: Date },
  specialPriceEndDate: { type: Date },
  quantityInStock: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, min: 0 },
  reorderQuantity: { type: Number, min: 0 },
  status: { type: String, enum: ["Active", "Discontinued", "OnHold"], default: "Active", index: true }
}, { timestamps: true });

inventoryItemSchema.pre("save", function(next) {
  if (this.specialPriceDuration && this.specialPriceDurationPeriod && this.specialPriceStartDate) {
    const durationMs = {
      Days: this.specialPriceDuration * 24 * 60 * 60 * 1000,
      Weeks: this.specialPriceDuration * 7 * 24 * 60 * 60 * 1000,
      Months: this.specialPriceDuration * 30 * 24 * 60 * 60 * 1000,
      Years: this.specialPriceDuration * 365 * 24 * 60 * 60 * 1000
    }[this.specialPriceDurationPeriod];
    this.specialPriceEndDate = new Date(this.specialPriceStartDate.getTime() + durationMs);
  }
  next();
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;