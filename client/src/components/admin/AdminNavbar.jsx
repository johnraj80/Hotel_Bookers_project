import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { assets } from '../../assets/assets';
import { logout } from '../../features/auth/authSlice';

const AdminNavbar = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="flex justify-between items-center px-10 py-4 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <Link to='/'>
          <img src={assets.logo} alt="Logo" className="w-32 cursor-pointer invert brightness-0 filter contrast-200 grayscale opacity-90" />
        </Link>
      </div>

      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium cursor-pointer"
          >
            {user.username?.[0]?.toUpperCase() || 'A'}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 py-1 text-sm z-10">
              <div className="px-4 py-2 border-b border-gray-700 truncate">{user.username}</div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400"
                onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;