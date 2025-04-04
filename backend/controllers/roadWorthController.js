const RoadWorth = require("../models/RoadWorth");
const { STATUS_CODES } = require("../config/core");

// Get all road worthiness certificates
exports.getAllRoadWorth = async (req, res) => {
  try {
    const roadWorth = await RoadWorth.find();
    res.status(STATUS_CODES.OK).json(roadWorth);
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get road worthiness certificate by ID
exports.getRoadWorthById = async (req, res) => {
  try {
    const roadWorth = await RoadWorth.findById(req.params.id);

    if (!roadWorth) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Road worthiness certificate not found." });
    }

    res.status(STATUS_CODES.OK).json(roadWorth);
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Create new road worthiness certificate
exports.createRoadWorth = async (req, res) => {
  try {
    // Validate dates
    if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "End date must be after start date."
      });
    }

    const roadWorth = new RoadWorth(req.body);
    await roadWorth.save();

    res.status(STATUS_CODES.CREATED).json(roadWorth);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Certificate with this number already exists." });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Update road worthiness certificate
exports.updateRoadWorth = async (req, res) => {
  try {
    // Validate dates if both are provided
    if (req.body.startDate && req.body.endDate && 
        new Date(req.body.startDate) >= new Date(req.body.endDate)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "End date must be after start date."
      });
    }

    const roadWorth = await RoadWorth.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!roadWorth) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Road worthiness certificate not found." });
    }

    res.status(STATUS_CODES.OK).json(roadWorth);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Certificate with this number already exists." });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Delete road worthiness certificate
exports.deleteRoadWorth = async (req, res) => {
  try {
    const roadWorth = await RoadWorth.findByIdAndDelete(req.params.id);
    
    if (!roadWorth) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Road worthiness certificate not found." });
    }

    res.status(STATUS_CODES.OK).json({ message: "Road worthiness certificate deleted." });
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get certificates expiring within a given date range
exports.getExpiringCertificates = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Both startDate and endDate are required." });
    }
    
    const certificates = await RoadWorth.find({
      endDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    res.status(STATUS_CODES.OK).json(certificates);
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get certificates by issuing authority
exports.getCertificatesByIssuer = async (req, res) => {
  try {
    const { issuer } = req.params;
    
    const certificates = await RoadWorth.find({ issuedBy: issuer.toLowerCase() });
    
    if (certificates.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: `No certificates found issued by: ${issuer}` });
    }
    
    res.status(STATUS_CODES.OK).json(certificates);
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};