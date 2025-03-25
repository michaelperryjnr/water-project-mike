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

const VEHICLE_STATUS = [
  "active",
  "maintenance",
  "retired",
  "available",
  "in-use",
  "reserved",
];

const OWNERSHIP_TYPES = [
  "company-owned",
  "leased",
  "rented",
  "employee-assigned",
];

const FUEL_TYPES = ["diesel", "gasoline", "electric", "hybrid"];

const TRANSMISSION_TYPES = ["automatic", "manual", "semi-automatic", "cvt"];

const vehicleSchema = new mongoose.Schema(
  {
    // basic identification details
    vehicleRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vinNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // vehicle classification
    vehicleType: {
      type: String,
      enum: VEHICLE_TYPES,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1980,
      max: new Date().getFullYear() + 1,
    },

    // technical classification
    fuelType: {
      type: String,
      enum: FUEL_TYPES,
      required: true,
    },
    transmissionType: {
      type: String,
      enum: TRANSMISSION_TYPES,
    },

    // operational details
    currentMileage: {
      type: Number,
      default: 0,
    },
    purchaseDate: {
      type: Date,
    },
    purchasePrice: {
      type: Number,
    },

    // status and ownership details
    status: {
      type: String,
      enum: VEHICLE_STATUS,
      default: "active",
    },
    ownershipType: {
      type: String,
      enum: OWNERSHIP_TYPES,
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    // insurance and compliance details
    insurancePolicy: {
      type: String,
    },
    insuranceExpiryDate: {
      type: Date,
    },
    technicalInspectionDate: {
      type: Date,
    },

    // additional details
    description: {
      type: String,
    },
    colour: {
      type: String,
    },
    seatingCapacity: {
      type: Number,
      min: 1,
    },
    // if the vehicle is part of the company's shared vehicle fleet or a fleet that can be temporarily assigned to different employees or departments as needed
    isAvailableForPool: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.pre("save", function (next) {
  const fieldsToLowercase = [
    "make",
    "model",
    "description",
    "colour",
    "vehicleRegistrationNumber",
    "vinNumber",
    "plateNumber",
  ];

  fieldsToLowercase.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toLowerCase();
    }
  });

  next();
});

vehicleSchema.pre("updateOne", function (next) {
  const fieldsToLowercase = [
    "make",
    "model",
    "description",
    "color",
    "vehicleRegistrationNumber",
    "vinNumber",
    "plateNumber",
  ];

  fieldsToLowercase.forEach((field) => {
    if (this._update[field]) {
      this._update[field] = this._update[field].toLowerCase();
    }
  });

  next();
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
