import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/orders?email=${encodeURIComponent(user.email)}`);
        setOrders(res.data);
      } catch (err) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center">
          <Link to="/shop" className="mr-4 text-gray-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {!user && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 text-sm font-medium border border-amber-200">
            You are viewing this as a guest. Your orders are tied to your current session. Please <Link to="/login" className="underline font-bold">log in</Link> to permanently save your history.
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any pickup orders.</p>
            <Link to="/shop" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Status & Code */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 min-w-[200px] flex flex-col items-center justify-center text-center w-full md:w-auto">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Pickup Code</div>
                  <div className="text-4xl font-black text-emerald-700 tracking-wider mb-3">
                    {order.pickupCode}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-800">
                    {order.status === 'Completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    {order.status || 'Pending'}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Order Placed</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <div className="mt-2 inline-flex items-center bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                        📍 Pickup at: {order.unitName || 'Unknown Unit'}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="text-xl font-bold text-gray-900">₹{order.totalAmount}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Customer Details</div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{order.name}</span><br />
                      <span className="text-gray-600">{order.houseName}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Items</div>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.quantity}x {item.name}</span>
                          <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
