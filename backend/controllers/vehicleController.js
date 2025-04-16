const Vehicle = require("../models/Vehicle");
const Logger = require("../utils/logger");

// Get all vehicles
exports.getVehicles = async (req, res) => {
    try {
        Logger("Fetching all vehicles", req, "vehicleController");
        const vehicles = await Vehicle.find()
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            })
            .populate('insurance')
            .populate('roadWorth');
        res.status(200).json(vehicles);
    } catch (error) {
        Logger("Failed to fetch vehicles", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        Logger("Fetching vehicle by ID", req, "vehicleController");
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            })
            .populate('insurance')
            .populate('roadWorth');

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(vehicle);
    } catch (error) {
        Logger("Failed to fetch vehicle by ID", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        Logger("Creating new vehicle", req, "vehicleController");
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }

        const vehicleData = req.body;

        if (req.files && req.files.length > 0) {
            vehicleData.pictures = req.files.map(file => `/uploads/${file.filename}`);
        }

        const newVehicle = new Vehicle(vehicleData);
        const savedVehicle = await newVehicle.save();

        const populatedVehicle = await savedVehicle.populate([
            'brand',
            'assignedDepartment',
            'assignedDriver',
            'insurance',
            'roadWorth'
        ]);

        res.status(201).json(populatedVehicle);
    } catch (error) {
        Logger("Failed to create vehicle", req, "vehicleController", "error", error);
        console.error('Error creating vehicle:', error);
        if (error.code === 11000) {
            res.status(400).json({
                message: 'Duplicate key error. A vehicle with this registration number or VIN already exists.',
                details: error.keyValue,
            });
        } else if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Validation failed.',
                details: error.errors,
            });
        } else {
            res.status(400).json({
                message: 'Failed to create vehicle.',
                details: error.message,
            });
        }
    }
};

// Update an existing vehicle
exports.updateVehicle = async (req, res) => {
    try {
        Logger("Updating vehicle", req, "vehicleController");
        const vehicleData = req.body;
        if (req.files && req.files.length > 0) {
            const existingVehicle = await Vehicle.findById(req.params.id);
            vehicleData.pictures = [
                ...(existingVehicle.pictures || []),
                ...req.files.map(file => `/uploads/${file.filename}`)
            ];
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id, 
            vehicleData, 
            { new: true, runValidators: true }
        )
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            })
            .populate('insurance')
            .populate('roadWorth');

        if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(updatedVehicle);
    } catch (error) {
        Logger("Failed to update vehicle", req, "vehicleController", "error", error);
        console.error('Error updating vehicle:', error);
        if (error.code === 11000) {
            res.status(400).json({
                message: 'Duplicate key error. A vehicle with this registration number or VIN already exists.',
                details: error.keyValue,
            });
        } else if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Validation failed.',
                details: error.errors,
            });
        } else {
            res.status(400).json({
                message: 'Failed to update vehicle.',
                details: error.message,
            });
        }
    }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        Logger("Deleting vehicle", req, "vehicleController");
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json({ message: 'Vehicle deleted', deletedVehicle });
    } catch (error) {
        Logger("Failed to delete vehicle", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by status
exports.getVehiclesByStatus = async (req, res) => {
    try {
        Logger("Fetching vehicles by status", req, "vehicleController");
        const { status } = req.params;
        const vehicles = await Vehicle.find({ status })
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });
        
        res.status(200).json(vehicles);
    } catch (error) {
        Logger("Failed to fetch vehicles by status", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by department
exports.getVehiclesByDepartment = async (req, res) => {
    try {
        Logger("Fetching vehicles by department", req, "vehicleController");
        const { departmentId } = req.params;
        const vehicles = await Vehicle.find({ assignedDepartment: departmentId })
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });
        
        res.status(200).json(vehicles);
    } catch (error) {
        Logger("Failed to fetch vehicles by department", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by assigned driver
exports.getVehiclesByDriver = async (req, res) => {
    try {
        Logger("Fetching vehicles by driver", req, "vehicleController");
        const { driverId } = req.params;
        const vehicles = await Vehicle.find({ assignedDriver: driverId })
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });
        
        res.status(200).json(vehicles);
    } catch (error) {
        Logger("Failed to fetch vehicles by driver", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by brand
exports.getVehiclesByBrand = async (req, res) => {
    try {
        Logger("Fetching vehicles by brand", req, "vehicleController");
        const { brandId } = req.params;
        const vehicles = await Vehicle.find({ brand: brandId })
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });
        
        res.status(200).json(vehicles);
    } catch (error) {
        Logger("Failed to fetch vehicles by brand", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles available for pool
exports.getPoolVehicles = async (req, res) => {
    try {
        Logger("Fetching vehicles available for pool", req, "vehicleController");
        const vehicles = await Vehicle.find({ 
            isAvailableForPool: true,
            status: 'available'
        })
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            });
        
        res.status(200).json(vehicles);
    } catch (error) {
        Logger("Failed to fetch vehicles available for pool", req, "vehicleController", "error", error);
        res.status(500).json({ message: error.message });
    }
};

// Update vehicle status
exports.updateVehicleStatus = async (req, res) => {
    try {
        Logger("Updating vehicle status", req, "vehicleController");
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });

        if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(updatedVehicle);
    } catch (error) {
        Logger("Failed to update vehicle status", req, "vehicleController", "error", error);
        res.status(400).json({ message: error.message });
    }
};

// Update vehicle mileage
exports.updateVehicleMileage = async (req, res) => {
    try {
        Logger("Updating vehicle mileage", req, "vehicleController");
        const { currentMileage } = req.body;
        
        if (!currentMileage) {
            return res.status(400).json({ message: 'Current mileage is required' });
        }
        
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        
        if (currentMileage < vehicle.currentMileage) {
            return res.status(400).json({ 
                message: 'New mileage cannot be less than the current mileage',
                currentMileage: vehicle.currentMileage
            });
        }
        
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { currentMileage },
            { new: true }
        )
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });

        res.status(200).json(updatedVehicle);
    } catch (error) {
        Logger("Failed to update vehicle mileage", req, "vehicleController", "error", error);
        res.status(400).json({ message: error.message });
    }
};

