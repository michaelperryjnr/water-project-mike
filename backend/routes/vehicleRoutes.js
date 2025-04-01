const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const uploadMiddleware = require("../middlewares/uploadMiddleware")

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - registrationNumber
 *         - vinNumber
 *         - vehicleType
 *         - brand
 *         - model
 *         - yearOfManufacturing
 *         - fuelType
 *         - transmissionType
 *         - sittingCapacity
 *         - weight
 *         - weightType
 *         - purchaseDate
 *         - costOfVehicle
 *       properties:
 *         registrationNumber:
 *           type: string
 *           description: Registration number (license plate) of the vehicle
 *           example: "GR-2345-23"
 *         vinNumber:
 *           type: string
 *           description: Vehicle Identification Number
 *           example: "1HGCM82633A123456"
 *         vehicleType:
 *           type: string
 *           enum: [sedan, suv, truck, van, pickup, minivan, bus, motorcycle, utility, coupe, saloon]
 *           description: Type of vehicle
 *           example: "sedan"
 *         brand:
 *           type: string
 *           description: ID of the vehicle brand
 *           example: "60d21b4667d0d8992e610c85"
 *         model:
 *           type: string
 *           description: Model of the vehicle
 *           example: "camry"
 *         yearOfManufacturing:
 *           type: number
 *           description: Year the vehicle was manufactured
 *           example: 2022
 *         fuelType:
 *           type: string
 *           enum: [diesel, petrol, electric, hybrid, compressed natural gas, biofuel, ethanol, propane, hydrogen]
 *           description: Type of fuel used by the vehicle
 *           example: "petrol"
 *         transmissionType:
 *           type: string
 *           enum: [automatic, manual, semi-automatic, cvt]
 *           description: Type of transmission
 *           example: "automatic"
 *         sittingCapacity:
 *           type: number
 *           description: Number of people the vehicle can seat
 *           example: 5
 *         weight:
 *           type: number
 *           description: Weight of the vehicle
 *           example: 1500
 *         weightType:
 *           type: string
 *           enum: [kg, grams, tons]
 *           description: Unit of weight measurement
 *           example: "kg"
 *         color:
 *           type: string
 *           description: Color of the vehicle
 *           example: "silver"
 *         status:
 *           type: string
 *           enum: [available, in-use, maintenance, out-of-service, retired, reserved, auctioned, sold, disposed off]
 *           description: Current status of the vehicle
 *           example: "available"
 *         ownershipStatus:
 *           type: string
 *           enum: [owned, leased, rented, financed, borrowed, shared]
 *           description: Ownership status of the vehicle
 *           example: "owned"
 *         vehicleCondition:
 *           type: string
 *           enum: [new, used, damaged, salvage, repaired, refurbished]
 *           description: Condition of the vehicle
 *           example: "new"
 *         assignedDepartment:
 *           type: string
 *           description: ID of the department the vehicle is assigned to
 *           example: "60d21b4667d0d8992e610c86"
 *         assignedDriver:
 *           type: string
 *           description: ID of the employee assigned as the driver
 *           example: "60d21b4667d0d8992e610c87"
 *         isAvailableForPool:
 *           type: boolean
 *           description: Whether the vehicle is available for pool use
 *           example: true
 *         currentMileage:
 *           type: number
 *           description: Current mileage of the vehicle
 *           example: 45000
 *         purchaseDate:
 *           type: string
 *           format: date
 *           description: Date the vehicle was purchased
 *           example: "2022-01-15"
 *         costOfVehicle:
 *           type: number
 *           description: Cost of purchasing the vehicle
 *           example: 25000
 *         vehicleDescription:
 *           type: string
 *           description: Additional description of the vehicle
 *           example: "executive sedan with leather seats and sunroof"
 *         engineDescription:
 *           type: string
 *           description: Description of the vehicle's engine
 *           example: "2.5l 4-cylinder engine"
 *         pictures:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of URLs to vehicle images
 *         insurance:
 *           type: string
 *           description: ID of the insurance record
 *           example: "60d21b4667d0d8992e610c88"
 *         insuranceStartDate:
 *           type: string
 *           format: date
 *           description: Start date of the insurance coverage
 *           example: "2022-01-20"
 *         insuranceEndDate:
 *           type: string
 *           format: date
 *           description: End date of the insurance coverage
 *           example: "2023-01-19"
 *         roadWorth:
 *           type: string
 *           description: ID of the road worthiness certificate
 *           example: "60d21b4667d0d8992e610c89"
 *         roadWorthStartDate:
 *           type: string
 *           format: date
 *           description: Start date of the road worthiness certificate
 *           example: "2022-01-20"
 *         roadWorthEndDate:
 *           type: string
 *           format: date
 *           description: End date of the road worthiness certificate
 *           example: "2023-01-19"
 */

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: API for managing vehicles
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 */
router.get('/', vehicleController.getVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.get('/:id', vehicleController.getVehicleById);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *               vinNumber:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               yearOfManufacturing:
 *                 type: number
 *               fuelType:
 *                 type: string
 *               transmissionType:
 *                 type: string
 *               sittingCapacity:
 *                 type: number
 *               weight:
 *                 type: number
 *               weightType:
 *                 type: string
 *               color:
 *                 type: string
 *               status:
 *                 type: string
 *               ownershipStatus:
 *                 type: string
 *               vehicleCondition:
 *                 type: string
 *               assignedDepartment:
 *                 type: string
 *               assignedDriver:
 *                 type: string
 *               isAvailableForPool:
 *                 type: boolean
 *               currentMileage:
 *                 type: number
 *               purchaseDate:
 *                 type: string
 *               costOfVehicle:
 *                 type: number
 *               vehicleDescription:
 *                 type: string
 *               engineDescription:
 *                 type: string
 *               insurance:
 *                 type: string
 *               insuranceStartDate:
 *                 type: string
 *               insuranceEndDate:
 *                 type: string
 *               roadWorth:
 *                 type: string
 *               roadWorthStartDate:
 *                 type: string
 *               roadWorthEndDate:
 *                 type: string
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', uploadMiddleware.upload.array('pictures', 5), vehicleController.createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *               vinNumber:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               yearOfManufacturing:
 *                 type: number
 *               fuelType:
 *                 type: string
 *               transmissionType:
 *                 type: string
 *               sittingCapacity:
 *                 type: number
 *               weight:
 *                 type: number
 *               weightType:
 *                 type: string
 *               color:
 *                 type: string
 *               status:
 *                 type: string
 *               ownershipStatus:
 *                 type: string
 *               vehicleCondition:
 *                 type: string
 *               assignedDepartment:
 *                 type: string
 *               assignedDriver:
 *                 type: string
 *               isAvailableForPool:
 *                 type: boolean
 *               currentMileage:
 *                 type: number
 *               purchaseDate:
 *                 type: string
 *               costOfVehicle:
 *                 type: number
 *               vehicleDescription:
 *                 type: string
 *               engineDescription:
 *                 type: string
 *               insurance:
 *                 type: string
 *               insuranceStartDate:
 *                 type: string
 *               insuranceEndDate:
 *                 type: string
 *               roadWorth:
 *                 type: string
 *               roadWorthStartDate:
 *                 type: string
 *               roadWorthEndDate:
 *                 type: string
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.put('/:id', uploadMiddleware.upload.array('pictures', 5), vehicleController.updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', vehicleController.deleteVehicle);

/**
 * @swagger
 * /api/vehicles/status/{status}:
 *   get:
 *     summary: Get vehicles by status
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, in-use, maintenance, out-of-service, retired, reserved, auctioned, sold, disposed off]
 *         required: true
 *         description: Status of the vehicles to retrieve
 *     responses:
 *       200:
 *         description: List of vehicles with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 */
router.get('/status/:status', vehicleController.getVehiclesByStatus);

/**
 * @swagger
 * /api/vehicles/department/{departmentId}:
 *   get:
 *     summary: Get vehicles by department
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: List of vehicles assigned to the specified department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId', vehicleController.getVehiclesByDepartment);

/**
 * @swagger
 * /api/vehicles/driver/{driverId}:
 *   get:
 *     summary: Get vehicles by driver
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the driver (employee)
 *     responses:
 *       200:
 *         description: List of vehicles assigned to the specified driver
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 */
router.get('/driver/:driverId', vehicleController.getVehiclesByDriver);

/**
 * @swagger
 * /api/vehicles/brand/{brandId}:
 *   get:
 *     summary: Get vehicles by brand
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the brand
 *     responses:
 *       200:
 *         description: List of vehicles of the specified brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 */
router.get('/brand/:brandId', vehicleController.getVehiclesByBrand);

/**
 * @swagger
 * /api/vehicles/pool:
 *   get:
 *     summary: Get vehicles available for pool
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicles available for pool
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Server error
 */
router.get('/pool/available', vehicleController.getPoolVehicles);

/**
 * @swagger
 * /api/vehicles/{id}/status:
 *   put:
 *     summary: Update vehicle status
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, in-use, maintenance, out-of-service, retired, reserved, auctioned, sold, disposed off]
 *                 description: New status for the vehicle
 *     responses:
 *       200:
 *         description: Vehicle status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.put('/:id/status', vehicleController.updateVehicleStatus);

/**
 * @swagger
 * /api/vehicles/{id}/mileage:
 *   put:
 *     summary: Update vehicle mileage
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentMileage
 *             properties:
 *               currentMileage:
 *                 type: number
 *                 description: Current mileage of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle mileage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.put('/:id/mileage', vehicleController.updateVehicleMileage);

/**
 * @swagger
 * /api/vehicles/{id}/pictures:
 *   put:
 *     summary: Remove a picture from vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pictureUrl
 *             properties:
 *               pictureUrl:
 *                 type: string
 *                 description: URL of the picture to remove
 *     responses:
 *       200:
 *         description: Picture removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.put('/:id/pictures', vehicleController.removePicture);

/**
 * @swagger
 * /api/vehicles/{id}/driver:
 *   put:
 *     summary: Assign driver to vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: ID of the driver to assign
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.put('/:id/driver', vehicleController.assignDriver);

/**
 * @swagger
 * /api/vehicles/{id}/driver:
 *   delete:
 *     summary: Unassign driver from vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the vehicle
 *     responses:
 *       200:
 *         description: Driver unassigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/driver', vehicleController.unassignDriver);

module.exports = router;