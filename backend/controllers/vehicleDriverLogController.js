const VehicleDriverLog = require("../models/VehicleDriver")

// get all vehicle driver logs
exports.getVehicleDriverLogs = async(req, res) => {
    try{
        const vehicleDriverLogs = await VehicleDriverLogs.find()
            .populate({
                path:"vehicleId",
                select: "registrationNumber model make yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: 'firsName lastName staffNumber email mobilePhone'
            })

        res.status(200).json(vehicleDriverLogs)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


// get a single driver log by ID
exports.getVehicleDriverLogByID = async(req, res) => {
    try{
        const vehicleDriverLog = await VehicleDriverLog.findById(req.params.id)
            .populate({
                path: "vehicleId",
                select: "registrationNumber model make year yearOfManufacture"
            })
            .populate({
                path: "employeeId",
                select: "firstName lastName staffNumber email mobilePhone"
            })

        if (!vehicleDriverLog) return res.status(404).json({message: "Vehicle driver log not found"})
        res.status(200).json(vehicleDriverLog);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


// create a new vehicle driver log
exports.createVehicleDriverLog = async (req, res) => {
    try{
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
        res.status(400).json({message: error.message})
    }
}

// delete a vehicle driver log
exports.deleteVehicleDriverLog = async (req, res) => {
    try{
        const deletedVehicleDriverLog = await VehicleDriverLog.findByIdAndDelete(req.params.id)

        if (!deletedVehicleDriverLog) return res.status(404).json({message: "Vehicle driver log not found."})

        res.status(200).json({message: "Vehicle driver log deleted.", deletedVehicleDriverLog })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

// get all vehicle log by vehicle ID
exports.getVehicleDriverLogsByVehicleId = async (req, res) => {
    try{
        const vehicleDriverLogs = await VehicleDriverLog.find({ vehicleId: req.params.id})
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
        res.status(500).json({message: error.message})
    }
}


// get all vehicle driver logs by employee ID
exports.getVehicleDriverLogsByEmployeeId = async (req, res) => {
    try {
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
        res.status(500).json({message: error.message})
    }
}

// get active vehicle driver logs
exports.getActiveVehicleDriverLogs = async (req, res) => {
    try {
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
        res.status(500).json({message: error.message})
    }
}

// complete a vehicle driver log assignment
exports.completeVehicleDriverLog = async (req, res) => {
    try {
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

        if (!updatedDriverLog) return res.status(404).json({message: "Vehicle driver log not found."})
        
        res.status(200).json(updatedVehicleDriverLog)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
