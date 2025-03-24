const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('../models/Country'); // Adjust the path based on your model location

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/water_backend', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to fetch country data from the Restcountries API
const fetchCountries = async () => {
  try {
    // Fetch country data from the API
    const response = await axios.get('https://restcountries.com/v3.1/all');

    // Loop through each country and extract relevant fields
    const countries = response.data.map(country => ({
      name: country.name.common.toLowerCase(), // Country name
      code: country.cca2.toLowerCase(), // ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')
      continent: country.region.toLowerCase(), // Continent name (e.g., 'Africa', 'Europe')
      capital: country.capital ? country.capital[0].toLowerCase() : 'N/A', // Capital city
      currency: country.currencies ? Object.keys(country.currencies)[0].toLowerCase() : 'N/A', // Currency (first in case of multiple)
      officialLanguages: country.languages ? Object.values(country.languages).map(language => language.toLowerCase()) : [], // Official languages
      flag: country.flags.png || '', // Flag URL (PNG version)
    }));

    // Insert the countries into the database
    await insertCountries(countries);
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
};

// Function to insert country data into the MongoDB database
const insertCountries = async (countries) => {
  try {
    // Create an array of all unique country names
    const uniqueCountries = [...new Set(countries.map(c => c.name))];

    // Filter out countries that already exist in the database
    const existingCountries = await Country.find({ name: { $in: uniqueCountries } }).select('name');
    const existingNames = new Set(existingCountries.map(c => c.name));

    // Filter countries that don't already exist in the database
    const newCountries = countries.filter(c => !existingNames.has(c.name));

    // Bulk insert new countries
    if (newCountries.length > 0) {
      await Country.insertMany(newCountries);
      console.log(`Inserted ${newCountries.length} new countries.`);
    } else {
      console.log('No new countries to insert.');
    }
  } catch (err) {
    console.error('Error inserting countries:', err);
  }
};

// Start the process of fetching and inserting countries
fetchCountries();
