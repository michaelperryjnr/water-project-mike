const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {CONFIG} = require("../config/core")

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw error;
    }
}

async function comparePassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw error;
    }
}

async function generateAccessToken(user) {
    if (!user) {
        throw new Error("User is required for generating access token");
    }
    if (!CONFIG.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in .env file");
    }
    if (!CONFIG.ACCESS_TOKEN_EXPIRATION) {
        throw new Error("ACCESS_TOKEN_EXPIRATION is not defined in .env file");
    }

    try {
        const payload = {
            id: user._id,
            role: user.role.name ? user.role.name : null // Handle missing role
        };
        return jwt.sign(payload, CONFIG.ACCESS_TOKEN_SECRET, {
            expiresIn: CONFIG.ACCESS_TOKEN_EXPIRATION,
        });
    } catch (error) {
        throw error;
    }
}

async function generateRefreshToken(user) {
    if (!user) {
        throw new Error("User is required for generating refresh token");
    }
    if (!CONFIG.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined in .env file");
    }
    if (!CONFIG.REFRESH_TOKEN_EXPIRATION) {
        throw new Error("REFRESH_TOKEN_EXPIRATION is not defined in .env file");
    }

    try {
        const payload = {
          id: user._id,
          role: user.role.name ? user.role.name : null // Handle missing role,
        };

        return jwt.sign(payload, CONFIG.REFRESH_TOKEN_SECRET, {
            expiresIn: CONFIG.REFRESH_TOKEN_EXPIRATION,
        });
    } catch (error) {
        throw error;
    }
}

async function verifyToken(token, tokenSecret) {
    try {
        return jwt.verify(token, tokenSecret);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
}