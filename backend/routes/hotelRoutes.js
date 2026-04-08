import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

// owners only
hotelRouter.post('/hotels', protect, registerHotel);

export default hotelRouter;
