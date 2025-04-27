const mongoose = require("mongoose");

const taxRateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rate: { type: Number, required: true, min: 0 },
  appliesTo: { 
    type: String, 
    enum: ["purchase", "sale", "both"], 
    required: true 
  }
}, { timestamps: true });

const TaxRate = mongoose.model("TaxRate", taxRateSchema);

module.exports = TaxRate;