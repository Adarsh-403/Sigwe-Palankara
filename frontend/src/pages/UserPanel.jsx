import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Package, X } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const UserPanel = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const uRes = await api.get('/units');
        const availableUnits = uRes.data.filter(u => u.type === 'Unit');
        setUnits(availableUnits);
        if (availableUnits.length > 0) {
          setSelectedUnit(availableUnits[0]._id);
        }
        
        const pRes = await api.get('/products');
        setProducts(pRes.data);
      } catch (err) {
        toast.error('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Compute products with their available stock in the selected unit
  const displayProducts = products.map(p => {
    if (!selectedUnit) return { ...p, availableStock: 0 };
    const uStock = p.unitStock.find(us => us.unitId === selectedUnit || us.unitId._id === selectedUnit);
    return {
      ...p,
      availableStock: uStock ? uStock.stock - uStock.reservedStock : 0
    };
  });

  const addToCart = (product) => {
    if (product.availableStock <= 0) return toast.error('Out of stock in this unit');
    const existing = cart.find(c => c.productId === product._id);
    if (existing) {
      if (existing.quantity >= product.availableStock) return toast.error('Max stock reached');
      setCart(cart.map(c => c.productId === product._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(c => c.productId !== id));

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const res = await api.post('/orders/pickup', {
        items: cart,
        unitId: selectedUnit,
        totalAmount: total,
      });
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Booking Confirmed!</span>
          <span>Pickup Code: <strong className="text-emerald-600 text-lg">{res.data.pickupCode}</strong></span>
          <span className="text-xs text-gray-500">Show this code at the counter.</span>
        </div>,
        { duration: 10000 }
      );
      setCart([]);
      setIsCartOpen(false);
      
      // Refresh products
      const pRes = await api.get('/products');
      setProducts(pRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Sigwe Shop
          </h1>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <select 
                className="bg-transparent font-medium outline-none cursor-pointer"
                value={selectedUnit || ''}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  setCart([]); // Clear cart when changing unit
                }}
              >
                {units.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Products near you</h2>
          <p className="text-gray-500 mt-2">Order online and pick up at your selected counter.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(p => (
            <motion.div 
              key={p._id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group relative overflow-hidden"
            >
              {p.availableStock <= 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <span className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl text-sm">Out of Stock</span>
                </div>
              )}
              
              <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <Package className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{p.availableStock} available for pickup</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-emerald-600">₹{p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors z-0"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-3 text-emerald-600" />
                  Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-emerald-600 font-medium text-sm">₹{item.price} x {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-red-500 text-sm font-medium hover:underline">
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹{total}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Confirm Pickup Booking
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserPanel;
