/* //controllers/departmentController.js
const Department = require('../models/Department');


//Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
        .populate('departmentHead') //Populate department head with employee details
        
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//Get a single department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if(!department) return res.status(404).json({ message: "Department not found" });
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};



//Create a new Department
exports.createDepartment = async(req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



//Update a department by ID
exports.updateDepartment = async(req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!department) return res.status(404).json({ message: "Department not found" });
        res.status(200).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




//Delete a department
exports.deleteDepartment = async(req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if(!department) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; */


/* const Department = require('../models/Department');

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find(); // Remove .populate('departmentHead')
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new Department
exports.createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a department by ID
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; */


const Department = require('../models/Department');
const Logger = require('../utils/logger');

// Utility function to transform departmentHead into a full name string
const transformDepartmentHead = (department) => {
  if (!department.departmentHead) {
    return { ...department.toObject(), departmentHead: 'N/A' };
  }
  const fullName = [
    department.departmentHead.firstName,
    department.departmentHead.middleName || '',
    department.departmentHead.lastName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  return { ...department.toObject(), departmentHead: fullName || 'N/A' };
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    Logger('Fetched all departments', req, 'departmentController', 'info');
    const departments = await Department.find()
      .populate('departmentHead', 'firstName middleName lastName'); // Populate only the name fields
    const transformedDepartments = departments.map(transformDepartmentHead);
    res.status(200).json(transformedDepartments);
  } catch (error) {
    Logger('Error fetching departments', req, 'departmentController', 'error', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    Logger('Fetched department by ID', req, 'departmentController', 'info');
    const department = await Department.findById(req.params.id)
      .populate('departmentHead', 'firstName middleName lastName');
    if (!department) return res.status(404).json({ message: "Department not found" });
    const transformedDepartment = transformDepartmentHead(department);
    res.status(200).json(transformedDepartment);
  } catch (error) {
    Logger('Error fetching department by ID', req, 'departmentController', 'error', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new Department
exports.createDepartment = async (req, res) => {
  try {
    Logger('Creating new department', req, 'departmentController', 'info');
    const department = new Department(req.body);
    await department.save();
    // Populate departmentHead after saving
    await department.populate('departmentHead', 'firstName middleName lastName');
    const transformedDepartment = transformDepartmentHead(department);
    res.status(201).json(transformedDepartment);
  } catch (error) {
    Logger('Error creating department', req, 'departmentController', 'error', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a department by ID
exports.updateDepartment = async (req, res) => {
  try {
    Logger('Updating department', req, 'departmentController', 'info');
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('departmentHead', 'firstName middleName lastName');
    if (!department) return res.status(404).json({ message: "Department not found" });
    const transformedDepartment = transformDepartmentHead(department);
    res.status(200).json(transformedDepartment);
  } catch (error) {
    Logger('Error updating department', req, 'departmentController', 'error', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    Logger('Deleting department', req, 'departmentController', 'info');
    const department = await Department.findByIdAndDelete(req.params.id)
      .populate('departmentHead', 'firstName middleName lastName');
    if (!department) return res.status(404).json({ message: 'Department not found' });
    const transformedDepartment = transformDepartmentHead(department);
    res.status(200).json(transformedDepartment);
  } catch (error) {
    Logger('Error deleting department', req, 'departmentController', 'error', error);
    res.status(400).json({ message: error.message });
  }
};