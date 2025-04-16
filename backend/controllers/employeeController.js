// controllers/employeeController.js
const Employee = require('../models/Employee');
const Logger = require('../utils/logger');

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        Logger("Fetched all employees", req, "employeeController", "info")
        const employees = await Employee.find()
            .populate({
                path: 'nextOfKin',
                select: 'firstName lastName mobileNumber email relationship gender'
            })  // Populating NextOfKin (employee's emergency contact)
            .populate('position')   // Populating Position (employee's role)
            .populate({
                path: 'department',
                select: 'departmentName departmentDescription departmentHead'
            }) // Populating Department (department employee works in)
            .populate('nationality') // Populating Nationality
            .populate({
                path: 'country',
                select: 'name code continent capital flag'
            })     // Populating Country
            .populate('contractType'); // Populating Contract Type
        res.status(200).json(employees);
    } catch (error) {
        Logger("Error fetching employees", req, "employeeController", "error", error)
        res.status(500).json({ message: error.message });
    }
};

// Get a single employee by ID
/* exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('title')
            .populate('maritalStatus')
            .populate('gender')
            .populate('nextOfKin')
            .populate({
                path: 'position',
                select: 'name salary', //Fetch position name and salary
            })
            .populate('department');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; */

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        Logger("Fetched employee by ID", req, "employeeController", "info")
        const employee = await Employee.findById(req.params.id)
/*             .populate('nextOfKin')  // Populating NextOfKin
            .populate('position')   // Populating Position
            .populate('department') // Populating Department
            .populate('nationality') // Populating Nationality
            .populate('country')     // Populating Country
            .populate('contractType'); // Populating Contract Type */
            
            .populate({
                path: 'nextOfKin',
                select: 'firstName lastName mobileNumber email relationship gender'
            })  // Populating NextOfKin (employee's emergency contact)
            .populate('position')   // Populating Position (employee's role)
            .populate({
                path: 'department',
                select: 'departmentName departmentDescription departmentHead'
            }) // Populating Department (department employee works in)
            .populate('nationality') // Populating Nationality
            .populate({
                path: 'country',
                select: 'name code continent capital flag'
            })     // Populating Country
            .populate('contractType'); // Populating Contract Type
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        Logger("Error fetching employee by ID", req, "employeeController", "error", error)
        res.status(500).json({ message: error.message });
    }
};

// Create a new employee
/* exports.createEmployee = async (req, res) => {
    try {
        //Check for multer errors
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }

        const employeeData = req.body;

        //If a file was uploaded, add the file path to the employeeData object
        if (req.file) {
            employeeData.image = `/uploads/${req.file.filename}`;
        }

        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();

        // Populating after save to get full employee details with referenced fields
        const populatedEmployee = await savedEmployee.populate([
            'nextOfKin',
            'position',
            'department',
            'nationality',
            'country',
            'contractType'
        ]); // Executing the populate operation

        res.status(201).json(populatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; */

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    Logger("Creating new employee", req, "employeeController", "info")
    // Check for multer errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    /* console.log('Received body:', req.body); */ // Debug incoming data
    /* console.log('Received file:', req.file); */ // Debug uploaded file

    const employeeData = req.body;

    // If a file was uploaded, add the file path to the employeeData object
    if (req.file) {
      employeeData.picture = `/uploads/${req.file.filename}`; // Note: Changed 'image' to 'picture' to match schema
    }
    const newEmployee = new Employee(employeeData);
    const savedEmployee = await newEmployee.save();

    // Populating after save to get full employee details with referenced fields
    const populatedEmployee = await savedEmployee.populate([
      'nextOfKin',
      'position',
      'department',
      'nationality',
      'country',
      'contractType',
    ]);

    res.status(201).json(populatedEmployee);
  } catch (error) {
    Logger("Error creating employee", req, "employeeController", "error", error)
    if (error.code === 11000) {
      res.status(400).json({
        message: 'Duplicate key error. A record with this email or staff number already exists.',
        details: error.keyValue,
      });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({
        message: 'Validation failed.',
        details: error.errors,
      });
    } else {
      res.status(400).json({
        message: 'Failed to create employee.',
        details: error.message,
      });
    }
  }
};

/* // Update an existing employee
exports.updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; */

// Update an existing employee
exports.updateEmployee = async (req, res) => {
    try {
        Logger("Updating employee", req, "employeeController", "info")
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('nextOfKin')  // Populating NextOfKin after update
            .populate('position')   // Populating Position after update
            .populate('department') // Populating Department after update
            .populate('nationality') // Populating Nationality after update
            .populate('country')     // Populating Country after update
            .populate('contractType'); // Populating Contract Type after update

        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        Logger("Error updating employee", req, "employeeController", "error", error)
        res.status(400).json({ message: error.message });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        Logger("Deleting employee", req, "employeeController", "info")
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted', deletedEmployee });
    } catch (error) {
        Logger("Error deleting employee", req, "employeeController", "error", error)
        res.status(500).json({ message: error.message });
    }
};
