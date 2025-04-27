const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "InventoryItem", 
    required: true 
  },
  transactionType: { 
    type: String, 
    enum: ["stockin", "stockout", "adjustment", "return"], 
    required: true 
  },
  quantity: { type: Number, required: true },
  location: { 
    type: String, 
    enum: ["warehouse", "finishedgoodsstore", "retailstore", "transit"], 
    required: true 
  },
  reference: { type: String, trim: true }
}, { timestamps: true });

stockTransactionSchema.index({ item: 1 });
stockTransactionSchema.index({ transactionType: 1 });
stockTransactionSchema.index({ reference: 1 });

const StockTransaction = mongoose.model("StockTransaction", stockTransactionSchema);

module.exports = StockTransaction;