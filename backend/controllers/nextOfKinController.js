//controllers/nextOfKinController.js
const NextOfKin = require('../models/NextOfKin')


//Get all nextOfKins
exports.getAllNextOfKins = async (req, res) => {
    try {
        const nextOfKin = await NextOfKin.find();
        res.status(200).json(nextOfKin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




//Get a single nextOfKin by ID
exports.getNextOfKinById = async (req, res) => {
    try {
        const nextOfKin = await NextOfKin.findById(req.params.id);
        if(!nextOfKin) return res.status(404).json({ message: 'Next of kin not found' });
        res.status(200).json(nextOfKin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




//Create a new nextOfKin
exports.createNextOfKin = async (req, res) => {
    try {
        const nextOfKin = new NextOfKin(req.body);
        await nextOfKin.save();
        res.status(201).json(nextOfKin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




//Update a nextOfKin by ID
exports.updateNextOfKin = async(req, res) => {
    try {
        const nextOfKin = await NextOfKin.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if(!nextOfKin) return res.status(404).json({ message: 'Next of Kin not found'});
        res.status(200).json(nextOfKin);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};



//Delete a nextOfKin
exports.deleteNextOfKin = async (req, res) => {
    try {
        const nextOfKin = await NextOfKin.findByIdAndDelete(req.params.id);
        if(!nextOfKin) return res.status(404).json({ message: 'Next of kin not found' });
        res.status(200).json(nextOfKin)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};