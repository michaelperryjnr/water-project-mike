const Vehicle = require("../models/Vehicle");
const fs = require("fs");
const path = require("path");

// Get all vehicles
exports.getVehicles = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError.message });
        }

        const vehicleData = req.body;

        if (req.files && req.files.length > 0) {
            vehicleData.pictures = req.files.map(file => `/uploads/vehicles/${file.filename}`);
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
        const vehicleData = req.body;

        // Validate insurance and roadworthiness dates
        if (vehicleData.insuranceStartDate && vehicleData.insuranceEndDate) {
            if (new Date(vehicleData.insuranceEndDate) <= new Date(vehicleData.insuranceStartDate)) {
                return res.status(400).json({ message: "Insurance end date must be after start date" });
            }
        }
        if (vehicleData.roadWorthStartDate && vehicleData.roadWorthEndDate) {
            if (new Date(vehicleData.roadWorthEndDate) <= new Date(vehicleData.roadWorthStartDate)) {
                return res.status(400).json({ message: "Roadworthiness end date must be after start date" });
            }
        }

        if (req.files && req.files.length > 0) {
            const existingVehicle = await Vehicle.findById(req.params.id);
            vehicleData.pictures = [
                ...(existingVehicle.pictures || []),
                ...req.files.map(file => `/uploads/vehicles/${file.filename}`)
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
        // Find the vehicle to get the pictures array
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        // Delete associated images from the filesystem
        if (vehicle.pictures && vehicle.pictures.length > 0) {
            for (const picturePath of vehicle.pictures) {
                const absolutePath = path.join(__dirname, '..', picturePath);
                try {
                    if (fs.existsSync(absolutePath)) {
                        fs.unlinkSync(absolutePath);
                    }
                } catch (fileError) {
                    console.warn(`Failed to delete file ${absolutePath}: ${fileError.message}`);
                    // Continue with deletion even if a file fails to delete
                }
            }
        }

        // Delete the vehicle record from the database
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Vehicle deleted', deletedVehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by status
exports.getVehiclesByStatus = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by department
exports.getVehiclesByDepartment = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by assigned driver
exports.getVehiclesByDriver = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles by brand
exports.getVehiclesByBrand = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Get vehicles available for pool
exports.getPoolVehicles = async (req, res) => {
    try {
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
        res.status(500).json({ message: error.message });
    }
};

// Update vehicle status
exports.updateVehicleStatus = async (req, res) => {
    try {
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
        res.status(400).json({ message: error.message });
    }
};

// Update vehicle mileage
exports.updateVehicleMileage = async (req, res) => {
    try {
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
        res.status(400).json({ message: error.message });
    }
};

// Remove picture from vehicle
exports.removePicture = async (req, res) => {
    try {
        const { pictureUrl } = req.body;
        
        if (!pictureUrl) {
            return res.status(400).json({ message: 'Picture URL is required' });
        }
        
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        
        // Delete the file from the filesystem
        const filePath = path.join(__dirname, '..', pictureUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

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
        res.status(400).json({ message: error.message });
    }
};

// Assign driver to vehicle
exports.assignDriver = async (req, res) => {
    try {
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
        res.status(400).json({ message: error.message });
    }
};

// Unassign driver from vehicle
exports.unassignDriver = async (req, res) => {
    try {
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
        res.status(400).json({ message: error.message });
    }
};