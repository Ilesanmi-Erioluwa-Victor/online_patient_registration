import { CalendarDaysIcon, ChartBarIcon, ClipboardDocumentListIcon, HomeIcon, PowerIcon, UserCircleIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const iconMap = { Dashboard: HomeIcon, Patients: UserGroupIcon, 'Register Patient': ClipboardDocumentListIcon, Appointments: CalendarDaysIcon, Users: UsersIcon, Reports: ChartBarIcon, 'Audit Logs': ClipboardDocumentListIcon, 'My Profile': UserCircleIcon, Consultations: ClipboardDocumentListIcon };

const navs = {
  admin: [
    ['Dashboard', '/admin/dashboard'],
    ['Patients', '/patients'],
    ['Appointments', '/appointments'],
    ['Users', '/admin/users'],
    ['Audit Logs', '/admin/audit-logs'],
    ['Reports', '/admin/reports'],
    ['My Profile', '/profile']
  ],
  receptionist: [
    ['Dashboard', '/receptionist/dashboard'],
    ['Register Patient', '/receptionist/register-patient'],
    ['Patients', '/patients'],
    ['Appointments', '/appointments'],
    ['My Profile', '/profile']
  ],
  doctor: [
    ['Dashboard', '/doctor/dashboard'],
    ['Patients', '/patients'],
    ['Consultations', '/consultations/new'],
    ['Appointments', '/appointments'],
    ['My Profile', '/profile']
  ],
  nurse: [
    ['Dashboard', '/nurse/dashboard'],
    ['Patients', '/patients'],
    ['My Profile', '/profile']
  ]
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="no-print flex w-full flex-col bg-primary-dark text-white md:min-h-screen md:w-72">
      <div className="border-b border-white/10 p-5">
        <div className="text-lg font-bold">Hospital Records</div>
        <div className="mt-1 text-xs capitalize text-primary-pale">{user?.role}</div>
      </div>
      <nav className="grid gap-1 p-3">
        {(navs[user?.role] || []).map(([label, to]) => {
          const Icon = iconMap[label] || HomeIcon;
          return (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary-light text-white' : 'text-primary-pale hover:bg-white/10'}`}>
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          );
        })}
      </nav>
      <button
        className="mt-auto flex items-center gap-3 p-5 text-sm text-primary-pale hover:bg-white/10"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        <PowerIcon className="h-5 w-5" /> Logout
      </button>
    </aside>
  );
};
