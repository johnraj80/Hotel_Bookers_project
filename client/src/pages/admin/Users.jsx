import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const Users = () => {
  const { userStats, fetchUserStats } = useAppContext();

  useEffect(() => {
    fetchUserStats();
  }, []);

  if (!userStats) return <div className="text-white">Loading user statistics...</div>;

  return (
    <div className="space-y-6 w-full text-white">
      <h2 className="text-2xl font-bold">User Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">Total Registered Users</h3>
          <p className="text-3xl font-bold text-white">{userStats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">Total Guests</h3>
          <p className="text-3xl font-bold text-blue-400">{userStats.guests.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">Hotel Owners</h3>
          <p className="text-3xl font-bold text-emerald-400">{userStats.hotelOwners.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Users;