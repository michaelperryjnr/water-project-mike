const express = require('express');
const {createLogger, format, transports} = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const {CONFIG} = require("../config/core")
const path = require('path');

const logger = createLogger({
    level: CONFIG.LOG_LEVEL,
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf((info) => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`)
            )
        }),
        new DailyRotateFile({
            filename: "logs/%DATE%-results.log",
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: CONFIG.LOG_LEVEL,
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});

function ErrorHandler(err, req, res, next) {
    logger.error(`Error: ${err.message} | URL: ${req.originalUrl} | IP: ${req.ip} | User-Agent: ${req.headers["user-agent"]}`)

    res.status(500).json({error: "Something went wrong. Please try again later."})

    next(err.message)
}

function Logger(req, res, next) {
    try {
        const {method, originalUrl, ip} = req
        const userAgent = req.headers["user-agent"] || "Unknown"

        res.on("finish", () => {
            logger.info(
                `${method} ${originalUrl} [${res.statusCode}] - IP: ${ip} - User-Agent: ${userAgent}` 
            )
        })
        next()
    } catch(error) {
        next(error.message)
    }
}

module.exports = {ErrorHandler, Logger}