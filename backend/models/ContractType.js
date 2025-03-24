//models/ContractType.js

const mongoose = require('mongoose');

const VALID_DURATION_UNIT = ['days', 'weeks', 'months', 'years'];


const contractTypeSchema = new mongoose.Schema({
    contractTypeName: { type: String, required: true, unique: true },
    contractTypeDescription: { type: String },
    duration: { type: Number, min: [1, 'Duration must be at least 1'],default: null },
    durationUnit: { type: String, enum: VALID_DURATION_UNIT, default: null },
    isActive: { type: Boolean, default: true }, // Indicates if the contract type is still active
}, { timestamps: true });//Automatically adds `createdAt and updatedAt


// Pre-save hook to convert contractTypeName and contractTypeDescription to lowercase
contractTypeSchema.pre('save', function (next) {
    if (this.contractTypeName) {
        this.contractTypeName = this.contractTypeName.toLowerCase();
    }
    if (this.contractTypeDescription) {
        this.contractTypeDescription = this.contractTypeDescription.toLowerCase();
    }
    next();
});

// Pre-update hook to convert contractTypeName and contractTypeDescription to lowercase
contractTypeSchema.pre('updateOne',{document: true, query: false}, function (next) {
    if (this._update.contractTypeName) {
        this._update.contractTypeName = this._update.contractTypeName.toLowerCase();
    }
    if (this._update.contractTypeDescription) {
        this._update.contractTypeDescription = this._update.contractTypeDescription.toLowerCase();
    }
    next();
});

const ContractType = mongoose.model('ContractType', contractTypeSchema);

module.exports = ContractType;