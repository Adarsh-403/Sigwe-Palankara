import { useState, useEffect } from 'react';
import { Search, CheckCircle2, Banknote, QrCode, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import axios from 'axios';

export default function POS() {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'online'
  
  // Online Order State
  const [orderCode, setOrderCode] = useState('');
  const [order, setOrder] = useState(null);
  
  // Direct Sale State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [directPaymentMethod, setDirectPaymentMethod] = useState('');
  const [completedDirectOrderCode, setCompletedDirectOrderCode] = useState(null);
  
  // Shared
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (activeTab === 'direct') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  // --- Online Order Logic ---
  const searchOrder = async () => {
    if (orderCode.length === 4) {
      try {
        const res = await axios.get(`/api/orders/${orderCode}`);
        setOrder({
          code: res.data.orderCode,
          status: res.data.status,
          total: res.data.totalAmount,
          items: res.data.items,
          paymentMethod: res.data.paymentMethod || ''
        });
      } catch (error) {
        alert('Order not found');
      }
    }
  };

  const completeOnlineSale = async () => {
    if (!paymentMethod) return alert('Select payment method');
    try {
      await axios.put(`/api/orders/${orderCode}/complete`, { paymentMethod });
      setOrder({ ...order, status: 'Completed', paymentMethod });
      alert('Sale Completed! Stock has been updated.');
    } catch (error) {
      alert(error.response?.data?.message || 'Error completing sale');
    }
  };

  // --- Direct Sale Logic ---
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

  const directTotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const completeDirectSale = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    if (!directPaymentMethod) return alert('Select payment method');

    try {
      // 1. Create the pending order
      const payload = {
        items: cart.map(c => ({
          productId: c._id,
          quantity: c.quantity,
          price: c.price,
          name: c.name
        })),
        totalAmount: directTotalAmount
      };
      const createRes = await axios.post('/api/orders', payload);
      const newOrderCode = createRes.data.orderCode;

      // 2. Immediately mark as complete to reduce stock
      await axios.put(`/api/orders/${newOrderCode}/complete`, { paymentMethod: directPaymentMethod });
      
      setCompletedDirectOrderCode(newOrderCode);
      setCart([]);
      setDirectPaymentMethod('');
      fetchProducts(); // refresh stock
    } catch (error) {
      console.error(error);
      alert('Error completing direct sale');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex space-x-2">
        <button 
          onClick={() => { setActiveTab('direct'); setOrder(null); setCompletedDirectOrderCode(null); }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'direct' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Direct Sale (Walk-in)
        </button>
        <button 
          onClick={() => { setActiveTab('online'); setOrder(null); setCompletedDirectOrderCode(null); }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'online' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Online Order Pickup
        </button>
      </div>

      {activeTab === 'direct' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product._id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h4>
                    <p className="text-emerald-600 font-bold mb-2">₹{product.price}</p>
                    <p className="text-xs text-gray-500 mb-4">Stock: {product.stock}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Cart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-fit">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ShoppingCart className="mr-2" /> Current Order
            </h2>
            
            {completedDirectOrderCode ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sale Completed!</h4>
                <p className="text-gray-500 mb-4">Receipt generated for</p>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 px-6 py-3 rounded-xl mb-6">
                  <span className="text-3xl font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                    {completedDirectOrderCode}
                  </span>
                </div>
                <button 
                  onClick={() => setCompletedDirectOrderCode(null)}
                  className="w-full px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  Start New Sale
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-60 pr-2">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No items added</p>
                  ) : (
                    cart.map(item => (
                      <div key={item._id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm font-bold text-emerald-600">₹{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
                          <button onClick={() => updateQuantity(item._id, -1)} className="p-1 text-gray-500 hover:text-red-500">
                            {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, 1)} className="p-1 text-gray-500 hover:text-emerald-500">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{directTotalAmount}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => setDirectPaymentMethod('UPI')}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all ${
                        directPaymentMethod === 'UPI' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-emerald-300'
                      }`}
                    >
                      <QrCode size={20} className="mb-1" />
                      <span className="text-xs font-bold">UPI</span>
                    </button>
                    <button 
                      onClick={() => setDirectPaymentMethod('Cash')}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all ${
                        directPaymentMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-emerald-300'
                      }`}
                    >
                      <Banknote size={20} className="mb-1" />
                      <span className="text-xs font-bold">CASH</span>
                    </button>
                  </div>

                  <button 
                    onClick={completeDirectSale}
                    disabled={cart.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                  >
                    Complete Sale
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'online' && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fetch Online Order</h2>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter 4-digit order code" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-lg font-mono tracking-wider"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>
              <button 
                onClick={searchOrder}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                Fetch
              </button>
            </div>
          </div>

          {order && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Details</h3>
                    <p className="text-sm text-gray-500 font-mono mt-1">#{order.code}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{order.total}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment</h3>
                
                {order.status === 'Pending' ? (
                  <>
                    <div className="space-y-3 mb-6">
                      <button 
                        onClick={() => setPaymentMethod('UPI')}
                        className={`w-full flex items-center p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === 'UPI' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        <QrCode className={`mr-3 ${paymentMethod === 'UPI' ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${paymentMethod === 'UPI' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300'}`}>UPI Scan</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('Cash')}
                        className={`w-full flex items-center p-4 border-2 rounded-xl transition-all ${
                          paymentMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        <Banknote className={`mr-3 ${paymentMethod === 'Cash' ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${paymentMethod === 'Cash' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300'}`}>Cash</span>
                      </button>
                    </div>

                    <button 
                      onClick={completeOnlineSale}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                      Complete Sale
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 size={64} className="text-green-500 mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Paid via {order.paymentMethod}</h4>
                    <p className="text-gray-500">Receipt generated</p>
                    <button 
                      onClick={() => { setOrder(null); setOrderCode(''); setPaymentMethod(''); }}
                      className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                    >
                      Next Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
