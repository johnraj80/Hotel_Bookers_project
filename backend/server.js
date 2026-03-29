import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import "dotenv/config";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

connectDB()
connectCloudinary()

const app = express();
app.use(cors());

app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use(express.json());

app.use(clerkMiddleware());

// Api to listen to Clerk webhooks
// app.use("/api/clerk", clerkWebhooks);
// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/admin", adminRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payment", paymentRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))

export default app;