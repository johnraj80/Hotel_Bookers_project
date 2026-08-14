import React from 'react'
import OwnerNavbar from '../../components/hotelOwner/OwnerNavbar'
import OwnerSidebar from '../../components/hotelOwner/OwnerSidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
        <OwnerNavbar />
        <div className='flex h-full'>
            <OwnerSidebar />
            <div className='flex-1 p-4 pt-10 md:px-10 h-full overflow-y-auto'>
                <Outlet />
            </div>
        </div>
        
    </div>
  )
}

export default Layout