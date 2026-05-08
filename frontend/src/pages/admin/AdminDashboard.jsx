import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, CreditCard, AlertTriangle, PieChart, Receipt, ArrowRight } from 'lucide-react';
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
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get('/api/analytics/summary');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    const confirmed = window.confirm("WARNING: You are about to permanently delete all Sales Orders and Products. All reports will be wiped and reset to zero. This action cannot be undone.\n\nAre you absolutely sure?");
    if (!confirmed) return;

    try {
      await axios.delete('/api/analytics/clear');
      alert("All data has been successfully cleared. Starting fresh.");
      fetchAnalytics();
    } catch (error) {
      alert("Failed to clear data.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading dashboard… (first load may take a moment)</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <p className="text-gray-500">Could not load analytics. The server may be waking up.</p>
        <button
          onClick={fetchAnalytics}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

 // Calculate percentages for UPI vs Cash
 const totalPayment = analytics.salesByPaymentMethod.UPI + analytics.salesByPaymentMethod.Cash;
 const upiPercent = totalPayment > 0 ? Math.round((analytics.salesByPaymentMethod.UPI / totalPayment) * 100) : 0;
 const cashPercent = totalPayment > 0 ? 100 - upiPercent : 0;

 return (
 <div className="space-y-8 max-w-7xl mx-auto">
 {/* Header */}
 <div className="flex justify-between items-end border-b border-gray-200 pb-6">
 <div>
 <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Overview & Analytics</h2>
 <p className="text-gray-500 mt-2">Today's store performance and inventory health.</p>
 </div>
 <button 
 onClick={handleClearData}
 className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-colors border border-red-100"
 >
 <AlertTriangle size={18} className="mr-2" /> Clear All Data
 </button>
 </div>

 {/* Metrics Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Metric 1: Revenue */}
 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
 <div className="flex justify-between items-start mb-6">
 <div>
 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
 <h3 className="text-3xl font-bold text-emerald-700 mt-2">₹{analytics.totalSales.toLocaleString()}</h3>
 </div>
 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
 <CreditCard size={24} />
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span className="flex items-center text-emerald-600 text-sm font-semibold">
 <TrendingUp size={16} className="mr-1" /> Active
 </span>
 <span className="text-sm text-gray-400">vs last week</span>
 </div>
 </div>

 {/* Metric 2: Orders */}
 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
 <div className="flex justify-between items-start mb-6">
 <div>
 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Number of Orders</p>
 <h3 className="text-3xl font-bold text-emerald-700 mt-2">{analytics.numberOfOrders}</h3>
 </div>
 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
 <Receipt size={24} />
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span className="flex items-center text-emerald-600 text-sm font-semibold">
 <TrendingUp size={16} className="mr-1" /> Active
 </span>
 <span className="text-sm text-gray-400">vs last week</span>
 </div>
 </div>

 {/* Metric 3: Payment Breakdown */}
 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
 <div className="flex justify-between items-start mb-6">
 <div>
 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Breakdown</p>
 <h3 className="text-xl font-bold text-gray-800 mt-2">UPI vs Cash</h3>
 </div>
 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
 <PieChart size={24} />
 </div>
 </div>
 <div className="flex items-center gap-6 mt-auto">
 <div className="flex-1">
 <div className="flex justify-between text-sm mb-1">
 <span className="text-gray-800 font-medium">UPI</span>
 <span className="text-emerald-600 font-bold">{upiPercent}%</span>
 </div>
 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
 <div className="bg-emerald-500 h-full" style={{ width: `${upiPercent}%` }}></div>
 </div>
 </div>
 <div className="flex-1">
 <div className="flex justify-between text-sm mb-1">
 <span className="text-gray-500">Cash</span>
 <span className="text-gray-500 font-medium">{cashPercent}%</span>
 </div>
 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
 <div className="bg-gray-300 h-full" style={{ width: `${cashPercent}%` }}></div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Charts & Lists Section */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Revenue Trends */}
 <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
 <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
 <option>This Week</option>
 <option>Last Week</option>
 <option>This Month</option>
 </select>
 </div>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
 <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
 <Tooltip 
 contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
 />
 <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Top Products List */}
 <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
 <div className="p-6 border-b border-gray-100">
 <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
 </div>
 <div className="flex-1 overflow-y-auto">
 <div className="w-full">
 <div className="flex px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
 <div className="flex-1">Product</div>
 <div className="w-16 text-right">Sold</div>
 </div>
 
 {analytics.mostSoldProducts.length === 0 ? (
 <div className="p-6 text-center text-sm text-gray-500">No products sold yet.</div>
 ) : (
 analytics.mostSoldProducts.map((item, idx) => (
 <div key={idx} className="flex px-6 py-4 border-b border-gray-50 hover:bg-emerald-50/30 transition-colors items-center">
 <div className="flex-1 flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
 {item.name.charAt(0).toUpperCase()}
 </div>
 <span className="text-sm font-semibold text-gray-800 truncate">{item.name}</span>
 </div>
 <div className="w-16 text-right text-sm text-gray-500 font-medium">{item.quantity}</div>
 </div>
 ))
 )}
 </div>
 </div>
 <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
 <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 mx-auto">
 View All Products <ArrowRight size={16} />
 </button>
 </div>
 </div>

 </div>
 </div>
 );
}
