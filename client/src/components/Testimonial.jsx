import React from 'react'
import Title from './Title'
import {testimonials} from '../assets/assets'
import StarRating from './StarRating'

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px24 bg-slate-50 dark:bg-gray-900 pt-20 pb-30 transition-colors duration-300'>
        <Title title="what Our Guests Say" subtitle="Discover why discerning travelers consitently choose HotelBookers for their exclusive and luxurious accommodations around the world."/>

        <div className="flex flex-wrap items-center gap-6 mt-20 ">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow dark:shadow-none dark:border dark:border-gray-700 max-w-xs">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                                <p className="text-gray-500 dark:text-gray-400">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                           <StarRating />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default Testimonial