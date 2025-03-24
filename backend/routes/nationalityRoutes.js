const express = require('express');
const router = express.Router();
const nationalityController = require('../controllers/nationalityController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Nationality:
 *       type: object
 *       required:
 *         - nationalityName
 *       properties:
 *         nationalityName:
 *           type: string
 *           description: The name of the nationality
 *           example: "canadian"
 *       example:
 *         nationalityName: "canadian"
 */

/**
 * @swagger
 * tags:
 *   name: Nationalities
 *   description: API endpoints for managing nationalities
 */


/**
 * @swagger
 * /api/nationalities:
 *   get:
 *     summary: Get all nationalities
 *     tags: [Nationalities]
 *     responses:
 *       200:
 *         description: List of all nationalities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nationality'
 *       500:
 *         description: Internal server error
 */

router.get('/', nationalityController.getAllNationalities);

/**
 * @swagger
 * /api/nationalities/{id}:
 *   get:
 *     summary: Get a nationality by ID
 *     tags: [Nationalities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The nationality ID
 *     responses:
 *       200:
 *         description: Nationality details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nationality'
 *       404:
 *         description: Nationality not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', nationalityController.getNationalityById);

/**
 * @swagger
 * /api/nationalities:
 *   post:
 *     summary: Create a new nationality
 *     tags: [Nationalities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nationality'
 *     responses:
 *       201:
 *         description: Nationality created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', nationalityController.createNationality);

/**
 * @swagger
 * /api/nationalities/{id}:
 *   put:
 *     summary: Update an existing nationality
 *     tags: [Nationalities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The nationality ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nationality'
 *     responses:
 *       200:
 *         description: Nationality updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Nationality not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', nationalityController.updateNationality);

/**
 * @swagger
 * /api/nationalities/{id}:
 *   delete:
 *     summary: Delete a nationality
 *     tags: [Nationalities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The nationality ID to delete
 *     responses:
 *       200:
 *         description: Nationality deleted successfully
 *       404:
 *         description: Nationality not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', nationalityController.deleteNationality);


module.exports = router;