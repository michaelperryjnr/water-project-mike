const axios = require("axios");
const mongoose = require("mongoose");
require("./models/Brand"); // Import the Brand model

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API key from api-ninjas
const API_KEY = "your-api-key-here";

// Function to fetch brands and models
const populateBrands = async () => {
  try {
    // Fetch all makes (brands)
    const makesResponse = await axios.get("https://api.api-ninjas.com/v1/cars", {
      headers: { "X-Api-Key": API_KEY },
      params: { limit: 100 }, // Adjust limit as needed
    });

    const makes = makesResponse.data
      .map((car) => car.make)
      .filter((value, index, self) => self.indexOf(value) === index); // Get unique makes

    // For each make, fetch models
    for (const make of makes) {
      const modelsResponse = await axios.get("https://api.api-ninjas.com/v1/cars", {
        headers: { "X-Api-Key": API_KEY },
        params: { make, limit: 100 },
      });

      const models = modelsResponse.data
        .map((car) => ({
          name: car.model, // Only include the name field
        }))
        .filter((value, index, self) => self.findIndex((m) => m.name === value.name) === index); // Get unique models

      // Save to Brands collection
      await mongoose.model("Brand").findOneAndUpdate(
        { name: make.toLowerCase() },
        {
          name: make.toLowerCase(),
          logo: "", // Leave empty for now; can be updated manually or via another API
          models, // Array of models with only name
        },
        { upsert: true, new: true }
      );

      console.log(`Saved brand: ${make} with ${models.length} models`);
    }

    console.log("Finished populating brands");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error populating brands:", error);
    mongoose.connection.close();
  }
};

populateBrands();