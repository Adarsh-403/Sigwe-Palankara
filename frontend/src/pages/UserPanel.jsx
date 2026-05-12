import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, LogIn, User, LogOut, Menu, X, Package } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { setUser } from '../store/authSlice';
import { SpiceProductCard } from '../components/spice-ui/SpiceProductCard';
import { CategoryFilterPills } from '../components/spice-ui/CategoryFilterPills';
import { FreshnessStrip } from '../components/spice-ui/FreshnessStrip';
import { HeritageTags } from '../components/spice-ui/HeritageTags';
import { OriginBadge } from '../components/spice-ui/OriginBadge';
import { TrustBadges } from '../components/spice-ui/TrustBadges';
import { MyOrders } from '../components/spice-ui/MyOrders';
import { CartToast, useCartAnimation } from '../components/spice-ui/CartToast';

/* ─── Animated floating decorations ─── */
const FLOATS = [
  { type: 'cart', top: '8%',  left: '2%',  size: 48, opacity: 0.07, dur: 7,  delay: 0   },
  { type: 'cart', top: '60%', left: '1%',  size: 36, opacity: 0.06, dur: 9,  delay: 1.5 },
  { type: 'cart', top: '30%', right: '2%', size: 54, opacity: 0.07, dur: 8,  delay: 0.8 },
  { type: 'cart', top: '75%', right: '1%', size: 42, opacity: 0.06, dur: 10, delay: 2   },
  { type: 'cart', top: '45%', left: '48%', size: 28, opacity: 0.05, dur: 11, delay: 3   },
  { type: 'leaf', top: '15%', left: '5%',  size: 32, opacity: 0.25, dur: 8,  delay: 0.5, rotate: '20deg',  color: '#4CAF50', stroke: '#2D5A27' },
  { type: 'leaf', top: '50%', left: '3%',  size: 24, opacity: 0.2,  dur: 10, delay: 2,   rotate: '-15deg', color: '#66BB6A', stroke: '#388E3C' },
  { type: 'leaf', top: '80%', left: '6%',  size: 28, opacity: 0.22, dur: 7,  delay: 1,   rotate: '35deg',  color: '#43A047', stroke: '#2D5A27' },
  { type: 'leaf', top: '10%', right: '4%', size: 36, opacity: 0.22, dur: 9,  delay: 1.2, rotate: '-25deg', color: '#4CAF50', stroke: '#2D5A27' },
  { type: 'leaf', top: '40%', right: '3%', size: 28, opacity: 0.2,  dur: 11, delay: 0.3, rotate: '15deg',  color: '#81C784', stroke: '#4CAF50' },
  { type: 'leaf', top: '70%', right: '5%', size: 32, opacity: 0.22, dur: 8,  delay: 2.5, rotate: '-40deg', color: '#43A047', stroke: '#2D5A27' },
];

function CartSVG({ size, opacity, style }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <path d="M6 10 H14 L20 38 H52 L58 18 H18" stroke="#2D5A27" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 24 H54" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M22 31 H52" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <circle cx="26" cy="46" r="5" stroke="#2D5A27" strokeWidth="3" fill="#E8F5E9"/>
        <circle cx="46" cy="46" r="5" stroke="#2D5A27" strokeWidth="3" fill="#E8F5E9"/>
        <path d="M6 10 Q4 6 8 4" stroke="#2D5A27" strokeWidth="3" strokeLinecap="round"/>
        <path d="M38 14 C38 14 32 8 35 4 C37 1 40 3 40 3 C40 3 43 5 42 8 C41 12 38 14 38 14Z" fill="#4CAF50" opacity="0.8"/>
        <path d="M38 14 L38 4" stroke="#2D5A27" strokeWidth="0.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function LeafSVG({ size, opacity, style, color, stroke, rotate }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none"
        style={{ transform: `rotate(${rotate})`, filter: 'drop-shadow(0 1px 4px rgba(45,90,39,0.2))' }}>
        <path d="M20 50 C20 50 2 32 5 14 C8 1 20 1 20 1 C20 1 32 1 35 14 C38 32 20 50 20 50Z"
          fill={color} opacity={opacity} />
        <path d="M20 1 L20 50" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity={opacity * 0.8} />
        <path d="M20 18 Q27 13 33 16" stroke={stroke} strokeWidth="0.7" strokeLinecap="round" opacity={opacity * 0.6} />
        <path d="M20 28 Q13 23 7 26" stroke={stroke} strokeWidth="0.7" strokeLinecap="round" opacity={opacity * 0.6} />
      </svg>
    </div>
  );
}

