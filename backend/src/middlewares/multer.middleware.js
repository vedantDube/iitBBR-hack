import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the public directory exists
const publicDir = "./public";
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, publicDir)
    },
    filename: function (req, file, cb) {
      // Sanitize filename - replace spaces with underscores and ensure no special characters
      const sanitizedName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      cb(null, sanitizedName)
    }
  })
  
export const upload = multer({ 
    storage, 
})