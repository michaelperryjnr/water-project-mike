const express = require('express');
const router = express.Router();
const InventoryItemController = require('../controllers/inventoryItemController');

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       required:
 *         - itemCode
 *         - itemDescription
 *         - inventoryType
 *         - unitOfMeasure
 *         - category
 *         - unitCost
 *       properties:
 *         itemCode:
 *           type: string
 *           description: Unique code for the item
 *           example: "ELEC-001"
 *         itemDescription:
 *           type: string
 *           description: Description of the item
 *           example: "Smartphone XYZ Model"
 *         inventoryType:
 *           type: string
 *           enum: [Physical, Service]
 *           description: Type of inventory
 *           example: "Physical"
 *         unitOfMeasure:
 *           type: string
 *           enum: [Piece, Set, Box, Bundle, Kg, Liter]
 *           description: Unit of measurement
 *           example: "Piece"
 *         saleable:
 *           type: boolean
 *           description: Whether the item can be sold
 *           example: true
 *         category:
 *           type: string
 *           description: ID of the category this item belongs to
 *           example: "60d21b4667d0d8992e610c85"
 *         unitCost:
 *           type: number
 *           description: Cost per unit
 *           example: 250.99
 *         sellingPrice:
 *           type: object
 *           properties:
 *             retail:
 *               type: number
 *               example: 499.99
 *             wholesale:
 *               type: number
 *               example: 399.99
 *         suppliers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               supplier:
 *                 type: string
 *                 description: ID of the supplier
 *               supplierItemCode:
 *                 type: string
 *               leadTimeDays:
 *                 type: number
 *         quantityInStock:
 *           type: number
 *           description: Current quantity in stock
 *           example: 25
 *         reorderLevel:
 *           type: number
 *           description: Level at which reordering is suggested
 *           example: 5
 *         status:
 *           type: string
 *           enum: [Active, Discontinued, OnHold]
 *           description: Current status of the item
 *           example: "Active"
 */

/**
 * @swagger
 * tags:
 *   name: InventoryItems
 *   description: API endpoints for managing inventory items
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all inventory items with pagination
 *     tags: [InventoryItems]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Discontinued, OnHold]
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: inventoryType
 *         schema:
 *           type: string
 *           enum: [Physical, Service]
 *         description: Filter by inventory type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by itemCode or description
 *     responses:
 *       200:
 *         description: List of inventory items
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
 *                     $ref: '#/components/schemas/InventoryItem'
 *       500:
 *         description: Server error
 */
router.get('/', InventoryItemController.getAllItems);

/**
 * @swagger
 * /api/items/low-stock:
 *   get:
 *     summary: Get low stock items
 *     tags: [InventoryItems]
 *     responses:
 *       200:
 *         description: List of items with stock at or below reorder level
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
 *                     $ref: '#/components/schemas/InventoryItem'
 *       500:
 *         description: Server error
 */
router.get('/low-stock', InventoryItemController.getLowStockItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get a single inventory item by ID
 *     tags: [InventoryItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item details with stock locations
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
 *                     itemCode:
 *                       type: string
 *                     itemDescription:
 *                       type: string
 *                     stockLocations:
 *                       type: array
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.get('/:id', InventoryItemController.getItemById);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [InventoryItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             allOf:
 *               - $ref: '#/components/schemas/InventoryItem'
 *               - type: object
 *                 properties:
 *                   initialStock:
 *                     type: number
 *                     description: Initial stock quantity
 *                   initialStockLocation:
 *                     type: string
 *                     description: Location for initial stock
 *                     enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', InventoryItemController.createItem);

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an existing inventory item
 *     tags: [InventoryItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The inventory item ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.put('/:id', InventoryItemController.updateItem);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [InventoryItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID to delete
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
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
 *         description: Cannot delete item with existing stock
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', InventoryItemController.deleteItem);

/**
 * @swagger
 * /api/items/{id}/stock:
 *   post:
 *     summary: Adjust inventory stock
 *     tags: [InventoryItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - location
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantity to adjust (positive for increase, negative for decrease)
 *                 example: 10
 *               location:
 *                 type: string
 *                 enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *                 description: Location where stock is being adjusted
 *                 example: "Warehouse"
 *               reason:
 *                 type: string
 *                 description: Reason for adjustment
 *                 example: "Received new shipment"
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
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
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *                     location:
 *                       type: string
 *                     previousQuantity:
 *                       type: number
 *                     adjustment:
 *                       type: number
 *                     newQuantity:
 *                       type: number
 *                     totalQuantity:
 *                       type: number
 *       400:
 *         description: Invalid input or would result in negative stock
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Server error
 */
router.post('/:id/stock', InventoryItemController.adjustStock);


module.exports = router;