import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import Exclusiveoffers from '../components/Exclusiveoffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'

const HomePage = () => {
  return (
    <>
        <Hero />
        <RecommendedHotels/>
        <FeaturedDestination />
        <Exclusiveoffers />
        <Testimonial />
        <NewsLetter />
    </>
  )
}

export default HomePage