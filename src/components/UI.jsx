import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function GlassCard({ children, className = '', hover = false, onClick, ...props }) {
  const { dark } = useTheme();
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`rounded-2xl p-6 ${dark ? 'glass neon-glow' : 'bg-white shadow-lg border border-gray-100'} ${hover ? 'cursor-pointer' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ icon, label, value, color = 'primary', trend }) {
  const { dark } = useTheme();
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };
  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>{label}</p>
          <p className={`text-3xl font-bold mt-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {trend && <p className="text-xs text-green-400 mt-1">↑ {trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}

export function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded-lg w-3/4"></div>
            <div className="h-3 bg-white/10 rounded-lg w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, message }) {
  const { dark } = useTheme();
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`mt-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{message}</p>
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    primary: 'bg-primary-100 text-primary-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    Completed: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  const { dark } = useTheme();
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-lg rounded-2xl p-6 ${dark ? 'glass-dark' : 'bg-white'} shadow-2xl max-h-[80vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={onClose} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>✕</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
