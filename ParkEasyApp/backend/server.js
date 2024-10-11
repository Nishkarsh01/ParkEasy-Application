// server.js
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');  // Import cors package
const authRoutes = require('./routes/auth');
require('dotenv').config();
require('./services/AuthService');  // Initialize Passport.js

const app = express();

// Set up the allowed origins including the Ngrok URL for development
const allowedOrigins = [
  'https://localhost:3000',  // Localhost for local development
  'https://parkeasy-application.onrender.com',  // Your production URL
  'https://1002-172-97-138-16.ngrok-free.app'  // Ngrok URL for development
];

// CORS configuration to allow requests from specific origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  // Allow credentials such as cookies or authorization headers
}));

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
