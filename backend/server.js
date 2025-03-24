//server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const multer = require('multer'); // Add multer
const path = require('path'); // For handling file paths
const fs = require('fs'); // For creating the uploads directory



const app = express();
const port = process.env.PORT || 5000;


//Connect to MongoDB
connectDB();


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `employee-${uniqueSuffix}${path.extname(file.originalname)}`); // e.g., employee-123456789.jpg
    },
  });
  
  // File filter to accept only images
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  });
  
  // Create the uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }


//Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes(upload)); //Pass the upload middleware to the employeeRoutes

const nationalityRoutes = require('./routes/nationalityRoutes');
app.use('/api/nationalities', nationalityRoutes)

const departmentRoutes = require('./routes/departmentRoutes');
app.use('/api/departments', departmentRoutes)

const countryRoutes = require('./routes/countryRoutes');
app.use('/api/countries', countryRoutes)

const positionRoutes = require('./routes/positionRoutes');
app.use('/api/positions', positionRoutes)

const nextOfKinRoutes = require('./routes/nextOfKinRoutes');
app.use('/api/nextofkin', nextOfKinRoutes)

const contractTypeRoutes = require('./routes/contractTypeRoutes');
app.use('/api/contracttypes', contractTypeRoutes)



//Start the server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));