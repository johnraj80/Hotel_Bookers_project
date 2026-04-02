import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        // use full URI from environment; you can append a database name if desired
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
}

export default connectDB;
