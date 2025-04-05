import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {student} from "../models/student.model.js";
import jwt from "jsonwebtoken";

const authSTD = asyncHandler(async(req, _, next) => {
    try {
        // Log cookies received for debugging
        console.log("Cookies received:", req.cookies);
        
        // Check for token in both cookies and Authorization header
        const accToken = req.cookies?.Accesstoken || 
                         req.header("Authorization")?.replace("Bearer ", "");
        
        if (!accToken) {
            console.log("No access token found in request");
            throw new ApiError(401, "Unauthorized request: No authentication token");
        }
        
        // Verify the token
        let decodedAccToken;
        try {
            decodedAccToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
            console.log("Token verified for user ID:", decodedAccToken._id);
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            
            // Provide specific error messages based on error type
            if (error.name === "TokenExpiredError") {
                throw new ApiError(401, "Authentication token expired");
            } else if (error.name === "JsonWebTokenError") {
                throw new ApiError(401, "Invalid authentication token");
            } else {
                throw new ApiError(401, "Token verification failed");
            }
        }
        
        // Find the student
        const Student = await student.findById(decodedAccToken?._id)
                               .select("-Password -Refreshtoken");
        
        if (!Student) {
            console.log("No student found with ID:", decodedAccToken._id);
            throw new ApiError(401, "Invalid access token: User not found");
        }
        
        console.log("Authentication successful for student:", Student._id);
        
        // Attach student to request
        req.Student = Student;
        next();
        
    } catch (error) {
        // Don't swallow errors, let asyncHandler deal with them
        throw error;
    }
});

export { authSTD };