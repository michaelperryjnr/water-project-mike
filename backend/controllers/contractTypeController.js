//controllers/contractTypeController.js
const ContractType = require('../models/ContractType')
const Logger = require('../utils/logger')


//Get all contract types
exports.getAllContracTypes = async (req, res) => {
    try {
        Logger("Fetched all contract types", req, "contractTypeController", "info");
        const contractType = await ContractType.find();

        res.status(200).json(contractType);
    } catch (error) {
        Logger("Error fetching contract types", req, "contractTypeController", "error", error);

        res.status(500).json({ message: error.message });
    }
};



//Get a single contract type by ID
exports.getContractTypeById = async (req, res) => {
    try {
        Logger("Fetched contract type by ID", req, "contractTypeController", "info");
        const contractType = await ContractType.findById(req.params.id);

        if (!contractType) return res.status(404).json({ message: "Contract type not found" });
        res.status(200).json(contractType);
    } catch (error) {
        Logger("Error fetching contract type by ID", req, "contractTypeController", "error", error);

        res.status(500).json({ message: error.message });
    }
};



//Create a new contract type
exports.createContractType = async (req, res) => {
    try {
        Logger("Creating new contract type", req, "contractTypeController", "info");
        const contractType = new ContractType(req.body);

        await contractType.save();
        res.status(201).json(contractType);
    } catch (error) {
        Logger("Error creating contract type", req, "contractTypeController", "error", error);

        res.status(400).json({ message: error.message });
    }
};



//Update a contract type
exports.updateContractType = async (req, res) => {
    try {
        Logger("Updating contract type", req, "contractTypeController", "info");
        const contractType = await ContractType.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!contractType) return res.status(404).json({ message: 'Contract type not'});
        res.status(200).json(contractType);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};




//Delete a contract type
exports.deleteContractType = async (req, res) => {
    try {
        Logger("Deleting contract type", req, "contractTypeController", "info");
        const contractType = await ContractType.findByIdAndDelete(req.params.id);

        if (!contractType) return res.status(404).json({ message: 'Contract type not'});
        res.status(200).json({ message: 'Contract type deleted' });
    } catch (error) {
        Logger("Error deleting contract type", req, "contractTypeController", "error", error);

        res.status(400).json({ message: error.message });
    }
};