import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = false, onClick, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={hover ? { y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
    onClick={onClick}
    className={`glass-card rounded-3xl p-8 shadow-sm transition-all duration-300 ${hover ? 'cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const StatCard = ({ title, value, icon: Icon, trend, variant = 'primary' }) => {
  const isGold = variant === 'gold' || variant === 'secondary';
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl p-6 relative overflow-hidden shadow-xl ${isGold ? 'gold-accent-gradient text-primary' : 'premium-gradient text-white'}`}
    >
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isGold ? 'text-primary/60' : 'text-secondary'}`}>
            {title}
          </p>
          <h3 className="text-3xl font-black font-headline tracking-tighter">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl backdrop-blur-md ${isGold ? 'bg-primary/10' : 'bg-white/20'}`}>
          <Icon size={24} className={isGold ? 'text-primary' : 'text-white'} />
        </div>
      </div>
      {trend && (
        <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <span className={`px-2 py-1 rounded-md backdrop-blur-md ${isGold ? 'bg-primary/10' : 'bg-white/20'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="opacity-80">vs last cycle</span>
        </div>
      )}
    </motion.div>
  );
};

export const Badge = ({ children, variant = 'success' }) => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    primary: 'bg-secondary-container text-on-secondary-container border-secondary/20',
    gold: 'bg-secondary-container text-on-secondary-container border-secondary/20',
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${variants[variant] || variants.primary}`}>
      {children}
    </span>
  );
};

export const Input = ({ label, icon: Icon, error, ...props }) => (
  <div className="mb-4 group">
    {label && (
      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">
        {label}
      </label>
    )}
    <div className="relative flex items-center">
      {Icon && (
        <div className="absolute left-3 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-4 bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all font-body text-on-surface placeholder:text-on-surface-variant/30 ${error ? 'border-error' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="mt-1.5 text-xs text-error font-medium">{error}</p>}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl p-8 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black font-headline tracking-tighter text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-surface-container rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'btn-premium',
    gold: 'btn-gold',
    outline: 'border border-outline-variant/30 hover:border-primary text-on-surface-variant hover:text-primary',
  };
  
  return (
    <button className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};
