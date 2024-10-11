const bcrypt = require('bcryptjs');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();


class UserService {

  // Helper function to validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate password strength
  static validatePassword(password) {
    // Password must be at least 8 characters long, contain at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }


  // Step 1: Initiate email verification (send verification email)
  static async initiateRegistration({ full_name, email }) {
    try {
      // Check if the email is already in use
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        throw new Error('Email is already in use.');
      }

      // Generate email verification token
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send verification email
      await this.sendVerificationEmail({ full_name, email, verificationToken });

      return { message: 'Verification email sent. Please check your inbox.' };
    } catch (err) {
      console.error('Error in initiateRegistration:', err.message);
      throw new Error('Failed to send verification email.');
    }
  }

    // Step 2: Complete registration after email verification
  static async completeRegistration({ email, password, user_type }) {
    try {
      // Check if the email has been verified
      const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_verified = true', [email]);
      if (result.rows.length === 0) {
        throw new Error('Email not verified. Please verify your email first.');
      }

      // Hash the password and complete the registration
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `UPDATE users SET password = $1, user_type = $2 WHERE email = $3`,
        [hashedPassword, user_type, email]
      );

      return { message: 'Registration complete. You can now log in.' };
    } catch (err) {
      console.error('Error in completeRegistration:', err.message);
      throw new Error('Error completing registration.');
    }
  }

    // Send verification email
    static async sendVerificationEmail({ full_name, email, verificationToken }) {
      const verificationLink = `http://localhost:3000/api/verify-email?token=${verificationToken}`;
  
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Verify Your Email - ParkEasy',
        text: `Hello ${full_name},\n\nPlease verify your email by clicking on the following link: ${verificationLink}`,
      };
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
  
      await transporter.sendMail(mailOptions);
    }

  // Register a new user (Email/Password)
  static async register({ full_name, email, password, phone, user_type, license_plate, vehicle_type }) {
    try {
      // Validate email format
      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format.');
      }

      // Validate password strength if user_type is either 'driver' or 'lister'
      if ((user_type === 'driver' || user_type === 'lister') && password && !this.validatePassword(password)) {
        throw new Error('Password is too weak. It must be at least 8 characters long and include both letters and numbers.');
      }

      // Hash the password if provided (for regular email/password registration)
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Insert new user into the database
      const result = await pool.query(
        `INSERT INTO users (full_name, email, password, phone, user_type, license_plate, vehicle_type) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [full_name, email, hashedPassword, phone, user_type, license_plate, vehicle_type]
      );

      return result.rows[0]; // Return the newly created user
    } catch (err) {
      console.error('Error in register:', err.message);
      throw new Error('Error during registration');
    }
  }

  // Login a user (Email/Password)
  static async login({ email, password }) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];

      // Check if the user is a Google OAuth user
      if (user.google_id && !user.password) {
        throw new Error('This account is registered with Google. Please use Google to login.');
      }

      // Compare passwords using bcrypt for regular users
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { token, user };
    } catch (err) {
      console.error('Error in login:', err.message);
      throw new Error('Error during login');
    }
  }

  // Delete a user by their ID
  static async deleteUser(user_id) {
    try {
      const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [user_id]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];  // Return the deleted user data
    } catch (err) {
      console.error('Error in deleteUser:', err.message);
      throw new Error('Error during user deletion');
    }
  }

  // Get user profile by ID
  static async getProfile(user_id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (err) {
      console.error('Error in getProfile:', err.message);
      throw new Error('Error fetching profile');
    }
  }

  // Update user profile
  static async updateProfile(user_id, updatedData) {
    try {
      const {
        full_name, email, phone, user_type, license_plate, vehicle_type, wants_push_notifications, wants_calendar_reminders
      } = updatedData;

      const result = await pool.query(
        `UPDATE users 
         SET full_name = $1, email = $2, phone = $3, user_type = $4, license_plate = $5, vehicle_type = $6,
             wants_push_notifications = $7, wants_calendar_reminders = $8
         WHERE user_id = $9 RETURNING *`,
        [full_name, email, phone, user_type, license_plate, vehicle_type, wants_push_notifications, wants_calendar_reminders, user_id]
      );

      if (result.rows.length === 0) {
        throw new Error('User update failed');
      }

      return result.rows[0]; // Return the updated user profile
    } catch (err) {
      console.error('Error in updateProfile:', err.message);
      throw new Error('Error updating profile');
    }
  }




    // Dummy function to "find" a user by Google ID (always succeeds)
    static async findByGoogleId(googleId) {
      try {
        // Return a dummy user object
        return {
          user_id: 1,
          full_name: 'John Doe',
          email: 'johndoe@gmail.com',
          google_id: googleId,
          user_type: 'driver'
        };
      } catch (err) {
        console.error('Error in findByGoogleId:', err.message);
        throw new Error('Error finding user by Google ID');
      }
    }
  
    // Dummy function to "create or update" a Google user (always succeeds)
    static async createOrUpdateGoogleUser(profile, userType) {
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;
  
        // Return a dummy user object
        return {
          user_id: 2,
          full_name: displayName,
          email: email,
          google_id: id,
          user_type: userType
        };
      } catch (err) {
        console.error('Error in createOrUpdateGoogleUser:', err.message);
        throw new Error('Error creating/updating Google user');
      }
    }
  
    // Dummy function for Google OAuth login (always succeeds)
    static async googleLogin(profile, userType) {
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;
  
        // Always "find" an existing user
        const existingUser = await this.findByGoogleId(id);
  
        // Generate a dummy JWT token
        const token = jwt.sign({ user_id: existingUser.user_id, email: existingUser.email }, 'dummy_jwt_secret', { expiresIn: '1h' });
  
        // Return the token and dummy user
        return { token, user: existingUser };
      } catch (err) {
        console.error('Error in googleLogin:', err.message);
        throw new Error('Error during Google login');
      }
    }
  }

  
  module.exports = UserService;
  
