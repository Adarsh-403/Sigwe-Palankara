import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, CreditCard, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/summary');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    const confirmed = window.confirm("WARNING: You are about to permanently delete all Sales Orders and Products. All reports will be wiped and reset to zero. This action cannot be undone.\n\nAre you absolutely sure?");
    if (!confirmed) return;

    try {
      await axios.delete('http://localhost:5000/api/analytics/clear');
      alert("All data has been successfully cleared. Starting fresh.");
      fetchAnalytics();
    } catch (error) {
      alert("Failed to clear data.");
    }
  };

  if (loading || !analytics) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  const stats = [
    { title: 'Total Revenue', value: `₹${analytics.totalSales}`, icon: <TrendingUp className="text-emerald-500" /> },
    { title: 'Orders', value: analytics.numberOfOrders, icon: <Users className="text-green-500" /> },
    { title: 'Sales (UPI)', value: `₹${analytics.salesByPaymentMethod.UPI}`, icon: <CreditCard className="text-emerald-500" /> },
    { title: 'Sales (Cash)', value: `₹${analytics.salesByPaymentMethod.Cash}`, icon: <CreditCard className="text-orange-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
        <button 
          onClick={handleClearData}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-medium transition-colors border border-red-200"
        >
          <AlertTriangle size={18} className="mr-2" /> Clear All Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
            <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-1">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Products Sold</h3>
          <div className="space-y-4">
            {analytics.mostSoldProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No products sold yet.</p>
            ) : analytics.mostSoldProducts.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{item.quantity} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
