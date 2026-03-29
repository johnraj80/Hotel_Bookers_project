import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

const paymentRouter = express.Router();

// Attach req.user like your other protected routes
const attachUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

paymentRouter.post("/create-order", requireAuth(), attachUser, createPaymentOrder);
paymentRouter.post("/verify", requireAuth(), attachUser, verifyPayment);

export default paymentRouter;