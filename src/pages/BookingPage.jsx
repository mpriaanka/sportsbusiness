import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sports as sportsAPI, courts as courtsAPI, bookings as bookingsAPI, equipment as equipAPI } from '../api';
import { GlassCard, Modal, Button, Input } from '../components/UI';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiCheck, FiShoppingCart, FiArrowRight, FiActivity } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function BookingPage() {
  const { sportId } = useParams();
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
    }).catch(() => toast.error('Failed to load data'))
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
      toast.success('Booking created!');
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
    <div className="min-h-screen flex items-center justify-center bg-surface font-black text-primary uppercase tracking-widest">
       Loading Facility Details...
    </div>
  );

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-10 lg:ml-72 pt-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 gold-accent-gradient rounded-3xl shadow-xl flex items-center justify-center text-4xl">
                     {sport?.icon}
                  </div>
                  <div>
                     <h1 className="text-4xl font-black text-primary font-headline tracking-tighter leading-none mb-2">
                        {sport?.name} <span className="text-secondary italic">Complex</span>
                     </h1>
                     <p className="text-on-surface-variant font-medium tracking-tight">Select your preferences and book your session</p>
                  </div>
               </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-12">
                {/* Court Selection */}
                <section>
                  <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-6 uppercase tracking-widest">Select Court</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courtsList.map(court => (
                      <button key={court.id}
                        onClick={() => { setSelectedCourt(court); setSelectedSlot(null); }}
                        className={`p-6 rounded-3xl text-left transition-all border-2 ${
                          selectedCourt?.id === court.id
                            ? 'gold-accent-gradient border-primary shadow-xl scale-[1.02]'
                            : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'
                        }`}
                      >
                        <p className="font-black text-primary text-lg font-headline tracking-tight">{court.name}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
                           <p className="text-[10px] font-black uppercase tracking-widest">Elite Level</p>
                           <p className="font-bold text-secondary">₹{court.price_per_hour}/hr</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Calendar Selection */}
                <section>
                   <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-6 uppercase tracking-widest">Select Date</h2>
                   <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                     {generateDates().map(date => {
                       const d = new Date(date);
                       const isSelected = date === selectedDate;
                       return (
                         <button key={date}
                           onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                           className={`flex-shrink-0 w-24 p-5 rounded-3xl text-center transition-all border-2 ${
                             isSelected
                               ? 'gold-accent-gradient border-primary shadow-lg scale-105'
                               : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'
                           }`}
                         >
                           <p className="text-[10px] font-black uppercase tracking-widest mb-2">{d.toLocaleDateString('en', { weekday: 'short' })}</p>
                           <p className="text-3xl font-black font-headline tracking-tighter text-primary leading-none">{d.getDate()}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest mt-2">{d.toLocaleDateString('en', { month: 'short' })}</p>
                         </button>
                       );
                     })}
                   </div>
                </section>

                {/* Slot Selection */}
                <section>
                   <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-6 uppercase tracking-widest">Available Slots</h2>
                   {slotsLoading ? (
                     <div className="flex justify-center py-12 text-secondary font-black animate-pulse">Checking availability...</div>
                   ) : (
                     <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                       {slots.map(slot => (
                         <button key={slot.time}
                           disabled={!slot.available}
                           onClick={() => setSelectedSlot(slot.time)}
                           className={`p-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest transition-all border-2 ${
                             !slot.available
                               ? 'bg-surface-container border-outline-variant/5 text-on-surface-variant/20 cursor-not-allowed'
                               : selectedSlot === slot.time
                                 ? 'gold-accent-gradient border-primary text-primary shadow-md'
                                 : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-secondary/30'
                           }`}
                         >
                           {slot.time.split('-')[0]}
                           <span className="block text-[8px] mt-1 opacity-60">
                             {!slot.available ? 'Booked' : 'Available'}
                           </span>
                         </button>
                       ))}
                     </div>
                   )}
                </section>

                {/* Equipment */}
                <section>
                   <h2 className="text-xl font-black text-primary font-headline tracking-tighter mb-6 uppercase tracking-widest">Add Equipment</h2>
                   <div className="grid gap-4">
                     {equipList.map(eq => {
                       const isChecked = selectedEquip.includes(eq.id);
                       return (
                         <button key={eq.id}
                           onClick={() => toggleEquip(eq.id)}
                           className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all border-2 ${
                             isChecked
                               ? 'gold-accent-gradient border-primary'
                               : 'bg-surface-container-low border-outline-variant/10'
                           }`}
                         >
                           <div className="flex items-center gap-6">
                             <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                               isChecked ? 'bg-primary border-primary text-secondary' : 'border-outline-variant/20'
                             }`}>
                               {isChecked && <FiCheck size={18} />}
                             </div>
                             <div className="text-left">
                               <p className="font-black text-primary tracking-tight">{eq.name}</p>
                               <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Quality Gear</p>
                             </div>
                           </div>
                           <span className="font-black text-secondary">₹{eq.price}</span>
                         </button>
                       );
                     })}
                   </div>
                </section>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                 <div className="sticky top-32">
                    <GlassCard className="p-8 border border-outline-variant/10 bg-surface-container-low shadow-2xl shadow-primary/10">
                       <h3 className="text-2xl font-black text-primary font-headline tracking-tighter mb-8 flex items-center gap-3">
                          <FiActivity className="text-secondary" /> Booking Summary
                       </h3>

                       <div className="space-y-6">
                          <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">
                             <span>Court Price</span>
                             <span className="text-primary font-black tracking-normal text-sm">₹{courtPrice}</span>
                          </div>

                          {selectedEquip.length > 0 && (
                             <div className="pt-6 border-t border-outline-variant/10 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Equipment Add-ons</p>
                                {selectedEquip.map(id => {
                                  const eq = equipList.find(e => e.id === id);
                                  return eq && (
                                    <div key={id} className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                                      <span>{eq.name}</span>
                                      <span className="text-primary">₹{eq.price}</span>
                                    </div>
                                  );
                                })}
                             </div>
                          )}

                          <div className="pt-8 border-t-2 border-primary/10">
                             <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-black uppercase tracking-widest text-primary">Total Amount</span>
                                <span className="text-4xl font-black text-primary font-headline tracking-tighter">₹{totalPrice}</span>
                             </div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-secondary text-right">
                                Advance Payment (50%): ₹{Math.ceil(totalPrice * 0.5)}
                             </p>
                          </div>
                       </div>

                       {selectedCourt && selectedSlot && (
                         <div className="mt-10 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Booking Details</p>
                            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                               {selectedCourt.name} <br/>
                               {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} <br/>
                               Time: {selectedSlot}
                            </p>
                         </div>
                       )}

                       <Button
                         onClick={() => setShowConfirm(true)}
                         disabled={!selectedCourt || !selectedSlot}
                         variant="primary"
                         className="w-full mt-8 py-5 text-lg"
                       >
                         Book Now
                       </Button>
                    </GlassCard>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Booking">
        <div className="space-y-8">
           <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/10">
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Sport</p>
                    <p className="text-sm font-black text-primary">{sport?.name}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Court</p>
                    <p className="text-sm font-black text-primary">{selectedCourt?.name}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Date</p>
                    <p className="text-sm font-black text-primary">{selectedDate}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Time Slot</p>
                    <p className="text-sm font-black text-primary">{selectedSlot}</p>
                 </div>
              </div>
           </div>
           
           <div className="flex justify-between items-center px-4">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Final Total</span>
              <span className="text-3xl font-black text-primary font-headline tracking-tighter">₹{totalPrice}</span>
           </div>

           <div className="flex gap-4">
              <Button onClick={() => setShowConfirm(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={handleBook} disabled={booking} variant="primary" className="flex-[2]">
                 {booking ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'Confirm Booking'}
              </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
}
