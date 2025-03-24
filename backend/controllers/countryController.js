//controllers/countryController.js
const Country = require('../models/Country')


//Get all countries
exports.getAllCountries = async (req, res) => {
    try {
        const country = await Country.find();
        res.status(200).json(country)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get a single country by ID
exports.getCountryById = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) return res.status(404).json({ message: 'Country not found' });
            res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Create a new country
exports.createCountry = async(req, res) => {
    try {
        const country = new Country(req.body);
        await country.save();
        res.status(201).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



//Update a country by ID
exports.updateCountry = async (req, res) => {
    try {
        const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if (!country) return res.status(404).json({ message: 'Country not found'});
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




//Delete a country
exports.deleteCountry = async (req, res) => {
    try {
        const country = await Country.findByIdAndDelete(req.params.id);
        if (!country) return res.status(404).json({ message: 'Country not found'});
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};