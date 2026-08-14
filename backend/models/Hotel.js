import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  owner: { type: String, required: true, ref: "User" },
  city: { type: String, required: true },
  isVerified:{ type: Boolean, default: false}
}, {timestamps: true });

hotelSchema.pre('findOneAndDelete', async function(next) {
    const hotelId = this.getQuery()["_id"];
    
    // Delete all rooms associated with this hotel
    await mongoose.model('Room').deleteMany({ hotel: hotelId });
    
    // Delete all bookings associated with this hotel
    await mongoose.model('Booking').deleteMany({ hotel: hotelId });
    
    next();
});


const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;