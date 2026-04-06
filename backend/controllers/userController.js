import User from "../models/User.js";

export const getUserData = async (req, res) => {
    try {
        const user = req.user; // Populated by protect middleware
        if (!user) return res.json({ success: false, message: "User not found" });
        
        // Return the full object so AppContext can read .role and .hotelStatus
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user;
        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity);
        } else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }
        await user.save();
        res.json({ success: true, message: "City added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};