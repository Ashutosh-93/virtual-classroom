// config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  console.log("reached db.js");
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");
};

export default connectDB;