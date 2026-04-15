import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { sports as sportsAPI, courts as courtsAPI, equipment as equipAPI, bookings as bookingsAPI, auth as authAPI } from '../api';
import { GlassCard, StatCard, Badge, EmptyState, LoadingSkeleton, Modal } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

function AdminOverview() {
  const { dark } = useTheme();
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState({ sports: 0, courts: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingsAPI.stats(),
      sportsAPI.getAll(),
      courtsAPI.getAll(),
      authAPI.users()
    ]).then(([sRes, spRes, cRes, uRes]) => {
      setStats(sRes.data);
      setCounts({ sports: spRes.data.length, courts: cRes.data.length, users: uRes.data.length });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton lines={6} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🏆" label="Sports" value={counts.sports} color="primary" />
        <StatCard icon="🏟️" label="Courts" value={counts.courts} color="purple" />
        <StatCard icon="👥" label="Users" value={counts.users} color="cyan" />
        <StatCard icon="💰" label="Revenue" value={`₹${stats?.totalRevenue || 0}`} color="green" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Booking Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.dailyBookings || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'} />
              <XAxis dataKey="date" tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 11 }}
                tickFormatter={v => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
              <YAxis tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: dark ? '#1a1a3e' : '#fff', border: 'none', borderRadius: 12 }} />
              <Bar dataKey="count" fill="url(#aGrad)" radius={[6,6,0,0]} />
              <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
              </linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Sports Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats?.sportBookings || []} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
                {(stats?.sportBookings || []).map((_, i) => (
                  <Cell key={i} fill={['#6366f1','#a855f7','#ec4899','#22d3ee','#10b981'][i % 5]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: dark ? '#1a1a3e' : '#fff', border: 'none', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}

function CrudPanel({ title, fetchFn, createFn, updateFn, deleteFn, fields, renderExtra }) {
  const { dark } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => { load(); }, []);

  const load = () => {
    fetchFn().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await updateFn(editItem.id, form);
        toast.success('Updated');
      } else {
        await createFn(form);
        toast.success('Created');
      }
      setShowAdd(false);
      setEditItem(null);
      setForm({});
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await deleteFn(id);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const startEdit = (item) => {
    setEditItem(item);
    const f = {};
    fields.forEach(fd => { f[fd.key] = item[fd.key] || ''; });
    setForm(f);
    setShowAdd(true);
  };

  const startAdd = () => {
    setEditItem(null);
    const f = {};
    fields.forEach(fd => { f[fd.key] = fd.default || ''; });
    setForm(f);
    setShowAdd(true);
  };

  if (loading) return <LoadingSkeleton lines={4} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <GlassCard key={item.id}>
            <div className="flex items-start justify-between">
              <div>
                {fields.filter(f => f.display).map(f => (
                  <p key={f.key} className={`${f.primary ? `font-semibold text-lg ${dark ? 'text-white' : 'text-gray-900'}` : `text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}`}>
                    {f.label && <span className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>{f.label}: </span>}
                    {f.render ? f.render(item[f.key], item) : item[f.key]}
                  </p>
                ))}
                {renderExtra && renderExtra(item)}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(item)} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-gray-100 text-gray-400'}`}><FiEdit size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><FiTrash2 size={14} /></button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {items.length === 0 && <EmptyState icon="📦" title={`No ${title.toLowerCase()}`} message="Click Add to create one" />}

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditItem(null); }} title={editItem ? `Edit ${title}` : `Add ${title}`}>
        <div className="space-y-3">
          {fields.filter(f => f.editable !== false).map(f => (
            <div key={f.key}>
              <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>{f.label || f.key}</label>
              {f.type === 'select' ? (
                <select value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  className={`mt-1 ${dark ? 'input-glass' : 'input-light'}`}>
                  <option value="">Select...</option>
                  {(f.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder || ''} className={`mt-1 ${dark ? 'input-glass' : 'input-light'}`} />
              )}
            </div>
          ))}
          <button onClick={handleSave} className="w-full btn-primary flex items-center justify-center gap-2">
            <FiSave /> {editItem ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function AdminSports() {
  return <CrudPanel
    title="Sports"
    fetchFn={sportsAPI.getAll}
    createFn={sportsAPI.create}
    updateFn={sportsAPI.update}
    deleteFn={sportsAPI.remove}
    fields={[
      { key: 'name', label: 'Name', display: true, primary: true },
      { key: 'icon', label: 'Icon', display: true },
      { key: 'description', label: 'Description', display: true },
    ]}
    renderExtra={(item) => (
      <p className="text-xs text-primary-400 mt-2">{item.Courts?.length || 0} courts • {item.Equipment?.length || 0} equipment</p>
    )}
  />;
}

function AdminCourts() {
  const [sports, setSports] = useState([]);
  useEffect(() => { sportsAPI.getAll().then(r => setSports(r.data)); }, []);

  return <CrudPanel
    title="Courts"
    fetchFn={courtsAPI.getAll}
    createFn={courtsAPI.create}
    updateFn={courtsAPI.update}
    deleteFn={courtsAPI.remove}
    fields={[
      { key: 'name', label: 'Name', display: true, primary: true },
      { key: 'sport_id', label: 'Sport', type: 'select', options: sports.map(s => ({ value: s.id, label: s.name })), display: false },
      { key: 'location', label: 'Location', display: true },
      { key: 'price_per_hour', label: 'Price/Hour', type: 'number', display: true, render: (v) => `₹${v}/hr` },
    ]}
  />;
}

function AdminEquipment() {
  const [sports, setSports] = useState([]);
  useEffect(() => { sportsAPI.getAll().then(r => setSports(r.data)); }, []);

  return <CrudPanel
    title="Equipment"
    fetchFn={equipAPI.getAll}
    createFn={equipAPI.create}
    updateFn={equipAPI.update}
    deleteFn={equipAPI.remove}
    fields={[
      { key: 'name', label: 'Name', display: true, primary: true },
      { key: 'sport_id', label: 'Sport', type: 'select', options: sports.map(s => ({ value: s.id, label: s.name })), display: false },
      { key: 'price', label: 'Price', type: 'number', display: true, render: (v) => `₹${v}` },
      { key: 'description', label: 'Description', display: true },
      { key: 'available_quantity', label: 'Quantity', type: 'number', display: true, default: '10' },
    ]}
  />;
}

function AdminManagers() {
  const { dark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.users().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton lines={4} />;

  const managers = users.filter(u => u.role === 'manager');
  const clients = users.filter(u => u.role === 'client');

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Users & Managers</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Managers ({managers.length})</h3>
          <div className="space-y-2">
            {managers.map(u => (
              <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{u.name}</p>
                  <p className={`text-xs ${dark ? 'text-white/50' : 'text-gray-500'}`}>{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Clients ({clients.length})</h3>
          <div className="space-y-2">
            {clients.map(u => (
              <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{u.name}</p>
                  <p className={`text-xs ${dark ? 'text-white/50' : 'text-gray-500'}`}>{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function AdminBookings() {
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
              <th className="pb-3">ID</th><th className="pb-3">Client</th><th className="pb-3">Sport</th>
              <th className="pb-3">Court</th><th className="pb-3">Date</th><th className="pb-3">Amount</th><th className="pb-3">Status</th>
            </tr></thead>
            <tbody>
              {bookingsList.map(b => (
                <tr key={b.id} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <td className={`py-3 ${dark ? 'text-white/50' : 'text-gray-400'}`}>#{b.id}</td>
                  <td className={`py-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{b.client?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{b.Court?.Sport?.icon} {b.Court?.Sport?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/70' : 'text-gray-600'}`}>{b.Court?.name}</td>
                  <td className={`py-3 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{b.date} {b.time_slot}</td>
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

function AdminAnalytics() {
  const { dark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { bookingsAPI.stats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if(loading) return <LoadingSkeleton lines={4} />;

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Academy Analytics</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total Bookings" value={stats?.totalBookings || 0} color="primary" />
        <StatCard icon="📌" label="Today" value={stats?.todayBookings || 0} color="cyan" />
        <StatCard icon="✅" label="Confirmed" value={stats?.confirmedBookings || 0} color="green" />
        <StatCard icon="💰" label="Revenue" value={`₹${stats?.totalRevenue || 0}`} color="purple" />
      </div>
      <GlassCard>
        <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>7-Day Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.dailyBookings || []}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'} />
            <XAxis dataKey="date" tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 11 }}
              tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
            <YAxis tick={{ fill: dark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: dark ? '#1a1a3e' : '#fff', border: 'none', borderRadius: 12 }} />
            <Bar dataKey="count" fill="url(#admGrad)" radius={[6,6,0,0]} />
            <defs><linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#ec4899" />
            </linearGradient></defs>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}

export default function AdminDashboard() {
  const { dark } = useTheme();
  const location = useLocation();
  const isRoot = location.pathname === '/admin';

  return (
    <div className={`min-h-screen pt-16 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="lg:ml-64 p-6">
        {isRoot ? <AdminOverview /> : <Outlet />}
      </div>
    </div>
  );
}

export { AdminSports, AdminCourts, AdminEquipment, AdminManagers, AdminBookings, AdminAnalytics };
