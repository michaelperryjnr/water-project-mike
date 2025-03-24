const axios = require('axios');
const mongoose = require('mongoose');
const Nationality = require('../models/Nationality'); // Adjust the path based on where your model is

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/water_backend', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to fetch nationality data from the Restcountries API
const fetchNationalities = async () => {
  try {
    // Fetch country data from the API
    const response = await axios.get('https://restcountries.com/v3.1/all');
    
    // Loop through each country and extract the nationality name (demonym)
    const nationalities = response.data.map(country => ({
      nationalityName: country.demonyms?.eng?.m ? country.demonyms?.eng?.m.toLowerCase() : country.name.common.toLowerCase(),
    }));

    // Insert the nationalities into the database
    await insertNationalities(nationalities);
  } catch (error) {
    console.error('Error fetching nationality data:', error);
  }
};

// Function to insert nationality data into the MongoDB database
const insertNationalities = async (nationalities) => {
  for (const nationality of nationalities) {
    try {
      // Create and save each nationality in the database
      const existingNationality = await Nationality.findOne({ nationalityName: nationality.nationalityName });

      // Only insert if the nationality doesn't already exist
      if (!existingNationality) {
        const newNationality = new Nationality(nationality);
        await newNationality.save();
        console.log(`Inserted: ${nationality.nationalityName}`);
      } else {
        console.log(`Already exists: ${nationality.nationalityName}`);
      }
    } catch (err) {
      console.error('Error inserting nationality:', err);
    }
  }
};

// Start the process of fetching and inserting nationalities
fetchNationalities();



/* const axios = require('axios');
const mongoose = require('mongoose');
const Nationality = require('../models/Nationality'); // Adjust the path based on where your model is

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/water_backend', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to fetch nationality data from the Restcountries API
const fetchNationalities = async () => {
  try {
    // Fetch country data from the API
    const response = await axios.get('https://restcountries.com/v3.1/all');
    
    // Loop through each country and extract the nationality name (demonym)
    const nationalities = response.data.map(country => {
      const demonym = country.demonyms?.eng?.m || country.demonyms?.eng?.f; // Get either 'm' or 'f' for the demonym

      // Only insert if a demonym exists
      if (demonym) {
        return {
          nationalityName: demonym.toLowerCase(),
        };
      }

      // Return null if no demonym is found
      return null;
    }).filter(n => n !== null); // Remove any countries that didn't have a demonym

    // Insert the nationalities into the database
    await insertNationalities(nationalities);
  } catch (error) {
    console.error('Error fetching nationality data:', error);
  }
};

// Function to insert nationality data into the MongoDB database
const insertNationalities = async (nationalities) => {
  try {
    // Create an array of all unique nationality names
    const uniqueNationalities = [...new Set(nationalities.map(n => n.nationalityName))];

    // Filter out nationalities that already exist in the database
    const existingNationalities = await Nationality.find({ nationalityName: { $in: uniqueNationalities } }).select('nationalityName');
    const existingNames = new Set(existingNationalities.map(n => n.nationalityName));

    // Filter nationalities that don't already exist in the database
    const newNationalities = nationalities.filter(n => !existingNames.has(n.nationalityName));

    // Bulk insert new nationalities
    if (newNationalities.length > 0) {
      await Nationality.insertMany(newNationalities);
      console.log(`Inserted ${newNationalities.length} new nationalities.`);
    } else {
      console.log('No new nationalities to insert.');
    }
  } catch (err) {
    console.error('Error inserting nationalities:', err);
  }
};

// Start the process of fetching and inserting nationalities
fetchNationalities();
 */