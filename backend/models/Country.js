//models/Country.js

const mongoose = require('mongoose')




const countrySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Country name
    code: { type: String, required: true, unique: true }, // ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')
    continent: { type: String, required: true }, // Continent name (e.g., 'Africa', 'Europe')
    capital: { type: String }, // Capital city of the country
    currency: { type: String }, // Currency used in the country (e.g., 'USD', 'EUR')
    officialLanguages: { type: [String], default: [] }, // List of official languages spoken
    flag: { type: String }, // URL or path to the country's flag image
});


//Pre-save hook to convert country name, code, continent, capital, currency and officialLanguages to lowercase
countrySchema.pre('save', function (next) {
    if (this.name) {
        this.name = this.name.toLowerCase();
    }
    if (this.code) {
        this.code = this.code.toLowerCase();
    }
    if (this.continent) {
        this.continent = this.continent.toLowerCase();
    }
    if (this.capital) {
        this.capital = this.capital.toLowerCase();
    }
    if (this.currency) {
        this.currency = this.currency.toLowerCase();
    }
    if (this.officialLanguages && Array.isArray(this.officialLanguages)) {
        this.officialLanguages = this.officialLanguages.map(language => language.toLowerCase());
    }
    next();
});


//Pre-save hook to convert country name, code, continent, capital, currency and officialLanguages to lowercase during update
countrySchema.pre('update', function (next) {
    if (this._update.name) {
        this._update.name = this._update.name.toLowerCase();
    }
    if (this._update.code) {
        this._update.code = this._update.code.toLowerCase();
    }
    if (this._update.continent) {
        this._update.continent = this._update.continent.toLowerCase();
    }
    if (this._update.capital) {
        this._update.capital = this._update.capital.toLowerCase();
    }
    if (this._update.currency) {
        this._update.currency = this._update.currency.toLowerCase();
    }
    if (this._update.officialLanguages && Array.isArray(this._update.officialLanguages)) {
        this._update.officialLanguages = this._update.officialLanguages.map(language => language.toLowerCase());
    }
    next();
});


const Country = mongoose.model('Country', countrySchema);

module.exports = Country;