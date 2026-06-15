import { LayoutDashboard, Users, Store, Box } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

const SuperAdminLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Units & Warehouses', path: '/admin/units', icon: Store },
    { label: 'Users & Managers', path: '/admin/users', icon: Users },
    { label: 'All Products', path: '/admin/products', icon: Box },
  ];

  return <SidebarLayout title="Sigwe SuperAdmin" navItems={navItems} />;
};

export default SuperAdminLayout;
