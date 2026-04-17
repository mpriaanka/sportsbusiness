import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { bookings as bookingsAPI, schedules as schedAPI, notifications as notifAPI, sports as sportsAPI, courts as courtsAPI } from '../api';
import { GlassCard, StatCard, Badge, Modal, Button, Input } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { FiCalendar, FiUsers, FiTrendingUp, FiPlus, FiSend, FiClock, FiActivity, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ManagerOverview() {
  const [stats, setStats] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingsAPI.stats(),
      bookingsAPI.getAll()
    ]).then(([sRes, bRes]) => {
      setStats(sRes.data);
      setBookingsList(bRes.data.slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-primary font-bold">Initializing Manager Terminal...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Bento Grid Stats */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 gold-accent-gradient rounded-3xl p-8 flex flex-col justify-between shadow-xl min-h-[200px]">
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Daily Engagement</span>
              <h2 className="text-4xl font-black text-primary mt-2 font-headline tracking-tighter">{stats?.todayBookings || 0}</h2>
           </div>
           <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <FiActivity /> <span>Active Sessions Today</span>
           </div>
        </div>
        
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-outline-variant/10">
           <div>
              <span className="text-secondary font-bold text-[10px] uppercase tracking-widest">Awaiting Verification</span>
              <h2 className="text-4xl font-black text-primary mt-2 font-headline tracking-tighter">{stats?.pendingBookings || 0}</h2>
           </div>
           <div className="flex items-center gap-2 text-on-surface-variant font-medium text-xs">
              <FiClock /> <span>Pending Protocol Checks</span>
           </div>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4 premium-gradient rounded-3xl p-8 flex flex-col justify-between shadow-xl text-white">
           <div>
              <span className="text-secondary font-bold text-[10px] uppercase tracking-widest">Revenue Cycle</span>
              <h2 className="text-4xl font-black mt-2 font-headline tracking-tighter">₹{(stats?.totalRevenue || 0).toLocaleString()}</h2>
           </div>
           <div className="flex items-center gap-2 text-white/60 font-medium text-xs">
              <FiTrendingUp /> <span>Growth vs Last Cycle</span>
           </div>
        </div>
      </section>

      {/* Engagement Activity */}
      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="flex justify-between items-end">
              <div>
                 <h2 className="text-2xl font-black text-primary font-headline tracking-tighter">Engagement Log</h2>
                 <p className="text-on-surface-variant text-sm font-medium mt-1">Real-time athlete activity across the complex</p>
              </div>
              <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6">Export PDF</Button>
           </div>
           <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-surface-container-low/50">
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Athlete</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Session</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Protocol</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-surface-container">
                    {bookingsList.map((b, i) => (
                       <tr key={i} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-bold text-primary text-sm">{b.client?.name}</p>
                             <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{b.client?.email}</p>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-sm font-bold text-primary">{b.Court?.Sport?.name}</p>
                             <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{b.date} • {b.time_slot}</p>
                          </td>
                          <td className="px-8 py-6">
                             <Badge variant={b.status}>{b.status}</Badge>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
           <GlassCard className="p-8 border border-outline-variant/10 bg-surface-container-low">
              <h3 className="font-black text-primary font-headline tracking-tight mb-6 flex items-center gap-2">
                 <FiAward className="text-secondary" /> Institutional Alert
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-medium">
                 Weekly maintenance check for <strong>Zone-B Facilities</strong> scheduled for Friday. Please notify all active instructors.
              </p>
              <Button variant="primary" className="w-full">Acknowledge Alert</Button>
           </GlassCard>

           <div className="p-8 premium-gradient rounded-3xl text-white shadow-xl shadow-primary/20">
              <h3 className="text-xl font-black font-headline tracking-tighter mb-2">Cycle Projection</h3>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">+24% Increase Predicted</p>
              <div className="h-24 flex items-end gap-2">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-secondary/30 rounded-t-lg transition-all hover:bg-secondary" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function ManagerSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ sport_id: '', court_id: '', day_of_week: 'Monday', start_time: '06:00', end_time: '22:00' });
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    Promise.all([
      schedAPI.getAll(),
      sportsAPI.getAll(),
      courtsAPI.getAll()
    ]).then(([sRes, spRes, cRes]) => {
      setSchedules(sRes.data);
      setSports(spRes.data);
      setCourts(cRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    try {
      await schedAPI.create(form);
      toast.success('Schedule Protocol Initialized');
      setShowAdd(false);
      schedAPI.getAll().then(r => setSchedules(r.data));
    } catch (err) { toast.error('Access Denied'); }
  };

  const handleDelete = async (id) => {
    await schedAPI.remove(id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Protocol Purged');
  };

  if(loading) return <div className="p-8 text-center text-primary font-bold">Synchronizing Timelines...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">Master Schedule</h2>
           <p className="text-on-surface-variant text-sm font-medium mt-1">Institutional timeline definition and management</p>
        </div>
        <Button onClick={() => setShowAdd(true)} variant="primary">
          <FiPlus /> New Schedule
        </Button>
      </div>
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Discipline</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Complex Unit</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Cycle Day</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Interval</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {schedules.map(s => (
                <tr key={s.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-6 font-bold text-primary text-sm">{s.Sport?.name}</td>
                  <td className="px-8 py-6 text-on-surface-variant font-medium text-sm">{s.Court?.name}</td>
                  <td className="px-8 py-6 font-black text-primary text-[10px] uppercase tracking-widest">{s.day_of_week}</td>
                  <td className="px-8 py-6 text-sm font-bold text-secondary">{s.start_time} - {s.end_time}</td>
                  <td className="px-8 py-6">
                    <button onClick={() => handleDelete(s.id)} className="text-on-surface-variant hover:text-error transition-colors">
                       <FiPlus className="rotate-45" size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Initialize Schedule">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">Discipline</label>
               <select value={form.sport_id} onChange={e => setForm({...form, sport_id: e.target.value})} className="w-full p-4 bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all font-body text-on-surface">
                 <option value="">Select Discipline</option>
                 {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
            </div>
            <div className="col-span-2">
               <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">Complex Unit</label>
               <select value={form.court_id} onChange={e => setForm({...form, court_id: e.target.value})} className="w-full p-4 bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all font-body text-on-surface">
                 <option value="">Select Unit</option>
                 {courts.filter(c => !form.sport_id || c.sport_id == form.sport_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div className="col-span-2">
               <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">Cycle Day</label>
               <select value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})} className="w-full p-4 bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all font-body text-on-surface">
                 {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
               </select>
            </div>
            <Input label="Start Interval" type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
            <Input label="End Interval" type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} />
          </div>
          <Button onClick={handleAdd} variant="primary" className="w-full">Initialize Timeline</Button>
        </div>
      </Modal>
    </div>
  );
}

function ManagerNotifications() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ user_id: '', title: '', message: '', type: 'general' });

  useEffect(() => {
    authAPI.users().then(r => setClients(r.data.filter(u => u.role === 'client'))).catch(() => {});
  }, []);

  const handleSend = async () => {
    try {
      await notifAPI.send(form);
      toast.success('Announcement Dispatched');
      setForm({ user_id: '', title: '', message: '', type: 'general' });
    } catch (err) { toast.error('Dispatch Failed'); }
  };

  const handleBulk = async () => {
    try {
      await notifAPI.sendBulk({ title: form.title, message: form.message, type: form.type, role: 'client' });
      toast.success('Global Dispatch Successful');
    } catch (err) { toast.error('Dispatch Failed'); }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
         <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">Communications Node</h2>
         <p className="text-on-surface-variant text-sm font-medium mt-1">Dispatch announcements and protocol updates</p>
      </div>
      <GlassCard className="max-w-3xl border border-outline-variant/10 bg-surface-container-low">
        <div className="space-y-6">
           <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">Target Entity</label>
              <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} className="w-full p-4 bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all font-body text-on-surface">
                <option value="">Select Entity (Private)</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
           </div>
          <Input label="Announcement Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Priority Title" />
          <div>
             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">Announcement Data</label>
             <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Institutional message body..." rows={4} className="w-full p-4 bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all font-body text-on-surface resize-none" />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSend} variant="primary" className="flex-1">
               <FiSend /> Private Dispatch
            </Button>
            <Button onClick={handleBulk} variant="outline" className="flex-1 font-black uppercase text-[10px] tracking-widest">
               <FiUsers /> Global Dispatch
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ManagerBookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getAll().then(r => setBookingsList(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if(loading) return <div className="p-8 text-center text-primary font-bold">Accessing Engagement Logs...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">Engagement Master Log</h2>
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Athlete</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Discipline</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Rate</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Protocol</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {bookingsList.map(b => (
                <tr key={b.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-6">
                     <p className="font-bold text-primary text-sm">{b.client?.name}</p>
                     <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{b.date} • {b.time_slot}</p>
                  </td>
                  <td className="px-8 py-6">
                     <p className="text-sm font-bold text-primary">{b.Court?.Sport?.name}</p>
                     <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{b.Court?.name}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-primary text-sm">₹{b.total_amount}</td>
                  <td className="px-8 py-6"><Badge variant={b.status}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

function ManagerAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.stats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if(loading) return <div className="p-8 text-center text-primary font-bold">Aggregating Strategic Data...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">Operational Analytics</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FiCalendar} title="Total Engagement" value={stats?.totalBookings || 0} />
        <StatCard icon={FiClock} title="Awaiting Review" value={stats?.pendingBookings || 0} variant="gold" />
        <StatCard icon={FiUsers} title="Active Capacity" value={`${((stats?.confirmedBookings / stats?.totalBookings) * 100 || 0).toFixed(1)}%`} />
        <StatCard icon={FiTrendingUp} title="Strategic Revenue" value={`₹${stats?.totalRevenue || 0}`} variant="gold" />
      </div>
      <GlassCard className="p-10 border border-outline-variant/10">
        <h3 className="text-xl font-black text-primary font-headline tracking-tighter mb-8">7-Day Operational Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.dailyBookings || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#00353a', fontSize: 10, fontWeight: 700 }}
              tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
            <YAxis tick={{ fill: '#00353a', fontSize: 10, fontWeight: 700 }} />
            <Tooltip cursor={{fill: 'rgba(212, 175, 55, 0.1)'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="count" fill="#00353a" radius={[10,10,0,0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}

export default function ManagerDashboard() {
  const location = useLocation();
  const isRoot = location.pathname === '/manager';

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-10 lg:ml-72 pt-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
             {isRoot ? <ManagerOverview /> : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export { ManagerSchedules, ManagerBookings, ManagerNotifications, ManagerAnalytics };
