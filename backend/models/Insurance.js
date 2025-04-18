//models/Insurrance.js
const mongoose = require("mongoose");

// Define enums for insurance types
const VALID_INSURANCE_TYPE = ["health", "life", "auto", "home", "travel", "business"];
const AUTO_INSURANCE_TYPES = ["comprehensive", "third-party", "collision", "liability", "uninsured motorist"];
const VALID_PROVIDERS = ["enterprise insurance", "alliance insurance", "united insurance", "global insurance", "sic insurance", "star assurance", "allianz", "axa", "metlife", "prudential", "liberty mutual", "geico", "progressive", "state farm", "travelers", "nationwide", "farmers", "american family", "chubb", "the hartford"];

const insuranceSchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true, trim: true }, // Frontend: Text input
  provider: { type: String, enum: VALID_PROVIDERS, required: true }, // Frontend: Dropdown (populated from VALID_PROVIDERS enum)
  coverageAmount: { type: Number, required: true, min: 0 }, // Frontend: Number input
  insuranceType: { type: String, enum: VALID_INSURANCE_TYPE, required: true }, // Frontend: Dropdown (populated from VALID_INSURANCE_TYPE enum)
  autoInsuranceType: { type: String, enum: AUTO_INSURANCE_TYPES, required: function () { return this.insuranceType === "auto"; } }, // Frontend: Dropdown (populated from AUTO_INSURANCE_TYPES enum, shown only if insuranceType is "auto")
  insuranceDescription: { type: String, trim: true }, // Frontend: Textarea
}, { timestamps: true });

// Pre-save hook to lowercase fields (POST method)
insuranceSchema.pre("save", function (next) {
  const fieldsToLowercase = ["policyNumber", "provider", "insuranceType", "autoInsuranceType", "insuranceDescription"];
  fieldsToLowercase.forEach((field) => {
    if (this[field] && typeof this[field] === "string") {
      this[field] = this[field].toLowerCase();
    }
  });
  next();
});

// Pre-update hook to lowercase fields (PUT method)
insuranceSchema.pre("updateOne", { document: true, query: false }, function (next) {
  const fieldsToLowercase = ["policyNumber", "provider", "insuranceType", "autoInsuranceType", "insuranceDescription"];
  fieldsToLowercase.forEach((field) => {
    if (this._update[field] && typeof this._update[field] === "string") {
      this._update[field] = this._update[field].toLowerCase();
    }
  });
  next();
});

const Insurance = mongoose.model("Insurance", insuranceSchema);

module.exports = Insurance;