import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='bg-[#F6F9FC] dark:bg-gray-900 text-gray-500/80 dark:text-gray-400 pt-8 px-6 md:px-16 lg:px-24 xl:px-32 transition-colors duration-300'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80 dark:invert-0' />
                    <p className='text-sm'>
                        Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <img src={assets.instagramIcon} alt="instagram-icon" className='dark:invert dark:opacity-70' />
                        <img src={assets.facebookIcon} alt="facebook-icon" className='dark:invert dark:opacity-70' />
                        <img src={assets.twitterIcon} alt="twitter-icon" className='dark:invert dark:opacity-70' />
                        <img src={assets.linkendinIcon} alt="linkedin-icon" className='dark:invert dark:opacity-70' />
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800 dark:text-gray-100'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800 dark:text-gray-100'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='font-playfair text-lg text-gray-800 dark:text-gray-100'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Subscribe to our newsletter for inspiration and special offers.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white dark:bg-gray-800 dark:text-gray-100 rounded-l border border-gray-300 dark:border-gray-700 h-9 px-3 outline-none' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-black dark:bg-gray-100 h-9 w-9 aspect-square rounded-r'>
                            <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert dark:invert-0'/>
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-300 dark:border-gray-700 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} HotelBookers. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
  )
}

export default Footer