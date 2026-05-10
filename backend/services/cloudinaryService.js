import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Upload a file buffer directly to Cloudinary (no temp file needed)
export const uploadBufferToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "traffic-reports",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    // Convert buffer to a readable stream and pipe into Cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return false;
  }
};
