const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brandController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the model
 *           example: "corolla"
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the brand
 *           example: "toyota"
 *         logo:
 *           type: string
 *           description: Path to the brand's logo image
 *           example: "/uploads/logos/toyota.png"
 *         models:
 *           type: array
 *           description: List of vehicle models under this brand
 *           items:
 *             $ref: '#/components/schemas/Model'
 *       example:
 *         name: "toyota"
 *         logo: "/uploads/logos/toyota.png"
 *         models: [
 *           { name: "corolla" },
 *           { name: "camry" },
 *           { name: "rav4" }
 *         ]
 */

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: API endpoints for managing vehicle brands and their models
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of all brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       500:
 *         description: Internal server error
 */

router.get('/', BrandController.getAllBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Brand details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', BrandController.getBrandById);

/**
 * @swagger
 * /api/brands/name/{name}:
 *   get:
 *     summary: Get a brand by name
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand name
 *     responses:
 *       200:
 *         description: Brand details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.get('/name/:name', BrandController.getBrandByName);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', BrandController.createBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update an existing brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The brand ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', BrandController.updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand ID to delete
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', BrandController.deleteBrand);

module.exports = router;