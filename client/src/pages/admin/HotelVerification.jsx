import React, { useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import { useAppContext } from '../../context/AppContext';

const HotelVerification = () => {
  // Added fetchUser to the destructured context values
  const { 
    pendingHotels, 
    fetchPendingHotels, 
    setPendingHotels, 
    fetchDashStats, 
    fetchUser, // <--- New: Import this to refresh user status
    axios, 
    getToken 
  } = useAppContext();

  useEffect(() => {
    fetchPendingHotels();
  }, []);

  const handleVerification = async (hotelId, action) => {
    try {
      const { data } = await axios.post('/api/admin/hotels/verify', 
        { hotelId, action },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(`Hotel ${action === 'approve' ? 'Approved' : 'Rejected'} Successfully`);
        
        // 1. Remove the hotel from the local pending list
        setPendingHotels(prev => prev.filter(h => h._id !== hotelId)); 
        
        // 2. Refresh the admin dashboard statistics
        fetchDashStats(); 

        // 3. New: Force a refresh of the user data so the Navbar updates to "Dashboard"
        fetchUser(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!pendingHotels) return <div className="text-white">Loading pending verifications...</div>;

  return (
    <div className="space-y-6 w-full text-white">
      <h2 className="text-2xl font-bold">Hotel Verification</h2>
      
      <div className="space-y-4">
        {pendingHotels.length === 0 ? (
           <p className="text-gray-400">No pending verifications at the moment.</p>
        ) : (
           pendingHotels.map(hotel => (
          <div key={hotel._id} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{hotel.name}</h3>
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {hotel.address}, {hotel.city}
                </p>
              </div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">Pending</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-700/30 rounded-lg">
              <div><p className="text-gray-400 text-sm">Owner</p><p className="text-white truncate">{hotel.owner?.username || 'Unknown'}</p></div>
              <div><p className="text-gray-400 text-sm">Email</p><p className="text-white truncate">{hotel.owner?.email || 'N/A'}</p></div>
              <div><p className="text-gray-400 text-sm">Contact</p><p className="text-white flex items-center gap-1"><Phone size={12} /> {hotel.contact}</p></div>
              <div><p className="text-gray-400 text-sm">Submitted</p><p className="text-white">{new Date(hotel.createdAt).toLocaleDateString()}</p></div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleVerification(hotel._id, 'approve')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"><CheckCircle size={18} /> Approve Hotel</button>
              <button onClick={() => handleVerification(hotel._id, 'reject')} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"><XCircle size={18} /> Reject Application</button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default HotelVerification;