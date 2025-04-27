//server.js
const express = require("express");
const cors = require("cors");
const path = require("path"); // For handling file paths
const corsOptions = require("./middlewares/corsMiddleware")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const multer = require("multer"); // Add multer
const fs = require("fs");
const uploadMiddleware = require("./middlewares/uploadMiddleware")
const {ErrorHandler, Logger} = require("./middlewares/loggerMiddleware")
const {apiLimiter} = require("./middlewares/rateLimiterMiddleware")
const helmet = require("helmet")

const app = express();
const port = process.env.PORT || 5000;

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
const employeeUploadDir = path.join(uploadDir, "employees");
const vehicleUploadDir = path.join(uploadDir, "vehicles");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(employeeUploadDir)) {
  fs.mkdirSync(employeeUploadDir);
}
if (!fs.existsSync(vehicleUploadDir)) {
  fs.mkdirSync(vehicleUploadDir);
}

//Middleware

function startServer() {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

    // Error Handling & Logging Middleware
    app.use(ErrorHandler)
    app.use(Logger)
    app.use(apiLimiter)

    //Allow CORS For All Routes Globally First
    app.use(cors(corsOptions))

    // Security Middleware Apply Helment After CORS
    app.use(helmet.hidePoweredBy({setTo: "PHP 4.2.0"}))
    app.use(helmet({
      crossOriginResourcePolicy: false, // Disable for now to test
  }))

    // API Docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // server.js (add this before the routes)
    app.use((err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        req.fileValidationError = err; // Pass the error to the controller
        return next();
      }
      next();
    });

    // Serve static files (for accessing uploaded images)
    app.use("/uploads", cors(corsOptions), express.static(path.join(__dirname, "uploads")));

    //Routes
    const employeeRoutes = require("./routes/employeeRoutes");
    app.use("/api/employees", employeeRoutes(uploadMiddleware.upload)); //Pass the upload middleware to the employeeRoutes

    const nationalityRoutes = require("./routes/nationalityRoutes");
    app.use("/api/nationalities", nationalityRoutes);

    const departmentRoutes = require("./routes/departmentRoutes");
    app.use("/api/departments", departmentRoutes);

    const countryRoutes = require("./routes/countryRoutes");
    app.use("/api/countries", countryRoutes);

    const positionRoutes = require("./routes/positionRoutes");
    app.use("/api/positions", positionRoutes);

    const nextOfKinRoutes = require("./routes/nextOfKinRoutes");
    app.use("/api/nextofkin", nextOfKinRoutes);

    const contractTypeRoutes = require("./routes/contractTypeRoutes");
    app.use("/api/contracttypes", contractTypeRoutes);

    const vehicleRoutes = require("./routes/vehicleRoutes")
    app.use("/api/vehicles", vehicleRoutes) //The middleware has already been added in the routes so just call it directly like so going forward

    const vehicleDriverLogRoutes = require("./routes/vehicleDriverLogRoutes")
    app.use("/api/vehicle-driver-logs", vehicleDriverLogRoutes)

    const insuranceRoutes = require("./routes/insuranceRoutes")
    app.use("/api/insurance", insuranceRoutes)

    const brandRoutes = require("./routes/brandRoutes")
    app.use("/api/brands", brandRoutes)

    const roadWorthRoutes = require("./routes/roadWorthRoutes")
    app.use("/api/roadworth", roadWorthRoutes)

    const inventoryItemsRoutes = require("./routes/inventoryItemsRoute")
    app.use("/api/items", inventoryItemsRoutes)

    const inventoryCategoryRoutes = require("./routes/inventoryCategoryRoutes")
    app.use("/api/categories", inventoryCategoryRoutes)

    const stockLocationRoutes = require("./routes/stockLocationRoutes")
    app.use("/api/stock", stockLocationRoutes)

    const stockTransactionsRoute = require("./routes/stockTransactionRoute")
    app.use("/api/stock-transactions", stockTransactionsRoute)

    const taxRateRoutes = require("./routes/taxRateRoutes")
    app.use("/api/tax-rates", taxRateRoutes)

    const salesOrderRoutes = require("./routes/salesOrderRoutes")
    app.use("/api/sales-orders", salesOrderRoutes)

    const supplierRoutes = require("./routes/supplierRoutes")
    app.use("/api/suppliers", supplierRoutes)

    const userRoutes = require("./routes/userRoutes")
    app.use("/api/auth", userRoutes)

    //Start the server
    const server = app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );

    return server;
  } catch (err) {
    console.log("Error starting server: ", err);
  }
}

function stopServer(server) {
  try {
    server.close();
  } catch (error) {
    console.error("Error stopping server: ", error.message);
  }
}

module.exports = { startServer, stopServer };
