import Razorpay from "razorpay";

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  // Don't throw at import time -- that would crash the entire serverless
  // function (and every unrelated route with it) before Express even
  // starts. Payment routes will fail gracefully instead, at request time.
  console.error(
    "Razorpay is not configured: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing from environment variables."
  );
}

export default razorpay;