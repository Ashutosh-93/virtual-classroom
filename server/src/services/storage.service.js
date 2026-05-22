import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// This service abstracts the Cloudinary operations for videos, making it easier to manage uploads and deletions in the controllers.
export const uploadVideo = async (fileBuffer) => {
  // Directly upload the buffer to Cloudinary
  return await uploadToCloudinary(fileBuffer);
};
// Delete video using the publicId
export const deleteVideo = async (publicId) => {
  return await deleteFromCloudinary(publicId);
};