function FloatingDecorations() {
  return (
    <>
      <style>{`
        @keyframes shopFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-14px) rotate(3deg); }
          66%       { transform: translateY(-7px) rotate(-2deg); }
        }
        @keyframes shopSpin {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
      {FLOATS.map((f, i) => {
        const baseStyle = {
          top: f.top, left: f.left, right: f.right,
          animation: `${f.type === 'cart' ? 'shopSpin' : 'shopFloat'} ${f.dur}s ease-in-out infinite`,
          animationDelay: `${f.delay}s`,
        };
        if (f.type === 'cart') return <CartSVG key={i} size={f.size} opacity={f.opacity} style={baseStyle} />;
        return <LeafSVG key={i} size={f.size} opacity={f.opacity} style={baseStyle} color={f.color} stroke={f.stroke} rotate={f.rotate} />;
      })}
    </>
  );
}

/* ─── Category filter ─── */
function matchesCategory(product, categoryId) {
  if (!categoryId || categoryId === 'all') return true;
  // Direct match on the stored category field
  if (product.category === categoryId) return true;
  // Fallback: keyword match on name for legacy products without a category set
  const keywords = {
    'curry-powders': ['curry', 'masala', 'powder'],
    'whole-spices':  ['whole', 'seed', 'pod', 'raw'],
    'masala-blends': ['masala', 'blend', 'mix', 'garam'],
    'pepper':        ['pepper'],
    'cardamom':      ['cardamom', 'elakka', 'elaichi'],
    'turmeric':      ['turmeric', 'manjal', 'haldi'],
  }[categoryId] || [];
  const haystack = product.name.toLowerCase();
  return keywords.some(k => haystack.includes(k));
}

/* ─── Main component ─── */
export default function UserPanel() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, triggerToast, clearToast] = useCartAnimation();

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerToast(product.name);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!user) { alert('Please login first to place an order!'); navigate('/login'); return; }
    try {
      const payload = {
        items: cart.map(c => ({ productId: c._id, quantity: c.quantity, price: c.price, name: c.name })),
        totalAmount,
        userId: user.uid,
        userEmail: user.email,
      };
      const res = await axios.post('/api/orders', payload);
      setOrderComplete({ code: res.data.orderCode, items: cart, total: totalAmount });
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Error placing order', error);
      alert('Failed to place order');
    }
  };

  const handleLogout = async () => {
    try { await signOut(auth); dispatch(setUser(null)); }
    catch (error) { console.error('Error signing out', error); }
  };

  const filteredProducts = products.filter(p => matchesCategory(p, activeCategory));

  /* ── Order success screen ── */
  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5fbf5] p-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#E8F5E9] text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-8">Please show this code at the counter</p>
          <div className="bg-[#f1f3f0] rounded-2xl py-6 mb-8 border border-gray-200">
            <span className="text-4xl font-bold tracking-widest text-emerald-700">{orderComplete.code}</span>
          </div>
          <button onClick={() => setOrderComplete(null)}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors">
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5fbf5] relative overflow-x-hidden">

      {/* ── Floating decorations ── */}
      {!loading && <FloatingDecorations />}

      {/* ── Header ── */}
      <header className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE Logo" className="h-10 object-contain" />
            </Link>
            <span className="hidden sm:block text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              Palankara Shop
            </span>
          </div>

          {/* Origin badge — hidden on small screens */}
          <div className="hidden md:flex">
            <OriginBadge />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">{user.email.split('@')[0]}</span>
                  <button
                    onClick={() => setIsMyOrdersOpen(true)}
                    className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Package size={16} /> My Orders
                  </button>
                  {(user.role === 'admin' || user.role === 'sales') && (
                    <Link to="/admin" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
                    <LogOut size={18} className="mr-1" /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <LogIn size={18} className="mr-1" /> Login
                </Link>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg absolute w-full left-0 z-20">
            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={18} /><span className="font-medium">{user.email.split('@')[0]}</span>
                </div>
                {(user.role === 'admin' || user.role === 'sales') && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 font-semibold hover:text-emerald-700">Admin Panel</Link>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center text-red-500 font-medium hover:text-red-600">
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-emerald-600 font-semibold hover:text-emerald-700">
                <LogIn size={18} className="mr-2" /> Login
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ── Hero banner ── */}
      <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-700 py-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <h1 className="relative text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
          🌿 Palankara Spice Shop
        </h1>
        <p className="relative text-emerald-200 text-sm mt-1">Wayanad-grown · farmer-direct · packed fresh</p>
        <div className="relative mt-3 flex justify-center">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(234,244,232,0.15)', border: '1px solid rgba(192,221,151,0.4)',
            color: '#C0DD97', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C0DD97', flexShrink: 0 }} />
            Sourced from Wayanad, Kerala
          </span>
        </div>
      </div>

      {/* ── Freshness Strip ── */}
      <FreshnessStrip />

      {/* ── Main content ── */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Heritage Tags + section label */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <HeritageTags tags={['Monsoon-grown', 'Handpicked', 'GI tagged region']} />
        </div>

        {/* Category Filter Pills */}
        <div className="mb-6">
          <CategoryFilterPills
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div style={{ animation: 'shopSpin 1.2s ease-in-out infinite' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M6 10 H14 L20 38 H52 L58 18 H18" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="26" cy="46" r="5" stroke="#059669" strokeWidth="3" fill="#D1FAE5"/>
                <circle cx="46" cy="46" r="5" stroke="#059669" strokeWidth="3" fill="#D1FAE5"/>
                <path d="M6 10 Q4 6 8 4" stroke="#059669" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">Fetching fresh spices…</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <svg width="120" height="120" viewBox="0 0 64 64" fill="none" className="opacity-20">
              <path d="M6 10 H14 L20 38 H52 L58 18 H18" stroke="#2D5A27" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="46" r="5" stroke="#2D5A27" strokeWidth="3" fill="#E8F5E9"/>
              <circle cx="46" cy="46" r="5" stroke="#2D5A27" strokeWidth="3" fill="#E8F5E9"/>
              <path d="M6 10 Q4 6 8 4" stroke="#2D5A27" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div>
              <p className="text-gray-600 font-semibold text-lg">No products in this category</p>
              <p className="text-gray-400 text-sm mt-1">Try another filter or check back soon 🌿</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <SpiceProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Trust Badges at bottom of shop */}
        {!loading && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Our Guarantees</p>
            <TrustBadges />
          </div>
        )}
      </main>

      {/* ── Cart Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f5fbf5]">
                <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                  <ShoppingCart className="text-emerald-600" /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                    <svg width="80" height="80" viewBox="0 0 64 64" fill="none" className="opacity-20">
                      <path d="M6 10 H14 L20 38 H52 L58 18 H18" stroke="#2D5A27" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="26" cy="46" r="5" stroke="#2D5A27" strokeWidth="3"/>
                      <circle cx="46" cy="46" r="5" stroke="#2D5A27" strokeWidth="3"/>
                      <path d="M6 10 Q4 6 8 4" stroke="#2D5A27" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <p className="text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-[#f1f3f0] flex-shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: item.image ? '#f1f3f0' : 'linear-gradient(135deg, #EAF4E8, #C0DD97)' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-[10px]">🌿</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-emerald-600 font-bold mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button onClick={() => updateQuantity(item._id, -1)} className="p-1 text-gray-500 hover:text-gray-900">
                          {item.quantity === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} />}
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1 text-gray-500 hover:text-gray-900">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-emerald-700">₹{totalAmount}</span>
                  </div>
                  <button onClick={placeOrder} className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors">
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── My Orders Panel ── */}
      {isMyOrdersOpen && user && (
        <MyOrders userId={user.uid} onClose={() => setIsMyOrdersOpen(false)} />
      )}

      {/* ── Cart Toast Animation ── */}
      {toast && <CartToast key={toast.key} productName={toast.productName} onDone={clearToast} />}
    </div>
  );
}
