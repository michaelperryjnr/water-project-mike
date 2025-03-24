const express = require('express');
const router = express.Router();
const NextOfKinController = require('../controllers/nextOfKinController')

/**
 * @swagger
 * components:
 *   schemas:
 *     NextOfKin:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - mobileNumber
 *         - email
 *         - relationship
 *         - gender
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the next of kin
 *           example: "John"
 *         middleName:
 *           type: string
 *           description: The middle name of the next of kin
 *           example: "Doe"
 *         lastName:
 *           type: string
 *           description: The last name of the next of kin
 *           example: "Smith"
 *         mobileNumber:
 *           type: string
 *           description: The mobile phone number of the next of kin
 *           example: "1234567890"
 *         email:
 *           type: string
 *           description: The email address of the next of kin
 *           example: "john.doe@example.com"
 *         physicalAddress:
 *           type: string
 *           description: The physical address of the next of kin
 *           example: "123 Street Name, City, Country"
 *         digitalAddress:
 *           type: string
 *           description: The digital address of the next of kin
 *           example: "GZ-101-2020"
 *         relationship:
 *           type: string
 *           description: The relationship to the person
 *           enum: ['mother', 'father', 'uncle', 'aunty', 'son', 'daughter', 'spouse', 'cousin', 'brother', 'sister', 'grandparent', 'grandchild', 'niece', 'nephew']
 *           example: "father"
 *         gender:
 *           type: string
 *           description: The gender of the next of kin
 *           enum: [male, female]
 *           example: "male"
 *       example:
 *         firstName: "John"
 *         middleName: "Doe"
 *         lastName: "Smith"
 *         mobileNumber: "1234567890"
 *         email: "john.doe@example.com"
 *         physicalAddress: "123 Street Name, City, Country"
 *         digitalAddress: "GZ-101-2020"
 *         relationship: "father"
 *         gender: "male"
 */


/**
 * @swagger
 * tags:
 *   name: NextOfKin
 *   description: API endpoints for managing next of kin information
 */


/**
 * @swagger
 * /api/nextofkin:
 *   get:
 *     summary: Get all next of kin
 *     tags: [NextOfKin]
 *     responses:
 *       200:
 *         description: List of all next of kin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NextOfKin'
 *       500:
 *         description: Internal server error
 */

router.get('/', NextOfKinController.getAllNextOfKins);

/**
 * @swagger
 * /api/nextofkin/{id}:
 *   get:
 *     summary: Get a next of kin by ID
 *     tags: [NextOfKin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the next of kin
 *     responses:
 *       200:
 *         description: Next of kin details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NextOfKin'
 *       404:
 *         description: Next of kin not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', NextOfKinController.getNextOfKinById);

/**
 * @swagger
 * /api/nextofkin:
 *   post:
 *     summary: Create a new next of kin
 *     tags: [NextOfKin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NextOfKin'
 *     responses:
 *       201:
 *         description: Next of kin created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', NextOfKinController.createNextOfKin);

/**
 * @swagger
 * /api/nextofkin/{id}:
 *   put:
 *     summary: Update an existing next of kin
 *     tags: [NextOfKin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the next of kin to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NextOfKin'
 *     responses:
 *       200:
 *         description: Next of kin updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Next of kin not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', NextOfKinController.updateNextOfKin);

/**
 * @swagger
 * /api/nextofkin/{id}:
 *   delete:
 *     summary: Delete a next of kin
 *     tags: [NextOfKin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the next of kin to delete
 *     responses:
 *       200:
 *         description: Next of kin deleted successfully
 *       404:
 *         description: Next of kin not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', NextOfKinController.deleteNextOfKin);

module.exports = router