// corsConfig.js
import cors from 'cors';

// Add all your allowed frontend URLs here
const allowedOrigins = [
  'http://localhost:5173',       // Local Vite Server
  'https://yourproductionapp.com' // Deployed Frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Export the middleware ready to be used
export const corsMiddleware = cors(corsOptions);