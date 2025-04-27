const mongoose = require("mongoose");

const stockLocationSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "InventoryItem", 
    required: true 
  },
  location: { 
    type: String, 
    enum: ["warehouse", "finishedgoodsstore", "retailstore", "transit"], 
    required: true 
  },
  quantity: { type: Number, default: 0, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

stockLocationSchema.index({ item: 1, location: 1 }, { unique: true });

const StockLocation = mongoose.model("StockLocation", stockLocationSchema);

module.exports = StockLocation;