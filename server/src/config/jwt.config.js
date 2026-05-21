// jwt.config.js
const jwt = require('jsonwebtoken');

// In production, ALWAYS store this in a .env file and load it via process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_super_secret_key_here';
const JWT_EXPIRATION = '1h'; // Token expires in 1 hour


const createToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  } catch (error) {
    console.error('Error signing token:', error);
    throw new Error('Token generation failed');
  }
};

module.exports = {
  createToken
};