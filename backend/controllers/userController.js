import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// GET /api/user/  (protected)
export const getUserData = async (req, res) => {
    try {
        const { role, recentSearchedCities, _id } = req.user;

        let hotelStatus = "none";
        const hotel = await Hotel.findOne({ owner: _id });
        if (hotel) {
            hotelStatus = hotel.isVerified ? "approved" : "pending";
        }

        res.json({ success: true, role, recentSearchedCities, hotelStatus });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/recent-search  (protected)
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

// DELETE /api/user/:userId  (admin only)
// No webhook needed anymore -- deleting the Mongo doc directly triggers the
// findOneAndDelete pre-hook, which cascades and removes the user's hotel too.
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.json({ success: false, message: "User not found" });
        }

        await User.findOneAndDelete({ _id: userId });

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};