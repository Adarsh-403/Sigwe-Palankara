import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, ClipboardList, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  // Protect admin routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin' && user.role !== 'sales') {
    return <Navigate to="/" replace />;
  }

  // Redirect sales directly to pos
  if (user.role === 'sales' && location.pathname === '/admin') {
    return <Navigate to="/admin/pos" replace />;
  }
  
  const allNavItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, roles: ['admin'] },
    { name: 'POS (Counter)', path: '/admin/pos', icon: <ShoppingCart size={20} />, roles: ['admin', 'sales'] },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} />, roles: ['admin'] },
    { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={20} />, roles: ['admin'] },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} />, roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-emerald-900 shadow-xl flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-800 bg-emerald-900">
          <div className="h-10 bg-white px-2 rounded-lg flex items-center justify-center">
            <img src="/logo.png" alt="SIGWE Logo" className="h-8 object-contain" />
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-emerald-100 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-800 text-white font-semibold' 
                    : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 md:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-6">
             <Link to="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Go to Shop</Link>
             <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
               {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f5fbf5] p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
