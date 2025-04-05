import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: "dy2fllwhq",
  api_key: "282772812972193",
  api_secret:"3DyMRKzxcd6ZY-4U81QfiaChS5I",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) return null;
      
      // Ensure we have an absolute path
      const absolutePath = path.isAbsolute(localFilePath) 
        ? localFilePath 
        : path.resolve(localFilePath);
      
      // Check if file exists before attempting upload
      if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        return null;
      }
  
      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(absolutePath, {
        resource_type: "auto",
      });
  
      // Clean up the local file after successful upload
      try {
        fs.unlinkSync(absolutePath);
      } catch (unlinkError) {
        console.log("Error deleting local file:", unlinkError);
      }
  
      return response;
    } catch (err) {
      console.log("cloudinary upload error", err);
      
      // Only attempt to delete if we have a path and the file exists
      if (localFilePath && fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
          console.log("Error deleting local file in error handler:", unlinkError);
        }
      }
      
      return null;
    }
  };
  
  export { uploadOnCloudinary };