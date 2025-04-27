const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";
    
    // Determine the subfolder based on the request base URL
    if (req.baseUrl === "/api/vehicles") {
      uploadPath = path.join(uploadPath, "vehicles");
    } else if (req.baseUrl === "/api/employees") {
      uploadPath = path.join(uploadPath, "employees");
    } else if (req.baseUrl === "/api/items") {
      uploadPath = path.join(uploadPath, "inventoryitems");
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let prefix = "file";
    
    // Determine the filename prefix based on the request base URL
    if (req.baseUrl === "/api/vehicles") {
      prefix = "vehicle";
    } else if (req.baseUrl === "/api/employees") {
      prefix = "employee";
    } else if (req.baseUrl === "/api/items") {
      prefix = "inventoryimage";
    }

    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});