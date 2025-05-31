const express = require('express');
const router = express.Router();
const StockTransactionController = require('../controllers/stockTransactionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     StockTransaction:
 *       type: object
 *       required:
 *         - item
 *         - transactionType
 *         - quantity
 *         - location
 *       properties:
 *         item:
 *           type: string
 *           description: ID of the inventory item
 *           example: "60d21b4667d0d8992e610c85"
 *         transactionType:
 *           type: string
 *           enum: [stockin, stockout, adjustment, return]
 *           description: Type of stock transaction
 *           example: "stockin"
 *         quantity:
 *           type: number
 *           description: Quantity of items in the transaction
 *           example: 10
 *         location:
 *           type: string
 *           enum: [warehouse, finishedgoodsstore, retailstore, transit]
 *           description: Location where the transaction occurred
 *           example: "warehouse"
 *         reference:
 *           type: string
 *           description: Reference information for the transaction
 *           example: "PO-2025-001"
 *       example:
 *         item: "60d21b4667d0d8992e610c85"
 *         transactionType: "stockin"
 *         quantity: 10
 *         location: "warehouse"
 *         reference: "PO-2025-001"
 */

/**
 * @swagger
 * tags:
 *   name: Stock Transactions
 *   description: API endpoints for managing inventory stock transactions
 */

/**
 * @swagger
 * /api/stock-transactions:
 *   get:
 *     summary: Get all stock transactions
 *     tags: [Stock Transactions]
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
 *         description: Number of records per page
 *       - in: query
 *         name: item
 *         schema:
 *           type: string
 *         description: Filter by item ID
 *       - in: query
 *         name: transactionType
 *         schema:
 *           type: string
 *         description: Filter by transaction type
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         description: Filter by reference text
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of stock transactions with pagination details
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
 *                     $ref: '#/components/schemas/StockTransaction'
 *       500:
 *         description: Internal server error
 */

router.get('/', StockTransactionController.getAllTransactions);

/**
 * @swagger
 * /api/stock-transactions/item/{itemId}/balance:
 *   get:
 *     summary: Get inventory item stock balance and transaction history
 *     tags: [Stock Transactions]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     responses:
 *       200:
 *         description: Item stock balance details
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
 *                     recentTransactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StockTransaction'
 *                     stockByLocation:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */

router.get('/item/:itemId/balance', StockTransactionController.getItemStockBalance);

/**
 * @swagger
 * /api/stock-transactions:
 *   post:
 *     summary: Create a new stock transaction
 *     tags: [Stock Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTransaction'
 *     responses:
 *       201:
 *         description: Stock transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/StockTransaction'
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */

router.post('/', StockTransactionController.createTransaction);

/**
 * @swagger
 * /api/stock-transactions/{id}:
 *   get:
 *     summary: Get a stock transaction by ID
 *     tags: [Stock Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock transaction ID
 *     responses:
 *       200:
 *         description: Stock transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/StockTransaction'
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', StockTransactionController.getTransactionById);

/**
 * @swagger
 * /api/stock-transactions/{id}:
 *   put:
 *     summary: Update an existing stock transaction
 *     tags: [Stock Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The stock transaction ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTransaction'
 *     responses:
 *       200:
 *         description: Stock transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/StockTransaction'
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Transaction or inventory item not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', StockTransactionController.updateTransaction);

/**
 * @swagger
 * /api/stock-transactions/{id}:
 *   delete:
 *     summary: Delete a stock transaction
 *     tags: [Stock Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock transaction ID to delete
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
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
 *         description: Cannot delete as it would result in negative inventory
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', StockTransactionController.deleteTransaction);

module.exports = router;