import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiShield, FiClock, FiStar, FiActivity } from 'react-icons/fi';
import { GlassCard, Button } from '../components/UI';

const sports = [
  { name: 'Pickleball', icon: '🎾', color: 'bg-surface-container-low' },
  { name: 'Football', icon: '⚽', color: 'bg-surface-container-low' },
  { name: 'Cricket', icon: '🏏', color: 'bg-surface-container-low' },
  { name: 'Badminton', icon: '🏸', color: 'bg-surface-container-low' },
];

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/hero-bg.png')` }}
        >
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-surface/90"></div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none z-10">
           <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-20">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 shadow-sm mb-10 backdrop-blur-md"
           >
             <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Premium Sports Academy</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="text-6xl md:text-8xl font-black text-white font-headline tracking-tighter leading-[0.9] mb-8"
           >
             Pro<br/>
             <span className="text-secondary italic">Academy</span>
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="max-w-2xl mx-auto text-xl text-white/80 font-medium leading-relaxed mb-12"
           >
             Book world-class sports facilities with ease. Professional-grade grounds, 
             seamless scheduling, and expert coaching at your fingertips.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-6"
           >
             {isAuthenticated ? (
               <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'manager' ? '/manager' : '/dashboard'}>
                 <Button variant="primary" className="px-12 py-5 text-lg rounded-2xl shadow-2xl shadow-primary/20">
                    Go to Dashboard <FiArrowRight className="ml-2" />
                 </Button>
               </Link>
             ) : (
               <>
                 <Link to="/signup">
                   <Button variant="primary" className="px-12 py-5 text-lg rounded-2xl shadow-2xl shadow-primary/20">
                      Get Started <FiArrowRight className="ml-2" />
                   </Button>
                 </Link>
                 <Link to="/login">
                   <Button variant="outline" className="px-12 py-5 text-lg rounded-2xl">
                      Staff Login
                   </Button>
                 </Link>
               </>
             )}
           </motion.div>

           {/* Hero Stats */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
           >
             {[
                { label: 'Total Courts', value: '8' },
               { label: 'Expert Coaches', value: '42' },
               { label: 'Happy Athletes', value: '500+' },
               { label: 'Booking Status', value: 'Live' }
             ].map((stat, i) => (
               <div key={i} className="text-center">
                 <p className="text-3xl font-black text-primary font-headline tracking-tighter">{stat.value}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">{stat.label}</p>
               </div>
             ))}
           </motion.div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-32 bg-surface-container-lowest">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
               <div className="max-w-xl">
                  <h2 className="text-4xl font-black text-primary font-headline tracking-tighter leading-none mb-6">Explore Our <br/>Facilities</h2>
                  <p className="text-on-surface-variant font-medium">Top-tier venues for every sport. Quality and performance guaranteed for every session.</p>
               </div>
               <Link to="/signup">
                 <span className="text-secondary font-black uppercase tracking-widest text-xs flex items-center gap-2 group cursor-pointer">
                    View All Facilities <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </span>
               </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {sports.map((sport, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`p-8 rounded-[32px] ${sport.color} border border-outline-variant/10 shadow-sm transition-all hover-gold hover:shadow-xl cursor-pointer group`}
                  >
                     <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl mb-8">
                        {sport.icon}
                     </div>
                     <h3 className="text-2xl font-black text-primary font-headline tracking-tight mb-2">{sport.name}</h3>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Trust & Features */}
      <section className="py-32">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
               <GlassCard hover={true} className="p-10 border border-outline-variant/10 bg-surface-container-low hover-gold">
                  <FiShield className="text-secondary mb-6" size={40} />
                  <h3 className="text-2xl font-black text-primary font-headline tracking-tight mb-4">Secure Payments</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">Safe and transparent billing for all your bookings and memberships.</p>
               </GlassCard>
               <GlassCard hover={true} className="p-10 border border-outline-variant/10 bg-surface-container-low hover-gold">
                  <FiClock className="text-secondary mb-6" size={40} />
                  <h3 className="text-2xl font-black text-primary font-headline tracking-tight mb-4">Instant Booking</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">Check availability and book your favorite courts in real-time.</p>
               </GlassCard>
               <GlassCard hover={true} className="p-10 border border-outline-variant/10 bg-surface-container-low hover-gold">
                  <FiActivity className="text-secondary mb-6" size={40} />
                  <h3 className="text-2xl font-black text-primary font-headline tracking-tight mb-4">Track Progress</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">Keep a detailed log of your sessions and athletic improvements.</p>
               </GlassCard>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-outline-variant/10">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">P</div>
               <span className="text-xl font-black text-primary font-headline tracking-tight">ProAcademy</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
               © 2026 ProAcademy • Established 1998
            </p>
         </div>
      </footer>
    </div>
  );
}
