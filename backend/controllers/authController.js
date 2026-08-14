import User from "../models/User.js";
import generateToken from "../utils/GenerateToken.js";

// @route  POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "An account with this email already exists" });
        }

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password, // hashed automatically by the pre-save hook on the model
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                image: user.image,
                recentSearchedCities: user.recentSearchedCities,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route  POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // password has select:false on the schema, so it must be explicitly requested
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                image: user.image,
                recentSearchedCities: user.recentSearchedCities,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route  GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
    // req.user is attached by the `protect` middleware
    res.json({
        success: true,
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            image: req.user.image,
            recentSearchedCities: req.user.recentSearchedCities,
        },
    });
};

// @route  POST /api/auth/logout
// With a Bearer-token setup the token simply gets discarded client-side,
// but we expose this endpoint for symmetry / future cookie-based auth.
export const logoutUser = async (req, res) => {
    res.json({ success: true, message: "Logged out" });
};