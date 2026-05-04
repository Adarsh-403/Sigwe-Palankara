import { Routes, Route } from 'react-router-dom';
import UserPanel from './pages/UserPanel';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import POS from './pages/admin/POS';
import OrderManagement from './pages/admin/OrderManagement';
import Analytics from './pages/admin/Analytics';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';

function App() {
 return (
 <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
 <Routes>
 <Route path="/" element={<UserPanel />} />
 <Route path="/login" element={<Login />} />
 
 {/* Admin Routes (to be protected later) */}
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
