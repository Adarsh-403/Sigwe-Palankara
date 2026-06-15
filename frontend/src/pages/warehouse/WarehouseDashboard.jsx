import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';
import { Package, ArrowRightLeft, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WarehouseDashboard = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await api.get('/transfers');
      setTransfers(res.data);
    } catch (error) {
      toast.error('Failed to load transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/transfers/${id}/approve`);
      toast.success('Transfer Approved & Stock Updated!');
      fetchTransfers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve transfer');
    }
  };

  if (loading) return <div className="p-8">Loading warehouse dashboard...</div>;

  const pendingCount = transfers.filter(t => t.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Dashboard</h1>
          <p className="text-sm text-gray-500">Manage transfers and central stock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Transfer Requests from Units</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Unit</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No transfer requests found.</td>
                </tr>
              ) : (
                transfers.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{t.toUnit?.name || 'Unknown Unit'}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {t.items.map((item, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        t.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {t.status === 'Pending' && (
                        <button
                          onClick={() => handleApprove(t._id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center text-sm shadow-sm shadow-emerald-600/20"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </button>
                      )}
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

export default WarehouseDashboard;
