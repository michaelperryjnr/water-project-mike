const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController')

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - continent
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the country
 *           example: "Canada"
 *         code:
 *           type: string
 *           description: The ISO 3166-1 alpha-2 country code
 *           example: "CA"
 *         continent:
 *           type: string
 *           description: The continent the country is located on
 *           example: "North America"
 *         capital:
 *           type: string
 *           description: The capital city of the country
 *           example: "Ottawa"
 *         currency:
 *           type: string
 *           description: The currency used in the country
 *           example: "CAD"
 *         officialLanguages:
 *           type: array
 *           items:
 *             type: string
 *           description: List of official languages spoken in the country
 *           example: ["English", "French"]
 *         flag:
 *           type: string
 *           description: URL or path to the country's flag image
 *           example: "https://example.com/flags/ca.png"
 *       example:
 *         name: "Canada"
 *         code: "CA"
 *         continent: "North America"
 *         capital: "Ottawa"
 *         currency: "CAD"
 *         officialLanguages: ["English", "French"]
 *         flag: "https://example.com/flags/ca.png"
 */


/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: API endpoints for managing countries
 */


/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of all countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       500:
 *         description: Internal server error
 */

router.get('/', countryController.getAllCountries);

/**
 * @swagger
 * /api/countries/{id}:
 *   get:
 *     summary: Get a country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The country ID
 *     responses:
 *       200:
 *         description: Country details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', countryController.getCountryById);

/**
 * @swagger
 * /api/countries:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       201:
 *         description: Country created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', countryController.createCountry);

/**
 * @swagger
 * /api/countries/{id}:
 *   put:
 *     summary: Update an existing country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The country ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', countryController.updateCountry);

/**
 * @swagger
 * /api/countries/{id}:
 *   delete:
 *     summary: Delete a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The country ID to delete
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', countryController.deleteCountry);

module.exports = router