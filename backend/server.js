//server.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const multer = require("multer"); // Add multer
const path = require("path"); // For handling file paths
const fs = require("fs");
const uploadMiddleware = require("./middlewares/uploadMiddleware")

const app = express();
const port = process.env.PORT || 5000;

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//Middleware

function startServer() {
  try {
    app.use(cors());
    app.use(express.json());
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
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
    app.use("/api/vehicles", vehicleRoutes)

    const vehicleDriverLogRoutes = require("./routes/vehicleDriverLogRoutes")
    app.use("/api/vehicle-driver-logs", vehicleDriverLogRoutes)

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
