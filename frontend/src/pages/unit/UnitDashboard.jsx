import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';
import { IndianRupee, Package, PackageCheck, PackageOpen } from 'lucide-react';
import { useSelector } from 'react-redux';

const UnitDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/analytics');
        setMetrics(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="p-8 animate-pulse">Loading dashboard...</div>;

  const cards = [
    { title: "Today's Sales", value: `₹${metrics?.sales?.todaySales || 0}`, icon: IndianRupee, color: "from-emerald-400 to-teal-500" },
    { title: "Available Stock", value: metrics?.inventory?.availableStock || 0, icon: Package, color: "from-blue-400 to-indigo-500" },
    { title: "Reserved Stock", value: metrics?.inventory?.reservedStock || 0, icon: PackageOpen, color: "from-orange-400 to-red-500" },
    { title: "Pending Pickups", value: metrics?.pickups?.pendingPickups || 0, icon: PackageCheck, color: "from-purple-400 to-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">Cash Received</span>
              <span className="font-bold text-gray-900">₹{metrics?.payments?.cashCollection || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
              <span className="font-medium text-blue-700">UPI Received</span>
              <span className="font-bold text-blue-900">₹{metrics?.payments?.upiCollection || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnitDashboard;
