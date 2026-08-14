import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
import AuthModal from './components/auth/AuthModal';
import { fetchCurrentUser, fetchHotelStatus } from './features/auth/authSlice';
import { fetchRooms } from './features/rooms/roomsSlice';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isDashboardPath = location.pathname.includes('owner') || location.pathname.includes('admin');
  const { showHotelReg } = useSelector((state) => state.ui);
  const { token, user, hotelRegStatus } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);

  // Keep <html class="dark"> in sync with the theme slice so Tailwind's
  // dark: utilities apply app-wide, not just inside one component.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  // Load the logged-in user once on app start if a token is already stored
  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load hotel registration status once we know who the user is
  useEffect(() => {
    if (user) dispatch(fetchHotelStatus());
  }, [user, dispatch]);

  // Always load the public room list
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  // Poll while a hotel registration is pending, so the navbar flips to
  // "Dashboard" automatically once an admin approves it
  useEffect(() => {
    if (hotelRegStatus !== 'pending') return;
    const interval = setInterval(() => dispatch(fetchHotelStatus()), 15000);
    return () => clearInterval(interval);
  }, [hotelRegStatus, dispatch]);

  return (
    <div>
      <Toaster />
      <AuthModal />
      {!isDashboardPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
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