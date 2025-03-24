const express = require('express');
const router = express.Router();
const ContractTypeController = require('../controllers/contractTypeController')

/**
 * @swagger
 * components:
 *   schemas:
 *     ContractType:
 *       type: object
 *       required:
 *         - contractTypeName
 *         - contractTypeDuration
 *         - contractTypeDurationUnit
 *       properties:
 *         contractTypeName:
 *           type: string
 *           description: The name of the contract type (e.g., 'full-time', 'part-time', 'temporary')
 *           example: "full-time"
 *         contractTypeDescription:
 *           type: string
 *           description: A description of the contract type
 *           example: "This contract type is for employees working full-time hours."
 *         contractTypeDuration:
 *           type: number
 *           description: Duration of the contract
 *           example: 12
 *         contractTypeDurationUnit:
 *           type: string
 *           description: Unit of duration (days, weeks, months, years)
 *           example: "months"
 *         isActive:
 *           type: boolean
 *           description: Indicates whether the contract type is still active
 *           example: true
 *       example:
 *         contractTypeName: "full-time"
 *         contractTypeDescription: "This contract type is for employees working full-time hours."
 *         contractTypeDuration: 12
 *         contractTypeDurationUnit: "months"
 *         isActive: true
 */

/**
 * @swagger
 * tags:
 *   name: ContractTypes
 *   description: API endpoints for managing contract types
 */

/**
 * @swagger
 * /api/contracttypes:
 *   get:
 *     summary: Get all contract types
 *     tags: [ContractTypes]
 *     responses:
 *       200:
 *         description: List of all contract types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContractType'
 *       500:
 *         description: Internal server error
 */

router.get('/', ContractTypeController.getAllContracTypes);

/**
 * @swagger
 * /api/contracttypes/{id}:
 *   get:
 *     summary: Get a contract type by ID
 *     tags: [ContractTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contract type ID
 *     responses:
 *       200:
 *         description: Contract type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContractType'
 *       404:
 *         description: Contract type not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', ContractTypeController.getContractTypeById);

/**
 * @swagger
 * /api/contracttypes:
 *   post:
 *     summary: Create a new contract type
 *     tags: [ContractTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractType'
 *     responses:
 *       201:
 *         description: Contract type created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', ContractTypeController.createContractType);

/**
 * @swagger
 * /api/contracttypes/{id}:
 *   put:
 *     summary: Update an existing contract type
 *     tags: [ContractTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The contract type ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractType'
 *     responses:
 *       200:
 *         description: Contract type updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Contract type not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', ContractTypeController.updateContractType);

/**
 * @swagger
 * /api/contracttypes/{id}:
 *   delete:
 *     summary: Delete a contract type
 *     tags: [ContractTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contract type ID to delete
 *     responses:
 *       200:
 *         description: Contract type deleted successfully
 *       404:
 *         description: Contract type not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', ContractTypeController.deleteContractType);


module.exports = router