import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HotelCard from './HotelCard'
import Title from './Title'

const FeaturedDestination = () => {
    const navigate = useNavigate()
    const rooms = useSelector((state) => state.rooms.list)

    return rooms.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 dark:bg-gray-950 py-20'>

            <Title title='Featured Destinations' subtitle='Discover our most popular destinations and book your next stay with us.' />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {rooms.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>

            <button onClick={() => {
                navigate('/rooms'); scrollTo(0, 0)
            }} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination