const {CORS_CONFIG, CONFIG} = require("../config/core")

const allowedOrigins = CORS_CONFIG.allowedOrigins.map(origin => origin.trim())
const allowedLocalOrigins = CORS_CONFIG.allowedLocalOrigins.map(origin => origin.trim())
const allowedMethods = CORS_CONFIG.allowedMethods.map(method => method.trim())
const allowedHeaders = CORS_CONFIG.allowedHeaders.map(header => header.trim())
const credentials = CORS_CONFIG.credentials
const maxAge = CORS_CONFIG.maxAge

const corsOptions = {
    origin: CONFIG.ENV === "production" ? allowedOrigins : allowedLocalOrigins,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
    credentials: credentials,
    maxAge: maxAge,
}

module.exports = corsOptions