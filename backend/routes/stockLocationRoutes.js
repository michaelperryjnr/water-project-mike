const express = require('express');
const router = express.Router();
const StockLocationController = require('../controllers/stockLocationController');

/**
 * @swagger
 * components:
 *   schemas:
 *     StockLocation:
 *       type: object
 *       required:
 *         - item
 *         - location
 *       properties:
 *         item:
 *           type: string
 *           description: ID of the inventory item
 *           example: "60d21b4667d0d8992e610c85"
 *         location:
 *           type: string
 *           enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *           description: Location where stock is stored
 *           example: "Warehouse"
 *         quantity:
 *           type: number
 *           description: Quantity in this location
 *           example: 15
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: When this stock location was last updated
 *     StockTransaction:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           description: ID of the inventory item
 *         transactionType:
 *           type: string
 *           enum: [StockIn, StockOut, Adjustment]
 *         quantity:
 *           type: number
 *         location:
 *           type: string
 *           enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *         reference:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: StockLocations
 *   description: API endpoints for managing stock locations and transfers
 */

/**
 * @swagger
 * /api/stock/location/{location}:
 *   get:
 *     summary: Get stock by location
 *     tags: [StockLocations]
 *     parameters:
 *       - in: path
 *         name: location
 *         schema:
 *           type: string
 *           enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *         required: true
 *         description: Location name
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
 *         name: showAll
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *           default: 'false'
 *         description: Show items with zero stock
 *     responses:
 *       200:
 *         description: List of stock items in the location
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
 *                 location:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockLocation'
 *       400:
 *         description: Invalid location
 *       500:
 *         description: Server error
 */
router.get('/location/:location', StockLocationController.getStockByLocation);

/**
 * @swagger
 * /api/stock/item/{itemId}:
 *   get:
 *     summary: Get stock by item
 *     tags: [StockLocations]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     responses:
 *       200:
 *         description: Stock details for the item across all locations
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
 *                     item:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         itemCode:
 *                           type: string
 *                         itemDescription:
 *                           type: string
 *                         quantityInStock:
 *                           type: number
 *                     stockLocations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StockLocation'
 *                     recentTransactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StockTransaction'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.get('/item/:itemId', StockLocationController.getStockByItem);

/**
 * @swagger
 * /api/stock/transfer/{itemId}:
 *   post:
 *     summary: Transfer stock between locations
 *     tags: [StockLocations]
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               - fromLocation
 *               - toLocation
 *               - quantity
 *             properties:
 *               fromLocation:
 *                 type: string
 *                 enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *                 description: Source location
 *                 example: "Warehouse"
 *               toLocation:
 *                 type: string
 *                 enum: [Warehouse, FinishedGoodsStore, RetailStore, Transit]
 *                 description: Destination location
 *                 example: "RetailStore"
 *               quantity:
 *                 type: number
 *                 description: Quantity to transfer
 *                 example: 5
 *               reason:
 *                 type: string
 *                 description: Reason for transfer
 *                 example: "Retail store replenishment"
 *     responses:
 *       200:
 *         description: Stock transferred successfully
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
 *                     fromLocation:
 *                       type: string
 *                     toLocation:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     transactionRef:
 *                       type: string
 *       400:
 *         description: Invalid input, insufficient stock, or same locations
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.post('/transfer/:itemId', StockLocationController.transferStock);

module.exports = router;