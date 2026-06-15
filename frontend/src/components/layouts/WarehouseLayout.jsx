import { LayoutDashboard, Package, ArrowRightLeft } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

const WarehouseLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/warehouse', icon: LayoutDashboard },
    { label: 'Warehouse Stock', path: '/warehouse/stock', icon: Package },
    { label: 'Transfer Requests', path: '/warehouse/transfers', icon: ArrowRightLeft },
  ];

  return <SidebarLayout title="Warehouse Manager" navItems={navItems} />;
};

export default WarehouseLayout;
