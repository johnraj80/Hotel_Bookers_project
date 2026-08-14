import jwt from "jsonwebtoken";

// Creates a signed JWT containing the user's Mongo _id
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables");
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

export default generateToken;