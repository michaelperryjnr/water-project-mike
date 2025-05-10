const express = require("express");
const router = express.Router();
const InsuranceController = require("../controllers/insuranceController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Insurance:
 *       type: object
 *       required:
 *         - policyNumber
 *         - provider
 *         - coverageAmount
 *         - insuranceType
 *         - startDate
 *         - endDate
 *       properties:
 *         policyNumber:
 *           type: string
 *           description: The unique policy number
 *           example: "pol-123456"
 *         provider:
 *           type: string
 *           description: Insurance provider company name
 *           example: "nationwide"
 *         coverageAmount:
 *           type: number
 *           description: The amount of coverage in currency units
 *           example: 100000
 *         insuranceType:
 *           type: string
 *           enum: [health, life, auto, home, travel, business]
 *           description: Type of insurance policy
 *           example: "auto"
 *         autoInsuranceType:
 *           type: string
 *           enum: [comprehensive, third-party, collision, liability, uninsured motorist]
 *           description: Type of auto insurance (required if insuranceType is auto)
 *           example: "comprehensive"
 *         insuranceDescription:
 *           type: string
 *           description: Additional details about the insurance policy
 *           example: "full coverage auto insurance for sedan vehicles"
 *       example:
 *         policyNumber: "pol-123456"
 *         provider: "nationwide"
 *         coverageAmount: 100000
 *         insuranceType: "auto"
 *         autoInsuranceType: "comprehensive"
 *         insuranceDescription: "full coverage auto insurance for sedan vehicles"
 */

/**
 * @swagger
 * tags:
 *   name: Insurance
 *   description: API endpoints for managing insurance policies
 */

/**
 * @swagger
 * /api/insurance:
 *   get:
 *     summary: Get all insurance policies
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: List of all insurance policies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insurance'
 *       500:
 *         description: Internal server error
 */
router.get("/", InsuranceController.getAllInsurance);

/**
 * @swagger
 * /api/insurance/{id}:
 *   get:
 *     summary: Get an insurance policy by ID
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The insurance policy ID
 *     responses:
 *       200:
 *         description: Insurance policy details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       404:
 *         description: Insurance policy not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", InsuranceController.getInsuranceById);

/**
 * @swagger
 * /api/insurance/type/{type}:
 *   get:
 *     summary: Get insurance policies by type
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum: [health, life, auto, home, travel, business]
 *         required: true
 *         description: The insurance type
 *     responses:
 *       200:
 *         description: List of insurance policies of the specified type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insurance'
 *       404:
 *         description: No insurance policies found with the specified type
 *       500:
 *         description: Internal server error
 */
router.get("/type/:type", InsuranceController.getInsuranceByType);

/**
 * @swagger
 * /api/insurance/expiring:
 *   get:
 *     summary: Get insurance policies expiring within a date range
 *     tags: [Insurance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for the expiration range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for the expiration range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of insurance policies expiring in the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insurance'
 *       400:
 *         description: Bad request - missing date parameters
 *       500:
 *         description: Internal server error
 */
router.get("/expiring", InsuranceController.getExpiringPolicies);

/**
 * @swagger
 * /api/insurance:
 *   post:
 *     summary: Create a new insurance policy
 *     tags: [Insurance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insurance'
 *     responses:
 *       201:
 *         description: Insurance policy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       400:
 *         description: Bad request - invalid input or validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", InsuranceController.createInsurance);

/**
 * @swagger
 * /api/insurance/{id}:
 *   put:
 *     summary: Update an existing insurance policy
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The insurance policy ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insurance'
 *     responses:
 *       200:
 *         description: Insurance policy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       400:
 *         description: Bad request - invalid input or validation error
 *       404:
 *         description: Insurance policy not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", InsuranceController.updateInsurance);

/**
 * @swagger
 * /api/insurance/{id}:
 *   delete:
 *     summary: Delete an insurance policy
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The insurance policy ID to delete
 *     responses:
 *       200:
 *         description: Insurance policy deleted successfully
 *       404:
 *         description: Insurance policy not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", InsuranceController.deleteInsurance);

module.exports = router;
