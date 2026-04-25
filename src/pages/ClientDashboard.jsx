import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { sports as sportsAPI, bookings as bookingsAPI } from '../api';
import { GlassCard, Badge, Button, Modal } from '../components/UI';
import { FiCalendar, FiClock, FiArrowRight, FiActivity } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sportsList, setSportsList] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCert, setShowCert] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-surface font-black text-primary">
       Loading your dashboard...
    </div>
  );

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-10 lg:ml-72 pt-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col md:flex-row justify-between items-end gap-6"
            >
               <div>
                  <h1 className="text-4xl font-black text-primary font-headline tracking-tighter leading-none mb-2">
                    Welcome, <span className="text-secondary italic">{user?.name}</span>
                  </h1>
                  <p className="text-on-surface-variant font-medium tracking-tight">Active Athlete at ProStar Academy</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Member ID</p>
                     <p className="text-sm font-bold text-primary tracking-widest">#ID-{user?.id || '000'}</p>
                  </div>
                  <button 
                     onClick={() => setShowCert(true)}
                     className="w-12 h-12 rounded-2xl gold-accent-gradient shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform"
                     title="View My Certification"
                  >
                     <FiActivity size={24} />
                  </button>
               </div>
            </motion.div>

            <Modal isOpen={showCert} onClose={() => setShowCert(false)} title="Elite Athlete Certification">
               <div className="p-4">
                  <img 
                    src="/prostar_academy_certificate_1776756327573.png" 
                    alt="ProStar Academy Certificate" 
                    className="w-full rounded-2xl shadow-2xl border-4 border-secondary/20"
                  />
                  <div className="mt-8 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                     <p className="text-center text-primary font-bold text-lg font-headline tracking-tight mb-2">
                        Official Elite Athlete Status
                     </p>
                     <p className="text-center text-on-surface-variant text-sm font-medium leading-relaxed">
                        This certification verifies that you have achieved Elite Status within the ProStar Academy athletic framework. 
                        Verified by Global Sports Council.
                     </p>
                  </div>
               </div>
            </Modal>

            {/* Sports Selection */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                 <h2 className="text-2xl font-black text-primary font-headline tracking-tighter">Available Sports</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Select to Book Now</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sportsList.map((sport, i) => (
                   <motion.div
                    key={sport.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/book/${sport.id}`)}
                  >
                    <GlassCard className="p-8 border border-outline-variant/10 bg-surface-container-low text-center group">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mx-auto mb-6 group-hover:gold-accent-gradient transition-all">
                        {sport.icon}
                      </div>
                      <h3 className="font-black text-primary font-headline tracking-tight text-xl mb-1">{sport.name}</h3>
                      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                        {sport.Courts?.length || 0} Courts Available
                      </p>
                      <div className="mt-6 pt-6 border-t border-outline-variant/5">
                        <span className="text-secondary font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                           Book Now <FiArrowRight size={14} />
                        </span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-primary font-headline tracking-tighter">Recent Bookings</h2>
                <Button variant="outline" onClick={() => navigate('/bookings')} className="text-[10px] font-black uppercase tracking-widest px-6">
                  View All History <FiArrowRight className="ml-2" />
                </Button>
              </div>

              {recentBookings.length === 0 ? (
                <GlassCard className="p-12 border border-dashed border-outline-variant/30 text-center">
                   <p className="text-on-surface-variant font-medium">You haven't made any bookings yet. Start by selecting a sport above.</p>
                </GlassCard>
              ) : (
                <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-surface-container-low/50">
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Sport / Court</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Date & Time</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Payment</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {recentBookings.map((booking, i) => (
                           <tr key={booking.id} className="hover:bg-surface-container-low transition-colors group">
                              <td className="px-8 py-6">
                                 <p className="font-bold text-primary text-sm">{booking.Court?.Sport?.name}</p>
                                 <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{booking.Court?.name}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-sm font-bold text-primary">{booking.date}</p>
                                 <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{booking.time_slot}</p>
                              </td>
                              <td className="px-8 py-6 font-black text-primary text-sm">₹{booking.total_amount}</td>
                              <td className="px-8 py-6"><Badge variant={booking.status}>{booking.status}</Badge></td>
                              <td className="px-8 py-6 text-right">
                                 {booking.status === 'Pending' && (
                                   <button 
                                     onClick={() => navigate(`/payment/${booking.id}`)}
                                     className="px-4 py-2 bg-secondary text-primary font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary hover:text-secondary transition-all"
                                   >
                                     Pay Now
                                   </button>
                                 )}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
