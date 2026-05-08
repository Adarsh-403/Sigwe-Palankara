import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { setUser } from './store/authSlice';

import HomePage from './pages/HomePage';
import UserPanel from './pages/UserPanel';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import POS from './pages/admin/POS';
import OrderManagement from './pages/admin/OrderManagement';
import Analytics from './pages/admin/Analytics';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || '';
        const raw = email.split('@')[0];
        let role = 'user';
        if (raw === 'sigwepal') role = 'admin';
        if (raw === 'sales') role = 'sales';
        dispatch(setUser({ uid: user.uid, email, role }));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5fbf5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 font-sans">
      <Routes>
        {/* Public home / landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Shop (product listing for customers) */}
        <Route path="/shop" element={<UserPanel />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes (protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="pos" element={<POS />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
