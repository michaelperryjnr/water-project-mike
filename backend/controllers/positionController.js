//controllers/positionController.js
const Position = require('../models/Position')
const Logger = require("../utils/logger")


//Get all positions
exports.getAllPositions = async (req, res) => {
    try {
        Logger("Fetching all positions", req, "positionController")
        const position = await Position.find();
        res.status(200).json(position)
    } catch (error) {
        Logger("Failed to fetch positions", req, "positionController", "error", error)
        res.status(500).json({ message: error.message })
    }
};



//Get a single Position by ID
exports.getPositionById = async (req, res) => {
    try {
        Logger("Fetching position by ID", req, "positionController")
        const position = await Position.findById(req.params.id);
        if (!position) return res.status(404).json({ message: 'Position not found' });
        res.status(200).json(position);
    } catch (error) {
        Logger("Failed to fetch position by ID", req, "positionController", "error", error)
        res.status(500).json({ message: error.message });
    }
};



//Create a new position
exports.createPosition = async (req, res) => {
    try {
        Logger("Creating new position", req, "positionController")
        const position = new Position(req.body);
        await position.save();
        res.status(201).json(position)
    } catch (error) {
        Logger("Failed to create new position", req, "positionController", "error", error)
        res.status(400).json({ message: error.message });
    }
};




//Update a position by ID
exports.updatePosition = async (req, res) => {
    try {
        Logger("Updating position", req, "positionController")
        const position = await Position.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if (!position) return res.status(404).json({ message: 'Position not found'});
        res.status(200).json(position)
    } catch (error) {
        Logger("Failed to update position", req, "positionController", "error", error)
        res.status(400).json({ message: error.message })
    }
};




//Delete a position
exports.deletePosition = async (req, res) => {
    try {
        Logger("Deleting position", req, "positionController")
        const position = await Position.findByIdAndDelete(req.params.id);
        if (!position) return res.status(404).json({ message: 'Position not found'});
        res.status(200).json(position);
    } catch (error) {
        Logger("Failed to delete position", req, "positionController", "error", error)
        res.status(400).json({ message: error.message });
    }
};