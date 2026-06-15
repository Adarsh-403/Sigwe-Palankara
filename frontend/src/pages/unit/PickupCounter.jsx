import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { PackageCheck, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const PickupCounter = () => {
  const [pickupCode, setPickupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPendingPickups();
  }, []);

  const fetchPendingPickups = async () => {
    try {
      const res = await api.get('/orders');
      // Only show pickups that are reserved (pending verification)
      setOrders(res.data.filter(o => o.orderType === 'Pickup' && o.status === 'Reserved'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!pickupCode || pickupCode.length !== 4) return toast.error('Enter a valid 4-digit code');
    setLoading(true);
    try {
      // Prompt for payment method if it was not paid online (assuming pay at counter for now)
      const res = await api.put(`/orders/pickup/${pickupCode}/complete`, { paymentMethod: 'Cash' });
      toast.success('Pickup Verified & Completed!');
      setPickupCode('');
      fetchPendingPickups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Pickup Code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verify Pickup Order</h2>
            <p className="text-gray-500 text-sm">Enter the 4-digit code provided by the customer</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex gap-4">
          <input
            type="text"
            placeholder="e.g. 7539"
            className="flex-1 text-2xl tracking-widest px-6 py-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value)}
            maxLength={4}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Complete Pickup'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Pickups ({orders.length})</h3>
        <div className="grid gap-4">
          {orders.map(order => (
            <motion.div key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Code: {order.pickupCode}</p>
                <p className="text-sm text-gray-500">{order.items.length} items • ₹{order.totalAmount}</p>
              </div>
              <div className="flex space-x-2">
                {order.items.map((item, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{item.name} x{item.quantity}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PickupCounter;
