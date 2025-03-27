const mongoose = require("mongoose");

const VEHICLE_TYPES = [
  "sedan",
  "suv",
  "truck",
  "van",
  "pickup",
  "minivan",
  "bus",
  "motorcycle",
  "utility",
];

const FUEL_TYPES = ["diesel", "petrol"];

const WEIGHT_UNITS = ["kg", "grams", "tons"];

const vehicleSchema = new mongoose.Schema(
  {
    // Basic identification details
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: VEHICLE_TYPES,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    yearOfManufacturing: {
      type: Number,
      required: true,
      min: 1980,
      max: new Date().getFullYear() + 1,
    },
    chasisNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sittingCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    weight: {
      type: Number,
      required: true,
    },
    weightType: {
      type: String,
      enum: WEIGHT_UNITS,
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },

    // Insurance details
    insurance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
    },
    insuranceStartDate: {
      type: Date,
    },
    insuranceEndDate: {
      type: Date,
    },

    // Roadworthiness details
    roadWorth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoadWorth",
    },
    roadWorthStartDate: {
      type: Date,
    },
    roadWorthEndDate: {
      type: Date,
    },

    // Technical details
    fuelType: {
      type: String,
      enum: FUEL_TYPES,
      required: true,
    },
    pictures: {
      type: [String], // Array to store multiple image paths
    },
    costOfVehicle: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },

    // Assignment details
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to format fields before saving
vehicleSchema.pre("save", function (next) {
  const fieldsToLowercase = ["registrationNumber", "chasisNumber", "color", "description", "model"];
  fieldsToLowercase.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toLowerCase();
    }
  });
  next();
});

// Vehicle Driver Log Schema
const vehicleDriverLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    purpose: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
const VehicleDriverLog = mongoose.model("VehicleDriverLog", vehicleDriverLogSchema);

module.exports = { Vehicle, VehicleDriverLog };