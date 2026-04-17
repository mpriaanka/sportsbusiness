import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { bookings as bookingsAPI } from '../api';
import { GlassCard, Badge, Button } from '../components/UI';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiDollarSign, FiXCircle, FiActivity, FiArrowRight } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    bookingsAPI.getAll().then(r => setBookingsList(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const filtered = filter === 'all' ? bookingsList : bookingsList.filter(b => b.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-black text-primary uppercase tracking-widest">
       Loading Booking History...
    </div>
  );

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-10 lg:ml-72 pt-32 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <div className="flex items-center gap-4 mb-2">
                  <FiActivity className="text-secondary" size={24} />
                  <h1 className="text-4xl font-black text-primary font-headline tracking-tighter leading-none">
                     My <span className="text-secondary italic">Bookings</span>
                  </h1>
               </div>
               <p className="text-on-surface-variant font-medium tracking-tight">Manage your upcoming and past sport sessions</p>
            </motion.div>

            {/* Filters */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {['all', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map(f => (
                <button key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    filter === f
                      ? 'gold-accent-gradient border-primary text-primary shadow-lg'
                      : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-secondary/30'
                  }`}
                >
                  {f === 'all' ? 'All Bookings' : f}
                  {f !== 'all' && (
                    <span className="ml-2 opacity-40">[{bookingsList.filter(b => b.status === f).length}]</span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <GlassCard className="p-16 border-2 border-dashed border-outline-variant/30 text-center">
                   <p className="text-on-surface-variant font-black uppercase tracking-widest text-sm mb-2">No Bookings Found</p>
                   <p className="text-on-surface-variant/40 text-xs font-medium">You haven't made any bookings in this category yet.</p>
                </GlassCard>
              ) : (
                filtered.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <GlassCard className="p-8 border border-outline-variant/10 bg-surface-container-low hover:border-secondary/30 transition-all group">
                      <div className="flex items-center justify-between flex-wrap gap-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl gold-accent-gradient shadow-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                            {b.Court?.Sport?.icon || '🏟️'}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-primary font-headline tracking-tight leading-none mb-2">
                              {b.Court?.Sport?.name} • {b.Court?.name}
                            </h3>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                              <span className="flex items-center gap-2"><FiCalendar className="text-secondary" /> {b.date}</span>
                              <span className="flex items-center gap-2"><FiClock className="text-secondary" /> {b.time_slot}</span>
                              <span className="flex items-center gap-2"><FiDollarSign className="text-secondary" /> ₹{b.total_amount}</span>
                            </div>
                            {b.Equipment && b.Equipment.length > 0 && (
                              <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-3">
                                Equipment: {b.Equipment.map(e => e.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <Badge variant={b.status}>{b.status}</Badge>
                           {(b.status === 'Pending' || b.status === 'Confirmed') && (
                             <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/10">
                               <Button onClick={() => navigate(`/payment/${b.id}`)} variant="primary" className="!py-2 !px-6 text-[10px]">
                                 Pay Now
                               </Button>
                               <button onClick={() => handleCancel(b.id)} className="p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all" title="Cancel Booking">
                                 <FiXCircle size={20} />
                               </button>
                             </div>
                           )}
                           <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary/20 group-hover:text-secondary transition-colors">
                              <FiArrowRight size={20} />
                           </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
