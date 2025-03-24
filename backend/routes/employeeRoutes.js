const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - salary
 *         - gender
 *         - dateEmployed
 *         - contractType
 *       properties:
 *         staffNumber:
 *           type: string
 *           description: The unique staff number for the employee
 *           example: "EMP-ABC-12345"
 *         title:
 *           type: string
 *           description: Title of the employee (e.g., Mr., Mrs., etc.)
 *           example: "Mr."
 *         firstName:
 *           type: string
 *           description: First name of the employee
 *           example: "John"
 *         middleName:
 *           type: string
 *           description: Middle name of the employee
 *           example: "Doe"
 *         lastName:
 *           type: string
 *           description: Last name of the employee
 *           example: "Smith"
 *         DOB:
 *           type: string
 *           format: date
 *           description: Date of birth of the employee
 *           example: "1985-06-15"
 *         email:
 *           type: string
 *           description: Email address of the employee
 *           example: "john.smith@example.com"
 *         mobilePhone:
 *           type: string
 *           description: Mobile phone number of the employee
 *           example: "1234567890"
 *         homePhone:
 *           type: string
 *           description: Home phone number of the employee (optional)
 *           example: "0987654321"
 *         workPhone:
 *           type: string
 *           description: Work phone number of the employee (optional)
 *           example: "1122334455"
 *         position:
 *           type: string
 *           description: The employee's position ID
 *           example: "5f1a2b3c4d5e6f7g8h9i0j1k"
 *         department:
 *           type: string
 *           description: The employee's department ID
 *           example: "5f1a2b3c4d5e6f7g8h9i0j2l"
 *         nationalID:
 *           type: string
 *           description: National ID of the employee
 *           example: "A123456789"
 *         maritalStatus:
 *           type: string
 *           enum:
 *             - single
 *             - married
 *             - divorced
 *             - widowed
 *           description: Marital status of the employee
 *           example: "single"
 *         nationality:
 *           type: string
 *           description: The employee's nationality ID
 *           example: "5f1a2b3c4d5e6f7g8h9i0j3m"
 *         country:
 *           type: string
 *           description: The employee's country ID
 *           example: "5f1a2b3c4d5e6f7g8h9i0j4n"
 *         bloodGroup:
 *           type: string
 *           enum:
 *             - a+
 *             - a-
 *             - b+
 *             - b-
 *             - ab+
 *             - ab-
 *             - o+
 *             - o-
 *           description: Blood group of the employee
 *           example: "O+"
 *         usesTobacco:
 *           type: string
 *           enum:
 *             - yes
 *             - no
 *           description: Whether the employee uses tobacco
 *           example: "no"
 *         physicalAddress:
 *           type: string
 *           description: Physical address of the employee (optional)
 *           example: "123 Main St, Cityville"
 *         digitalAddress:
 *           type: string
 *           description: Digital address (e.g., postal code, P.O. Box) of the employee (optional)
 *           example: "P.O. Box 123"
 *         picture:
 *           type: string
 *           description: URL or path to the employee's picture (optional)
 *           example: "/uploads/employee-123456789.jpg"
 *         salary:
 *           type: number
 *           description: The salary of the employee
 *           example: 50000
 *         gender:
 *           type: string
 *           enum:
 *             - male
 *             - female
 *           description: Gender of the employee
 *           example: "male"
 *         isFullTime:
 *           type: boolean
 *           description: Whether the employee is full-time
 *           example: true
 *         dateEmployed:
 *           type: string
 *           format: date
 *           description: The date the employee was employed
 *           example: "2021-01-01"
 *         contractType:
 *           type: string
 *           description: The type of contract the employee has
 *           example: "5f1a2b3c4d5e6f7g8h9i0j2m"
 *         confirmed:
 *           type: boolean
 *           description: Whether the employee's probation is confirmed
 *           example: false
 *         confirmationDate:
 *           type: string
 *           format: date
 *           description: The date the employee's confirmation was done
 *           example: "2022-06-01"
 *         workAtHome:
 *           type: string
 *           enum:
 *             - yes
 *             - no
 *           description: Whether the employee works from home
 *           example: "yes"
 *         overTimeEligible:
 *           type: string
 *           enum:
 *             - yes
 *             - no
 *           description: Whether the employee is eligible for overtime
 *           example: "yes"
 *         probationStarted:
 *           type: boolean
 *           description: Indicates if the probation period has started
 *           example: true
 *         probationStart:
 *           type: string
 *           format: date
 *           description: Start date of the employee's probation
 *           example: "2021-01-01"
 *         probationEnd:
 *           type: string
 *           format: date
 *           description: End date of the employee's probation
 *           example: "2021-06-01"
 *         probationPeriod:
 *           type: number
 *           description: Duration of the employee's probation period
 *           example: 6
 *         probationUnit:
 *           type: string
 *           enum:
 *             - Days
 *             - Weeks
 *             - Months
 *           description: Unit of the probation period
 *           example: "Months"
 *         comments:
 *           type: string
 *           description: Additional comments about the employee
 *           example: "Excellent performance"
 *         baseCurrency:
 *           type: string
 *           description: The currency used for the employee's salary
 *           example: "USD"
 *         terminated:
 *           type: boolean
 *           description: Indicates if the employee has been terminated
 *           example: true
 *         terminationDate:
 *           type: string
 *           format: date
 *           description: The date when the employee was terminated, if applicable
 *           example: "2025-12-31"
 *       example:
 *         staffNumber: ""
 *         title: "mr."
 *         firstName: "John"
 *         middleName: "Doe"
 *         lastName: "Smith"
 *         DOB: "1985-06-15"
 *         nextOfKin: "60f8d0f7c9a11b4f08f54e3e"
 *         mobilePhone: "1234567890"
 *         homePhone: "0987654321"
 *         workPhone: "1122334455"
 *         email: "john.smith@example.com"
 *         position: "60f8d0f7c9a11b4f08f54e4f"
 *         department: "60f8d0f7c9a11b4f08f54e5f"
 *         nationalID: "AB1234567"
 *         maritalStatus: "married"
 *         nationality: "60f8d0f7c9a11b4f08f54e6f"
 *         country: "60f8d0f7c9a11b4f08f54e7f"
 *         bloodGroup: "o+"
 *         usesTobacco: "no"
 *         physicalAddress: "123 Main St, City, Country"
 *         digitalAddress: "gz-101-2020"
 *         picture: "/uploads/employee-123456789.jpg"
 *         salary: 60000
 *         gender: "male"
 *         isFullTime: false
 *         contractType: "60f8d0f7c9a11b4f08f54e8f"
 *         confirmed: false
 *         confirmationDate: ""
 *         workAtHome: "yes"
 *         overTimeEligible: "yes"
 *         probationStarted: false
 *         probationStart: ""
 *         probationEnd: ""
 *         probationPeriod: 6
 *         probationUnit: "months"
 *         comments: "Employee is on track for confirmation"
 *         baseCurrency: "usd"
 *         terminated: false
 *         terminationDate: ""
 */

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: API endpoints for managing employees
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get a list of all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of all employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: picture
 *         in: formData
 *         description: Profile picture of the employee
 *         required: false
 *         type: file
 *         format: binary
 *       - name: staffNumber
 *         in: formData
 *         description: The unique staff number for the employee
 *         required: false
 *         type: string
 *       - name: firstName
 *         in: formData
 *         description: First name of the employee
 *         required: true
 *         type: string
 *       - name: middleName
 *         in: formData
 *         description: Middle name of the employee
 *         type: string
 *       - name: lastName
 *         in: formData
 *         description: Last name of the employee
 *         required: true
 *         type: string
 *       - name: title
 *         in: formData
 *         description: Title of the employee (e.g., Mr., Mrs., etc.)
 *         required: true
 *         type: string
 *       - name: DOB
 *         in: formData
 *         description: Date of birth of the employee
 *         required: true
 *         type: string
 *         format: date
 *       - name: email
 *         in: formData
 *         description: Email address of the employee
 *         required: true
 *         type: string
 *       - name: mobilePhone
 *         in: formData
 *         description: Mobile phone number of the employee
 *         required: true
 *         type: string
 *       - name: homePhone
 *         in: formData
 *         description: Home phone number of the employee (optional)
 *         required: false
 *         type: string
 *       - name: workPhone
 *         in: formData
 *         description: Work phone number of the employee (optional)
 *         required: false
 *         type: string
 *       - name: position
 *         in: formData
 *         description: The employee's position ID
 *         required: false
 *         type: string
 *       - name: department
 *         in: formData
 *         description: The employee's department ID
 *         required: false
 *         type: string
 *       - name: nationalID
 *         in: formData
 *         description: National ID of the employee
 *         required: true
 *         type: string
 *       - name: maritalStatus
 *         in: formData
 *         description: Marital status of the employee
 *         required: true
 *         type: string
 *       - name: nationality
 *         in: formData
 *         description: The employee's nationality ID
 *         required: true
 *         type: string
 *       - name: country
 *         in: formData
 *         description: The employee's country ID
 *         required: true
 *         type: string
 *       - name: bloodGroup
 *         in: formData
 *         description: Blood group of the employee
 *         required: false
 *         type: string
 *       - name: usesTobacco
 *         in: formData
 *         description: Whether the employee uses tobacco
 *         required: false
 *         type: string
 *       - name: physicalAddress
 *         in: formData
 *         description: Physical address of the employee (optional)
 *         required: false
 *         type: string
 *       - name: digitalAddress
 *         in: formData
 *         description: Digital address (e.g., postal code, P.O. Box) of the employee (optional)
 *         required: false
 *         type: string
 *       - name: salary
 *         in: formData
 *         description: The salary of the employee
 *         required: true
 *         type: number
 *       - name: gender
 *         in: formData
 *         description: Gender of the employee
 *         required: true
 *         type: string
 *       - name: isFullTime
 *         in: formData
 *         description: Whether the employee is full-time
 *         required: false
 *         type: boolean
 *       - name: dateEmployed
 *         in: formData
 *         description: The date the employee was employed
 *         required: true
 *         type: string
 *         format: date
 *       - name: contractType
 *         in: formData
 *         description: The type of contract the employee has
 *         required: true
 *         type: string
 *       - name: confirmed
 *         in: formData
 *         description: Whether the employee's probation is confirmed
 *         required: false
 *         type: boolean
 *       - name: confirmationDate
 *         in: formData
 *         description: The date the employee's confirmation was done
 *         required: false
 *         type: string
 *         format: date
 *       - name: workAtHome
 *         in: formData
 *         description: Whether the employee works from home
 *         required: false
 *         type: string
 *       - name: overTimeEligible
 *         in: formData
 *         description: Whether the employee is eligible for overtime
 *         required: false
 *         type: string
 *       - name: probationStarted
 *         in: formData
 *         description: Indicates if the probation period has started
 *         required: false
 *         type: boolean
 *       - name: probationStart
 *         in: formData
 *         description: Start date of the employee's probation
 *         required: false
 *         type: string
 *         format: date
 *       - name: probationEnd
 *         in: formData
 *         description: End date of the employee's probation
 *         required: false
 *         type: string
 *         format: date
 *       - name: probationPeriod
 *         in: formData
 *         description: Duration of the employee's probation period
 *         required: false
 *         type: number
 *       - name: probationUnit
 *         in: formData
 *         description: Unit of the probation period
 *         required: false
 *         type: string
 *       - name: comments
 *         in: formData
 *         description: Additional comments about the employee
 *         required: false
 *         type: string
 *       - name: baseCurrency
 *         in: formData
 *         description: The currency used for the employee's salary
 *         required: true
 *         type: string
 *       - name: terminated
 *         in: formData
 *         description: Indicates if the employee has been terminated
 *         required: false
 *         type: boolean
 *       - name: terminationDate
 *         in: formData
 *         description: The date when the employee was terminated, if applicable
 *         required: false
 *         type: string
 *         format: date
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

module.exports = (upload) => {
  router.get('/', employeeController.getEmployees);
  router.get('/:id', employeeController.getEmployeeById);
  router.post('/', upload.single('picture'), employeeController.createEmployee);
  router.put('/:id', employeeController.updateEmployee);
  router.delete('/:id', employeeController.deleteEmployee);

  return router;
};