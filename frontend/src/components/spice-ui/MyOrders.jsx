import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, X, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_CONFIG = {
  Pending:   { color: '#B45309', bg: '#FEF3C7', icon: <Clock size={13} />,         label: 'Pending'   },
  Completed: { color: '#065F46', bg: '#D1FAE5', icon: <CheckCircle size={13} />,   label: 'Completed' },
  Delivered: { color: '#1D4ED8', bg: '#DBEAFE', icon: <Truck size={13} />,         label: 'Delivered' },
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid #E8E8E4',
      overflow: 'hidden', marginBottom: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'monospace', fontWeight: 800, fontSize: 20,
            color: '#27500A', letterSpacing: '0.08em',
            background: '#EAF4E8', borderRadius: 8, padding: '2px 10px',
          }}>
            #{order.orderCode}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{date}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: cfg.bg, color: cfg.color,
            borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700,
          }}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#27500A' }}>₹{order.totalAmount}</span>
          {expanded ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
        </div>
      </button>

      {/* Expanded items */}
      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid #F3F4F6' }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Qty: {item.quantity}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#639922' }}>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
          {order.paymentMethod && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#6B7280' }}>
              Payment: <strong>{order.paymentMethod}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MyOrders({ userId, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/orders/user/${userId}`)
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #F3F4F6', background: '#F5FBF2',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Package size={20} color="#27500A" />
              <span style={{ fontSize: 17, fontWeight: 800, color: '#27500A', fontFamily: 'Manrope, sans-serif' }}>
                My Orders
              </span>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
                <div style={{ width: 32, height: 32, border: '4px solid #C0DD97', borderTopColor: '#27500A',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 60, color: '#9CA3AF' }}>
                <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: 14, fontWeight: 600 }}>No orders yet</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Your order history will appear here</p>
              </div>
            ) : (
              orders.map(o => <OrderCard key={o._id} order={o} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
