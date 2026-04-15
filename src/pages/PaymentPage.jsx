import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { bookings as bookingsAPI, payments as paymentsAPI } from '../api';
import { GlassCard, Badge, LoadingSkeleton } from '../components/UI';
import toast from 'react-hot-toast';
import { FiCheck, FiClock, FiDollarSign } from 'react-icons/fi';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const { dark } = useTheme();
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
    }).catch(() => toast.error('Failed to load booking'))
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
    if (!payAmount || payAmount <= 0) return toast.error('Enter a valid amount');
    if (payAmount > remaining) return toast.error('Amount exceeds remaining balance');

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
    <div className={`min-h-screen pt-20 p-6 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto"><LoadingSkeleton lines={6} /></div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-20 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-display font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>Payment</h1>
          <p className={dark ? 'text-white/50' : 'text-gray-500'}>Complete your booking payment</p>
        </motion.div>

        {/* Booking Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
          <GlassCard>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl">
                  {booking?.Court?.Sport?.icon || '🏟️'}
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {booking?.Court?.Sport?.name} - {booking?.Court?.name}
                  </h3>
                  <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                    {booking?.date} • {booking?.time_slot}
                  </p>
                </div>
              </div>
              <Badge variant={booking?.status}>{booking?.status}</Badge>
            </div>
          </GlassCard>
        </motion.div>

        {/* Payment Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <GlassCard>
            <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Payment Progress
            </h2>

            {/* Progress Bar */}
            <div className={`relative h-4 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full gradient-primary rounded-full"
              />
              {/* 50% marker */}
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/50"></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>₹0</span>
              <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>50% (₹{minAdvance})</span>
              <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>₹{totalAmount}</span>
            </div>

            {/* Status Steps */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  totalPaid > 0 ? 'gradient-primary text-white' : dark ? 'bg-white/10 text-white/30' : 'bg-gray-200 text-gray-400'
                }`}>
                  {totalPaid > 0 ? <FiCheck /> : '1'}
                </div>
                <span className={`text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>Payment Made</span>
              </div>
              <div className={`flex-1 h-0.5 mx-3 ${totalPaid >= minAdvance ? 'gradient-primary' : dark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  booking?.status === 'Confirmed' || booking?.status === 'Completed' ? 'gradient-primary text-white' : dark ? 'bg-white/10 text-white/30' : 'bg-gray-200 text-gray-400'
                }`}>
                  {booking?.status === 'Confirmed' || booking?.status === 'Completed' ? <FiCheck /> : '2'}
                </div>
                <span className={`text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>Confirmed</span>
              </div>
              <div className={`flex-1 h-0.5 mx-3 ${totalPaid >= totalAmount ? 'gradient-primary' : dark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  totalPaid >= totalAmount ? 'gradient-primary text-white' : dark ? 'bg-white/10 text-white/30' : 'bg-gray-200 text-gray-400'
                }`}>
                  {totalPaid >= totalAmount ? <FiCheck /> : '3'}
                </div>
                <span className={`text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>Fully Paid</span>
              </div>
            </div>

            {/* Amounts */}
            <div className={`grid grid-cols-3 gap-4 mt-6 pt-4 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-center">
                <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>Total</p>
                <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>₹{totalAmount}</p>
              </div>
              <div className="text-center">
                <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>Paid</p>
                <p className="text-xl font-bold text-green-400">₹{totalPaid}</p>
              </div>
              <div className="text-center">
                <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>Remaining</p>
                <p className="text-xl font-bold text-amber-400">₹{remaining}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Make Payment */}
        {remaining > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
            <GlassCard>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                <FiDollarSign /> Make Payment
              </h2>

              <div className="flex gap-2 mb-4">
                {[minAdvance, remaining].filter((v, i, a) => a.indexOf(v) === i && v > 0).map(preset => (
                  <button key={preset} onClick={() => setAmount(String(preset))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      amount === String(preset)
                        ? 'gradient-primary text-white'
                        : dark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₹{preset} {preset === minAdvance && totalPaid < minAdvance ? '(50% Advance)' : preset === remaining ? '(Full)' : ''}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  type="number" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={`Enter amount (min ₹1)`}
                  max={remaining}
                  className={`flex-1 ${dark ? 'input-glass' : 'input-light'}`}
                />
                <button onClick={handlePay} disabled={paying} className="btn-primary">
                  {paying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Pay'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Payment History */}
        {paymentsList.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
            <GlassCard>
              <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Payment History</h2>
              <div className="space-y-2">
                {paymentsList.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div>
                      <p className={`font-medium text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>₹{p.amount_paid}</p>
                      <p className={`text-xs ${dark ? 'text-white/40' : 'text-gray-500'}`}>
                        {new Date(p.payment_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={p.payment_type === 'Full' ? 'success' : 'info'}>{p.payment_type}</Badge>
                      <Badge variant={p.payment_status === 'Success' ? 'success' : 'danger'}>{p.payment_status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/bookings')} className={`text-sm font-medium ${dark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            ← Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
