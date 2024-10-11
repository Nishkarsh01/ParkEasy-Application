const express = require('express');
const UserService = require('../services/UserService');
const { verifyToken } = require('../services/AuthService');
const passport = require('passport');
require('../services/AuthService'); // Initialize Passport.js

const router = express.Router();

// Step 1: Send verification email
router.post('/initiate-registration', async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const response = await UserService.initiateRegistration({ full_name, email });
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Step 2: Complete registration (after email verification)
router.post('/complete-registration', async (req, res) => {
  try {
    const { email, password, user_type } = req.body;
    const response = await UserService.completeRegistration({ email, password, user_type });
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    await UserService.verifyEmail(token);
    res.redirect('/email-verified');  // Redirect to a success page
  } catch (err) {
    res.status(400).send({ error: 'Email verification failed' });
  }
});

// User registration route
router.post('/register', async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User login route
router.post('/login', async (req, res) => {
  try {
    const { token, user } = await UserService.login(req.body);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Google OAuth login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res) => {
    const token = req.user.token;
    res.redirect(`https://parkeasy-application.onrender.com/dashboard?token=${token}`);
  }
);

// Get user profile (protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await UserService.getProfile(req.user.user_id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile (protected)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updatedProfile = await UserService.updateProfile(req.user.user_id, req.body);
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

// Delete user profile (protected)
router.delete('/profile', verifyToken, async (req, res) => {
  try {
    const deletedUser = await UserService.deleteUser(req.user.user_id);
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
});

// Logout route (optional)
router.post('/logout', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
