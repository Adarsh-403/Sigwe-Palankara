import { useState, useEffect } from 'react';
import { Search, Filter, Download, Truck } from 'lucide-react';
import axios from 'axios';

const STATUS_STYLE = {
  Pending:   { dot: 'bg-amber-400',  text: 'text-amber-600'  },
  Completed: { dot: 'bg-green-500',  text: 'text-green-600'  },
  Delivered: { dot: 'bg-blue-500',   text: 'text-blue-600'   },
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [delivering, setDelivering] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async (orderCode) => {
    setDelivering(orderCode);
    try {
      await axios.patch(`/api/orders/${orderCode}/deliver`);
      setOrders(prev =>
        prev.map(o => o.orderCode === orderCode ? { ...o, status: 'Delivered' } : o)
      );
    } catch (error) {
      alert('Failed to mark as delivered');
    } finally {
      setDelivering(null);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filtered = orders.filter(o =>
    o.orderCode.includes(searchQuery) ||
    (o.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Business Journal</h2>
          <div className="flex space-x-3 flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by code or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none w-56"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <Filter size={16} className="mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
              <Download size={16} className="mr-2" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date &amp; Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 text-sm">
                    {searchQuery ? 'No orders match your search.' : 'No orders found.'}
                  </td>
                </tr>
              ) : filtered.map((order) => {
                const sc = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
                const canDeliver = order.status === 'Completed';
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-900 bg-emerald-50 px-2 py-0.5 rounded text-sm">
                        #{order.orderCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.userEmail ? (
                        <span title={order.userEmail}>
                          {order.userEmail.split('@')[0]}
                          <span className="text-gray-400 text-xs"> @{order.userEmail.split('@')[1]}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Guest</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentMethod === 'UPI' ? 'bg-emerald-100 text-emerald-700' :
                        order.paymentMethod === 'Cash' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.paymentMethod || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-sm font-medium ${sc.text}`}>
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canDeliver && (
                        <button
                          onClick={() => markDelivered(order.orderCode)}
                          disabled={delivering === order.orderCode}
                          className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {delivering === order.orderCode ? (
                            <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                          ) : (
                            <Truck size={13} />
                          )}
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
