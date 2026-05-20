// services/storage.service.js

import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// UPLOAD FILE
export const uploadVideo = async (filePath) => {
  return await uploadToCloudinary(filePath);
};

// DELETE FILE
export const deleteVideo = async (publicId) => {
  return await deleteFromCloudinary(publicId);
};