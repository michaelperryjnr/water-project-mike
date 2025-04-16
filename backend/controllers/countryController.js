//controllers/countryController.js
const Country = require('../models/Country')
const Logger = require('../utils/logger')


//Get all countries
exports.getAllCountries = async (req, res) => {
    try {
        Logger("Fetched all countries", req, "countryController", "info")
        const country = await Country.find();
        res.status(200).json(country)
    } catch (error) {
        Logger("Error fetching countries", req, "countryController", "error", error)
        res.status(500).json({ message: error.message });
    }
};


//Get a single country by ID
exports.getCountryById = async (req, res) => {
    try {
        Logger("Fetched country by ID", req, "countryController", "info")
        const country = await Country.findById(req.params.id);
        if (!country) return res.status(404).json({ message: 'Country not found' });
            res.status(200).json(country);
    } catch (error) {
        Logger("Error fetching country by ID", req, "countryController", "error", error)
        res.status(500).json({ message: error.message });
    }
};


//Create a new country
exports.createCountry = async(req, res) => {
    try {
        Logger("Creating new country", req, "countryController", "info")
        const country = new Country(req.body);
        await country.save();
        res.status(201).json(country);
    } catch (error) {
        Logger("Error creating country", req, "countryController", "error", error)
        res.status(400).json({ message: error.message });
    }
};



//Update a country by ID
exports.updateCountry = async (req, res) => {
    try {
        Logger("Updating country", req, "countryController", "info")
        const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if (!country) return res.status(404).json({ message: 'Country not found'});
        res.status(200).json(country);
    } catch (error) {
        Logger("Error updating country", req, "countryController", "error", error)
        res.status(400).json({ message: error.message });
    }
};




//Delete a country
exports.deleteCountry = async (req, res) => {
    try {
        Logger("Deleting country", req, "countryController", "info")
        const country = await Country.findByIdAndDelete(req.params.id);
        if (!country) return res.status(404).json({ message: 'Country not found'});
        res.status(200).json(country);
    } catch (error) {
        Logger("Error deleting country", req, "countryController", "error", error)
        res.status(400).json({ message: error.message });
    }
};