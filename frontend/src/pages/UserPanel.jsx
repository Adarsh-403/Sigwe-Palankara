import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Package, X, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const UserPanel = () => {
  const [units, setUnits] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [products, setProducts] = useState([]);
  const [unitStock, setUnitStock] = useState({});
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [houseName, setHouseName] = useState('');
  const [successCode, setSuccessCode] = useState(null);
  
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const initData = async () => {
      try {
        const uRes = await api.get('/units');
        const fetchedUnits = uRes.data;
        setUnits(fetchedUnits);
        
        const uniqueRegions = [...new Set(fetchedUnits.map(u => u.region).filter(Boolean))];
        if (uniqueRegions.length > 0) {
          const firstReg = uniqueRegions[0];
          setSelectedRegion(firstReg);
          const unitsInReg = fetchedUnits.filter(u => u.region === firstReg);
          if (unitsInReg.length > 0) {
            setSelectedUnit(unitsInReg[0].unitId);
          }
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

  useEffect(() => {
    const fetchStock = async () => {
      if (!selectedUnit) {
        setUnitStock({});
        return;
      }
      try {
        const res = await api.get(`/units/${selectedUnit}/stock`);
        const stockMap = {};
        res.data.forEach(s => {
          stockMap[s.productId] = s.quantity || 0;
        });
        setUnitStock(stockMap);
      } catch (err) {
        setUnitStock({});
      }
    };
    fetchStock();
  }, [selectedUnit]);

  const regions = [...new Set(units.map(u => u.region).filter(Boolean))];
  const filteredUnits = units.filter(u => u.region === selectedRegion);

  const displayProducts = products.map(p => {
    const qty = unitStock[p.productId] || 0;
    const isAvailable = p.isAvailable && qty > 0;
    return {
      ...p,
      isAvailable,
      availableStock: isAvailable ? qty : 0
    };
  });

  const addToCart = (product) => {
    if (!product.isAvailable) return toast.error('Out of stock');
    const existing = cart.find(c => c.productId === product.productId);
    if (existing) {
      setCart(cart.map(c => c.productId === product.productId ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: product.productId, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(c => c.productId !== id));

  const updateQuantity = (productId, delta) => {
    const product = displayProducts.find(p => p.productId === productId);
    if (!product) return;
    setCart(cart.map(c => {
      if (c.productId === productId) {
        const newQ = c.quantity + delta;
        if (newQ > product.availableStock) {
          toast.error('Max stock reached');
          return c;
        }
        if (newQ <= 0) return null;
        return { ...c, quantity: newQ };
      }
      return c;
    }).filter(Boolean));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim() || !houseName.trim()) {
      return toast.error('Please enter your Name and House Name');
    }
    
    try {
      const res = await api.post('/orders/pickup', {
        name: customerName,
        houseName,
        email: user?.email || '',
        items: cart,
        unitId: selectedUnit,
        totalAmount: total,
      });
      
      setSuccessCode(res.data.pickupCode);
      setCart([]);
      setCustomerName('');
      setHouseName('');
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
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Sigwe Shop
            </h1>
          </Link>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
              <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              
              <div className="flex flex-col border-r border-gray-200 pr-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Region</label>
                <select 
                  className="bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-pointer w-28"
                  value={selectedRegion}
                  onChange={(e) => {
                    const newRegion = e.target.value;
                    setSelectedRegion(newRegion);
                    const unitsInReg = units.filter(u => u.region === newRegion);
                    setSelectedUnit(unitsInReg.length > 0 ? unitsInReg[0].unitId : '');
                    setCart([]);
                  }}
                >
                  <option value="" disabled>Select Region</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="flex flex-col pl-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pickup Unit</label>
                <select 
                  className="bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-pointer w-32"
                  value={selectedUnit}
                  onChange={(e) => {
                    setSelectedUnit(e.target.value);
                    setCart([]);
                  }}
                >
                  <option value="" disabled>Select Unit</option>
                  {filteredUnits.map(u => (
                    <option key={u.unitId} value={u.unitId}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Link to="/orders" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold transition-colors">
              <History className="w-5 h-5" /> <span className="hidden sm:inline">Orders</span>
            </Link>

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
        {/* Mobile Region/Unit Selector */}
        <div className="md:hidden flex flex-col bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6 gap-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Select Pickup Location</h3>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">1. Region</label>
            <select className="bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500 transition-shadow" value={selectedRegion} onChange={(e) => {
                const newRegion = e.target.value;
                setSelectedRegion(newRegion);
                const unitsInReg = units.filter(u => u.region === newRegion);
                setSelectedUnit(unitsInReg.length > 0 ? unitsInReg[0].unitId : '');
                setCart([]);
              }}>
              <option value="" disabled>Select a Region</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">2. Pickup Unit</label>
            <select className="bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500 transition-shadow" value={selectedUnit} onChange={(e) => {
                setSelectedUnit(e.target.value);
                setCart([]);
              }}>
              <option value="" disabled>Select a Unit</option>
              {filteredUnits.map(u => <option key={u.unitId} value={u.unitId}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Products near you</h2>
          <p className="text-gray-500 mt-2">Order online and pick up at your selected counter.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(p => (
            <motion.div 
              key={p._id}
              whileHover={{ y: -8 }}
              className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border flex flex-col group relative overflow-hidden ${!p.isAvailable ? 'border-red-100 opacity-75' : 'border-gray-100'}`}
            >
              {!p.isAvailable && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <span className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl text-sm">Unavailable</span>
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
                <p className={`text-sm mb-4 font-medium ${p.isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                  {p.isAvailable ? 'Available for pickup' : 'Currently Unavailable'}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  disabled={!p.isAvailable}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors z-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                <button onClick={() => { setIsCartOpen(false); setTimeout(() => setSuccessCode(null), 300); }} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {successCode ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                    className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner"
                  >
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Successfully Added!</h3>
                  <p className="text-gray-500 mb-8 max-w-[250px]">Your items have been reserved at the selected unit.</p>
                  
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 w-full mb-8 shadow-sm">
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Your Pickup Code</p>
                    <p className="text-5xl font-black text-emerald-700 tracking-widest">{successCode}</p>
                  </div>

                  <button 
                    onClick={() => { setIsCartOpen(false); setTimeout(() => setSuccessCode(null), 300); }}
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">Your cart is empty</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-100 shadow-sm p-4 rounded-2xl gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-emerald-600 font-bold">₹{item.price * item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                              <button onClick={() => updateQuantity(item.productId, -1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 font-bold transition-colors">-</button>
                              <span className="w-8 text-center text-sm font-bold text-gray-900 border-x border-gray-200">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.productId, 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 font-bold transition-colors">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.productId)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors" title="Remove Item">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="space-y-3 mb-6">
                      <input 
                        type="text" 
                        placeholder="Your Full Name" 
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white" 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Your House/Building Name" 
                        value={houseName} 
                        onChange={e => setHouseName(e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white" 
                        required 
                      />
                    </div>
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
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserPanel;
