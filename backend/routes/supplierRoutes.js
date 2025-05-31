const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the supplier
 *           example: "Acme Supplies"
 *         contactInfo:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the supplier
 *               example: "contact@acmesupplies.com"
 *             phone:
 *               type: string
 *               description: Phone number of the supplier
 *               example: "555-987-6543"
 *             address:
 *               type: string
 *               description: Address of the supplier
 *               example: "456 Business Ave, Commerce City, US"
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Status of the supplier
 *           example: "active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the supplier was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the supplier was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers with pagination
 *     tags: [Suppliers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filter by supplier status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search suppliers by name
 *     responses:
 *       200:
 *         description: List of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *       500:
 *         description: Server error
 */
router.get('/', supplierController.getAllSuppliers);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier details with supplied items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   allOf:
 *                     - $ref: '#/components/schemas/Supplier'
 *                     - type: object
 *                       properties:
 *                         suppliedItems:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               itemCode:
 *                                 type: string
 *                               itemDescription:
 *                                 type: string
 *                               quantityInStock:
 *                                 type: number
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.get('/:id', supplierController.getSupplierById);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', supplierController.createSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.put('/:id', supplierController.updateSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', supplierController.deleteSupplier);

/**
 * @swagger
 * /api/suppliers/{id}/status:
 *   patch:
 *     summary: Change supplier status (active/inactive)
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Supplier status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', supplierController.changeSupplierStatus);

module.exports = router;