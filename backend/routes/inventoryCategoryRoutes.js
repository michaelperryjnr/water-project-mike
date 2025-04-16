const express = require('express');
const router = express.Router();
const InventoryCategoryController = require('../controllers/inventoryCategoryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *           example: "Electronics"
 *         description:
 *           type: string
 *           description: Description of the category
 *           example: "Electronic devices and accessories"
 *         parentCategory:
 *           type: string
 *           description: ID of the parent category (if this is a subcategory)
 *           example: "60d21b4667d0d8992e610c85"
 *       example:
 *         name: "Electronics"
 *         description: "Electronic devices and accessories"
 *         parentCategory: null
 */

/**
 * @swagger
 * tags:
 *   name: InventoryCategories
 *   description: API endpoints for managing inventory categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [InventoryCategories]
 *     responses:
 *       200:
 *         description: List of all categories
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
 *                     $ref: '#/components/schemas/InventoryCategory'
 *       500:
 *         description: Server error
 */
router.get('/', InventoryCategoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [InventoryCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details with subcategories and item count
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
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     parentCategory:
 *                       type: object
 *                     subcategories:
 *                       type: array
 *                     itemCount:
 *                       type: integer
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id', InventoryCategoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [InventoryCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryCategory'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InventoryCategory'
 *       400:
 *         description: Invalid input or parent category not found
 *       500:
 *         description: Server error
 */
router.post('/', InventoryCategoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [InventoryCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InventoryCategory'
 *       400:
 *         description: Invalid input, parent category not found, or circular reference
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', InventoryCategoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [InventoryCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *         description: Cannot delete category with subcategories or items
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', InventoryCategoryController.deleteCategory);

/**
 * @swagger
 * /api/categories/hierarchy:
 *   get:
 *     summary: Get category hierarchy
 *     tags: [InventoryCategories]
 *     responses:
 *       200:
 *         description: Full category hierarchy with item counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       itemCount:
 *                         type: integer
 *                       children:
 *                         type: array
 *       500:
 *         description: Server error
 */
router.get('/hierarchy', InventoryCategoryController.getCategoryHierarchy);

module.exports = router;