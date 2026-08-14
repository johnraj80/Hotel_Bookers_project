import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { currency } from '../../config'
import api from '../../app/api'
import toast from 'react-hot-toast'

const Dashboard = () => {

    const user = useSelector((state) => state.auth.user)

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    })

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/api/bookings/hotel')
            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user])

    return (
        <div>
            <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your
            room listings, track bookings and analyze revenue—all in one place. Stay
            updated with real-time insights to ensure smooth operations.' />

            <div className='flex gap-4 my-8'>
                {/* ---- ---Total Bookings-- */}
                <div className='bg-primary/3 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded flex p-4
                pr-8'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden
                    h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Bookings</p>
                        <p className='text-neutral-400 dark:text-neutral-300 text-base'>{dashboardData.
                            totalBookings}</p>
                    </div>
                </div>

                {/* ---- ---Total Revenue-- */}
                <div className='bg-primary/3 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded flex p-4
                pr-8'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden
                    h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenue</p>
                        <p className='text-neutral-400 dark:text-neutral-300 text-base'>{currency} {dashboardData.
                            totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* ---- --- Recent Bookings --------- */}
            <h2 className='text-xl text-blue-950/70 dark:text-blue-300 font-medium mb-5'>Recent Bookings</h2>

            <div className='w-full max-w-3xl text-left border border-gray-300 dark:border-gray-700
            rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-800'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 dark:text-gray-100 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 dark:text-gray-100 font-medium
                            max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 dark:text-gray-100 font-medium
                            text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 dark:text-gray-100 font-medium
                            text-center'>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700'>
                                    {item.user.username}
                                </td>

                                <td className='py-3 px-4 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700 max-sm:hidden'>
                                    {item.room.roomType}
                                </td>

                                <td className='py-3 px-4 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700 text-center'>
                                    {currency} {item.totalPrice}
                                </td>

                                <td className='py-3 px-4 border-t border-gray-300 dark:border-gray-700 flex'>
                                    <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-amber-200 dark:bg-amber-900 text-yellow-600 dark:text-yellow-300'
                                        }`}>
                                        {item.isPaid ? 'Completed' : 'Pending'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard