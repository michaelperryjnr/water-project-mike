const mongoose = require("mongoose");

const inventoryCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, index: true },
  description: { type: String, trim: true },
  parentCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "InventoryCategory", 
    default: null,
    index: true
  }
}, { timestamps: true });


const InventoryCategory = mongoose.model("InventoryCategory", inventoryCategorySchema);

module.exports = InventoryCategory;