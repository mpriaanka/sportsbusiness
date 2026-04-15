import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { bookings as bookingsAPI } from '../api';
import { GlassCard, Badge, EmptyState, LoadingSkeleton } from '../components/UI';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiDollarSign, FiXCircle } from 'react-icons/fi';

export default function BookingHistory() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    bookingsAPI.getAll().then(r => setBookingsList(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  const filtered = filter === 'all' ? bookingsList : bookingsList.filter(b => b.status === filter);

  if (loading) return (
    <div className={`min-h-screen pt-20 p-6 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto"><LoadingSkeleton lines={6} /></div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-20 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>My Bookings</h1>
          <p className={`mt-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>Track and manage your bookings</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {['all', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'gradient-primary text-white shadow-lg'
                  : dark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f}
              {f !== 'all' && (
                <span className="ml-1 text-xs">({bookingsList.filter(b => b.status === f).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <EmptyState icon="📅" title="No bookings found" message={filter === 'all' ? 'Book your first sport session!' : `No ${filter.toLowerCase()} bookings`} />
          ) : (
            filtered.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl">
                        {b.Court?.Sport?.icon || '🏟️'}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>
                          {b.Court?.Sport?.name} - {b.Court?.name}
                        </h3>
                        <div className={`flex items-center gap-4 text-sm mt-1 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                          <span className="flex items-center gap-1"><FiCalendar size={12} /> {b.date}</span>
                          <span className="flex items-center gap-1"><FiClock size={12} /> {b.time_slot}</span>
                          <span className="flex items-center gap-1"><FiDollarSign size={12} /> ₹{b.total_amount}</span>
                        </div>
                        {b.Equipment && b.Equipment.length > 0 && (
                          <p className={`text-xs mt-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                            Equipment: {b.Equipment.map(e => e.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={b.status}>{b.status}</Badge>
                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/payment/${b.id}`)} className="text-xs btn-primary !py-1.5 !px-3">
                            Pay
                          </button>
                          <button onClick={() => handleCancel(b.id)} className="text-xs p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                            <FiXCircle size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
