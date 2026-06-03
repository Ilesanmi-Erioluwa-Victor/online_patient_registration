import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className="no-print flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
      <div className="flex items-center gap-2">
        <Bars3Icon className="h-6 w-6 text-primary md:hidden" />
        <span className="font-semibold text-neutral-800">Patient Records System</span>
      </div>
      <div className="text-right text-sm">
        <div className="font-semibold">{user?.fullName}</div>
        <div className="capitalize text-neutral-500">{user?.department || user?.role}</div>
      </div>
    </header>
  );
};
