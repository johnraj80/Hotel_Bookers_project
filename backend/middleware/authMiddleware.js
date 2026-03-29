import User from "../models/User.js";
import { getAuth } from "@clerk/express";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated with Clerk" });
        }

        const user = await User.findById(userId);
        
        // ADD THIS CHECK: If the user isn't in MongoDB, stop the request!
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found in database. Please sync Clerk user." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// NEW Middleware to check if the authenticated user is an admin
export const isAdmin = async (req, res, next) => {
    // protect() has already run, so req.user should exist.
    // We just check if their role is exactly "admin"
    if (req.user && req.user.role === "admin") {
        next(); // They are an admin! Let them pass to the controller.
    } else {
        // If not, block the request
        res.status(403).json({ 
            success: false, 
            message: "Access denied: Not authorized as an admin" 
        });
    }
};