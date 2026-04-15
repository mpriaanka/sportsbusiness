import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiCalendar, FiUsers, FiSettings, FiBarChart2, FiActivity, FiAward, FiBell, FiPackage, FiLayers } from 'react-icons/fi';

export default function Sidebar() {
  const { dark } = useTheme();
  const { user } = useAuth();

  const managerLinks = [
    { to: '/manager', icon: FiGrid, label: 'Overview', end: true },
    { to: '/manager/bookings', icon: FiCalendar, label: 'Bookings' },
    { to: '/manager/schedules', icon: FiActivity, label: 'Schedules' },
    { to: '/manager/notifications', icon: FiBell, label: 'Notifications' },
    { to: '/manager/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const adminLinks = [
    { to: '/admin', icon: FiGrid, label: 'Overview', end: true },
    { to: '/admin/sports', icon: FiAward, label: 'Sports' },
    { to: '/admin/courts', icon: FiLayers, label: 'Courts' },
    { to: '/admin/equipment', icon: FiPackage, label: 'Equipment' },
    { to: '/admin/managers', icon: FiUsers, label: 'Managers' },
    { to: '/admin/bookings', icon: FiCalendar, label: 'Bookings' },
    { to: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const links = user?.role === 'admin' ? adminLinks : managerLinks;

  return (
    <aside className={`fixed left-0 top-16 bottom-0 w-64 ${dark ? 'glass-dark' : 'glass-light'} border-r ${dark ? 'border-white/5' : 'border-gray-200'} overflow-y-auto hidden lg:block`}>
      <div className="p-4">
        <div className={`mb-6 p-4 rounded-2xl ${dark ? 'gradient-card' : 'bg-primary-50'}`}>
          <p className={`text-sm font-medium ${dark ? 'text-white/60' : 'text-primary-600'}`}>{user?.role?.toUpperCase()}</p>
          <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? dark ? 'gradient-primary text-white shadow-lg' : 'bg-primary-500 text-white shadow-lg'
                    : dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
