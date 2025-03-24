const express = require ('express');
const router = express.Router();
const PositionController = require('../controllers/positionController')

/**
 * @swagger
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       required:
 *         - positionTitle
 *         - positionDescription
 *         - positionBaseSalary
 *       properties:
 *         positionTitle:
 *           type: string
 *           description: The title of the position
 *           example: "Software Engineer"
 *         positionDescription:
 *           type: string
 *           description: A detailed description of the position
 *           example: "Responsible for developing and maintaining web applications."
 *         positionBaseSalary:
 *           type: number
 *           description: The base salary for the position
 *           example: 75000
 *         positionResponsibilities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of responsibilities for the position
 *           example: ["Develop software", "Write tests", "Collaborate with teams"]
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *           description: Required qualifications or certifications for the position
 *           example: ["BSc in Computer Science", "5 years of experience"]
 *         isActive:
 *           type: boolean
 *           description: Status to indicate if the position is currently active
 *           example: true
 *       example:
 *         positionTitle: "Software Engineer"
 *         positionDescription: "Responsible for developing and maintaining web applications."
 *         positionBaseSalary: 75000
 *         positionResponsibilities: ["Develop software", "Write tests", "Collaborate with teams"]
 *         qualifications: ["BSc in Computer Science", "5 years of experience"]
 *         isActive: true
 */


/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: API endpoints for managing positions
 */

/**
 * @swagger
 * /api/positions:
 *   get:
 *     summary: Get all positions
 *     tags: [Positions]
 *     responses:
 *       200:
 *         description: List of all positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Position'
 *       500:
 *         description: Internal server error
 */


router.get('/', PositionController.getAllPositions);

/**
 * @swagger
 * /api/positions/{id}:
 *   get:
 *     summary: Get a position by ID
 *     tags: [Positions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The position ID
 *     responses:
 *       200:
 *         description: Position details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Position'
 *       404:
 *         description: Position not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', PositionController.getPositionById);

/**
 * @swagger
 * /api/positions:
 *   post:
 *     summary: Create a new position
 *     tags: [Positions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       201:
 *         description: Position created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', PositionController.createPosition);

/**
 * @swagger
 * /api/positions/{id}:
 *   put:
 *     summary: Update an existing position
 *     tags: [Positions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The position ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       200:
 *         description: Position updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Position not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', PositionController.updatePosition);

/**
 * @swagger
 * /api/positions/{id}:
 *   delete:
 *     summary: Delete a position
 *     tags: [Positions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The position ID to delete
 *     responses:
 *       200:
 *         description: Position deleted successfully
 *       404:
 *         description: Position not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', PositionController.deletePosition);


module.exports = router