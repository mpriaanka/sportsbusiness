import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { sports as sportsAPI, courts as courtsAPI, bookings as bookingsAPI, equipment as equipAPI } from '../api';
import { GlassCard, Modal, LoadingSkeleton } from '../components/UI';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiCheck, FiX, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

export default function BookingPage() {
  const { sportId } = useParams();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [sport, setSport] = useState(null);
  const [courtsList, setCourtsList] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [equipList, setEquipList] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      sportsAPI.getById(sportId),
      courtsAPI.getAll(sportId),
      equipAPI.getAll(sportId)
    ]).then(([sRes, cRes, eRes]) => {
      setSport(sRes.data);
      setCourtsList(cRes.data);
      setEquipList(eRes.data);
      if (cRes.data.length > 0) setSelectedCourt(cRes.data[0]);
    }).catch(() => toast.error('Failed to load sport data'))
    .finally(() => setLoading(false));
  }, [sportId]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      setSlotsLoading(true);
      bookingsAPI.availableSlots(selectedCourt.id, selectedDate)
        .then(r => setSlots(r.data))
        .catch(() => {})
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedCourt, selectedDate]);

  const courtPrice = selectedCourt ? parseFloat(selectedCourt.price_per_hour) : 0;
  const equipTotal = selectedEquip.reduce((sum, id) => {
    const eq = equipList.find(e => e.id === id);
    return sum + (eq ? parseFloat(eq.price) : 0);
  }, 0);
  const totalPrice = courtPrice + equipTotal;

  const toggleEquip = (id) => {
    setSelectedEquip(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBook = async () => {
    if (!selectedCourt || !selectedSlot) return;
    setBooking(true);
    try {
      const { data } = await bookingsAPI.create({
        court_id: selectedCourt.id,
        date: selectedDate,
        time_slot: selectedSlot,
        equipment_ids: selectedEquip
      });
      toast.success('Booking created! Proceed to payment.');
      setShowConfirm(false);
      navigate(`/payment/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (loading) return (
    <div className={`min-h-screen pt-20 p-6 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto"><LoadingSkeleton lines={8} /></div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-20 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{sport?.icon}</span>
            <div>
              <h1 className={`text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                Book {sport?.name}
              </h1>
              <p className={`${dark ? 'text-white/50' : 'text-gray-500'}`}>{sport?.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Court Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard>
                <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Select Court
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {courtsList.map(court => (
                    <button key={court.id}
                      onClick={() => { setSelectedCourt(court); setSelectedSlot(null); }}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selectedCourt?.id === court.id
                          ? 'gradient-primary text-white shadow-lg'
                          : dark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <p className="font-semibold text-sm">{court.name}</p>
                      <p className={`text-xs mt-1 ${selectedCourt?.id === court.id ? 'text-white/80' : dark ? 'text-white/40' : 'text-gray-500'}`}>
                        ₹{court.price_per_hour}/hr • {court.location}
                      </p>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Date Selection - Calendar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassCard>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  <FiCalendar /> Select Date
                </h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {generateDates().map(date => {
                    const d = new Date(date);
                    const isSelected = date === selectedDate;
                    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
                    const dayNum = d.getDate();
                    const month = d.toLocaleDateString('en', { month: 'short' });
                    return (
                      <button key={date}
                        onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                        className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'gradient-primary text-white shadow-lg'
                            : dark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <p className="text-xs font-medium">{dayName}</p>
                        <p className="text-xl font-bold mt-1">{dayNum}</p>
                        <p className="text-xs">{month}</p>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* Time Slots */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlassCard>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  <FiClock /> Available Slots
                </h2>
                {slotsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-3 border-primary-400/30 border-t-primary-400 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map(slot => (
                      <button key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3 rounded-xl text-center text-sm font-medium transition-all ${
                          !slot.available
                            ? dark ? 'bg-red-500/10 text-red-400/50 cursor-not-allowed line-through' : 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                            : selectedSlot === slot.time
                              ? 'gradient-primary text-white shadow-lg'
                              : dark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {slot.time.split('-')[0]}
                        <span className="block text-xs mt-0.5">
                          {!slot.available ? 'Booked' : selectedSlot === slot.time ? '✓' : 'Free'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Equipment Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <GlassCard>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  <FiShoppingCart /> Equipment (Optional)
                </h2>
                <div className="space-y-2">
                  {equipList.map(eq => {
                    const isChecked = selectedEquip.includes(eq.id);
                    return (
                      <button key={eq.id}
                        onClick={() => toggleEquip(eq.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                          isChecked
                            ? dark ? 'bg-primary-600/20 border border-primary-500/30' : 'bg-primary-50 border border-primary-200'
                            : dark ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-primary-500 border-primary-500 text-white' : dark ? 'border-white/20' : 'border-gray-300'
                          }`}>
                            {isChecked && <FiCheck size={14} />}
                          </div>
                          <div className="text-left">
                            <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{eq.name}</p>
                            <p className={`text-xs ${dark ? 'text-white/40' : 'text-gray-500'}`}>{eq.description}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>₹{eq.price}</span>
                      </button>
                    );
                  })}
                  {equipList.length === 0 && (
                    <p className={`text-sm text-center py-4 ${dark ? 'text-white/40' : 'text-gray-400'}`}>No equipment available</p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Price Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard className="!p-5">
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    <FiDollarSign /> Booking Summary
                  </h2>

                  <div className="space-y-3">
                    <div className={`flex justify-between text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>
                      <span>Court Fee</span>
                      <span>₹{courtPrice}</span>
                    </div>

                    {selectedEquip.length > 0 && (
                      <div className={`border-t pt-3 ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                        <p className={`text-xs font-medium mb-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>Equipment</p>
                        {selectedEquip.map(id => {
                          const eq = equipList.find(e => e.id === id);
                          return eq && (
                            <div key={id} className={`flex justify-between text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>
                              <span>{eq.name}</span>
                              <span>₹{eq.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className={`border-t pt-3 ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className={`flex justify-between text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        <span>Total</span>
                        <span className="text-gradient">₹{totalPrice}</span>
                      </div>
                      <p className={`text-xs mt-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                        Min. advance: ₹{Math.ceil(totalPrice * 0.5)} (50%)
                      </p>
                    </div>
                  </div>

                  {selectedCourt && selectedDate && selectedSlot && (
                    <div className={`mt-4 p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                        {selectedCourt.name} • {selectedDate} • {selectedSlot}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={!selectedCourt || !selectedSlot}
                    className={`w-full mt-4 btn-primary ${(!selectedCourt || !selectedSlot) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Confirm Booking
                  </button>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Booking">
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className={dark ? 'text-white/50' : 'text-gray-500'}>Sport</p>
                <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{sport?.name}</p>
              </div>
              <div>
                <p className={dark ? 'text-white/50' : 'text-gray-500'}>Court</p>
                <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{selectedCourt?.name}</p>
              </div>
              <div>
                <p className={dark ? 'text-white/50' : 'text-gray-500'}>Date</p>
                <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{selectedDate}</p>
              </div>
              <div>
                <p className={dark ? 'text-white/50' : 'text-gray-500'}>Slot</p>
                <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{selectedSlot}</p>
              </div>
            </div>
          </div>
          <div className={`flex justify-between text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowConfirm(false)} className="flex-1 btn-glass">Cancel</button>
            <button onClick={handleBook} disabled={booking} className="flex-1 btn-primary">
              {booking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'Book Now'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
