const Insurance = require("../models/Insurance")
const {STATUS_CODES} = require("../config/core")

// get all insurance policies
exports.getAllInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.find()

        res.status(STATUS_CODES.OK).json(insurance)
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}


// get insurance policy by ID

exports.getInsuranceById = async (req, res) => {
    try {
        const insurance = await Insurance.findById(req.params.id);

        if (!insurance) {
            return res.status(STATUS_CODES.NOT_FOUND).json({message: "Insurance policy not found."})
        }

        res.status(STATUS_CODES.OK).json(insurance)
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}

// create insurance policy
exports.createInsurance = async (req, res) => {
    try {
        // validate dates
        if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({message: "Start date must be before end date."})
        }

        // validate auto insurance type if applicable
        if (req.body.insuranceType === "auto" && !req.body.autoInsuranceType) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({message: "Auto insurance type is required for auto insurance."})
        }

        const insurance = new Insurance(req.body)
        await insurance.save()

        res.status(STATUS_CODES.CREATED).json(insurance)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(STATUS_CODES.BAD_REQUEST).json({message: error.message})
        }

        if (error.code === 11000) {
            return res.status(STATUS_CODES.CONFLICT).json({message: "Insurance policy already exists."})
        }

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}

// update insurance policy
exports.updateInsurance = async (req, res) => {
    try {
        // validate dates if both are provided
        if (req.body.startDate && req.body.endDate) {
            if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({message: "Start date must be before end date."})
            }
        }

        // validate auto insurance type if applicable
        if (req.body.insuranceType === "auto" && !req.body.autoInsuranceType) {
            // check if there's already an autoInsuranceType in the existing policy
            const existingInsurance = await Insurance.findById(req.params.id)
            if (existingInsurance && existingInsurance.autoInsuranceType) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({message: "Auto insurance type is required for auto insurance."})
            }
        }

        const insurance = await Insurance.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        )

        if (!insurance) {
            return res.status(STATUS_CODES.NOT_FOUND).json({message: "Insurance policy not found."})
        }

        res.status(STATUS_CODES.OK).json(insurance)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(STATUS_CODES.BAD_REQUEST).json({message: error.message})
        }

        if (error.code === 11000) {
            return res.status(STATUS_CODES.CONFLICT).json({message: "Insurance policy already exists."})
        }

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}


// delete insurance policy
exports.deleteInsurance = async (req, res) => {
    try {
       const insurance = await Insurance.findByIdAndDelete(req.params.id);
       
       if (!insurance) {
        return res.status(STATUS_CODES.NOT_FOUND).json({message: "Insurance Policy not found."})
       }

       res.status(STATUS_CODES.OK).json({message: "Insurance policy deleted."})
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}

// get insurance policies by type 
exports.getInsuranceByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const insurance = await Insurance.find({ insuranceType: type.toLowerCase() });
    
    if (insurance.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: `No insurance policies found with type: ${type}` });
    }
    
    res.status(STATUS_CODES.OK).json(insurance);
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get policies that expire within a given date range
exports.getExpiringPolicies = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Both startDate and endDate are required." });
    }
    
    const policies = await Insurance.find({
      endDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    res.status(STATUS_CODES.OK).json(policies);
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
