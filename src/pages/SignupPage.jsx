import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';

export default function SignupPage() {
  const { dark } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(form);
      toast.success('Account created successfully!');
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'manager' ? '/manager' : '/dashboard';
      navigate(dest);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = dark ? 'input-glass' : 'input-light';

  return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-dark-900' : 'bg-gray-50'} px-4 py-20`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-[20%] w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative w-full max-w-md rounded-3xl p-8 ${dark ? 'glass-dark neon-glow' : 'bg-white shadow-2xl'}`}
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🏟️</span>
          <h1 className={`text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`mt-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>Join ProStar Sports Academy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Full Name</label>
            <div className="relative mt-1">
              <FiUser className={`absolute left-4 top-3.5 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe" className={`${inputClass} pl-11`} />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Email</label>
            <div className="relative mt-1">
              <FiMail className={`absolute left-4 top-3.5 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className={`${inputClass} pl-11`} />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Phone</label>
            <div className="relative mt-1">
              <FiPhone className={`absolute left-4 top-3.5 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210" className={`${inputClass} pl-11`} />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Password</label>
            <div className="relative mt-1">
              <FiLock className={`absolute left-4 top-3.5 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters" className={`${inputClass} pl-11`} />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Role</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {['client', 'manager', 'admin'].map(role => (
                <button key={role} type="button"
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    form.role === role
                      ? 'gradient-primary text-white shadow-lg'
                      : dark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setForm({ ...form, role })}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 !mt-6">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Create Account <FiArrowRight /></>
            )}
          </button>
        </form>

        <p className={`text-center mt-6 text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