// Remove picture from vehicle
exports.removePicture = async (req, res) => {
    try {
        Logger("Removing picture from vehicle", req, "vehicleController");
        const { pictureUrl } = req.body;
        
        if (!pictureUrl) {
            return res.status(400).json({ message: 'Picture URL is required' });
        }
        
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        
        // Filter out the specified picture
        const updatedPictures = vehicle.pictures.filter(pic => pic !== pictureUrl);
        
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { pictures: updatedPictures },
            { new: true }
        )
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });

        res.status(200).json(updatedVehicle);
    } catch (error) {
        Logger("Failed to remove picture from vehicle", req, "vehicleController", "error", error);
        res.status(400).json({ message: error.message });
    }
};

// Assign driver to vehicle
exports.assignDriver = async (req, res) => {
    try {
        Logger("Assigning driver to vehicle", req, "vehicleController");
        const { driverId } = req.body;
        
        if (!driverId) {
            return res.status(400).json({ message: 'Driver ID is required' });
        }
        
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { 
                assignedDriver: driverId,
                status: 'in-use'
            },
            { new: true }
        )
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            })
            .populate({
                path: 'assignedDriver',
                select: 'firstName lastName staffNumber email phoneNumber'
            });

        if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(updatedVehicle);
    } catch (error) {
        Logger("Failed to assign driver to vehicle", req, "vehicleController", "error", error);
        res.status(400).json({ message: error.message });
    }
};

// Unassign driver from vehicle
exports.unassignDriver = async (req, res) => {
    try {
        Logger("Unassigning driver from vehicle", req, "vehicleController");
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { 
                assignedDriver: null,
                status: 'available'
            },
            { new: true }
        )
            .populate('brand')
            .populate({
                path: 'assignedDepartment',
                select: 'departmentName departmentDescription departmentHead'
            });

        if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(updatedVehicle);
    } catch (error) {
        Logger("Failed to unassign driver from vehicle", req, "vehicleController", "error", error);
        res.status(400).json({ message: error.message });
    }
};