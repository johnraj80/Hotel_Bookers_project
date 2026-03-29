import React from 'react';
import { Building2, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminDashboard = () => {

  const { dashStats, currency } = useAppContext()
  // Mock Data
  const stats = {
    totalHotels: 156,
    verifiedHotels: 142,
    pendingVerification: 14,
    totalUsers: 3456,
    hotelOwners: 156,
    guests: 3300,
    totalRevenue: 1234567,
    transactions: 8945,
    siteVisits: 45678
  };

  if (!dashStats) {
    return <div className="text-white text-xl">Loading Dashboard Data...</div>;
  }

  const avgTransactionValue = dashStats.transactions > 0 
    ? (dashStats.totalRevenue / dashStats.transactions).toFixed(2) 
    : "0.00";
    
  const guestsPercentage = dashStats.totalUsers > 0 
    ? ((dashStats.guests / dashStats.totalUsers) * 100).toFixed(1) 
    : 0;
    
  const ownersPercentage = dashStats.totalUsers > 0 
    ? ((dashStats.hotelOwners / dashStats.totalUsers) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6 w-full text-white">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hotels */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-sm">Total Hotels</h3>
            <Building2 className="text-blue-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{dashStats.totalHotels}</p>
          <p className="text-emerald-400 text-sm mt-1">+{dashStats.verifiedHotels} verified</p>
        </div>

        {/* Pending Verification */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-sm">Pending Verification</h3>
            <AlertCircle className="text-orange-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{dashStats.pendingVerification}</p>
          <p className="text-orange-400 text-sm mt-1">Requires action</p>
        </div>

        {/* Total Users */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-sm">Total Users</h3>
            <Users className="text-purple-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{dashStats.totalUsers.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">{dashStats.guests} guests, {dashStats.hotelOwners} owners</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
            <TrendingUp className="text-emerald-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{currency}{dashStats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Analytics & Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Site Analytics */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Site Analytics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Site Visits</span>
              <span className="text-white font-semibold">{stats.siteVisits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Transactions</span>
              <span className="text-white font-semibold">{dashStats.transactions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg. Transaction Value</span>
              <span className="text-white font-semibold">{currency}{avgTransactionValue}</span>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Guests</span>
                <span className="text-white">{guestsPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${guestsPercentage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Hotel Owners</span>
                <span className="text-white">{((stats.hotelOwners / stats.totalUsers) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${ownersPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;