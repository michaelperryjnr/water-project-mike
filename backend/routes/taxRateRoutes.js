const express = require('express');
const router = express.Router();
const TaxRateController = require('../controllers/taxRateController');

/**
 * @swagger
 * components:
 *   schemas:
 *     TaxRate:
 *       type: object
 *       required:
 *         - name
 *         - rate
 *         - appliesTo
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the tax rate
 *           example: "Standard VAT"
 *         rate:
 *           type: number
 *           description: The tax rate percentage
 *           example: 20
 *         appliesTo:
 *           type: string
 *           enum: [Purchase, Sale, Both]
 *           description: Whether the tax applies to purchases, sales, or both
 *           example: "Both"
 *       example:
 *         name: "Standard VAT"
 *         rate: 20
 *         appliesTo: "Both"
 */

/**
 * @swagger
 * tags:
 *   name: Tax Rates
 *   description: API endpoints for managing tax rates
 */

/**
 * @swagger
 * /api/tax-rates:
 *   get:
 *     summary: Get all tax rates
 *     tags: [Tax Rates]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by tax rate name
 *       - in: query
 *         name: appliesTo
 *         schema:
 *           type: string
 *         description: Filter by where tax applies (Purchase, Sale, Both)
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Filter by minimum rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Filter by maximum rate
 *     responses:
 *       200:
 *         description: List of all tax rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaxRate'
 *       500:
 *         description: Internal server error
 */

router.get('/', TaxRateController.getAllTaxRates);

/**
 * @swagger
 * /api/tax-rates/{id}:
 *   get:
 *     summary: Get a tax rate by ID
 *     tags: [Tax Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The tax rate ID
 *     responses:
 *       200:
 *         description: Tax rate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TaxRate'
 *       404:
 *         description: Tax rate not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', TaxRateController.getTaxRateById);

/**
 * @swagger
 * /api/tax-rates:
 *   post:
 *     summary: Create a new tax rate
 *     tags: [Tax Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxRate'
 *     responses:
 *       201:
 *         description: Tax rate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TaxRate'
 *       400:
 *         description: Invalid input or duplicate tax rate name
 *       500:
 *         description: Internal server error
 */

router.post('/', TaxRateController.createTaxRate);

/**
 * @swagger
 * /api/tax-rates/{id}:
 *   put:
 *     summary: Update an existing tax rate
 *     tags: [Tax Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The tax rate ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxRate'
 *     responses:
 *       200:
 *         description: Tax rate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TaxRate'
 *       400:
 *         description: Invalid input or duplicate tax rate name
 *       404:
 *         description: Tax rate not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', TaxRateController.updateTaxRate);

/**
 * @swagger
 * /api/tax-rates/{id}:
 *   delete:
 *     summary: Delete a tax rate
 *     tags: [Tax Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The tax rate ID to delete
 *     responses:
 *       200:
 *         description: Tax rate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete tax rate in use by inventory items
 *       404:
 *         description: Tax rate not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', TaxRateController.deleteTaxRate);

/**
 * @swagger
 * /api/tax-rates/bulk:
 *   post:
 *     summary: Create multiple tax rates in bulk
 *     tags: [Tax Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TaxRate'
 *     responses:
 *       201:
 *         description: Tax rates created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaxRate'
 *       400:
 *         description: Invalid input, duplicate names, or empty array
 *       500:
 *         description: Internal server error
 */

router.post('/bulk', TaxRateController.bulkCreateTaxRates);

/**
 * @swagger
 * /api/tax-rates/calculate:
 *   post:
 *     summary: Calculate tax amount based on value and tax rate ID
 *     tags: [Tax Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taxRateId
 *               - value
 *             properties:
 *               taxRateId:
 *                 type: string
 *                 description: ID of the tax rate to use
 *               value:
 *                 type: number
 *                 description: Base value to calculate tax on
 *               type:
 *                 type: string
 *                 enum: [Purchase, Sale]
 *                 description: Transaction type for tax applicability check
 *             example:
 *               taxRateId: "60d21b4667d0d8992e610c85"
 *               value: 100
 *               type: "Sale"
 *     responses:
 *       200:
 *         description: Tax calculation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     taxRate:
 *                       type: number
 *                     baseValue:
 *                       type: number
 *                     taxAmount:
 *                       type: number
 *                     totalWithTax:
 *                       type: number
 *       400:
 *         description: Invalid input or tax not applicable to transaction type
 *       404:
 *         description: Tax rate not found
 *       500:
 *         description: Internal server error
 */

router.post('/calculate', TaxRateController.calculateTax);

module.exports = router;