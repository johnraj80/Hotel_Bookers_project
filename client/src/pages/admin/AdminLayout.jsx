import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNavbar />
      <div className="flex w-full">
          <AdminSidebar />
          <div className="w-[82%] min-h-screen p-6 overflow-y-scroll text-gray-100">
              <Outlet />
          </div>
      </div>
    </div>
  );
};

export default AdminLayout;