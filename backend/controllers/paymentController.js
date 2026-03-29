import crypto from "crypto";
import razorpay from "../configs/razorpay.js";
import Booking from "../models/Booking.js";

// POST /api/payment/create-order
// Creates a Razorpay order for an existing booking
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find the booking and make sure it belongs to this user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.isPaid) {
      return res.json({ success: false, message: "Booking is already paid" });
    }

    const options = {
      amount: booking.totalPrice * 100, // Convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // Save orderId to booking for later verification
    await Booking.findByIdAndUpdate(bookingId, { orderId: order.id });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      bookingId,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/payment/verify
// Verifies Razorpay signature and marks booking as paid
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Generate expected signature using HMAC-SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // Mark booking as paid and confirmed
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: "Online",
      status: "confirmed",  // Auto-confirm on successful payment
    });

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};