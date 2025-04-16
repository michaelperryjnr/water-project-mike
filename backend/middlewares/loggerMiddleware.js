const express = require('express');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { CONFIG, STATUS_CODES } = require("../config/core");

// Custom formatter for industry-standard logging
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.metadata({ fillExcept: ['timestamp', 'level', 'message', 'stack'] }),
  format.printf(info => {
    const requestId = info.metadata.requestId || info.metadata.correlationId || info.metadata.traceId || '-';
    const userId = info.metadata.userId || '-';
    const service = info.metadata.service ||'api-service';
    const component = info.metadata.component || '-';
    const env = process.env.NODE_ENV || 'development';
    
    // Format the log with structured fields and consistent separators
    return `${info.timestamp} | ${env} | ${info.message} | ${service}:${component} | ${info.level} | reqId=${requestId} | userId=${userId}${info.stack ? '\n' + info.stack : ''}`;
  })
);

// Create the logger but keep it private to this module
const logger = createLogger({
    level: CONFIG.LOG_LEVEL,
    defaultMeta: { 
      service: 'api-service',
      version: require('../package.json').version
    },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                customFormat
            )
        }),
        new DailyRotateFile({
            filename: "logs/%DATE%-results.log",
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: CONFIG.LOG_LEVEL,
            format: customFormat
        })
    ]
});

/**
 * Global error handler middleware
 * Logs errors and returns standardized response
 */
function ErrorHandler(err, req, res, next) {
    const correlationId = req.headers['x-correlation-id'] || req.headers['x-request-id'] || 'unknown';
    const userId = req.user?.id || 'anonymous';
    
    logger.error(`Request failed | URL: ${req.originalUrl} | Method: ${req.method}`, {
        error: err.message,
        stack: err.stack,
        statusCode: err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        requestId: correlationId,
        userId: userId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        component: 'error-handler'
    });

    // Don't expose internal errors to clients
    res.status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: err.expose ? err.message : "Something went wrong. Please try again later.",
        requestId: correlationId
    });

    next(err);
}

/**
 * Request logger middleware
 * Logs information about incoming requests and their responses
 */
function Logger(req, res, next) {
    try {
        // Generate or extract correlation ID for request tracking
        const correlationId = req.headers['x-correlation-id'] || 
                             req.headers['x-request-id'] || 
                             `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Add correlation ID to response headers
        res.setHeader('x-correlation-id', correlationId);
        
        const startTime = Date.now();
        const { method, originalUrl, ip } = req;
        const userAgent = req.headers["user-agent"] || "Unknown";
        const userId = req.user?.id || 'anonymous';
        
        // Log the request
        logger.info(`Incoming request | ${method} ${originalUrl}`, {
            requestId: correlationId,
            userId: userId,
            ip: ip,
            userAgent: userAgent,
            component: 'request-logger'
        });
        
        // Log response when finished
        res.on("finish", () => {
            const duration = Date.now() - startTime;
            const level = res.statusCode >= 400 ? 'warn' : 'info';
            
            logger[level](`Request completed | ${method} ${originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`, {
                requestId: correlationId,
                userId: userId,
                statusCode: res.statusCode,
                responseTime: duration,
                contentLength: res.get('Content-Length') || 0,
                component: 'request-logger'
            });
        });
        
        next();
    } catch(error) {
        logger.error('Error in logger middleware', {
            error: error.message,
            stack: error.stack,
            component: 'request-logger'
        });
        next(error);
    }
}

module.exports = { ErrorHandler, Logger, logger };