//models/RoadWorth.js
const mongoose = require("mongoose");

const roadWorthSchema = new mongoose.Schema({
  certificateNumber: { type: String, required: true, unique: true, trim: true }, // Frontend: Text input
  issuedBy: { type: String, required: true, trim: true, default: "dvla" }, // Frontend: Text input
  notes: { type: String, trim: true, default: null }, // Optional, used for edge cases or admin comments
}, { timestamps: true });

// Pre-save hook to lowercase fields (POST method)
roadWorthSchema.pre("save", function (next) {
  const fieldsToLowercase = ["certificateNumber", "issuedBy", "notes"];
  fieldsToLowercase.forEach((field) => {
    if (this[field] && typeof this[field] === "string") {
      this[field] = this[field].toLowerCase();
    }
  });
  next();
});

// Pre-update hook to lowercase fields (PUT method)
roadWorthSchema.pre("updateOne", { document: true, query: false }, function (next) {
  const fieldsToLowercase = ["certificateNumber", "issuedBy", "notes"];
  fieldsToLowercase.forEach((field) => {
    if (this._update[field] && typeof this._update[field] === "string") {
      this._update[field] = this._update[field].toLowerCase();
    }
  });
  next();
});

const RoadWorth = mongoose.model("RoadWorth", roadWorthSchema);

module.exports = RoadWorth;