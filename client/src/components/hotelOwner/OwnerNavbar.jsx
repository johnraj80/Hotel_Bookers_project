import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { assets } from '../../assets/assets'
import { logout } from '../../features/auth/authSlice'
import { toggleTheme } from '../../features/theme/themeSlice'

const SunIcon = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
);

const OwnerNavbar = () => {
  const user = useSelector((state) => state.auth.user)
  const mode = useSelector((state) => state.theme.mode)
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
    <div className='flex items-center justify-between px-4 md:px-8
    border-b border-gray-300 dark:border-gray-700 py-3 bg-white dark:bg-gray-900 transition-all
    duration-300'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-9 invert opacity-80 dark:invert-0' />
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle dark mode"
          className="p-1.5 rounded-full cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-medium cursor-pointer"
            >
              {user.username?.[0]?.toUpperCase() || 'U'}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 text-sm text-gray-700 dark:text-gray-200 z-10">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 truncate">{user.username}</div>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-red-500"
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerNavbar