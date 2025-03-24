//models/Nationality.js

const mongoose = require('mongoose');

const nationalitySchema = new mongoose.Schema({
    nationalityName: { type: String, required: true, unique: true },
});


//Pre-save hook to convert nationalityName to lowercase
nationalitySchema.pre('save', function (next) {
    if (this.nationalityName) {
        this.nationalityName = this.nationalityName.toLowerCase();
    }
    next();
});

//Pre-update hook to convert nationalityName to lowercase during update
nationalitySchema.pre('findOneAndUpdate', function (next) {
    if (this._update.nationalityName) {
        this._update.nationalityName = this._update.nationalityName.toLowerCase();
    }
    next();
})


const Nationality = mongoose.model('Nationality', nationalitySchema);

module.exports = Nationality;