import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiCalendar, FiUsers, FiSettings, FiBarChart2, FiActivity, FiAward, FiBell, FiPackage, FiLayers } from 'react-icons/fi';

export default function Sidebar() {
  const { user } = useAuth();

  const clientLinks = [
    { to: '/dashboard', icon: FiGrid, label: 'Dashboard', end: true },
    { to: '/bookings', icon: FiCalendar, label: 'My Bookings' },
  ];

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

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'manager' ? managerLinks : clientLinks;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-sidebar-bg flex flex-col z-40 shadow-2xl overflow-hidden font-headline tracking-tight">
      <div className="px-8 py-10 flex flex-col items-start h-full">
        {/* Logo / Brand */}
        <div className="text-xl font-bold text-secondary mb-12 tracking-widest uppercase">
          PROSTAR
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 mb-10 w-full group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-secondary/30 overflow-hidden bg-primary/20">
               <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-secondary/60">person</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-sidebar-bg rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm truncate max-w-[120px]">{user?.name}</span>
            <span className="text-slate-400 text-xs truncate max-w-[120px]">{user?.role?.toUpperCase()}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 w-full flex-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? 'text-white font-bold border-l-4 border-secondary bg-white/5'
                    : 'text-slate-400 font-medium hover:text-white hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-xl transition-colors duration-300 ${isActive ? 'text-secondary' : 'group-hover:text-white'}`} />
                  <span className="text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Status / Bottom Info */}
        <div className="mt-auto w-full">
          <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
            <span className="text-secondary text-[10px] font-bold tracking-widest uppercase mb-1 block">Account Type</span>
            <p className="text-white text-xs font-semibold">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Access</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
