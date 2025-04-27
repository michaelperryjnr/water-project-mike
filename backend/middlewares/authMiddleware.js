const express = require('express');
const jwt = require('jsonwebtoken');
const { CONFIG, STATUS_CODES} = require('../config/core');


async function authenticateUser(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(STATUS_CODES.UNAUTHENTICATED).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const userPosition = req.user.position?.toLowerCase().trim();
        const isAuthorized = allowedRoles.some(role => role.toLowerCase().trim() === userPosition);
        if (!isAuthorized) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Forbidden' });
        }
        next(); 
    };
}

module.exports = { authenticateUser, authorizeRoles };