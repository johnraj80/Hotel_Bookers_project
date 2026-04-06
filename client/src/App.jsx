import React from 'react'
import Navbar from './components/Navbar'
import {Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import ListRoom from './pages/hotelOwner/ListRoom';
import AddRoom from './pages/hotelOwner/AddRoom';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import HotelVerification from './pages/admin/HotelVerification';
import RegisteredHotels from './pages/admin/RegisteredHotels';
import Transactions from './pages/admin/Transactions';
import Users from './pages/admin/Users';
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext';

const App = () => {

  const location = useLocation();

  const isDashboardPath = location.pathname.includes('owner') || location.pathname.includes('admin');
  const {showHotelReg, isOwner, user} = useAppContext();

  return (
    <div>
      <Toaster />
      {!isDashboardPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/rooms' element={<AllRooms />}/>
          <Route path='/rooms/:id' element={<RoomDetails />}/>
          <Route path='/my-bookings' element={<MyBookings />}/>
          <Route path='/owner' element={isOwner && user?.hotelStatus === 'approved' ? <Layout /> : <Navigate to="/" />}>
              <Route index element={<Dashboard />}/>
              <Route path="add-room" element={<AddRoom />}/>
              <Route path="list-room" element={<ListRoom />}/>
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="verify" element={<HotelVerification />} />
            <Route path="hotels" element={<RegisteredHotels />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </div>
      {!isDashboardPath && <Footer />}
    </div>
  )
}

export default App