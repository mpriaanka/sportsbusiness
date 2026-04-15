import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notifications as notifAPI } from '../api';
import { FiSun, FiMoon, FiMenu, FiX, FiBell, FiLogOut, FiUser, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      notifAPI.getAll().then(r => setNotifs(r.data)).catch(() => {});
    }
  }, [isAuthenticated]);

  const unread = notifs.filter(n => !n.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'manager') return '/manager';
    return '/dashboard';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${dark ? 'glass-dark' : 'glass-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏟️</span>
            <span className={`font-display font-bold text-xl ${dark ? 'text-gradient' : 'text-primary-600'}`}>
              ProStar
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${dark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Home
            </Link>
            {isAuthenticated && (
              <Link to={getDashboardLink()} className={`text-sm font-medium transition-colors ${dark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'client' && (
              <Link to="/bookings" className={`text-sm font-medium transition-colors ${dark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                My Bookings
              </Link>
            )}

            {/* Theme Toggle */}
            <button onClick={toggle} className={`p-2 rounded-lg transition-all ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)} className={`p-2 rounded-lg transition-all relative ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <FiBell size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                      {unread}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-2xl ${dark ? 'glass-dark' : 'glass-light'} shadow-xl p-4`}
                    >
                      <h3 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                      {notifs.length === 0 ? (
                        <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-400'}`}>No notifications</p>
                      ) : (
                        notifs.slice(0, 10).map(n => (
                          <div key={n.id} className={`p-3 rounded-xl mb-2 transition-all ${n.is_read ? (dark ? 'bg-white/5' : 'bg-gray-50') : (dark ? 'bg-primary-600/20 border border-primary-500/30' : 'bg-primary-50 border border-primary-200')}`}
                            onClick={async () => {
                              if (!n.is_read) {
                                await notifAPI.markRead(n.id);
                                setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
                              }
                            }}
                          >
                            <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{n.title}</p>
                            <p className={`text-xs mt-1 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{n.message}</p>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className={`text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>
                  {user.name} <span className="text-xs px-2 py-0.5 rounded-full gradient-primary text-white ml-1">{user.role}</span>
                </span>
                <button onClick={handleLogout} className={`p-2 rounded-lg transition-all ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`text-sm font-medium ${dark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Login</Link>
                <Link to="/signup" className="btn-primary text-sm !py-2 !px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 ${dark ? 'text-white' : 'text-gray-600'}`}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setMenuOpen(false)} className={`py-2 px-3 rounded-lg ${dark ? 'text-white/70' : 'text-gray-600'}`}>Home</Link>
                {isAuthenticated && (
                  <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className={`py-2 px-3 rounded-lg ${dark ? 'text-white/70' : 'text-gray-600'}`}>Dashboard</Link>
                )}
                <div className="flex items-center gap-3 px-3 pt-2">
                  <button onClick={toggle} className={`p-2 rounded-lg ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
                  </button>
                  {isAuthenticated ? (
                    <button onClick={handleLogout} className={`p-2 rounded-lg ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <FiLogOut size={16} />
                    </button>
                  ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm !py-2 !px-4">Login</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
