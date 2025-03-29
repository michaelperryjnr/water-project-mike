//models/Vehicle.js
const mongoose = require("mongoose");

// Define enums for fields with fixed options
const VEHICLE_TYPES = ["sedan", "suv", "truck", "van", "pickup", "minivan", "bus", "motorcycle", "utility", "coupe", "saloon"];
const VEHICLE_STATUS = ["available", "in-use", "maintenance", "out-of-service", "retired", "reserved", "auctioned", "sold", "disposed off"];
const VEHICLE_CONDITION = ["new", "used", "damaged", "salvage", "repaired", "refurbished"];
const OWNERSHIP_STATUS = ["owned", "leased", "rented", "financed", "borrowed", "shared"];
const TRANSMISSION_TYPES = ["automatic", "manual", "semi-automatic", "cvt"];
const FUEL_TYPES = ["diesel", "petrol", "electric", "hybrid", "compressed natural gas", "biofuel", "ethanol", "propane", "hydrogen"];
const WEIGHT_UNITS = ["kg", "grams", "tons"];

const vehicleSchema = new mongoose.Schema({
  // Basic identification details
  registrationNumber: { type: String, required: true, unique: true, trim: true }, // Frontend: Text input (used as the plate number in Ghana)
  vinNumber: { type: String, required: true, unique: true, trim: true }, // Frontend: Text input

  // Vehicle classification
  vehicleType: { type: String, enum: VEHICLE_TYPES, required: true }, // Frontend: Dropdown (populated from VEHICLE_TYPES enum)
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Frontend: Dropdown (populated from Brands collection)
  model: { type: String, required: true, trim: true }, // Frontend: Dropdown (populated dynamically based on selected brand)
  yearOfManufacturing: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 }, // Frontend: Number input or dropdown (e.g., 1900 to current year + 1)

  // Technical specifications
  fuelType: { type: String, enum: FUEL_TYPES, required: true }, // Frontend: Dropdown (populated from FUEL_TYPES enum)
  transmissionType: { type: String, enum: TRANSMISSION_TYPES, required: true }, // Frontend: Dropdown (populated from TRANSMISSION_TYPES enum)
  sittingCapacity: { type: Number, required: true, min: 1 }, // Frontend: Number input
  weight: { type: Number, required: true, min: 0 }, // Frontend: Number input
  weightType: { type: String, enum: WEIGHT_UNITS, required: true, default: "kg" }, // Frontend: Dropdown (populated from WEIGHT_UNITS enum)
  color: { type: String, trim: true }, // Frontend: Text input or dropdown (if you want to limit color options)

  // Status and ownership details
  status: { type: String, enum: VEHICLE_STATUS, default: "available" }, // Frontend: Dropdown (populated from VEHICLE_STATUS enum)
  ownershipStatus: { type: String, enum: OWNERSHIP_STATUS, default: "owned" }, // Frontend: Dropdown (populated from OWNERSHIP_STATUS enum)
  vehicleCondition: { type: String, enum: VEHICLE_CONDITION, default: "new" }, // Frontend: Dropdown (populated from VEHICLE_CONDITION enum)
  assignedDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // Frontend: Dropdown (populated from Departments collection)
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Frontend: Dropdown (populated from Employees collection)
  isAvailableForPool: { type: Boolean, default: true }, // Frontend: Checkbox

  // Operational details
  currentMileage: { type: Number, default: 0, min: 0 }, // Frontend: Number input
  purchaseDate: { type: Date, required: true }, // Frontend: Date picker
  costOfVehicle: { type: Number, required: true, min: 0 }, // Frontend: Number input

  // Technical details
  vehicleDescription: { type: String, trim: true }, // Frontend: Textarea
  engineDescription: { type: String, trim: true }, // Frontend: Textarea
  pictures: { type: [String], default: [] }, // Frontend: File upload (allow multiple files, store paths)

  // Insurance and compliance details
  insurance: { type: mongoose.Schema.Types.ObjectId, ref: "Insurance" }, // Frontend: Dropdown (populated from Insurance collection)
  insuranceStartDate: { type: Date }, // Frontend: Date picker
  insuranceEndDate: { type: Date }, // Frontend: Date picker
  roadWorth: { type: mongoose.Schema.Types.ObjectId, ref: "RoadWorth" }, // Frontend: Dropdown (populated from RoadWorth collection)
  roadWorthStartDate: { type: Date }, // Frontend: Date picker
  roadWorthEndDate: { type: Date }, // Frontend: Date picker
}, { timestamps: true });

// Middleware to validate that the model belongs to the selected brand
vehicleSchema.pre("save", async function (next) {
  if (this.isModified("brand") || this.isModified("model")) {
    const brand = await mongoose.model("Brand").findById(this.brand);
    if (!brand) {
      return next(new Error("Brand not found"));
    }
    const modelExists = brand.models.some((model) => model.name === this.model.toLowerCase());
    if (!modelExists) {
      return next(new Error(`Model ${this.model} is not available for brand ${brand.name}`));
    }
  }
  next();
});

// Middleware to lowercase certain fields before saving (POST method)
vehicleSchema.pre("save", function (next) {
  const fieldsToLowercase = ["registrationNumber", "vinNumber", "model", "color", "vehicleDescription", "engineDescription"];
  fieldsToLowercase.forEach((field) => {
    if (this[field] && typeof this[field] === "string") {
      this[field] = this[field].toLowerCase();
    }
  });
  next();
});

// Middleware to lowercase certain fields before updating (PUT method)
vehicleSchema.pre("updateOne", { document: true, query: false }, function (next) {
  const fieldsToLowercase = ["registrationNumber", "vinNumber", "model", "color", "vehicleDescription", "engineDescription"];
  fieldsToLowercase.forEach((field) => {
    if (this._update[field] && typeof this._update[field] === "string") {
      this._update[field] = this._update[field].toLowerCase();
    }
  });
  next();
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;