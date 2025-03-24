//models/Positions.js

const mongoose = require('mongoose')



const positionSchema = new mongoose.Schema({
    positionTitle: {type: String, required: true, unique: true},
    positionDescription: {type: String, required: true},
    positionBaseSalary: {type: Number, required: true}, //Base salary for the position
    positionResponsibilities: {type: [String], default: []}, //List of Responsibilities for the position
    qualifications: {type: [String], default: []}, //Required qualifications or certification
    isActive: {type: Boolean, default: true}, //Status to indicate if the position is currently active or deprecated
}, { timestamps: true });//Automatically adds `createdAt and updatedAt`


// Pre-save hook to convert position fields to lowercase
positionSchema.pre('save', function (next) {
    if (this.positionTitle) {
        this.positionTitle = this.positionTitle.toLowerCase();
    }
    if (this.positionDescription) {
        this.positionDescription = this.positionDescription.toLowerCase();
    }
    if (this.positionResponsibilities && Array.isArray(this.positionResponsibilities)) {
        this.positionResponsibilities = this.positionResponsibilities.map(responsibility => responsibility.toLowerCase());
    }
    if (this.qualifications && Array.isArray(this.qualifications)) {
        this.qualifications = this.qualifications.map(qualification => qualification.toLowerCase());
    }
    next();
});

// Pre-update hook to convert position fields to lowercase
positionSchema.pre('update', function (next) {
    if (this._update.positionTitle) {
        this._update.positionTitle = this._update.positionTitle.toLowerCase();
    }
    if (this._update.positionDescription) {
        this._update.positionDescription = this._update.positionDescription.toLowerCase();
    }
    if (this._update.positionResponsibilities && Array.isArray(this._update.positionResponsibilities)) {
        this._update.positionResponsibilities = this._update.positionResponsibilities.map(responsibility => responsibility.toLowerCase());
    }
    if (this._update.qualifications && Array.isArray(this._update.qualifications)) {
        this._update.qualifications = this._update.qualifications.map(qualification => qualification.toLowerCase());
    }
    next();
});

const Position = mongoose.model('Position', positionSchema);

module.exports = Position