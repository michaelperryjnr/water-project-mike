const express = require('express');
const router = express.Router();
const RoadWorthController = require('../controllers/roadWorthController');

/**
 * @swagger
 * components:
 *   schemas:
 *     RoadWorth:
 *       type: object
 *       required:
 *         - certificateNumber
 *         - issuedBy
 *         - startDate
 *         - endDate
 *       properties:
 *         certificateNumber:
 *           type: string
 *           description: The unique certificate number
 *           example: "rwc-123456"
 *         issuedBy:
 *           type: string
 *           description: Authority that issued the certificate
 *           example: "dvla"
 *           default: "dvla"
 *         startDate:
 *           type: string
 *           format: date
 *           description: Certificate validity start date
 *           example: "2023-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           description: Certificate validity end date
 *           example: "2024-01-01"
 *       example:
 *         certificateNumber: "rwc-123456"
 *         issuedBy: "dvla"
 *         startDate: "2023-01-01"
 *         endDate: "2024-01-01"
 */

/**
 * @swagger
 * tags:
 *   name: RoadWorth
 *   description: API endpoints for managing road worthiness certificates
 */

/**
 * @swagger
 * /api/roadworth:
 *   get:
 *     summary: Get all road worthiness certificates
 *     tags: [RoadWorth]
 *     responses:
 *       200:
 *         description: List of all road worthiness certificates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoadWorth'
 *       500:
 *         description: Internal server error
 */
router.get('/', RoadWorthController.getAllRoadWorth);

/**
 * @swagger
 * /api/roadworth/{id}:
 *   get:
 *     summary: Get a road worthiness certificate by ID
 *     tags: [RoadWorth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The certificate ID
 *     responses:
 *       200:
 *         description: Certificate details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoadWorth'
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', RoadWorthController.getRoadWorthById);

/**
 * @swagger
 * /api/roadworth/issuer/{issuer}:
 *   get:
 *     summary: Get certificates by issuing authority
 *     tags: [RoadWorth]
 *     parameters:
 *       - in: path
 *         name: issuer
 *         schema:
 *           type: string
 *         required: true
 *         description: The issuing authority (e.g., 'dvla')
 *     responses:
 *       200:
 *         description: List of certificates from the specified issuer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoadWorth'
 *       404:
 *         description: No certificates found from the specified issuer
 *       500:
 *         description: Internal server error
 */
router.get('/issuer/:issuer', RoadWorthController.getCertificatesByIssuer);

/**
 * @swagger
 * /api/roadworth/expiring:
 *   get:
 *     summary: Get certificates expiring within a date range
 *     tags: [RoadWorth]
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
 *         description: List of certificates expiring in the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoadWorth'
 *       400:
 *         description: Bad request - missing date parameters
 *       500:
 *         description: Internal server error
 */
router.get('/expiring', RoadWorthController.getExpiringCertificates);

/**
 * @swagger
 * /api/roadworth:
 *   post:
 *     summary: Create a new road worthiness certificate
 *     tags: [RoadWorth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoadWorth'
 *     responses:
 *       201:
 *         description: Certificate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoadWorth'
 *       400:
 *         description: Bad request - invalid input or validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', RoadWorthController.createRoadWorth);

/**
 * @swagger
 * /api/roadworth/{id}:
 *   put:
 *     summary: Update an existing road worthiness certificate
 *     tags: [RoadWorth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The certificate ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoadWorth'
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoadWorth'
 *       400:
 *         description: Bad request - invalid input or validation error
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', RoadWorthController.updateRoadWorth);

/**
 * @swagger
 * /api/roadworth/{id}:
 *   delete:
 *     summary: Delete a road worthiness certificate
 *     tags: [RoadWorth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The certificate ID to delete
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', RoadWorthController.deleteRoadWorth);

module.exports = router;