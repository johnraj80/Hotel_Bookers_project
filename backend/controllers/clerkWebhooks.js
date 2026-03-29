import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // 1. Ensure req.body is the raw unparsed string/buffer
    const payloadString = req.body.toString('utf8');

    // 2. Verify using the raw string
    await whook.verify(payloadString, headers);

    // 3. Parse it into an object ONLY after successful verification
    const parsedBody = JSON.parse(payloadString);
    const { data, type } = parsedBody;

    switch (type) {
      case "user.created": {
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            // Fallback to empty string if first/last name are null
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(), 
            image: data.image_url,
            role: data.public_metadata?.role || "user",
        }
        await User.create(userData);
        break;
      }
      case "user.updated": {
         const userData = {
            email: data.email_addresses[0].email_address,
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url,
            role: data.public_metadata?.role || "user",
        }
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;