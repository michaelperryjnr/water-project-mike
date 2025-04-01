const express = require('express');
const router = express.Router();
const vehicleDriverLogController = require('../controllers/vehicleDriverLogController');

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleDriverLog:
 *       type: object
 *       required:
 *         - vehicleId
 *         - employeeId
 *         - vehicleLocation
 *         - assignmentStartDate
 *       properties:
 *         vehicleId:
 *           type: string
 *           description: ID of the vehicle being assigned
 *           example: "60d21b4667d0d8992e610c85"
 *         employeeId:
 *           type: string
 *           description: ID of the employee who is assigned as the driver
 *           example: "60d21b4667d0d8992e610c86"
 *         vehicleLocation:
 *           type: string
 *           description: Current location of the vehicle
 *           example: "Accra Head Office"
 *         assignmentStartDate:
 *           type: string
 *           format: date-time
 *           description: Date when the assignment starts
 *           example: "2023-01-01T09:00:00.000Z"
 *         assignmentEndDate:
 *           type: string
 *           format: date-time
 *           description: Date when the assignment ends
 *           example: "2023-01-05T17:00:00.000Z"
 *         reasonForAssignment:
 *           type: string
 *           description: Reason why the vehicle is being assigned
 *           example: "assigned for field operations"
 *         odometerReadingAtStart:
 *           type: number
 *           description: Vehicle odometer reading at assignment start
 *           example: 45000
 *         odometerReadingAtEnd:
 *           type: number
 *           description: Vehicle odometer reading at assignment end
 *           example: 45350
 *         notes:
 *           type: string
 *           description: Additional notes about the assignment
 *           example: "driver reported low tire pressure"
 *         status:
 *           type: string
 *           enum: [active, completed, terminated]
 *           description: Current status of the assignment
 *           example: "active"
 */

/**
 * @swagger
 * tags:
 *   name: VehicleDriverLogs
 *   description: API for managing vehicle driver assignments
 */

/**
 * @swagger
 * /api/vehicle-driver-logs:
 *   get:
 *     summary: Get all vehicle driver logs
 *     tags: [VehicleDriverLogs]
 *     responses:
 *       200:
 *         description: List of all vehicle driver logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleDriverLog'
 *       500:
 *         description: Server error
 */
router.get('/', vehicleDriverLogController.getVehicleDriverLogs);

/**
 * @swagger
 * /api/vehicle-driver-logs/{id}:
 *   get:
 *     summary: Get vehicle driver log by ID
 *     tags: [VehicleDriverLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle driver log
 *     responses:
 *       200:
 *         description: Vehicle driver log details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleDriverLog'
 *       404:
 *         description: Vehicle driver log not found
 *       500:
 *         description: Server error
 */
router.get('/:id', vehicleDriverLogController.getVehicleDriverLogById);

/**
 * @swagger
 * /api/vehicle-driver-logs:
 *   post:
 *     summary: Create a new vehicle driver log
 *     tags: [VehicleDriverLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleDriverLog'
 *     responses:
 *       201:
 *         description: Vehicle driver log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleDriverLog'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', vehicleDriverLogController.createVehicleDriverLog);

/**
 * @swagger
 * /api/vehicle-driver-logs/{id}:
 *   put:
 *     summary: Update a vehicle driver log
 *     tags: [VehicleDriverLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle driver log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleDriverLog'
 *     responses:
 *       200:
 *         description: Vehicle driver log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleDriverLog'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle driver log not found
 *       500:
 *         description: Server error
 */
router.put('/:id', vehicleDriverLogController.updateVehicleDriverLog);

/**
 * @swagger
 * /api/vehicle-driver-logs/{id}:
 *   delete:
 *     summary: Delete a vehicle driver log
 *     tags: [VehicleDriverLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle driver log
 *     responses:
 *       200:
 *         description: Vehicle driver log deleted successfully
 *       404:
 *         description: Vehicle driver log not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', vehicleDriverLogController.deleteVehicleDriverLog);

/**
 * @swagger
 * /api/vehicle-driver-logs/vehicle/{vehicleId}:
 *   get:
 *     summary: Get all driver logs for a specific vehicle
 *     tags: [VehicleDriverLogs]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     responses:
 *       200:
 *         description: List of vehicle driver logs for the specified vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleDriverLog'
 *       500:
 *         description: Server error
 */
router.get('/vehicle/:vehicleId', vehicleDriverLogController.getVehicleDriverLogsByVehicleId);

/**
 * @swagger
 * /api/vehicle-driver-logs/employee/{employeeId}:
 *   get:
 *     summary: Get all driver logs for a specific employee
 *     tags: [VehicleDriverLogs]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the employee
 *     responses:
 *       200:
 *         description: List of vehicle driver logs for the specified employee
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleDriverLog'
 *       500:
 *         description: Server error
 */
router.get('/employee/:employeeId', vehicleDriverLogController.getVehicleDriverLogsByEmployeeId);

/**
 * @swagger
 * /api/vehicle-driver-logs/status/active:
 *   get:
 *     summary: Get all active vehicle driver logs
 *     tags: [VehicleDriverLogs]
 *     responses:
 *       200:
 *         description: List of all active vehicle driver logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleDriverLog'
 *       500:
 *         description: Server error
 */
router.get('/status/active', vehicleDriverLogController.getActiveVehicleDriverLogs);

/**
 * @swagger
 * /api/vehicle-driver-logs/{id}/complete:
 *   put:
 *     summary: Complete a vehicle driver log assignment
 *     tags: [VehicleDriverLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle driver log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - odometerReadingAtEnd
 *             properties:
 *               odometerReadingAtEnd:
 *                 type: number
 *                 description: Vehicle odometer reading at assignment end
 *                 example: 45350
 *               notes:
 *                 type: string
 *                 description: Additional notes about the completed assignment
 *                 example: "vehicle returned in good condition"
 *     responses:
 *       200:
 *         description: Vehicle driver log completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleDriverLog'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle driver log not found
 *       500:
 *         description: Server error
 */
router.put('/:id/complete', vehicleDriverLogController.completeVehicleDriverLog);

module.exports = router;