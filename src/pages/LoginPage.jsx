import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const { dark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'manager' ? '/manager' : '/dashboard';
      navigate(dest);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-dark-900' : 'bg-gray-50'} px-4`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[20%] w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative w-full max-w-md rounded-3xl p-8 ${dark ? 'glass-dark neon-glow' : 'bg-white shadow-2xl'}`}
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🏟️</span>
          <h1 className={`text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
          <p className={`mt-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Email</label>
            <div className="relative mt-1">
              <FiMail className={`absolute left-4 top-3.5 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`${dark ? 'input-glass' : 'input-light'} pl-11`}
              />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${dark ? 'text-white/70' : 'text-gray-700'}`}>Password</label>
            <div className="relative mt-1">
              <FiLock className={`absolute left-4 top-3.5 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
              <input
                type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`${dark ? 'input-glass' : 'input-light'} pl-11`}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 !mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Sign In <FiArrowRight /></>
            )}
          </button>
        </form>

        <p className={`text-center mt-6 text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-400 font-medium hover:underline">Sign up</Link>
        </p>

        {/* Quick login hints */}
        <div className={`mt-6 p-4 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-xs font-medium mb-2 ${dark ? 'text-white/40' : 'text-gray-400'}`}>Demo Accounts (pw: password123)</p>
          <div className="space-y-1">
            {[
              { email: 'admin@sports.com', role: 'Admin' },
              { email: 'manager1@sports.com', role: 'Manager' },
              { email: 'client1@sports.com', role: 'Client' },
            ].map(acc => (
              <button key={acc.email}
                onClick={() => setForm({ email: acc.email, password: 'password123' })}
                className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${dark ? 'text-white/60 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="font-medium">{acc.role}:</span> {acc.email}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
