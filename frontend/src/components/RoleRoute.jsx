import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on their actual role if unauthorized
    if (user.role === 'SuperAdmin') return <Navigate to="/admin" replace />;
    if (user.role === 'WarehouseManager') return <Navigate to="/warehouse" replace />;
    if (user.role === 'UnitAreaManager') return <Navigate to="/unit" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
