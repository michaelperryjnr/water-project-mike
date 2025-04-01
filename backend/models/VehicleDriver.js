const mongoose = require("mongoose");

const vehicleDriverLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true }, // Frontend: Not editable (display vehicle details)
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Frontend: Dropdown (populated from Employees collection)
  vehicleLocation: {type: String, required: true},
  assignmentStartDate: { type: Date, required: true, default: Date.now }, // Frontend: Date picker (default to current date)
  assignmentEndDate: { type: Date }, // Frontend: Date picker
  reasonForAssignment: { type: String, trim: true }, // Frontend: Text input (e.g., "Assigned for daily operations")
  odometerReadingAtStart: { type: Number, min: 0 }, // Frontend: Number input (record mileage at assignment start)
  odometerReadingAtEnd: { type: Number, min: 0 }, // Frontend: Number input (record mileage at assignment end)
  notes: { type: String, trim: true }, // Frontend: Textarea (e.g., "Driver reported a minor issue with brakes")
  status: { type: String, enum: ["active", "completed", "terminated"], default: "active" }, // Frontend: Dropdown (populated from enum)
}, { timestamps: true });

// Pre-save hook to lowercase fields (POST method)
vehicleDriverLogSchema.pre("save", function (next) {
  const fieldsToLowercase = ["reasonForAssignment", "notes"];
  fieldsToLowercase.forEach((field) => {
    if (this[field] && typeof this[field] === "string") {
      this[field] = this[field].toLowerCase();
    }
  });
  next();
});

// Pre-update hook to lowercase fields (PUT method)
vehicleDriverLogSchema.pre("updateOne", { document: true, query: false }, function (next) {
  const fieldsToLowercase = ["reasonForAssignment", "notes"];
  fieldsToLowercase.forEach((field) => {
    if (this._update[field] && typeof this._update[field] === "string") {
      this._update[field] = this._update[field].toLowerCase();
    }
  });
  next();
});

const VehicleDriverLog = mongoose.model("VehicleDriverLog", vehicleDriverLogSchema);

module.exports = VehicleDriverLog;