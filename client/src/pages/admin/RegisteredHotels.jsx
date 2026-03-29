import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const RegisteredHotels = () => {
  const { registeredHotels, fetchRegisteredHotels } = useAppContext();

  useEffect(() => {
    fetchRegisteredHotels();
  }, []);

  if (!registeredHotels) return <div className="text-white text-xl">Loading registered hotels...</div>;

  return (
    <div className="space-y-6 w-full text-white">
      <h2 className="text-2xl font-bold">Registered Hotels</h2>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Hotel Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Owner</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {registeredHotels.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-400">No verified hotels found.</td></tr>
              ) : (
                registeredHotels.map(hotel => (
                  <tr key={hotel._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-white font-medium">{hotel.name}</td>
                    <td className="px-6 py-4 text-gray-300">{hotel.owner?.username || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-300">{hotel.city}</td>
                    <td className="px-6 py-4 text-gray-300">{hotel.contact}</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">Verified</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegisteredHotels;