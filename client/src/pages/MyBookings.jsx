import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import api from '../app/api'
import toast from 'react-hot-toast'

const MyBookings = () => {

    const [bookings, setBookings] = useState([])
    const user = useSelector((state) => state.auth.user)

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/api/bookings/user')
            if (data.success) {
                setBookings(data.bookings)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) fetchBookings()
    }, [user])

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await api.post('/api/payment/create-order', { bookingId })

            if (!data.success) return toast.error(data.message)

            const { order, key } = data

            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: "Hotel Booking",
                description: "Room Booking Payment",
                order_id: order.id,
                handler: async (response) => {
                    const verify = await api.post('/api/payment/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingId,
                    })
                    if (verify.data.success) {
                        toast.success("Payment Successful! Booking Confirmed.")
                        setBookings(prev =>
                            prev.map(b => b._id === bookingId
                                ? { ...b, isPaid: true }
                                : b
                            )
                        )
                    } else {
                        toast.error("Payment verification failed")
                    }
                },
                prefill: {
                    name: user?.username,
                    email: user?.email,
                },
                theme: { color: "#3B82F6" },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>

            <Title title='My Bookings' subtitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />

            <div className='max-w-6xl mt-8 w-full text-gray-800 dark:text-gray-100'>

                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b
        border-gray-300 dark:border-gray-700 font-medium text-base py-3'>
                    <div className='w-1/3'>Hotels</div>
                    <div className='w-1/3'>Date & Timings</div>
                    <div className='w-1/3'>Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 dark:border-gray-700 py-6 first:border-t'>
                        {/* ----- Hotel Details ---- */}
                        <div className='flex flex-col md:flex-row'>
                            <img src={booking.room.images[0]} alt="hotel-img"
                                className='min-md:w-44 rounded shadow object-cover' />
                            <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.hotel.name}
                                    <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                                </p>
                                <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                                    <img src={assets.locationIcon} alt="location-icon" className='dark:invert dark:opacity-70' />
                                    <span>{booking.hotel.address}</span>
                                </div>
                                <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                                    <img src={assets.guestsIcon} alt="guests-icon" className='dark:invert dark:opacity-70' />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className='text-base'>Total: ${booking.totalPrice}</p>
                            </div>
                        </div>

                        {/* ----- Date & Timeings ---- */}
                        <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                            <div>
                                <p>Check-In:</p>
                                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                                    {new Date(booking.checkInDate).toDateString()}
                                </p>
                            </div>
                            <div>
                                <p>Check-Out:</p>
                                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                                    {new Date(booking.checkOutDate).toDateString()}
                                </p>
                            </div>
                        </div>

                        {/* ----- Payent Status ---- */}
                        <div className='flex flex-col items-start justify-center pt-3'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ?
                                    "bg-green-500" : "bg-red-500"}`}></div>
                                <p className={`text-sm ${booking.isPaid ? "text-green-500" :
                                    "text-red-500"}`}>
                                    {booking.isPaid ? "Paid" : "Unpaid"}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button onClick={() => handlePayment(booking._id)} className='px-4 py-1.5 mt-4 text-xs border border-gray-400 dark:border-gray-600
                rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer'>
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default MyBookings