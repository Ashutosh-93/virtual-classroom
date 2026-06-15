// src/config/jwt.config.js
import jwt from 'jsonwebtoken';

// In production, ALWAYS store this in a .env file and load it via process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_super_secret_key_here';
const JWT_EXPIRATION = '1h'; // Token expires in 1 hour

export const createToken = (incomingPayload) => {
  try {
    let sanitizedPayload;

    // Defensive Check: If the payload is a Mongoose ObjectId or a plain primitive string/number
    if (typeof incomingPayload !== 'object' || incomingPayload === null || incomingPayload._bsontype) {
      sanitizedPayload = { id: incomingPayload.toString() };
    } else {
      // If it's already an object, make a shallow copy to ensure it's a plain JS object literal
      sanitizedPayload = { ...incomingPayload };
      
      // If the object has an _id property that is an ObjectId, flatten it to a string
      if (sanitizedPayload.id && typeof sanitizedPayload.id === 'object') {
        sanitizedPayload.id = sanitizedPayload.id.toString();
      }
    }

    // Securely sign the verified plain object literal
    return jwt.sign(sanitizedPayload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  } catch (error) {
    console.error('Error signing token inside config utility:', error);
    throw new Error('Token generation failed');
  }
};