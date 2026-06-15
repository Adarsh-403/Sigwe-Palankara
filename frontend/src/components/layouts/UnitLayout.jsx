import { LayoutDashboard, Calculator, PackageCheck, PackageOpen } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

const UnitLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/unit', icon: LayoutDashboard },
    { label: 'POS Terminal', path: '/unit/pos', icon: Calculator },
    { label: 'Pickup Orders', path: '/unit/pickup', icon: PackageCheck },
    { label: 'Inventory & Stock', path: '/unit/inventory', icon: PackageOpen },
  ];

  return <SidebarLayout title="Unit Manager" navItems={navItems} />;
};

export default UnitLayout;
