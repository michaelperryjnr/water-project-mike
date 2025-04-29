const User = require("../models/User");
const Employee = require("../models/Employee");
const Role = require("../models/Role");
const {STATUS_CODES, CONFIG} = require("../config/core");
const Logger = require("../utils/logger");
const {hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyToken} = require("../utils/authUtils");

exports.registerUser = async(req, res) => {
    try {
        Logger("Registering user", req, "auth-controller");
        const {staffNumber, password, roleName} = req.body;

        if (!staffNumber || !password || roleName) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Staff number, password, and role are required"
            });
        }

        const existingUser = await User.findOne({staffNumber: staffNumber});

        if (existingUser) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "User already exists"
            });
        }

        const employee = await Employee.findOne({staffNumber: staffNumber})
        .populate("email")

        if (!employee) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Employee not found"
            });
        }

        let role = await Role.findOne({name: roleName.toLowerCase()})

        if (!role) {
            role = new Role({name: roleName.toLowerCase(), description: `Role for ${roleName.toLowerCase}`});
            await role.save()
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            username: employee.username,
            staffNumber: employee.staffNumber,
            email: employee.email,
            hashedPassword: hashedPassword,
            role: role._id,
        });

        await newUser.save();

        Logger("User registered successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.CREATED).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                staffNumber: newUser.staffNumber,
                email: newUser.email,
                role: role.name,
            }
        });

    } catch (error) {
        Logger("Error registering user", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

exports.loginUser = async(req, res) => {
    try {
        Logger("User login attempt", req, "auth-controller");
        const {staffNumber, password} = req.body;

        if (!staffNumber || !password) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Staff number and password are required"
            });
        }

        const user = await User.findOne({staffNumber: staffNumber})
            .populate("role");

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await comparePassword(password, user.hashedPassword);

        if (!isPasswordValid) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "Invalid credentials"
            });
        }

        const accessToken = generateAccessToken({
            id: user._id,
            staffNumber: user.staffNumber,
            role: user.role.name
        });

        const refreshToken = generateRefreshToken({
            id: user._id,
            staffNumber: user.staffNumber
        });

        user.refreshToken = refreshToken;
        await user.save();

        Logger("User logged in successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                staffNumber: user.staffNumber,
                email: user.email,
                role: user.role.name
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        Logger("Error logging in user", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error logging in",
            error: error.message
        });
    }
};

exports.refreshToken = async(req, res) => {
    try {
        Logger("Refreshing token", req, "auth-controller");
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Refresh token is required"
            });
        }

        const decoded = verifyToken(refreshToken, CONFIG.REFRESH_TOKEN_SECRET);
        
        if (!decoded) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "Invalid refresh token"
            });
        }

        const user = await User.findOne({
            _id: decoded.id,
            refreshToken: refreshToken
        }).populate("role");

        if (!user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "User not found or token revoked"
            });
        }
        const accessToken = generateAccessToken({
            id: user._id,
            staffNumber: user.staffNumber,
            role: user.role.name
        });

        Logger("Token refreshed successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "Token refreshed successfully",
            accessToken
        });

    } catch (error) {
        Logger("Error refreshing token", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error refreshing token",
            error: error.message
        });
    }
};

exports.logoutUser = async(req, res) => {
    try {
        Logger("Logging out user", req, "auth-controller");
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Refresh token is required"
            });
        }

        const user = await User.findOneAndUpdate(
            { refreshToken: refreshToken },
            { refreshToken: null },
            { new: true }
        );

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "User not found or already logged out"
            });
        }

        Logger("User logged out successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        Logger("Error logging out user", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error logging out",
            error: error.message
        });
    }
};

exports.resetPassword = async(req, res) => {
    try {
        Logger("Password reset attempt", req, "auth-controller");
        const {staffNumber, newPassword} = req.body;
        const requestingUser = req.user;

        if (requestingUser.role !== 'superadmin') {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "Only Super Admin can reset passwords"
            });
        }

        if (!staffNumber || !newPassword) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Staff number and new password are required"
            });
        }

        const user = await User.findOne({staffNumber: staffNumber});

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "User not found"
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        user.hashedPassword = hashedPassword;
        user.refreshToken = null;
        
        await user.save();

        Logger("Password reset successful", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "Password reset successful"
        });

    } catch (error) {
        Logger("Error resetting password", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error resetting password",
            error: error.message
        });
    }
};

exports.changePassword = async(req, res) => {
    try {
        Logger("Password change attempt", req, "auth-controller");
        const {currentPassword, newPassword} = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Current password and new password are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await comparePassword(currentPassword, user.hashedPassword);

        if (!isPasswordValid) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        user.hashedPassword = hashedPassword;
        user.refreshToken = null;
        
        await user.save();

        Logger("Password changed successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        Logger("Error changing password", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error changing password",
            error: error.message
        });
    }
};

exports.changeEmail = async(req, res) => {
    try {
        Logger("Email change attempt", req, "auth-controller");
        const {staffNumber, newEmail} = req.body;
        const requestingUser = req.user;

        if (requestingUser.role !== 'superadmin') {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: "Only Super Admin can change email addresses"
            });
        }

        if (!staffNumber || !newEmail) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: "Staff number and new email are required"
            });
        }

        const user = await User.findOne({staffNumber: staffNumber});

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "User not found"
            });
        }

        const employee = await Employee.findOne({staffNumber: staffNumber});
        
        if (employee) {
            employee.email = newEmail;
            await employee.save();
        }

        user.email = newEmail;
        await user.save();

        Logger("Email changed successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "Email changed successfully",
            user: {
                id: user._id,
                username: user.username,
                staffNumber: user.staffNumber,
                email: user.email
            }
        });

    } catch (error) {
        Logger("Error changing email", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error changing email",
            error: error.message
        });
    }
};

exports.getUserProfile = async(req, res) => {
    try {
        Logger("Getting user profile", req, "auth-controller");
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate("role")
            .select("-hashedPassword -refreshToken");

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "User not found"
            });
        }

        Logger("User profile retrieved successfully", req, "auth-controller", "info");

        res.status(STATUS_CODES.OK).json({
            message: "User profile retrieved successfully",
            user: {
                id: user._id,
                username: user.username,
                staffNumber: user.staffNumber,
                email: user.email,
                role: user.role.name
            }
        });

    } catch (error) {
        Logger("Error getting user profile", req, "auth-controller", "error", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Error getting user profile",
            error: error.message
        });
    }
};