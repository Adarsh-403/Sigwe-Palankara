import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, IndianRupee, ShoppingCart, Trash2 } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (product) => {
    if (product.availableStock <= 0) return toast.error('Out of stock!');
    const existing = cart.find(c => c.productId === product._id);
    if (existing) {
      if (existing.quantity >= product.availableStock) return toast.error('Max stock reached');
      setCart(cart.map(c => c.productId === product._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.productId !== id));
  };

  const updateQuantity = (id, delta, max) => {
    setCart(cart.map(c => {
      if (c.productId === id) {
        const newQ = c.quantity + delta;
        if (newQ > 0 && newQ <= max) return { ...c, quantity: newQ };
        if (newQ <= 0) { removeFromCart(id); return c; }
      }
      return c;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (method) => {
    if (cart.length === 0) return;
    try {
      const res = await api.post('/orders/pos', {
        items: cart,
        paymentMethod: method,
        totalAmount: total
      });
      toast.success(`Sale completed! Code: ${res.data.transactionCode}`);
      setCart([]);
      // Refresh products to update stock
      const prodRes = await api.get('/products');
      setProducts(prodRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Products Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <motion.div
                  key={p._id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(p)}
                  className={`cursor-pointer border rounded-xl p-4 transition-all ${p.availableStock > 0 ? 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md' : 'bg-gray-50 border-gray-200 opacity-60'}`}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <Package className="w-10 h-10 text-gray-300" />}
                  </div>
                  <h4 className="font-medium text-gray-900 truncate text-sm">{p.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-emerald-600">₹{p.price}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{p.availableStock} left</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-emerald-600" />
            Current Order
          </h2>
          <span className="bg-emerald-100 text-emerald-700 py-1 px-2.5 rounded-lg text-sm font-bold">{cart.length}</span>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <AnimatePresence>
            {cart.map(item => {
              const product = products.find(p => p._id === item.productId);
              return (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="font-bold text-emerald-600 text-sm">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.productId, -1, product.availableStock)} className="p-1 rounded-md hover:bg-white text-gray-500"><Minus className="w-4 h-4" /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1, product.availableStock)} className="p-1 rounded-md hover:bg-white text-gray-500"><Plus className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
              <p>Cart is empty</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">₹{total}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCheckout('Cash')}
              disabled={cart.length === 0}
              className="flex items-center justify-center py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IndianRupee className="w-4 h-4 mr-2" />
              Cash
            </button>
            <button
              onClick={() => handleCheckout('UPI')}
              disabled={cart.length === 0}
              className="flex items-center justify-center py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              UPI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
