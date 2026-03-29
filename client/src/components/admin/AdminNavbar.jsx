import React from 'react';
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'; 
import { assets } from '../../assets/assets';

const AdminNavbar = () => {
  return (
    <div className="flex justify-between items-center px-10 py-4 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <Link to='/'>
        <img src={assets.logo} alt="Logo" className="w-32 cursor-pointer invert brightness-0 filter contrast-200 grayscale opacity-90" />
        </Link>
      </div>
      <UserButton appearance={{
        elements: {
          userButtonAvatarBox: "w-10 h-10", // Optional styling
          userButtonPopoverCard: "bg-gray-800 text-white" // Clerk theme adjustment if needed
        }
      }}/>
    </div>
  );
};

export default AdminNavbar;