import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { assets, cities } from '../assets/assets'
import { storeRecentSearchedCity } from '../features/auth/authSlice'

const Hero = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [destination, setDestination] = useState("")

    const onSearch = async (e) => {
        e.preventDefault();
        navigate(`/rooms?destination=${destination}`)
        dispatch(storeRecentSearchedCity(destination))
    }

    return (
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
            <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-14 font-bold md:font-extrabold max-w-xl mt-4'>Discover Your Perfect Gateway Destination</h1>
            <p className='max-w-130 mt-2 text-sm md:text-base'>Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.</p>

            <form onSubmit={onSearch} className='bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto transition-colors duration-300'>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4 dark:invert dark:opacity-70' />
                        <label htmlFor="destinationInput">Destination</label>
                    </div>
                    <input onChange={e => setDestination(e.target.value)} value={destination} list='destinations' id="destinationInput" type="text" className="rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
                    <datalist id="destinations">
                        {cities.map((city, index) => (<option value={city} key={index} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4 dark:invert dark:opacity-70' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" className="rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4 dark:invert dark:opacity-70' />
                        <label htmlFor="checkOut">Check out</label>
                    </div>
                    <input id="checkOut" type="date" className="rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-md bg-black dark:bg-white dark:text-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-7 dark:invert' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero