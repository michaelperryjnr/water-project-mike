const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - staffNumber
 *         - email
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *           example: "johnsmith"
 *         staffNumber:
 *           type: string
 *           description: The staff identification number
 *           example: "EMP123456"
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: "john.smith@example.com"
 *         role:
 *           type: string
 *           description: The user's role ID (reference to Role model)
 *           example: "60d21b4667d0d8992e610c85"
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *           example: "60d21b4667d0d8992e610c85"
 *         username:
 *           type: string
 *           description: The user's username
 *           example: "johnsmith"
 *         staffNumber:
 *           type: string
 *           description: The staff identification number
 *           example: "EMP123456"
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: "john.smith@example.com"
 *         role:
 *           type: string
 *           description: The user's role
 *           example: "superadmin"
 *     LoginRequest:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: The user's identifier (can be username, email, or staffNumber)
 *           example: "EMP123456/johndoe@email.com/johnsmith"
 *         password:
 *           type: string
 *           description: The user's password
 *           example: "securePassword123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Token refreshed successfully"
 *         accessToken:
 *           type: string
 *           description: New JWT access token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     PasswordChangeRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: The user's current password
 *           example: "currentPassword123"
 *         newPassword:
 *           type: string
 *           description: The new password
 *           example: "newSecurePassword456"
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - staffNumber
 *         - newPassword
 *       properties:
 *         staffNumber:
 *           type: string
 *           description: Staff number of the user whose password is being reset
 *           example: "EMP123456"
 *         newPassword:
 *           type: string
 *           description: The new password
 *           example: "newSecurePassword456"
 *     EmailChangeRequest:
 *       type: object
 *       required:
 *         - staffNumber
 *         - newEmail
 *       properties:
 *         staffNumber:
 *           type: string
 *           description: Staff number of the user whose email is being changed
 *           example: "EMP123456"
 *         newEmail:
 *           type: string
 *           description: The new email address
 *           example: "john.newmail@example.com"
 *     RegistrationRequest:
 *       type: object
 *       required:
 *         - staffNumber
 *         - password
 *         - roleName
 *       properties:
 *         staffNumber:
 *           type: string
 *           description: The staff identification number
 *           example: "EMP123456"
 *         password:
 *           type: string
 *           description: The user's desired password
 *           example: "securePassword123"
 *         roleName:
 *           type: string
 *           description: The role to assign to the user
 *           example: "staff"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - user already exists or missing required fields
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.post("/register", AuthController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/login", AuthController.loginUser);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       400:
 *         description: Bad request - refresh token not provided
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
router.post("/refresh-token", AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       400:
 *         description: Bad request - refresh token not provided
 *       404:
 *         description: User not found or already logged out
 *       500:
 *         description: Internal server error
 */
router.post("/logout", AuthController.logoutUser);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user's own password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordChangeRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/change-password", authenticateUser, AuthController.changePassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset a user's password (SuperAdmin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - not a SuperAdmin
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", authenticateUser, authorizeRoles("superadmin"), AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/change-email:
 *   post:
 *     summary: Change a user's email address (SuperAdmin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailChangeRequest'
 *     responses:
 *       200:
 *         description: Email changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email changed successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - not a SuperAdmin
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/change-email", authenticateUser, authorizeRoles("superadmin"), AuthController.changeEmail);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile", authenticateUser, AuthController.getUserProfile);

/**
 * @swagger
 * /api/auth/sa-update:
 *   post:
 *     summary: Update a user's details (SuperAdmin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - updates
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user to be updated
 *                 example: "60d21b4667d0d8992e610c85"
 *               updates:
 *                 type: object
 *                 description: The fields to be updated (e.g., name, email, role)
 *                 example:
 *                   name: "John Smith"
 *                   email: "john.smith@newdomain.com"
 *                   role: "admin"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid request body or missing userId/updates
 *       401:
 *         description: Unauthorized - not a SuperAdmin
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/sa-update", authenticateUser, authorizeRoles("superadmin"), AuthController.saUpdate);

module.exports = router;
