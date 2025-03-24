//controllers/positionController.js
const Position = require('../models/Position')


//Get all positions
exports.getAllPositions = async (req, res) => {
    try {
        const position = await Position.find();
        res.status(200).json(position)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};



//Get a single Position by ID
exports.getPositionById = async (req, res) => {
    try {
        const position = await Position.findById(req.params.id);
        if (!position) return res.status(404).json({ message: 'Position not found' });
        res.status(200).json(position);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//Create a new position
exports.createPosition = async (req, res) => {
    try {
        const position = new Position(req.body);
        await position.save();
        res.status(201).json(position)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




//Update a position by ID
exports.updatePosition = async (req, res) => {
    try {
        const position = await Position.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if (!position) return res.status(404).json({ message: 'Position not found'});
        res.status(200).json(position)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};




//Delete a position
exports.deletePosition = async (req, res) => {
    try {
        const position = await Position.findByIdAndDelete(req.params.id);
        if (!position) return res.status(404).json({ message: 'Position not found'});
        res.status(200).json(position);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};