import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) =>{
    try {
        const {name, address, contact, city} = req.body;
        const owner = req.user._id

        const hotel = await Hotel.findOne({owner})
        if(hotel){
            return res.json({ success: false, message: "Hotel Already Registered" })
        }
        
        await Hotel.create({name, address, contact, city, owner});

        // Set role AND explicitly set hotelStatus to pending
        await User.findByIdAndUpdate(owner, {
            role: "hotelOwner",
            hotelStatus: "pending" 
        });

        res.json({success: true, message: "Hotel Registered Successfully. Pending Admin Approval."})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}