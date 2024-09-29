const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/paymentRoutes');
const connectDB = require('./config/db');  // Import the database connection function

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/payments', paymentRoutes);

// Connect to MongoDB
connectDB();  // Call the connectDB function to establish the MongoDB connection

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});