const express = require('express');
const jwt = require('jsonwebtoken');
const { CONFIG } = require('../config/core');


async function authenticateUser(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.position)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next(); 
    };
}

module.exports = { authenticateUser, authorizeRoles };