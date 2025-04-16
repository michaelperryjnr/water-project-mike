const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
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

    try {
        return jwt.sign({ id: user._id, position: user.position }, CONFIG.ACCESS_TOKEN_SECRET, {
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

    try {
        return jwt.sign({ id: user._id, position: user.position }, CONFIG.REFRESH_TOKEN_SECRET, {
            expiresIn: CONFIG.REFRESH_TOKEN_EXPIRATION,
        });
    } catch (error) {
        throw error;
    }
}

async function verifyToken(token) {
    try {
        return jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
}

async function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, CONFIG.REFRESH_TOKEN_SECRET);
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
    verifyRefreshToken,
}