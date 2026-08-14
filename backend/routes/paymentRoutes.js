import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

// protect() already verifies the JWT and attaches req.user -- no extra step needed
paymentRouter.post("/create-order", protect, createPaymentOrder);
paymentRouter.post("/verify", protect, verifyPayment);

export default paymentRouter;