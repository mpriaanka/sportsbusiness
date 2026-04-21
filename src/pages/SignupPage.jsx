import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiShield } from 'react-icons/fi';
import { GlassCard, Button, Input } from '../components/UI';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(form);
      toast.success('Registration successful!');
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'manager' ? '/manager' : '/dashboard';
      navigate(dest);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl z-10"
      >
        <GlassCard className="p-12 border border-outline-variant/10 shadow-2xl bg-surface-container-low">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 gold-accent-gradient rounded-3xl shadow-xl shadow-secondary/20 mb-8">
               <FiShield className="text-primary" size={36} />
            </div>
            <h1 className="text-4xl font-black text-primary font-headline tracking-tighter mb-2">Create Account</h1>
            <p className="text-on-surface-variant font-medium text-sm tracking-wide">Join the ProStar Sports Academy today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                  label="Full Name"
                  required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" icon={FiUser}
               />
               <Input 
                  label="Phone Number"
                  type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210" icon={FiPhone}
               />
            </div>

            <Input 
               label="Email Address"
               type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
               placeholder="your@email.com" icon={FiMail}
            />

            <Input 
               label="Password"
               type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
               placeholder="••••••••" icon={FiLock}
            />


            <Button type="submit" disabled={loading} variant="primary" className="w-full py-5 text-lg shadow-xl shadow-primary/20 mt-6">
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                <>Sign Up Now</>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-outline-variant/10 text-center">
             <p className="text-on-surface-variant text-sm font-medium">
               Already have an account?{' '}
               <Link to="/login" className="text-secondary font-black hover:underline tracking-tight">Login</Link>
             </p>
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
