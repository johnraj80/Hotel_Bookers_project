import express from "express";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getPendingHotels,
  verifyHotel,
  getRegisteredHotels,
  getTransactions,
  getUserStats
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// NOTE: You should ideally add an isAdmin middleware here to ensure normal users can't access these
// For now, we are using the standard 'protect' middleware to ensure they are logged in.

adminRouter.get("/dashboard", protect, isAdmin, getDashboardStats);
adminRouter.get("/hotels/pending", protect, isAdmin, getPendingHotels);
adminRouter.post("/hotels/verify", protect, isAdmin, verifyHotel); 
adminRouter.get("/hotels/registered", protect, isAdmin, getRegisteredHotels);
adminRouter.get("/transactions", protect, isAdmin, getTransactions);
adminRouter.get("/users", protect, isAdmin, getUserStats);

export default adminRouter;