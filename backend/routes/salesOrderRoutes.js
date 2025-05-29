const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrderController');

/**
 * @swagger
 * components:
 *   schemas:
 *     SalesOrder:
 *       type: object
 *       required:
 *         - orderNumber
 *         - customer
 *         - items
 *         - subtotal
 *         - totalAmount
 *       properties:
 *         orderNumber:
 *           type: string
 *           description: Unique identifier for the order
 *           example: "SO2404001"
 *         customer:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the customer
 *               example: "John Doe"
 *             email:
 *               type: string
 *               description: Email of the customer
 *               example: "john@example.com"
 *             phone:
 *               type: string
 *               description: Phone number of the customer
 *               example: "555-123-4567"
 *             address:
 *               type: string
 *               description: Address of the customer
 *               example: "123 Main St, Anytown, US"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 description: ID of the inventory item
 *                 example: "60f1a5b9e6b4a32d84c29a1b"
 *               quantity:
 *                 type: number
 *                 description: Quantity ordered
 *                 example: 2
 *               unitPrice:
 *                 type: number
 *                 description: Price per unit
 *                 example: 29.99
 *               totalPrice:
 *                 type: number
 *                 description: Total price for this item
 *                 example: 59.98
 *               serialNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Serial numbers for serialized items
 *                 example: ["SN12345", "SN12346"]
 *         subtotal:
 *           type: number
 *           description: Subtotal before tax
 *           example: 59.98
 *         taxAmount:
 *           type: number
 *           description: Tax amount
 *           example: 6.00
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *           example: 65.98
 *         status:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *           description: Status of the order
 *           example: "Pending"
 *         paymentStatus:
 *           type: string
 *           enum: [Unpaid, Partial, Paid]
 *           description: Payment status of the order
 *           example: "Unpaid"
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, CreditCard, BankTransfer, PayPal]
 *           description: Method of payment
 *           example: "CreditCard"
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date when the order was placed
 *           example: "2023-04-15T10:30:00Z"
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *           description: Expected or actual delivery date
 *           example: "2023-04-20T15:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Sales Orders
 *   description: API endpoints for managing sales orders
 */

/**
 * @swagger
 * /api/sales-orders:
 *   get:
 *     summary: Get all sales orders with filtering and pagination
 *     tags: [Sales Orders]
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
 *         name: orderNumber
 *         schema:
 *           type: string
 *         description: Filter by order number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [Unpaid, Partial, Paid]
 *         description: Filter by payment status
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Filter by customer name
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders up to this date
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Filter by minimum order amount
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Filter by maximum order amount
 *     responses:
 *       200:
 *         description: List of sales orders
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
 *                     $ref: '#/components/schemas/SalesOrder'
 *       500:
 *         description: Server error
 */
router.get('/', salesOrderController.getAllSalesOrders);

/**
 * @swagger
 * /api/sales-orders/summary:
 *   get:
 *     summary: Get sales summary statistics
 *     tags: [Sales Orders]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the summary
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the summary
 *     responses:
 *       200:
 *         description: Sales summary statistics
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
 *                     totalSales:
 *                       type: integer
 *                     salesByStatus:
 *                       type: array
 *                     salesByPaymentStatus:
 *                       type: array
 *                     topSellingItems:
 *                       type: array
 *                     salesTrend:
 *                       type: array
 *       500:
 *         description: Server error
 */
router.get('/summary', salesOrderController.getSalesSummary);

/**
 * @swagger
 * /api/sales-orders/customer-history:
 *   get:
 *     summary: Get customer purchase history
 *     tags: [Sales Orders]
 *     parameters:
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Customer name to search for
 *       - in: query
 *         name: customerEmail
 *         schema:
 *           type: string
 *         description: Customer email to search for
 *     responses:
 *       200:
 *         description: Customer purchase history
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
 *                     customer:
 *                       type: object
 *                     totalOrders:
 *                       type: integer
 *                     totalSpent:
 *                       type: number
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SalesOrder'
 *                     frequentlyPurchasedItems:
 *                       type: array
 *       400:
 *         description: Missing customer name or email
 *       500:
 *         description: Server error
 */
router.get('/customer-history', salesOrderController.getCustomerPurchaseHistory);

/**
 * @swagger
 * /api/sales-orders/{id}:
 *   get:
 *     summary: Get a sales order by ID
 *     tags: [Sales Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order ID
 *     responses:
 *       200:
 *         description: Sales order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SalesOrder'
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', salesOrderController.getSalesOrderById);

/**
 * @swagger
 * /api/sales-orders:
 *   post:
 *     summary: Create a new sales order
 *     tags: [Sales Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - items
 *               - subtotal
 *               - totalAmount
 *             properties:
 *               customer:
 *                 type: object
 *                 required:
 *                   - name
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - item
 *                     - quantity
 *                     - unitPrice
 *               subtotal:
 *                 type: number
 *               taxAmount:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               paymentStatus:
 *                 type: string
 *                 enum: [Unpaid, Partial, Paid]
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, CreditCard, BankTransfer, PayPal]
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Sales order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SalesOrder'
 *       400:
 *         description: Invalid input or insufficient stock
 *       500:
 *         description: Server error
 */
router.post('/', salesOrderController.createSalesOrder);

/**
 * @swagger
 * /api/sales-orders/{id}:
 *   put:
 *     summary: Update a sales order
 *     tags: [Sales Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [Unpaid, Partial, Paid]
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, CreditCard, BankTransfer, PayPal]
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Sales order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SalesOrder'
 *       400:
 *         description: Cannot update order in current status
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Server error
 */
router.put('/:id', salesOrderController.updateSalesOrder);

/**
 * @swagger
 * /api/sales-orders/{id}:
 *   delete:
 *     summary: Delete a sales order (only Pending orders)
 *     tags: [Sales Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order ID
 *     responses:
 *       200:
 *         description: Sales order deleted successfully
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
 *         description: Cannot delete order in current status
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', salesOrderController.deleteSalesOrder);

module.exports = router;