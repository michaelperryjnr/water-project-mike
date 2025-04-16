// controllers/nationalityController.js
const Nationality = require('../models/Nationality');
const Logger = require("../utils/logger")

//Get all nationalities
exports.getAllNationalities = async (req, res) => {
    try {
        Logger("Fetching all nationalities", req, "nationalityController")
        const nationalities = await Nationality.find();
        res.status(200).json(nationalities)
    } catch (error) {
        Logger("Failed to fetch nationalities", req, "nationalityController", "error", error)
        res.status(500).json({ message: error.message });
    }
};




//Get a single nationality by ID
exports.getNationalityById = async (req, res) => {
    try {
        Logger("Fetching nationalities by ID", req, "nationalityController")
        const nationality = await Nationality.findById(req.params.id)
        if (!nationality) return res.status(404).json({ message: 'Nationality not found' });
        res.status(200).json(nationality);
    } catch (error) {
        Logger("Failed to fetch nationalities by ID", req, "nationalityController", "error", error)
        res.status(500).json({ message: error.message });
    }
};



//Create a new nationality
exports.createNationality = async(req, res) => {
    try {
        Logger("Creating new nationality", req, "nationalityController")
        const nationality = new Nationality(req.body);
        await nationality.save();
        res.status(201).json(nationality);
    } catch (error) {
        Logger("Failed to create new nationality", req, "nationalityController", "error", error)
        res.status(400).json({ message: error.message });
    }
};



//Update a nationality by ID
exports.updateNationality = async(req, res)=> {
    try {
        Logger("Updating nationality", req, "nationalityController")
        const nationality = await Nationality.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!nationality) return res.status(404).json({ message: 'Nationality not found'});
        res.status(200).json(nationality);
    } catch (error) {
        Logger("Failed to update nationality", req, "nationalityController", "error", error)
        res.status(400).json({ message: error.message });
    }
};





//Delete a nationality
exports.deleteNationality = async(req, res) => {
    try {
        Logger("Deleting nationality", req, "nationalityController")
        const nationality = await Nationality.findByIdAndDelete(req.params.id);
        if (!nationality) return res.status(404).json({ message: 'Nationality not found'});
        res.status(200).json(nationality);
    } catch (error) {
        Logger("Failed to delete nationality", req, "nationalityController", "error", error)
        res.status(400).json({ message: error.message });
    }
};