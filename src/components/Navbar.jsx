import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notifications as notifAPI } from '../api';
import { FiMenu, FiBell, FiLogOut, FiSearch } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const { data } = await notifAPI.getAll();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 lg:left-72 right-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Page Title */}
          <div className="flex items-center gap-6">
             <button className="lg:hidden p-2 text-primary">
                <FiMenu size={24} />
             </button>
             <h1 className="font-headline font-extrabold tracking-tighter text-2xl text-primary">
                Dashboard
             </h1>
          </div>

          {/* Desktop Nav Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-white/50 px-5 py-2 rounded-xl border border-outline-variant/10 focus-within:border-secondary/30 transition-all duration-300 group shadow-sm">
               <FiSearch className="text-outline-variant/60 group-focus-within:text-secondary mr-3 transition-colors" size={18} />
               <input 
                  type="text" 
                  placeholder="search records" 
                  className="bg-transparent border-none focus:ring-0 text-sm placeholder-outline-variant/40 w-56 font-medium text-primary"
               />
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-primary hover:text-secondary transition-colors relative"
                >
                  <FiBell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-error rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {isAuthenticated ? (
               <div className="flex items-center gap-4">
                  <div className="h-8 w-[1px] bg-outline-variant/30"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
               </div>
            ) : (
               <Link to="/login" className="btn-premium py-2 px-6 text-sm">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
