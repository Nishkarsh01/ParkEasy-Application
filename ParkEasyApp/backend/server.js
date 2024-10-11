// server.js
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');  // Import cors package
const authRoutes = require('./routes/auth');
require('dotenv').config();
require('./services/AuthService');  // Initialize Passport.js

const app = express();

app.use(cors());  // Enable CORS for all routes

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
