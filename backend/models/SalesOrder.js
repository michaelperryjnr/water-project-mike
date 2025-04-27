const mongoose = require("mongoose");

const salesOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, trim: true, index: true },
  customer: {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  items: [{
    item: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "InventoryItem", 
      required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    serialNumbers: [{ type: String }]
  }],
  subtotal: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"], 
    default: "pending",
    index: true
  },
  paymentStatus: { 
    type: String, 
    enum: ["unpaid", "partial", "paid"], 
    default: "unpaid",
    index: true
  },
  paymentMethod: { 
    type: String, 
    enum: ["cash", "creditcard", "banktransfer", "payPal"] 
  },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date }
}, { timestamps: true });

const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);

module.exports = SalesOrder;