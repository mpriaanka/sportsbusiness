import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { bookings as bookingsAPI, payments as paymentsAPI } from '../api';
import { GlassCard, Badge, Button, Input } from '../components/UI';
import toast from 'react-hot-toast';
import { FiCheck, FiClock, FiDollarSign, FiActivity, FiArrowLeft } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentsList, setPaymentsList] = useState([]);
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      bookingsAPI.getById(bookingId),
      paymentsAPI.getByBooking(bookingId)
    ]).then(([bRes, pRes]) => {
      setBooking(bRes.data);
      setPaymentsList(pRes.data);
    }).catch(() => toast.error('Failed to load payment details'))
    .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [bookingId]);

  const totalAmount = booking ? parseFloat(booking.total_amount) : 0;
  const totalPaid = paymentsList.filter(p => p.payment_status === 'Success')
    .reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
  const remaining = Math.max(0, totalAmount - totalPaid);
  const progressPercent = totalAmount > 0 ? Math.min(100, (totalPaid / totalAmount) * 100) : 0;
  const minAdvance = Math.ceil(totalAmount * 0.5);

  const handlePay = async () => {
    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) return toast.error('Please enter a valid amount');
    if (payAmount > remaining) return toast.error('Amount exceeds the remaining balance');

    setPaying(true);
    try {
      await paymentsAPI.make({
        booking_id: parseInt(bookingId),
        amount_paid: payAmount,
        payment_type: totalPaid + payAmount >= totalAmount ? 'Full' : 'Advance'
      });
      toast.success('Payment successful!');
      setAmount('');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-black text-primary uppercase tracking-widest">
       Loading Payment Portal...
    </div>
  );

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-10 lg:ml-72 pt-32 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-10">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <div className="flex items-center gap-4 mb-2">
                  <FiActivity className="text-secondary" size={24} />
                  <h1 className="text-4xl font-black text-primary font-headline tracking-tighter leading-none">
                     Make <span className="text-secondary italic">Payment</span>
                  </h1>
               </div>
               <p className="text-on-surface-variant font-medium tracking-tight">Booking ID: #BK-{bookingId}</p>
            </motion.div>

            {/* Booking Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard className="p-8 border border-outline-variant/10 bg-surface-container-low">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl gold-accent-gradient flex items-center justify-center text-3xl shadow-lg">
                      {booking?.Court?.Sport?.icon || '🏟️'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-primary font-headline tracking-tight">
                        {booking?.Court?.Sport?.name} • {booking?.Court?.name}
                      </h3>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1">
                        Date: {booking?.date} • Time: {booking?.time_slot}
                      </p>
                    </div>
                  </div>
                  <Badge variant={booking?.status}>{booking?.status}</Badge>
                </div>
              </GlassCard>
            </motion.div>

            {/* Payment Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassCard className="p-10 border border-outline-variant/10 bg-surface-container-low shadow-xl">
                <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-8 uppercase tracking-widest">
                  Payment Progress
                </h2>

                <div className="relative h-6 rounded-3xl overflow-hidden bg-surface-container shadow-inner border border-outline-variant/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: 'circOut' }}
                    className="h-full gold-accent-gradient rounded-3xl"
                  />
                  {/* 50% marker */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-primary/20"></div>
                </div>

                <div className="flex items-center justify-between mt-4">
                   <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Start</span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-secondary">50% Advance</span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Complete</span>
                </div>

                {/* Status Steps */}
                <div className="flex items-center justify-between mt-12 relative">
                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container -translate-y-1/2 z-0"></div>
                  {[
                    { label: 'Pending', condition: totalPaid >= 0 },
                    { label: 'Advance Paid', condition: totalPaid >= minAdvance },
                    { label: 'Fully Settled', condition: totalPaid >= totalAmount }
                  ].map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm transition-all duration-500 border-2 ${
                        step.condition ? 'gold-accent-gradient border-primary text-primary shadow-lg scale-110' : 'bg-surface border-outline-variant/10 text-on-surface-variant/20'
                      }`}>
                        {step.condition ? <FiCheck size={20} /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.condition ? 'text-primary' : 'text-on-surface-variant/20'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-outline-variant/10">
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-primary font-headline tracking-tighter leading-none">₹{totalAmount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary mb-1">Paid So Far</p>
                    <p className="text-2xl font-black text-secondary font-headline tracking-tighter leading-none">₹{totalPaid}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Remaining Balance</p>
                    <p className="text-2xl font-black text-primary font-headline tracking-tighter leading-none opacity-40">₹{remaining}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Payment Action */}
            {remaining > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <GlassCard className="p-8 border-2 border-primary shadow-2xl bg-surface-container-lowest">
                  <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-8 flex items-center gap-3">
                    <FiDollarSign className="text-secondary" /> Make a Payment
                  </h2>

                  <div className="flex gap-4 mb-8">
                    {[minAdvance, remaining].filter((v, i, a) => a.indexOf(v) === i && v > 0).map(preset => (
                      <button key={preset} onClick={() => setAmount(String(preset))}
                        className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                          amount === String(preset)
                            ? 'gold-accent-gradient border-primary text-primary shadow-lg scale-[1.02]'
                            : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-secondary/30'
                        }`}
                      >
                        ₹{preset} {preset === minAdvance && totalPaid < minAdvance ? '(Advance)' : preset === remaining ? '(Full Pay)' : ''}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Input
                      type="number" value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder={`Enter amount (max ₹${remaining})`}
                      max={remaining}
                      className="flex-1"
                    />
                    <Button onClick={handlePay} disabled={paying} variant="primary" className="px-12">
                      {paying ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Pay Now'}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* History */}
            {paymentsList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <GlassCard className="p-8 border border-outline-variant/10 bg-surface-container-low">
                  <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-6 uppercase tracking-widest">Transaction History</h2>
                  <div className="space-y-3">
                    {paymentsList.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/5 hover:border-secondary/20 transition-all group">
                        <div className="flex items-center gap-6">
                           <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary group-hover:gold-accent-gradient group-hover:text-primary transition-all">
                              <FiCheck size={20} />
                           </div>
                           <div>
                             <p className="text-lg font-black text-primary font-headline tracking-tight leading-none">₹{p.amount_paid}</p>
                             <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                               Date: {new Date(p.payment_date).toLocaleString()}
                             </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={p.payment_type === 'Full' ? 'success' : 'info'}>{p.payment_type}</Badge>
                          <Badge variant={p.payment_status === 'Success' ? 'success' : 'danger'}>{p.payment_status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            <div className="pt-10 text-center">
              <button onClick={() => navigate('/bookings')} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-secondary transition-colors group">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to My Bookings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
