const express = require('express');
const router = express.Router();
const RoleController = require("../controllers/roleController");


/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - permissions
 *         - isActive
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the role
 *           example: "68113d3486f9bcaf8018dbdd"
 *         name:
 *           type: string
 *           description: The name of the role
 *           example: "superadmin"
 *         description:
 *           type: string
 *           description: A detailed description of the role
 *           example: "has all permissions and full system access."
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of permissions assigned to the role
 *           example: ["*"]
 *         isActive:
 *           type: boolean
 *           description: Status to indicate if the role is currently active
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the role was created
 *           example: "2025-04-29T20:57:24.759Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the role was last updated
 *           example: "2025-04-29T20:57:24.759Z"
 *       example:
 *         _id: "68113d3486f9bcaf8018dbdd"
 *         name: "superadmin"
 *         description: "has all permissions and full system access."
 *         permissions: ["*"]
 *         isActive: true
 *         createdAt: "2025-04-29T20:57:24.759Z"
 *         updatedAt: "2025-04-29T20:57:24.759Z"
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API endpoints for managing roles
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the role to retrieve
 *         example: "68113d3486f9bcaf8018dbdd"
 *     responses:
 *       200:
 *         description: The role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: object
 */

router.get('/:id', RoleController.getRoleById);

module.exports = router;