import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sports as sportsAPI, courts as courtsAPI, equipment as equipAPI, bookings as bookingsAPI, auth as authAPI } from '../api';
import { GlassCard, StatCard, Badge, Modal, Button, Input } from '../components/UI';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet, useLocation, Link, useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiSearch, FiShield, FiTrendingUp, FiArrowRight, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

function AdminOverview() {
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

  const [showCert, setShowCert] = useState(false);
  const [showDraft, setShowDraft] = useState(false);

  const handleSendAnnouncement = () => {
    toast.success('Protocol Synchronized with Faculty');
    setShowDraft(false);
  };

  if (loading) return <div className="p-8 text-center text-primary font-bold">Initializing Admin Terminal...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Stats Bento */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 premium-gradient rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-primary/20 min-h-[240px]">
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-black">Total Annual Revenue</span>
            <h2 className="text-5xl font-black text-white mt-4 font-headline tracking-tighter">
              ₹{(stats?.totalRevenue || 0).toLocaleString()}
            </h2>
          </div>
          <div className="mt-8 flex items-end justify-between relative z-10">
            <div className="flex gap-2 items-center text-secondary">
              <FiTrendingUp size={24} />
              <span className="font-bold text-lg">+14.2%</span>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Next Projection</p>
              <p className="text-white font-bold">Month End</p>
            </div>
          </div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between relative shadow-sm">
          <div className="absolute top-0 left-0 w-full h-[4px] gold-accent-gradient"></div>
          <div>
            <span className="text-secondary font-bold text-[10px] uppercase tracking-widest">Active Enrollment</span>
            <div className="flex items-baseline gap-2 mt-4">
              <h3 className="text-4xl font-black text-primary tracking-tighter">{counts.users}</h3>
              <span className="text-on-surface-variant text-sm font-medium">Athletes</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-medium">Capacity</span>
              <span className="text-primary font-black">92%</span>
            </div>
            <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full gold-accent-gradient w-[92%]"></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container-highest rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 border border-secondary/20">
              <FiShield className="text-secondary text-3xl" />
           </div>
           <h4 className="text-primary font-black text-2xl font-headline tracking-tighter">Elite Status</h4>
           <p className="text-on-surface-variant text-sm mt-2 font-medium">Top 5% of Global Academies</p>
           <button 
             onClick={() => setShowCert(true)}
             className="mt-6 text-secondary font-bold text-[10px] uppercase tracking-widest border-b-2 border-secondary/20 hover:border-secondary transition-all"
           >
              View Certifications
           </button>
        </div>
      </section>

      <Modal isOpen={showCert} onClose={() => setShowCert(false)} title="Academy Certification">
         <div className="p-4">
            <img 
              src="/prostar_academy_certificate_1776756327573.png" 
              alt="ProStar Academy Certificate" 
              className="w-full rounded-2xl shadow-2xl border-4 border-secondary/20"
            />
            <p className="mt-6 text-center text-on-surface-variant text-sm font-medium">
               Official Elite Status certification verified by Global Sports Council.
            </p>
         </div>
      </Modal>

      <Modal isOpen={showDraft} onClose={() => setShowDraft(false)} title="Compose Institutional Protocol">
         <div className="p-6 space-y-6">
            <div>
               <label className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2 block">Protocol Subject</label>
               <input 
                 type="text" 
                 placeholder="Enter subject..."
                 className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl p-4 text-sm font-bold text-primary focus:border-secondary outline-none transition-all"
               />
            </div>
            <div>
               <label className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2 block">Directive Content</label>
               <textarea 
                 rows="5"
                 placeholder="Enter the official academy directive..."
                 className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl p-4 text-sm font-medium text-primary focus:border-secondary outline-none transition-all resize-none"
               ></textarea>
            </div>
            <button 
              onClick={handleSendAnnouncement}
              className="w-full gold-accent-gradient text-primary font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
            >
               Broadcast to All Faculty
            </button>
         </div>
      </Modal>

      {/* System Roles */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-primary tracking-tighter font-headline">System Roles</h2>
            <p className="text-on-surface-variant mt-1 text-sm font-medium">Manage access control and elite permissions</p>
          </div>
          <Link to="/admin/managers" className="text-secondary font-bold text-sm hover:underline tracking-tight">
            Manage All Roles
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { title: 'Director', desc: 'Full administrative control over faculty and finances.', icon: FiShield, count: 2, path: '/admin/managers?filter=director' },
             { title: 'Instructors', desc: 'Access to curriculum and student performance.', icon: FiUsers, count: 12, path: '/admin/managers?filter=instructor' },
             { title: 'Medical', desc: 'Sensitive medical records and recovery protocols.', icon: FiShield, count: 3, path: '/admin/managers?filter=medical' },
             { title: 'Clients', desc: 'Access to booking and personal performance.', icon: FiUsers, count: counts.users - 17, path: '/admin/managers?filter=client' }
           ].map((role, i) => (
             <Link key={i} to={role.path}>
               <GlassCard hover className="group border border-transparent hover:border-secondary/20 p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                     <role.icon size={24} />
                  </div>
                  <h3 className="font-black text-primary text-lg font-headline tracking-tight">{role.title}</h3>
                  <p className="text-on-surface-variant text-xs mt-2 leading-relaxed font-medium">{role.desc}</p>
                  <div className="mt-6 flex justify-between items-center">
                     <div className="w-8 h-8 rounded-full bg-surface-container text-[10px] font-black flex items-center justify-center border-2 border-surface text-primary">
                        +{role.count}
                     </div>
                     <FiArrowRight className="text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" />
                  </div>
               </GlassCard>
             </Link>
           ))}
        </div>
      </section>

      {/* Performance Overview */}
      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="p-8 border-b border-surface-container">
            <h3 className="text-xl font-black text-primary font-headline tracking-tighter">Performance Analysis</h3>
          </div>
          <div className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.dailyBookings || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#00353a', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fill: '#00353a', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#D4AF37" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#D4AF37', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, fill: '#00353a', stroke: '#D4AF37', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="premium-gradient p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-primary/20">
             <div className="relative z-10">
                <h3 className="text-2xl font-black font-headline tracking-tighter mb-4">Institutional Protocol</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  The upcoming Elite Selection process begins tomorrow. Ensure all candidate biometric logs are synchronized.
                </p>
                <button 
                  onClick={() => setShowDraft(true)}
                  className="w-full py-4 bg-secondary text-primary font-black rounded-xl text-sm hover:bg-white transition-all shadow-xl"
                >
                  Draft Announcement
                </button>
             </div>
             <div className="absolute -right-8 -bottom-8 opacity-10">
                <FiShield size={160} />
             </div>
          </div>

          <div className="p-8 border border-outline-variant/30 rounded-3xl bg-surface-container-low shadow-sm">
             <h3 className="font-black text-primary font-headline tracking-tight mb-6">Security Node Status</h3>
             <div className="space-y-6">
                <div className="flex gap-4 items-start">
                   <div className="p-2 bg-secondary/10 rounded-lg">
                      <FiShield size={16} className="text-secondary" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-primary">Biometric Sync Complete</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">2m ago • Node-7</p>
                   </div>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="p-2 bg-primary/10 rounded-lg">
                      <FiPlus size={16} className="text-primary" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-primary">New API Access Initialized</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">14m ago • System</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CrudPanel({ title, fetchFn, createFn, updateFn, deleteFn, fields, renderExtra }) {
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
        toast.success('Protocol Updated');
      } else {
        await createFn(form);
        toast.success('New Entry Initialized');
      }
      setShowAdd(false);
      setEditItem(null);
      setForm({});
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Proceed with record deletion?')) return;
    try {
      await deleteFn(id);
      toast.success('Record Purged');
      load();
    } catch (err) { toast.error('Access Denied'); }
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

  if (loading) return <div className="p-8 text-center text-primary font-bold">Accessing Records...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">{title}</h2>
           <p className="text-on-surface-variant text-sm font-medium mt-1">Manage institutional assets and definitions</p>
        </div>
        <Button onClick={startAdd} variant="primary">
           <FiPlus /> New Record
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <GlassCard key={item.id} hover className="flex flex-col border border-outline-variant/10">
            <div className="flex items-start justify-between flex-1">
              <div>
                {fields.filter(f => f.display).map(f => (
                  <div key={f.key} className="mb-2">
                    {f.primary ? (
                      <p className="font-black text-xl text-primary font-headline tracking-tight">
                        {f.render ? f.render(item[f.key], item) : item[f.key]}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                        {f.label && <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">{f.label}:</span>}
                        {f.render ? f.render(item[f.key], item) : item[f.key]}
                      </p>
                    )}
                  </div>
                ))}
                {renderExtra && renderExtra(item)}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => startEdit(item)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditItem(null); }} title={editItem ? `Update ${title}` : `Initialize ${title}`}>
        <div className="space-y-6">
          {fields.filter(f => f.editable !== false).map(f => (
            <div key={f.key}>
              <Input 
                 label={f.label || f.key}
                 type={f.type || 'text'}
                 value={form[f.key] || ''}
                 onChange={e => setForm({...form, [f.key]: e.target.value})}
                 placeholder={f.placeholder || ''}
              />
            </div>
          ))}
          <Button onClick={handleSave} variant="primary" className="w-full">
            <FiSave /> {editItem ? 'Confirm Update' : 'Initialize Record'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function AdminSports() {
  return <CrudPanel
    title="Curriculum"
    fetchFn={sportsAPI.getAll}
    createFn={sportsAPI.create}
    updateFn={sportsAPI.update}
    deleteFn={sportsAPI.remove}
    fields={[
      { key: 'name', label: 'Discipline', display: true, primary: true },
      { key: 'icon', label: 'Identifier', display: true },
      { key: 'description', label: 'Scope', display: true },
    ]}
  />;
}

function AdminCourts() {
  const [sports, setSports] = useState([]);
  useEffect(() => { sportsAPI.getAll().then(r => setSports(r.data)); }, []);

  return <CrudPanel
    title="Facilities"
    fetchFn={courtsAPI.getAll}
    createFn={courtsAPI.create}
    updateFn={courtsAPI.update}
    deleteFn={courtsAPI.remove}
    fields={[
      { key: 'name', label: 'Complex Unit', display: true, primary: true },
      { key: 'sport_id', label: 'Discipline', type: 'select', options: sports.map(s => ({ value: s.id, label: s.name })), display: false },
      { key: 'location', label: 'Zone', display: true },
      { key: 'price_per_hour', label: 'Rate', type: 'number', display: true, render: (v) => `₹${v}/hr` },
    ]}
  />;
}

function AdminEquipment() {
  const [sports, setSports] = useState([]);
  useEffect(() => { sportsAPI.getAll().then(r => setSports(r.data)); }, []);

  return <CrudPanel
    title="Assets"
    fetchFn={equipAPI.getAll}
    createFn={equipAPI.create}
    updateFn={equipAPI.update}
    deleteFn={equipAPI.remove}
    fields={[
      { key: 'name', label: 'Hardware', display: true, primary: true },
      { key: 'sport_id', label: 'Discipline', type: 'select', options: sports.map(s => ({ value: s.id, label: s.name })), display: false },
      { key: 'price', label: 'Valuation', type: 'number', display: true, render: (v) => `₹${v}` },
      { key: 'available_quantity', label: 'Stock', type: 'number', display: true, default: '10' },
    ]}
  />;
}

function AdminManagers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  useEffect(() => {
    authAPI.users().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-primary font-bold">Accessing Faculty Records...</div>;

  const managers = users.filter(u => u.role === 'manager');
  const clients = users.filter(u => u.role === 'client');

  if (filter === 'director') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-3xl font-black text-primary font-headline tracking-tighter text-center italic">Directorate Protocols</h2>
        <div className="grid md:grid-cols-2 gap-8">
           <GlassCard className="p-8 border border-secondary/20 bg-primary/5">
              <h3 className="text-xl font-black text-primary font-headline mb-4 flex items-center gap-2">
                 <FiShield className="text-secondary" /> Administrative Nodes
              </h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                 All faculty nodes are currently synchronized with the central directive. 
                 System integrity at 99.8%.
              </p>
           </GlassCard>
           <GlassCard className="p-8 border border-secondary/20 bg-primary/5">
              <h3 className="text-xl font-black text-primary font-headline mb-4 flex items-center gap-2">
                 <FiTrendingUp className="text-secondary" /> Financial Logbook
              </h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                 Quarterly growth exceeds projections by 12.4%. All transactions are encrypted.
              </p>
           </GlassCard>
        </div>
      </div>
    );
  }

  if (filter === 'medical') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-3xl font-black text-primary font-headline tracking-tighter text-center italic">Recovery & Biometrics</h2>
        <GlassCard className="p-10 border border-secondary/20 bg-surface-container-low text-center">
           <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <FiPlus className="text-secondary text-4xl" />
           </div>
           <h3 className="text-2xl font-black text-primary font-headline mb-4">No Active Trauma Records</h3>
           <p className="text-on-surface-variant font-medium max-w-md mx-auto">
              All athletes are currently within optimal biometric parameters. No recovery protocols active.
           </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section>
         <h2 className="text-3xl font-black text-primary font-headline tracking-tighter mb-8 text-center">Faculty & Personnel</h2>
         <div className="grid sm:grid-cols-2 gap-8">
            {(!filter || filter === 'instructor') && (
              <GlassCard className="border border-outline-variant/10">
                 <h3 className="font-black text-primary text-xl font-headline tracking-tighter mb-6 flex items-center gap-3">
                    <FiShield className="text-secondary" /> Senior Instructors ({managers.length})
                 </h3>
                 <div className="space-y-4">
                    {managers.map(u => (
                      <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                         <div className="w-12 h-12 rounded-full gold-accent-gradient flex items-center justify-center text-primary font-bold shadow-lg">
                            {u.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-primary">{u.name}</p>
                            <p className="text-[10px] text-secondary font-black uppercase tracking-widest">Instructor Status • Verified</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </GlassCard>
            )}
            {(!filter || filter === 'client') && (
              <GlassCard className="border border-outline-variant/10">
                 <h3 className="font-black text-primary text-xl font-headline tracking-tighter mb-6 flex items-center gap-3">
                    <FiSearch className="text-secondary" /> Active Athletes ({clients.length})
                 </h3>
                 <div className="space-y-4">
                    {clients.map(u => (
                      <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                         <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold">
                            {u.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-primary">{u.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{u.email}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </GlassCard>
            )}
         </div>
      </section>
    </div>
  );
}

function AdminBookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getAll().then(r => setBookingsList(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if(loading) return <div className="p-8 text-center text-primary font-bold">Syncing Logbook...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
       <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">Engagement Records</h2>
       <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Transaction</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Entity</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Discipline</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Rate</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {bookingsList.map(b => (
                  <tr key={b.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-6">
                       <p className="font-bold text-primary text-sm">#TX-{b.id}</p>
                       <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{b.date}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-primary">{b.client?.name}</td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-primary">{b.Court?.Sport?.name}</p>
                       <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{b.Court?.name}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-primary">₹{b.total_amount}</td>
                    <td className="px-8 py-6"><Badge variant={b.status}>{b.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );
}

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { bookingsAPI.stats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if(loading) return <div className="p-8 text-center text-primary font-bold">Processing Neural Data...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-primary font-headline tracking-tighter">Strategic Intelligence</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FiTrendingUp} title="Total Bookings" value={stats?.totalBookings || 0} />
        <StatCard icon={FiSearch} title="Today's Sessions" value={stats?.todayBookings || 0} variant="gold" />
        <StatCard icon={FiShield} title="Confirmed Paid" value={stats?.confirmedBookings || 0} />
        <StatCard icon={FiTrendingUp} title="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} variant="gold" />
      </div>
      <GlassCard className="p-10 border border-outline-variant/10">
        <h3 className="text-xl font-black text-primary font-headline tracking-tighter mb-8">Discipline Distribution</h3>
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

export default function AdminDashboard() {
  const location = useLocation();
  const isRoot = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-10 lg:ml-72 pt-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
             {isRoot ? <AdminOverview /> : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export { AdminSports, AdminCourts, AdminEquipment, AdminManagers, AdminBookings, AdminAnalytics };
