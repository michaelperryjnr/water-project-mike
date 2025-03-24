//models/NextOfKin.JS

const mongoose = require('mongoose');

const VALID_RELATIONSHIP = ['mother', 'father', 'uncle', 'aunty', 'son', 'daughter', 'spouse', 'cousin', 'brother', 'sister', 'grandparent', 'grandchild', 'niece', 'nephew']
const VALID_GENDER = ['male', 'female']

const nextOfKinSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, minlength: 10, maxlength: 18, required: true },
    email: { type: String, required: true, unique: true },
    physicalAddress: { type: String },
    digitalAddress: { type: String },
    relationship: { type: String, enum: VALID_RELATIONSHIP, required: true },
    gender: { type: String, enum: VALID_GENDER, required: true },
});

// Pre-save hook to convert relevant fields to lowercase
nextOfKinSchema.pre('save', function (next) {
    if (this.firstName) {
        this.firstName = this.firstName.toLowerCase();
    }
    if (this.middleName) {
        this.middleName = this.middleName.toLowerCase();
    }
    if (this.lastName) {
        this.lastName = this.lastName.toLowerCase();
    }
    if (this.mobileNumber) {
        this.mobileNumber = this.mobileNumber.toLowerCase();
    }
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    if (this.physicalAddress) {
        this.physicalAddress = this.physicalAddress.toLowerCase();
    }
    if (this.digitalAddress) {
        this.digitalAddress = this.digitalAddress.toLowerCase();
    }
    if (this.relationship) {
        this.relationship = this.relationship.toLowerCase();
    }
    if (this.gender) {
        this.gender = this.gender.toLowerCase();
    }
    next();
});

// Pre-update hook to convert relevant fields to lowercase
nextOfKinSchema.pre('update', function (next) {
    if (this._update.firstName) {
        this._update.firstName = this._update.firstName.toLowerCase();
    }
    if (this._update.middleName) {
        this._update.middleName = this._update.middleName.toLowerCase();
    }
    if (this._update.lastName) {
        this._update.lastName = this._update.lastName.toLowerCase();
    }
    if (this._update.mobileNumber) {
        this._update.mobileNumber = this._update.mobileNumber.toLowerCase();
    }
    if (this._update.email) {
        this._update.email = this._update.email.toLowerCase();
    }
    if (this._update.physicalAddress) {
        this._update.physicalAddress = this._update.physicalAddress.toLowerCase();
    }
    if (this._update.digitalAddress) {
        this._update.digitalAddress = this._update.digitalAddress.toLowerCase();
    }
    if (this._update.relationship) {
        this._update.relationship = this._update.relationship.toLowerCase();
    }
    if (this._update.gender) {
        this._update.gender = this._update.gender.toLowerCase();
    }
    next();
});

const NextOfKin = mongoose.model('NextOfKin', nextOfKinSchema);
module.exports = NextOfKin;