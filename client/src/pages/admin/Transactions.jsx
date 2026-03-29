import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const Transactions = () => {
  const { transactions, fetchTransactions, currency } = useAppContext();

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (!transactions) return <div className="text-white">Loading transactions...</div>;

  return (
    <div className="space-y-6 w-full text-white">
      <h2 className="text-2xl font-bold">Recent Transactions</h2>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Hotel</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Guest</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-400">No transactions found</td></tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-white font-mono text-sm">{txn._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-gray-300">{txn.hotel?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">{txn.user?.username || 'N/A'}</td>
                    <td className="px-6 py-4 text-white font-semibold">{currency}{txn.totalPrice}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${txn.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : txn.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {txn.status}
                      </span>
                    </td>
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

export default Transactions;