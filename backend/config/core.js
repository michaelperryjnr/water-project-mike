require("dotenv").config()

const CONFIG = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    LOG_LEVEL: process.env.LOG_LEVEL,
    ENV: process.env.NODE_ENV,
}
const STATUS_CODES = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    UNAUTHENTICATED: 401,
    CREATED: 201,
    OK: 200
}

const CORS_CONFIG = {
    allowedOrigins: process.env.ALLOWED_ORIGINS.split(","),
    allowedMethods: process.env.ALLOWED_METHODS.split(","),
    allowedHeaders: process.env.ALLOWED_HEADERS.split(","),
    credentials: process.env.CREDENTIALS === "true",
    allowedLocalOrigins: process.env.ALLOWED_LOCAL_ORIGINS.split(","),
    maxAge: parseInt(process.env.MAX_AGE),
}


module.exports = {STATUS_CODES, CONFIG, CORS_CONFIG}