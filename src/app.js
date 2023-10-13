const express = require('express');
const app = express();
const connectDB = require('./config/db');
const routes = require('./routes');

// Load environment variables from .env file.
require('dotenv').config();

// Connect to the MongoDB database.
connectDB();

// Middleware setup, including body parsing, CORS, etc.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes.
app.use('/api', routes);

// Start the Express server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
