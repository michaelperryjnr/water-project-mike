const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
require("../models/Brand");
const {CONFIG} = require("../config/core")

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// API key from api-ninjas
const API_KEY = "UqHPOQBFOUOIQoAsAxE5vQ==Cita0ug1GNyWEazv";

// Optional: Drop the existing brands collection (uncomment to enable)
// const dropBrandsCollection = async () => {
//   try {
//     await mongoose.model("Brand").collection.drop();
//     console.log("Dropped existing brands collection");
//   } catch (error) {
//     if (error.code === 26) {
//       console.log("Brands collection does not exist, proceeding...");
//     } else {
//       console.error("Error dropping brands collection:", error.message);
//       throw error;
//     }
//   }
// };

// Fetch all manufacturers by querying across multiple years
const fetchAllManufacturers = async () => {
  try {
    console.log("Fetching manufacturers by querying across years...");
    const years = Array.from({ length: 36 }, (_, i) => 1990 + i); // 1990 to 2025
    const allManufacturers = new Set();

    for (const year of years) {
      try {
        const response = await axios.get("https://api.api-ninjas.com/v1/cars", {
          headers: { "X-Api-Key": API_KEY },
          params: { year, limit: 100 },
        });

        if (response.data && Array.isArray(response.data)) {
          response.data.forEach((car) => {
            if (car.make) allManufacturers.add(car.make.toLowerCase());
          });
          console.log(`Fetched ${response.data.length} cars for year ${year}, total unique manufacturers: ${allManufacturers.size}`);
        }
      } catch (error) {
        console.error(`Failed to fetch cars for year ${year}:`, error.message);
        if (error.response) {
          console.error("API Response:", error.response.data);
        }
      }
    }

    const manufacturers = Array.from(allManufacturers);
    console.log(`Fetched ${manufacturers.length} unique manufacturers`);
    return manufacturers;
  } catch (error) {
    console.error("Error fetching manufacturers:", error.message);
    throw error;
  }
};

// Fetch models for a given manufacturer
const fetchModelsForManufacturer = async (make) => {
  try {
    const modelsResponse = await axios.get("https://api.api-ninjas.com/v1/cars", {
      headers: { "X-Api-Key": API_KEY },
      params: { make, limit: 100 },
    });

    const models = modelsResponse.data
      .map((car) => car.model.toLowerCase())
      .filter((value, index, self) => self.indexOf(value) === index); // Deduplicate models

    console.log(`Fetched ${models.length} models for ${make}`);
    return models;
  } catch (error) {
    console.error(`Failed to fetch models for ${make}:`, error.message);
    if (error.response) {
      console.error(`API Response:`, error.response.data);
    }
    return [];
  }
};

// Populate brands and models
const populateBrands = async () => {
  try {
    // Uncomment the following line to drop the existing brands collection
    // await dropBrandsCollection();

    const manufacturers = await fetchAllManufacturers();

    console.log("Populating brands and models...");
    for (const make of manufacturers) {
      const models = await fetchModelsForManufacturer(make);
      if (models.length === 0) {
        console.log(`Skipping ${make} due to no models found`);
        continue;
      }

      await mongoose.model("Brand").findOneAndUpdate(
        { name: make.toLowerCase() },
        {
          name: make.toLowerCase(),
          models: models.map((name) => ({ name })), // Store as array of objects
          logo: "", // Will be updated later
        },
        { upsert: true, new: true }
      );

      console.log(`Saved brand: ${make} with ${models.length} models: ${models.join(", ")}`);
    }

    console.log("Finished populating brands");
  } catch (error) {
    console.error("Error populating brands:", error.message);
    throw error;
  }
};

// Fetch logos from www.carlogos.org
const fetchLogosFromCarLogos = async () => {
  try {
    const response = await axios.get("https://www.carlogos.org/car-brands/");
    const $ = cheerio.load(response.data);

    const logoData = [];
    $("div.car-logo").each((i, element) => {
      const brandElement = $(element).find("h2, h3, p.brand-name");
      const brandName = brandElement.text().toLowerCase().trim().replace(/[^a-z0-9]/g, "");
      const logoUrl = $(element).find("img").attr("src");
      if (brandName && logoUrl) {
        const fullLogoUrl = logoUrl.startsWith("http")
          ? logoUrl
          : `https://www.carlogos.org${logoUrl}`;
        logoData.push({ name: brandName, logo: fullLogoUrl });
        console.log(`Found logo for ${brandName}: ${fullLogoUrl}`);
      } else {
        console.log(`No valid logo data for element ${i}`);
      }
    });

    for (const { name, logo } of logoData) {
      const updatedBrand = await mongoose.model("Brand").findOneAndUpdate(
        { name },
        { logo },
        { new: true, upsert: false }
      );
      if (updatedBrand) {
        console.log(`Updated logo for ${name}: ${logo}`);
      } else {
        console.log(`Brand ${name} not found in database for logo update`);
      }
    }

    console.log("Finished fetching logos from carlogos.org");
    return logoData;
  } catch (error) {
    console.error("Error fetching logos:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    throw error;
  }
};

// Main execution
const run = async () => {
  try {
    await connectDB();
    await populateBrands();
    const logos = await fetchLogosFromCarLogos();
    console.log("Separate logo list:", logos);
  } catch (error) {
    console.error("Script failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

run();