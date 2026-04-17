import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';
import { GlassCard, Button, Input } from '../components/UI';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}`);
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'manager' ? '/manager' : '/dashboard';
      navigate(dest);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
         <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <GlassCard className="p-12 border border-outline-variant/10 shadow-2xl bg-surface-container-low">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 gold-accent-gradient rounded-3xl shadow-xl shadow-secondary/20 mb-8">
               <FiShield className="text-primary" size={36} />
            </div>
            <h1 className="text-4xl font-black text-primary font-headline tracking-tighter mb-2">Member Login</h1>
            <p className="text-on-surface-variant font-medium text-sm tracking-wide">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input 
               label="Email Address"
               type="email" required value={form.email}
               onChange={e => setForm({ ...form, email: e.target.value })}
               placeholder="your@email.com"
               icon={FiMail}
            />

            <Input 
               label="Password"
               type="password" required value={form.password}
               onChange={e => setForm({ ...form, password: e.target.value })}
               placeholder="••••••••"
               icon={FiLock}
            />

            <Button
              type="submit" disabled={loading}
              variant="primary"
              className="w-full py-5 text-lg shadow-xl shadow-primary/20 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                <>Login Now <FiArrowRight className="ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-outline-variant/10 text-center">
             <p className="text-on-surface-variant text-sm font-medium">
               New here?{' '}
               <Link to="/signup" className="text-secondary font-black hover:underline tracking-tight">Create Account</Link>
             </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/5">
             <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-4">Demo Credentials</p>
             <div className="grid grid-cols-1 gap-3">
               {[
                 { email: 'admin@sports.com', role: 'Admin' },
                 { email: 'manager1@sports.com', role: 'Manager' },
                 { email: 'client1@sports.com', role: 'Athlete' },
               ].map(acc => (
                 <button key={acc.email}
                   type="button"
                   onClick={() => setForm({ email: acc.email, password: 'password123' })}
                   className="flex items-center justify-between px-4 py-2 rounded-xl hover:bg-surface-container-low transition-colors group"
                 >
                   <span className="text-[10px] font-black text-primary group-hover:text-secondary transition-colors">{acc.role} Login</span>
                   <span className="text-xs font-bold text-on-surface-variant">{acc.email}</span>
                 </button>
               ))}
             </div>
          </div>
        </GlassCard>
        
        <div className="mt-8 text-center">
           <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">
              Back to Home
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
