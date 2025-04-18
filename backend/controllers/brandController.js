const Brand = require("../models/Brand")
const {STATUS_CODES} = require("../config/core")
const Logger = require("../utils/logger")

// get all brands in db

exports.getAllBrands = async (req, res) =>{
    try {
        Logger("Fetched all brands", req, "brandController", "info")
        const brands = await Brand.find()

        res.status(STATUS_CODES.OK).json(brands)
    } catch (error) {
        Logger("Error fetching brands", req, "brandController", "error", error)

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}

// get brand by id
exports.getBrandById = async (req, res) => {
    try {
        Logger("Fetched brand by ID", req, "brandController", "info")
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(STATUS_CODES.NOT_FOUND).json({message: "Brand not found."})
        }

        res.status(STATUS_CODES.OK).json(brand)
    } catch (error) {
        Logger("Error fetching brand by ID", req, "brandController", "error", error)
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}


// Get brand by name
exports.getBrandByName = async (req, res) => {
    try {
      // Normalize the brand name: lowercase and trim spaces
      const brandName = req.params.name.toLowerCase().trim();
      console.log("Searching for brand:", brandName); // Debug log
  
      // Query the database with the normalized name
      const brand = await Brand.findOne({ name: brandName });
      console.log("Brand found:", brand); // Debug log
  
      if (!brand) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Brand not found." });
      }
  
      res.status(STATUS_CODES.OK).json(brand);
    } catch (error) {
      console.error("Error in getBrandByName:", error);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };


// create brand
exports.createBrand = async (req, res) => {
    try {
        Logger("Creating new brand", req, "brandController", "info")
        const brand = new Brand(req.body)

        await brand.save()

        res.status(STATUS_CODES.CREATED).json(brand)

    } catch (error) {
        Logger("Error creating brand", req, "brandController", "error", error)
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}


// update brand
exports.updateBrand = async (req, res) => {
    try {
        Logger("Updating brand", req, "brandController", "info")
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!brand) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Brand not found.'});

        res.status(STATUS_CODES.OK).json(brand);
    } catch (error) {
        Logger("Error updating brand", req, "brandController", "error", error)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
}

//Delete a brand
exports.deleteBrand = async (req, res) => {
    try {
        Logger("Deleting brand", req, "brandController", "info")
        const brand = await Brand.findByIdAndDelete(req.params.id);

        if (!brand) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Brand not found.'});

        res.status(STATUS_CODES.OK).json({ message: 'Brand deleted.' });
    } catch (error) {
        Logger("Error deleting brand", req, "brandController", "error", error)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};