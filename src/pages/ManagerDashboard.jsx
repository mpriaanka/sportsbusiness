import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { bookings as bookingsAPI, schedules as schedAPI, notifications as notifAPI } from '../api';
import { GlassCard, StatCard, Badge, EmptyState, LoadingSkeleton, Modal } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { FiCalendar, FiUsers, FiDollarSign, FiTrendingUp, FiPlus, FiSend, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ManagerOverview() {
  const { dark } = useTheme();
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

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee', '#10b981'];

  if (loading) return <LoadingSkeleton lines={6} />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total Bookings" value={stats?.totalBookings || 0} color="primary" />
        <StatCard icon="📌" label="Today's Bookings" value={stats?.todayBookings || 0} color="cyan" />
        <StatCard icon="⏳" label="Pending" value={stats?.pendingBookings || 0} color="orange" />
        <StatCard icon="💰" label="Revenue" value={`₹${stats?.totalRevenue || 0}`} color="green" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Daily Bookings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.dailyBookings || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'} />
              <XAxis dataKey="date" tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 12 }}
                tickFormatter={v => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
              <YAxis tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: dark ? '#1a1a3e' : '#fff', border: 'none', borderRadius: 12 }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Sport Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats?.sportBookings || []} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
                {(stats?.sportBookings || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: dark ? '#1a1a3e' : '#fff', border: 'none', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {(stats?.sportBookings || []).map((s, i) => (
              <span key={s.name} className={`text-xs flex items-center gap-1 ${dark ? 'text-white/60' : 'text-gray-600'}`}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }}></span>
                {s.name} ({s.count})
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Bookings */}
      <GlassCard>
        <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left text-sm ${dark ? 'text-white/40' : 'text-gray-500'}`}>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Sport / Court</th>
                <th className="pb-3 font-medium">Date & Slot</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookingsList.map(b => (
                <tr key={b.id} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <td className={`py-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{b.client?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{b.Court?.Sport?.name} - {b.Court?.name}</td>
                  <td className={`py-3 text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>{b.date} {b.time_slot}</td>
                  <td className={`py-3 font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>₹{b.total_amount}</td>
                  <td className="py-3"><Badge variant={b.status}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function ManagerSchedules() {
  const { dark } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ sport_id: '', court_id: '', day_of_week: 'Monday', start_time: '06:00', end_time: '22:00' });
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    Promise.all([
      schedAPI.getAll(),
      fetch('/api/sports').then(r => r.json()),
      fetch('/api/courts').then(r => r.json())
    ]).then(([sRes, spRes, cRes]) => {
      setSchedules(sRes.data);
      setSports(spRes);
      setCourts(cRes);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    try {
      await schedAPI.create(form);
      toast.success('Schedule created');
      setShowAdd(false);
      schedAPI.getAll().then(r => setSchedules(r.data));
    } catch (err) { toast.error('Failed to create schedule'); }
  };

  const handleDelete = async (id) => {
    await schedAPI.remove(id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Deleted');
  };

  if(loading) return <LoadingSkeleton lines={4} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Schedules</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus /> Add Schedule
        </button>
      </div>
      <div className="overflow-x-auto">
        <GlassCard>
          <table className="w-full">
            <thead><tr className={`text-left text-sm ${dark ? 'text-white/40' : 'text-gray-500'}`}>
              <th className="pb-3">Sport</th><th className="pb-3">Court</th><th className="pb-3">Day</th>
              <th className="pb-3">Time</th><th className="pb-3">Actions</th>
            </tr></thead>
            <tbody>
              {schedules.map(s => (
                <tr key={s.id} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <td className={`py-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{s.Sport?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{s.Court?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{s.day_of_week}</td>
                  <td className={`py-3 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{s.start_time} - {s.end_time}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Schedule">
        <div className="space-y-3">
          <select value={form.sport_id} onChange={e => setForm({...form, sport_id: e.target.value})}
            className={dark ? 'input-glass' : 'input-light'}>
            <option value="">Select Sport</option>
            {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.court_id} onChange={e => setForm({...form, court_id: e.target.value})}
            className={dark ? 'input-glass' : 'input-light'}>
            <option value="">Select Court</option>
            {courts.filter(c => !form.sport_id || c.sport_id == form.sport_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})}
            className={dark ? 'input-glass' : 'input-light'}>
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className={dark ? 'input-glass' : 'input-light'} />
            <input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} className={dark ? 'input-glass' : 'input-light'} />
          </div>
          <button onClick={handleAdd} className="w-full btn-primary">Create Schedule</button>
        </div>
      </Modal>
    </div>
  );
}

function ManagerNotifications() {
  const { dark } = useTheme();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ user_id: '', title: '', message: '', type: 'general' });

  useEffect(() => {
    fetch('/api/auth/users?role=client', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(setClients).catch(() => {});
  }, []);

  const handleSend = async () => {
    try {
      await notifAPI.send(form);
      toast.success('Notification sent!');
      setForm({ user_id: '', title: '', message: '', type: 'general' });
    } catch (err) { toast.error('Failed to send'); }
  };

  const handleBulk = async () => {
    try {
      await notifAPI.sendBulk({ title: form.title, message: form.message, type: form.type, role: 'client' });
      toast.success('Sent to all clients!');
    } catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Send Notification</h2>
      <GlassCard>
        <div className="space-y-3">
          <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})}
            className={dark ? 'input-glass' : 'input-light'}>
            <option value="">Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
          </select>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Title" className={dark ? 'input-glass' : 'input-light'} />
          <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
            placeholder="Message" rows={3} className={dark ? 'input-glass' : 'input-light'} />
          <div className="flex gap-3">
            <button onClick={handleSend} className="btn-primary flex items-center gap-2 flex-1"><FiSend /> Send</button>
            <button onClick={handleBulk} className="btn-glass flex items-center gap-2 flex-1"><FiUsers /> Send to All</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ManagerBookings() {
  const { dark } = useTheme();
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getAll().then(r => setBookingsList(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if(loading) return <LoadingSkeleton lines={6} />;

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>All Bookings</h2>
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={`text-left text-sm ${dark ? 'text-white/40' : 'text-gray-500'}`}>
              <th className="pb-3">Client</th><th className="pb-3">Sport</th><th className="pb-3">Court</th>
              <th className="pb-3">Date</th><th className="pb-3">Slot</th><th className="pb-3">Amount</th><th className="pb-3">Status</th>
            </tr></thead>
            <tbody>
              {bookingsList.map(b => (
                <tr key={b.id} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <td className={`py-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{b.client?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{b.Court?.Sport?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{b.Court?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{b.date}</td>
                  <td className={`py-3 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{b.time_slot}</td>
                  <td className={`py-3 font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>₹{b.total_amount}</td>
                  <td className="py-3"><Badge variant={b.status}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function ManagerAnalytics() {
  const { dark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.stats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if(loading) return <LoadingSkeleton lines={4} />;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee', '#10b981'];

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total Bookings" value={stats?.totalBookings || 0} color="primary" />
        <StatCard icon="✅" label="Confirmed" value={stats?.confirmedBookings || 0} color="green" />
        <StatCard icon="⏳" label="Pending" value={stats?.pendingBookings || 0} color="orange" />
        <StatCard icon="💰" label="Revenue" value={`₹${stats?.totalRevenue || 0}`} color="purple" />
      </div>
      <GlassCard>
        <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Booking Trends (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.dailyBookings || []}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'} />
            <XAxis dataKey="date" tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 11 }}
              tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
            <YAxis tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: dark ? '#1a1a3e' : '#fff', border: 'none', borderRadius: 12 }} />
            <Bar dataKey="count" fill="url(#grad2)" radius={[6,6,0,0]} />
            <defs><linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
            </linearGradient></defs>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}

export default function ManagerDashboard() {
  const { dark } = useTheme();
  const location = useLocation();
  const isRoot = location.pathname === '/manager';

  return (
    <div className={`min-h-screen pt-16 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="lg:ml-64 p-6">
        {isRoot ? <ManagerOverview /> : <Outlet />}
      </div>
    </div>
  );
}

export { ManagerSchedules, ManagerBookings, ManagerNotifications, ManagerAnalytics };
