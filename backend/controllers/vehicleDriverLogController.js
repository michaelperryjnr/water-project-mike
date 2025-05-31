const VehicleDriverLog = require("../models/VehicleDriver")
const Logger = require("../utils/logger")

// get all vehicle driver logs
exports.getVehicleDriverLogs = async(req, res) => {
    try{
        Logger("Fetching all vehicle driver logs", req, "vehicleDriverLogController")
        const vehicleDriverLogs = await VehicleDriverLog.find()
            .populate({
                path:"vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: 'firstName lastName staffNumber email mobilePhone'
            })

            const totalCount = await VehicleDriverLog.countDocuments()

            res.status(200).json({
                success: true,
                logs: vehicleDriverLogs,
                totalCount: totalCount,
            });
    }catch(error){
        Logger("Failed to fetch vehicle driver logs", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}


// get a single driver log by ID
exports.getVehicleDriverLogById = async(req, res) => {
    try{
        Logger("Fetching vehicle driver log by ID", req, "vehicleDriverLogController")
        const vehicleDriverLogs = await VehicleDriverLog.findById(req.params.id)
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make year yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })

        const totalCount = await VehicleDriverLog.countDocuments({_id: req.params.id})

        if (!vehicleDriverLogs) return res.status(404).json({message: "Vehicle driver log not found"})
        res.status(200).json({
            success: true,
            logs: vehicleDriverLogs,
            totalCount: totalCount,
        });
    }catch(error){
        Logger("Failed to fetch vehicle driver log by ID", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}


// create a new vehicle driver log
exports.createVehicleDriverLog = async (req, res) => {
    try{
        Logger("Creating new vehicle driver log", req, "vehicleDriverLogController")
        const vehicleDriverLogData = req.body

        const newVehicleDriverLog = new VehicleDriverLog(vehicleDriverLogData)
        const savedVehicleDriverLog = await newVehicleDriverLog.save();

        const populateVehicleDriverLog = await savedVehicleDriverLog.populate([
            {
                path: "vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            },
            {
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            }
        ])
        
        res.status(201).json(populateVehicleDriverLog);
    } catch(error) {
        Logger("Failed to create new vehicle driver log", req, "vehicleDriverLogController", "error", error)
        if(error.name === "ValidationError") {
            res.status(400).json({
                message: "Validation Failed.",
                details: error.errors
            })
        } else {
            res.status(400).json({
                message: "Failed to create Vehicle driver log.",
                details: error.message
            })
        }
    }
}


// update existing vehicle driver log
exports.updateVehicleDriverLog = async (req, res) => {
    try{
        Logger("Updating vehicle driver log", req, "vehicleDriverLogController")
        const updatedVehicleDriverLog = await VehicleDriverLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })

        if (!updatedVehicleDriverLog) return res.status(404).json({message: "Vehicle driver log not found."})
        res.status(200).json(updatedVehicleDriverLog)
    } catch(error) {
        Logger("Failed to update vehicle driver log", req, "vehicleDriverLogController", "error", error)
        res.status(400).json({message: error.message})
    }
}

// delete a vehicle driver log
exports.deleteVehicleDriverLog = async (req, res) => {
    try{
        Logger("Deleting vehicle driver log", req, "vehicleDriverLogController")
        const deletedVehicleDriverLog = await VehicleDriverLog.findByIdAndDelete(req.params.id)

        if (!deletedVehicleDriverLog) return res.status(404).json({message: "Vehicle driver log not found."})

        res.status(200).json({message: "Vehicle driver log deleted.", deletedVehicleDriverLog })
    } catch(error) {
        Logger("Failed to delete vehicle driver log", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}

// get all vehicle log by vehicle ID
exports.getVehicleDriverLogsByVehicleId = async (req, res) => {
    try{
        Logger("Fetching vehicle driver logs by vehicle ID", req, "vehicleDriverLogController")
        const vehicleDriverLogs = await VehicleDriverLog.find({ vehicleId: req.params.vehicleId})
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })
            .sort({assignmentStartDate: -1})

        res.status(200).json(vehicleDriverLogs)
    } catch(error) {
        Logger("Failed to fetch vehicle driver logs by vehicle ID", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}


// get all vehicle driver logs by employee ID
exports.getVehicleDriverLogsByEmployeeId = async (req, res) => {
    try {
        Logger("Fetching vehicle driver logs by employee ID", req, "vehicleDriverLogController")
        const vehicleDriverLogs = await VehicleDriverLog.find({employeeId: req.params.employeeId})
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })
            .sort({assignmentStartDate: -1})

            res.status(200).json(vehicleDriverLogs)
    } catch (error) {
        Logger("Failed to fetch vehicle driver logs by employee ID", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}

// get active vehicle driver logs
exports.getActiveVehicleDriverLogs = async (req, res) => {
    try {
        Logger("Fetching active vehicle driver logs", req, "vehicleDriverLogController")
        const activeVehicleDriverLogs = await VehicleDriverLog.find({status: "active"})
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })
        
        res.status(200).json(activeVehicleDriverLogs)
    } catch (error) {
        Logger("Failed to fetch active vehicle driver logs", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}

// complete a vehicle driver log assignment
exports.completeVehicleDriverLog = async (req, res) => {
    try {
        Logger("Completing vehicle driver log assignment", req, "vehicleDriverLogController")
        const {odometerReadingAtEnd, notes}  = req.body

        const updatedVehicleDriverLog = await VehicleDriverLog.findByIdAndUpdate(
            req.params.id,
            {
                status: "completed",
                assignmentEndDate: new Date(),
                odometerReadingAtEnd,
                notes
            },
            { new: true}
        )
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })

        if (!updatedVehicleDriverLog) return res.status(404).json({message: "Vehicle driver log not found."})
        
        res.status(200).json(updatedVehicleDriverLog)
    } catch (error) {
        Logger("Failed to complete vehicle driver log assignment", req, "vehicleDriverLogController", "error", error)
        res.status(500).json({message: error.message})
    }
}
