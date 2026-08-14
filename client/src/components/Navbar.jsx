import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { assets } from '../assets/assets';
import { setShowHotelReg, openSignIn } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import { toggleTheme } from '../features/theme/themeSlice';

// --- Inline icons (kept dependency-free, same pattern as the original BookIcon) ---
const BookIcon = () => (
    <svg className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const SunIcon = () => (
    <svg className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

// --- Dropdown menu, shared between desktop and mobile triggers ---
const UserMenu = ({ user, onClose, navigate, handleLogout }) => (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden text-gray-700 dark:text-gray-200 z-20">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-lg shrink-0">
                {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{user.username}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
            </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700" />

        <button
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => { onClose(); navigate('/my-bookings'); }}
        >
            <BookIcon />
            My Bookings
        </button>

        <div className="border-t border-gray-100 dark:border-gray-700" />

        <button
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200"
            onClick={() => { onClose(); handleLogout(); }}
        >
            <LogoutIcon />
            Sign out
        </button>
    </div>
);

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const desktopMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const { user, isOwner, isAdmin, hotelRegStatus } = useSelector((state) => state.auth);
    const themeMode = useSelector((state) => state.theme.mode);

    useEffect(() => {
        setIsScrolled(location.pathname !== '/');
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutsideDesktop = desktopMenuRef.current && !desktopMenuRef.current.contains(e.target);
            const clickedOutsideMobile = mobileMenuRef.current && !mobileMenuRef.current.contains(e.target);

            if (clickedOutsideDesktop && clickedOutsideMobile) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const getHotelButtonProps = (closeMenus) => {
        const status = hotelRegStatus;
        let buttonText = 'List Your Hotel';
        let onClickAction = () => { closeMenus(); dispatch(setShowHotelReg(true)); };

        if (status === 'pending') {
            buttonText = 'Pending Approval';
            onClickAction = () => { closeMenus(); };
        } else if (status === 'approved' || isOwner) {
            buttonText = 'Dashboard';
            onClickAction = () => { closeMenus(); navigate('/owner'); };
        }
        return { buttonText, onClickAction };
    };

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 dark:bg-gray-900/80 shadow-md text-gray-700 dark:text-gray-200 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
            {/* Logo */}
            <Link to='/'>
                <img src={assets.logo} alt="Logo" className={`h-9 ${isScrolled ? "invert opacity-80 dark:invert-0" : ""}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700 dark:bg-gray-200" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </a>
                ))}

                {user && !isAdmin && (() => {
                    const { buttonText, onClickAction } = getHotelButtonProps(() => {});
                    return (
                        <button
                            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black dark:text-white dark:border-gray-500' : 'text-white'} transition-all`}
                            onClick={onClickAction}
                        >
                            {buttonText}
                        </button>
                    );
                })()}

                {isAdmin && (
                    <button className="border border-purple-600 bg-purple-600 text-white px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all hover:bg-purple-700" onClick={() => navigate('/admin')}>
                        Admin Panel
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {/* Theme toggle */}
                <button
                    onClick={() => dispatch(toggleTheme())}
                    aria-label="Toggle dark mode"
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${isScrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'}`}
                >
                    {themeMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>

                <img src={assets.searchIcon} alt="search" className={`${isScrolled ? "invert dark:invert-0" : ""}`} />

                {user ? (
                    <div className="relative" ref={desktopMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen((v) => !v)}
                            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-medium cursor-pointer"
                        >
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </button>
                        {isUserMenuOpen && (
                            <UserMenu
                                user={user}
                                onClose={() => setIsUserMenuOpen(false)}
                                navigate={navigate}
                                handleLogout={handleLogout}
                            />
                        )}
                    </div>
                ) : (
                    <button onClick={() => dispatch(openSignIn())} className="bg-black dark:bg-white dark:text-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer">
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    aria-label="Toggle dark mode"
                    className={`${isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"}`}
                >
                    {themeMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                {user && (
                    <div className="relative" ref={mobileMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen((v) => !v)}
                            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm cursor-pointer"
                        >
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </button>
                        {isUserMenuOpen && (
                            <UserMenu
                                user={user}
                                onClose={() => setIsUserMenuOpen(false)}
                                navigate={navigate}
                                handleLogout={handleLogout}
                            />
                        )}
                    </div>
                )}
                <img src={assets.menuIcon} alt="" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isScrolled ? "invert dark:invert-0" : ""}h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-gray-900 text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 dark:text-gray-100 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className='h-6.5 dark:invert' />
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </a>
                ))}

                {user && !isAdmin && (() => {
                    const { buttonText, onClickAction } = getHotelButtonProps(() => setIsMenuOpen(false));
                    return (
                        <button
                            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all border-gray-800 dark:border-gray-400"
                            onClick={onClickAction}
                        >
                            {buttonText}
                        </button>
                    );
                })()}

                {isAdmin && (
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-light" onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}>
                        Admin Panel
                    </button>
                )}

                {user && (
                    <button
                        className="border px-6 py-2 rounded-full cursor-pointer transition-all font-light border-gray-800 dark:border-gray-400 text-red-500"
                        onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    >
                        Logout
                    </button>
                )}

                {!user && (
                    <button onClick={() => { setIsMenuOpen(false); dispatch(openSignIn()); }} className="bg-black dark:bg-white dark:text-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer">
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;