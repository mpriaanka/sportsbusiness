import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiZap, FiShield, FiClock, FiStar } from 'react-icons/fi';

const sports = [
  { name: 'Football', icon: '⚽', color: 'from-green-400 to-emerald-600' },
  { name: 'Cricket', icon: '🏏', color: 'from-orange-400 to-red-500' },
  { name: 'Tennis', icon: '🎾', color: 'from-yellow-400 to-amber-500' },
  { name: 'Badminton', icon: '🏸', color: 'from-blue-400 to-cyan-500' },
  { name: 'Basketball', icon: '🏀', color: 'from-purple-400 to-pink-500' },
];

const features = [
  { icon: <FiZap />, title: 'Instant Booking', desc: 'Book your favourite sports court in just a few clicks' },
  { icon: <FiShield />, title: 'Secure Payments', desc: 'Safe and flexible payment options with 50% advance booking' },
  { icon: <FiClock />, title: 'Real-time Slots', desc: 'Live availability updates — no double bookings, ever' },
  { icon: <FiStar />, title: 'Premium Facilities', desc: 'World-class courts and professional-grade equipment' },
];

export default function LandingPage() {
  const { dark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={`min-h-screen ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${dark ? 'gradient-dark' : 'bg-gradient-to-br from-primary-50 via-white to-purple-50'}`}></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${dark ? 'glass text-white/80' : 'bg-primary-100 text-primary-700'}`}
              >
                🏟️ ProStar Sports Academy
              </motion.div>

              <h1 className={`text-5xl md:text-7xl font-display font-bold leading-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Book Your
                <span className="text-gradient block">Sports Court</span>
                Instantly
              </h1>

              <p className={`text-lg md:text-xl mb-8 max-w-xl ${dark ? 'text-white/60' : 'text-gray-600'}`}>
                Experience world-class sports facilities. Choose from multiple courts,
                rent equipment, and manage your bookings effortlessly.
              </p>

              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link
                    to={user?.role === 'admin' ? '/admin' : user?.role === 'manager' ? '/manager' : '/dashboard'}
                    className="btn-primary text-lg flex items-center gap-2"
                  >
                    Go to Dashboard <FiArrowRight />
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary text-lg flex items-center gap-2">
                      Get Started <FiArrowRight />
                    </Link>
                    <Link to="/login" className="btn-glass text-lg">Login</Link>
                  </>
                )}
              </div>

              <div className={`mt-8 flex items-center gap-6 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>10+</p>
                  <p className="text-xs">Courts</p>
                </div>
                <div className={`w-px h-8 ${dark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>5</p>
                  <p className="text-xs">Sports</p>
                </div>
                <div className={`w-px h-8 ${dark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>500+</p>
                  <p className="text-xs">Happy Players</p>
                </div>
              </div>
            </motion.div>

            {/* Sports Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {sports.map((sport, i) => (
                <motion.div
                  key={sport.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`rounded-2xl p-6 ${dark ? 'glass' : 'bg-white shadow-lg'} ${i === 0 ? 'col-span-2' : ''} card-hover`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sport.color} flex items-center justify-center text-2xl mb-3`}>
                    {sport.icon}
                  </div>
                  <h3 className={`font-semibold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>{sport.name}</h3>
                  <p className={`text-sm mt-1 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                    {i === 0 ? 'Premium turf grounds available' : 'Multiple courts available'}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-24 ${dark ? 'bg-dark-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-display font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Why Choose <span className="text-gradient">ProStar</span>?
            </h2>
            <p className={`text-lg ${dark ? 'text-white/50' : 'text-gray-500'}`}>
              Everything you need for a seamless sports booking experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl p-6 ${dark ? 'glass' : 'bg-gray-50 border border-gray-100'} transition-all duration-300`}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-xl mb-4">
                  {f.icon}
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-500'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Play?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of sports enthusiasts who trust ProStar for their bookings.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-xl">
              {isAuthenticated ? 'Book Now' : 'Create Account'} <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${dark ? 'border-white/5 bg-dark-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${dark ? 'text-white/30' : 'text-gray-400'}`}>
            © 2024 ProStar Sports Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
