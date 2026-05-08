import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, LogIn, User, LogOut, Menu, X } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { setUser } from '../store/authSlice';

export default function UserPanel() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

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
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!user) {
      alert("Please login first to place an order!");
      navigate('/login');
      return;
    }
    try {
      const payload = {
        items: cart.map(c => ({
          productId: c._id,
          quantity: c.quantity,
          price: c.price,
          name: c.name
        })),
        totalAmount
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
    try {
      await signOut(auth);
      dispatch(setUser(null));
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5fbf5] p-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#E8F5E9] text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-8">Please show this code at the counter</p>
          <div className="bg-[#f1f3f0] rounded-2xl py-6 mb-8 border border-gray-200">
            <span className="text-4xl font-bold tracking-widest text-emerald-700">{orderComplete.code}</span>
          </div>
          <button
            onClick={() => setOrderComplete(null)}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors"
          >
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5fbf5] relative">
      <header className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE Logo" className="h-10 object-contain" />
            </Link>
            <span className="hidden sm:block text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Palankara Shop</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {user.email.split('@')[0]}
                  </span>
                  {(user.role === 'admin' || user.role === 'sales') && (
                    <Link to="/admin" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={18} className="mr-1" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <LogIn size={18} className="mr-1" /> Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
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
                  <User size={18} />
                  <span className="font-medium">{user.email.split('@')[0]}</span>
                </div>
                {(user.role === 'admin' || user.role === 'sales') && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-emerald-600 font-semibold hover:text-emerald-700"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center text-red-500 font-medium hover:text-red-600"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-emerald-600 font-semibold hover:text-emerald-700"
              >
                <LogIn size={18} className="mr-2" /> Login
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products available right now.
              </div>
            ) : products.map(product => (
              <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:border-emerald-200 hover:shadow-[0_8px_24px_rgba(5,150,105,0.1)] hover:-translate-y-1">
                <div className="h-48 bg-[#f1f3f0] w-full overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-emerald-700 tracking-tight">₹{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-50"
                      disabled={product.stock <= 0}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f5fbf5]">
                <h2 className="text-xl font-bold text-emerald-800 flex items-center">
                  <ShoppingCart className="mr-2 text-emerald-600" /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-[#f1f3f0] flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-[10px]">No Image</span>
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
                  <button
                    onClick={placeOrder}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
