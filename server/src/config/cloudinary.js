import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload (Memory Storage / Buffer version)
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Create the upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    // Feed the buffer into the stream
    uploadStream.end(fileBuffer);
  });
};

// delete (Remains exactly the same)
export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
  });
};