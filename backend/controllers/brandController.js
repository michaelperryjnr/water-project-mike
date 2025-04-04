const Brand = require("../models/Brand")
const {STATUS_CODES} = require("../config/core")

// get all brands in db

exports.getAllBrands = async (req, res) =>{
    try {
        const brands = await Brand.find()

        res.status(STATUS_CODES.OK).json(brands)
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}

// get brand by id
exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(STATUS_CODES.NOT_FOUND).json({message: "Brand not found."})
        }

        res.status(STATUS_CODES.OK).json(brand)
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}


// create brand
exports.createBrand = async (req, res) => {
    try {

        const brand = new Brand(req.body)
        await brand.save()

        res.status(STATUS_CODES.CREATED).json(brand)

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}


// update brand
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Brand not found.'});

        res.status(STATUS_CODES.OK).json(brand);
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
}

//Delete a brand
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Brand not found.'});

        res.status(STATUS_CODES.OK).json({ message: 'Brand deleted.' });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};