import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        // 1. Explicitly define _id to accept Clerk's string IDs
        
        username: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, minlength: 6, select: false },
        image: { type: String, default: "" },
        role: { type: String, enum: ["user", "hotelOwner", "admin"], default: "user" },
        recentSearchedCities: { type: [String], default: [] },
    },
    { timestamps: true }
);

// Hash password whenever it is created/changed
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // Removed next()
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Removed next() at the bottom
});

// Instance method to compare a plaintext password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Cascade-delete owned hotels when a user is deleted
userSchema.pre("findOneAndDelete", async function (next) {
    const userId = this.getQuery()["_id"];
    await mongoose.model("Hotel").findOneAndDelete({ owner: userId });
    // await mongoose.model('Booking').deleteMany({ user: userId });
});

const User = mongoose.model("User", userSchema);

export default User;