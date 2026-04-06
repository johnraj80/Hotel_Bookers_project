import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// --- For AdminDashboard.jsx ---
export const getDashboardStats = async (req, res) => {
  try {
    const totalHotels = await Hotel.countDocuments();
    const verifiedHotels = await Hotel.countDocuments({ isVerified: true });
    const pendingVerification = totalHotels - verifiedHotels;

    const totalUsers = await User.countDocuments();
    const guests = await User.countDocuments({ role: "user" });
    const hotelOwners = await User.countDocuments({ role: "hotelOwner" });

    // Calculate total revenue from confirmed bookings
    const bookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const transactions = bookings.length;

    res.json({
      success: true,
      stats: {
        totalHotels,
        verifiedHotels,
        pendingVerification,
        totalUsers,
        guests,
        hotelOwners,
        totalRevenue,
        transactions,
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --- For HotelVerification.jsx ---
export const getPendingHotels = async (req, res) => {
  try {
    // Fetch hotels that are not verified and populate the owner's details
    const pendingHotels = await Hotel.find({ isVerified: false })
      .populate("owner", "username email")
      .sort({ createdAt: 1 });
      
    res.json({ success: true, pendingHotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyHotel = async (req, res) => {
  try {
    const { hotelId, action } = req.body; // action will be 'approve' or 'reject'

    if (action === 'approve') {
      await Hotel.findByIdAndUpdate(hotelId, { isVerified: true });
      return res.json({ success: true, message: "Hotel approved successfully" });
    } else if (action === 'reject') {
      // If rejected, you can either delete the application or add a 'rejected' status
      await Hotel.findByIdAndDelete(hotelId);
      return res.json({ success: true, message: "Hotel application rejected and removed" });
    }

    res.json({ success: false, message: "Invalid action" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --- For RegisteredHotels.jsx ---
export const getRegisteredHotels = async (req, res) => {
  try {
    const verifiedHotels = await Hotel.find({ isVerified: true })
      .populate("owner", "username email")
      .sort({ createdAt: -1 });
    
    // Optional: You could map through these and count bookings for each hotel here
    // For now, we will just send the hotel details
    res.json({ success: true, hotels: verifiedHotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --- For Transactions.jsx ---
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Booking.find()
      .populate("hotel", "name")
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --- For Users.jsx ---
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const guests = await User.countDocuments({ role: "user" });
    const hotelOwners = await User.countDocuments({ role: "hotelOwner" });

    res.json({
      success: true,
      stats: { totalUsers, guests, hotelOwners }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};