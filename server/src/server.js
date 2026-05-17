// server.js

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);


// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Server is up and running smoothly!',
//     timestamp: new Date().toISOString(),
//     database: 'connected' // Optional: you can dynamically check mongoose.connection.readyState here
//   });
//   console.log('Health check endpoint accessed');
// });


const PORT = process.env.PORT || 5000;

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();