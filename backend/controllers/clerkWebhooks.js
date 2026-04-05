import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET in environment variables");
    }

    // Getting Headers
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    // If there are no Svix headers, error out immediately
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        message: "Error: Missing svix headers",
      });
    }

    // Create a Svix instance
    const whook = new Webhook(WEBHOOK_SECRET);

    // Convert the raw Buffer into a string for verification
    const payloadString = req.body.toString('utf8');

    let evt;
    try {
      // whook.verify actually returns the parsed JSON object!
      evt = whook.verify(payloadString, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Svix Verification Error:", err.message);
      // MUST return 400 so Clerk knows it failed
      return res.status(400).json({ success: false, message: err.message });
    }

    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        // Safely handle missing first/last names
        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim() || "User";

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: fullName,
            image: data.image_url || "",
            role: data.public_metadata?.role || "user",
        }
        await User.create(userData);
        break;
      }

      case "user.updated": {
        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim() || "User";

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: fullName,
            image: data.image_url || "",
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

    // Only return 200 if everything succeeded
    res.status(200).json({ success: true, message: "Webhook Received and Processed" });
    
  } catch (error) {
    console.error("Database/Server Error:", error.message);
    // MUST return 400/500 so Clerk knows the database failed
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;