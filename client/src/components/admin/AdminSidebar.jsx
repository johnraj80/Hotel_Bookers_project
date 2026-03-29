import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminSidebar = () => {
  const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: assets.LayoutDashboard },
    { name: 'Verify Hotels', path: '/admin/verify', icon: assets.CheckCircle }, 
    { name: 'All Hotels', path: '/admin/hotels', icon: assets.Building2  },
    { name: 'Transactions', path: '/admin/transactions', icon: assets.CreditCard  }, 
    { name: 'Manage Users', path: '/admin/users', icon: assets.Users }, 
  ];

  return (
    <div className="w-[18%] min-h-screen border-r border-gray-700 bg-gray-800 text-gray-300">
      <div className="flex flex-col gap-4 pt-10 pl-[20%]">
        {sidebarItems.map((item, index ) => (
          <NavLink 
            to={item.path} 
            key={index} 
            end={item.path === '/admin'} // Ensure exact match for dashboard home
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 border-r-4 transition-all duration-200 cursor-pointer
              ${isActive  
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'border-transparent hover:bg-gray-700 text-gray-400 hover:text-white'
              }
            `}
          >
            {/* Added filter to make icons white/light on dark background */}
           {typeof item.icon === 'string' ? (
      <img 
        src={item.icon} 
        className="min-h-6 min-w-6" 
        alt={item.name} 
        style={{ filter: item.icon === assets.dashboardIcon ? '' : 'invert(1) brightness(2)' }} 
      />
  ) : (
      /* Lucide icons automatically inherit the text color (gray/emerald/white) */
      <item.icon className="min-h-6 min-w-6" />
  )}
            <p className="font-medium hidden md:block">{item.name}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;