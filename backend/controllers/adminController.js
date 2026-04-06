import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalHotels = await Hotel.countDocuments();
    const verifiedHotels = await Hotel.countDocuments({ isVerified: true });
    const pendingVerification = totalHotels - verifiedHotels;
    const totalUsers = await User.countDocuments();
    const guests = await User.countDocuments({ role: "user" });
    const hotelOwners = await User.countDocuments({ role: "hotelOwner" });
    const bookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const transactions = bookings.length;

    res.json({
      success: true,
      stats: { totalHotels, verifiedHotels, pendingVerification, totalUsers, guests, hotelOwners, totalRevenue, transactions }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyHotel = async (req, res) => {
  try {
    const { hotelId, action } = req.body; 

    if (action === 'approve') {
      const hotel = await Hotel.findByIdAndUpdate(hotelId, { isVerified: true }, { new: true });
      if (hotel) {
        // Sync user role and status so the Navbar updates
        await User.findByIdAndUpdate(hotel.owner, { role: 'hotelOwner', hotelStatus: 'approved' });
      }
      return res.json({ success: true, message: "Hotel approved successfully" });
    } else if (action === 'reject') {
      const hotel = await Hotel.findById(hotelId);
      if (hotel) {
        await User.findByIdAndUpdate(hotel.owner, { hotelStatus: '', role: 'user' });
        await Hotel.findByIdAndDelete(hotelId);
      }
      return res.json({ success: true, message: "Hotel application rejected" });
    }
    res.json({ success: false, message: "Invalid action" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPendingHotels = async (req, res) => {
  try {
    const pendingHotels = await Hotel.find({ isVerified: false }).populate("owner", "username email").sort({ createdAt: 1 });
    res.json({ success: true, pendingHotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRegisteredHotels = async (req, res) => {
  try {
    const verifiedHotels = await Hotel.find({ isVerified: true }).populate("owner", "username email").sort({ createdAt: -1 });
    res.json({ success: true, hotels: verifiedHotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Booking.find().populate("hotel", "name").populate("user", "username").sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const guests = await User.countDocuments({ role: "user" });
    const hotelOwners = await User.countDocuments({ role: "hotelOwner" });
    res.json({ success: true, stats: { totalUsers, guests, hotelOwners } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};