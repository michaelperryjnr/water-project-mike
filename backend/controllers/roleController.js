//controller/roleController.js
const Role = require('../models/Role');

exports.getRoleById = async (req, res) => {
    try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};