const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - departmentName
 *         - departmentDescription
 *       properties:
 *         departmentName:
 *           type: string
 *           description: The name of the department
 *         departmentDescription:
 *           type: string
 *           description: The description of the department and what it does
 *         departmentHead:
 *           type: string
 *           description: The name of the department head/leader
 *           example: "60b8c0f58d4b421fdf1e387c"
 *       example:
 *         departmentName: sales
 *         departmentDescription: this is the description of the sales department
 *         departmentHead: 60b8c0f58d4b421fdf1e387c
 */



/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API enpoints for managing departments
 */


/**
 * @swagger
 *  /api/departments:
 *    get:
 *      summary: Get all departments
 *      tags: [Departments]
 *      responses:
 *        200:
 *          description: List of all departments
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Department'
 *        500:
 *          description: Internal server error
 */

router.get('/', departmentController.getAllDepartments);

/**
 * @swagger
 *  /api/departments/{id}:
 *    get:
 *      summary: Get a department by ID
 *      tags: [Departments]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The department ID
 *      responses:
 *        200:
 *          description: Department details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Department'
 *        404:
 *          description: Department not found
 *        500:
 *          description: Internal server error
 */

router.get('/:id', departmentController.getDepartmentById);

/**
 * @swagger
 *  /api/departments:
 *    post:
 *      summary: Create a new department
 *      tags: [Departments]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *      responses:
 *        201:
 *          description: Department created successfully
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 */

router.post('/', departmentController.createDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *    put:
 *      summary: Update an existing department
 *      tags: [Departments]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: The department ID to update
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *      responses:
 *        200:
 *          description: Department updated successfully
 *        400:
 *          description: Invalid input
 *        404:
 *          description: Department not found
 *        500:
 *          description: Internal server error
 */

router.put('/:id', departmentController.updateDepartment);

/**
 * @swagger
 *  /api/departments/{id}:
 *    delete:
 *      summary: Delete a department
 *      tags: [Departments]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The department ID to delete
 *      responses:
 *        200:
 *          description: Department deleted successfully
 *        404:
 *          description: Department not found
 *        500:
 *          description: Internal server error
 */

router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;