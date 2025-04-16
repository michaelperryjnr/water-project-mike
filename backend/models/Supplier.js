const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contactInfo: {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

supplierSchema.index({ name: 1 });
supplierSchema.index({ status: 1 });

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;