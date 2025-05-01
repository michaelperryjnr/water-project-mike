const express = require('express');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const { CONFIG, STATUS_CODES} = require('../config/core');


async function authenticateUser(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHENTICATED)
      .json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).populate("role");

    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "User not found." });
    }

    req.user = {
      id: user._id,
      staffNumber: user.staffNumber,
      role: user.role.name,
    };
    next();
  } catch (error) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role?.toLowerCase().trim();

    if (!userRole) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: "User role is not defined" });
    }

    const isAuthorized = allowedRoles.some(
      (role) => role.toLowerCase().trim() === userRole
    );
    if (!isAuthorized) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: `Access denied: Requires one of the following roles: ${allowedRoles.join(
          ", "
        )}`,
      });
    }
    next();
  };
}

module.exports = { authenticateUser, authorizeRoles };