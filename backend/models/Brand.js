//models/Brand.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, // Frontend: Text input
  logo: { type: String, trim: true }, // Frontend: File upload (store path to logo image)
  models: [{ name: { type: String, required: true, trim: true } }], // Removed description field
}, { timestamps: true });

// Middleware to lowercase fields before saving (POST method)
brandSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toLowerCase();
  }
  if (this.models && this.models.length > 0) {
    this.models.forEach((model) => {
      if (model.name) {
        model.name = model.name.toLowerCase();
      }
    });
  }
  next();
});

// Middleware to lowercase fields before updating (PUT method)
brandSchema.pre("updateOne", { document: true, query: false }, function (next) {
  if (this._update.name) {
    this._update.name = this._update.name.toLowerCase();
  }
  if (this._update.models && this._update.models.length > 0) {
    this._update.models.forEach((model) => {
      if (model.name) {
        model.name = model.name.toLowerCase();
      }
    });
  }
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;