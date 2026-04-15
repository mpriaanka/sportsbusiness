import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { sports as sportsAPI, bookings as bookingsAPI } from '../api';
import { GlassCard, Badge, EmptyState, LoadingSkeleton } from '../components/UI';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

export default function ClientDashboard() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sportsList, setSportsList] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sportsAPI.getAll(),
      bookingsAPI.getAll()
    ]).then(([sRes, bRes]) => {
      setSportsList(sRes.data);
      setRecentBookings(bRes.data.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={`min-h-screen pt-20 p-6 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto"><LoadingSkeleton lines={6} /></div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-20 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, <span className="text-gradient">{user?.name}</span> 👋
          </h1>
          <p className={`mt-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
            Browse sports and book your favourite court
          </p>
        </motion.div>

        {/* Sports Grid */}
        <div className="mt-8">
          <h2 className={`text-xl font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Browse Sports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {sportsList.map((sport, i) => (
              <motion.div
                key={sport.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover onClick={() => navigate(`/book/${sport.id}`)}>
                  <div className="text-center">
                    <span className="text-4xl block mb-3">{sport.icon}</span>
                    <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{sport.name}</h3>
                    <p className={`text-sm mt-1 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                      {sport.Courts?.length || 0} courts
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-1 text-primary-400 text-sm font-medium">
                      Book Now <FiArrowRight size={14} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Recent Bookings</h2>
            <button onClick={() => navigate('/bookings')} className="text-primary-400 text-sm font-medium flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <EmptyState icon="📅" title="No bookings yet" message="Browse sports above and book your first session!" />
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-xl`}>
                          {booking.Court?.Sport?.icon || '🏟️'}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {booking.Court?.Sport?.name} - {booking.Court?.name}
                          </h3>
                          <div className={`flex items-center gap-3 text-sm mt-1 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1"><FiCalendar size={12} /> {booking.date}</span>
                            <span className="flex items-center gap-1"><FiClock size={12} /> {booking.time_slot}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>₹{booking.total_amount}</span>
                        <Badge variant={booking.status}>{booking.status}</Badge>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
