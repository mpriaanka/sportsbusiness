const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sports', require('./routes/sports'));
app.use('/api/courts', require('./routes/courts'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admissions', require('./routes/admissions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sports Academy API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    // Auto-seed if no users exist (fixes empty database after git pull)
    const { User } = require('./models');
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('⚠️  No users found — auto-seeding database...');
      const bcrypt = require('bcryptjs');
      const { Academy, Sport, Court, Schedule, Equipment, Notification } = require('./models');

      const academy = await Academy.findOrCreate({
        where: { name: 'ProStar Sports Academy' },
        defaults: { address: '123 Sports Avenue, Stadium Road', phone: '9876543210', email: 'info@prostarsports.com', description: 'Premier sports academy with world-class facilities' }
      }).then(([a]) => a);

      const pw = await bcrypt.hash('ProStar@Academy2024', 10);
      const admin = await User.create({ name: 'Admin User', email: 'admin@sports.com', password: pw, role: 'admin', phone: '9000000001', academy_id: academy.id });
      const mgr1 = await User.create({ name: 'Rahul Sharma', email: 'manager1@sports.com', password: pw, role: 'manager', phone: '9000000002', academy_id: academy.id });
      const mgr2 = await User.create({ name: 'Priya Singh', email: 'manager2@sports.com', password: pw, role: 'manager', phone: '9000000003', academy_id: academy.id });
      const c1 = await User.create({ name: 'Arjun Kumar', email: 'client1@sports.com', password: pw, role: 'client', phone: '9000000004', academy_id: academy.id });
      await User.create({ name: 'Sneha Patel', email: 'client2@sports.com', password: pw, role: 'client', phone: '9000000005', academy_id: academy.id });
      await User.create({ name: 'Vikram Reddy', email: 'client3@sports.com', password: pw, role: 'client', phone: '9000000006', academy_id: academy.id });

      const football = await Sport.findOrCreate({ where: { name: 'Football' }, defaults: { description: 'Join exciting football matches on our premium turf grounds.', icon: '⚽', academy_id: academy.id } }).then(([s]) => s);
      const cricket = await Sport.findOrCreate({ where: { name: 'Cricket' }, defaults: { description: 'Practice and play cricket on our well-maintained pitches.', icon: '🏏', academy_id: academy.id } }).then(([s]) => s);
      const badminton = await Sport.findOrCreate({ where: { name: 'Badminton' }, defaults: { description: 'Play badminton in our air-conditioned indoor arena.', icon: '🏸', academy_id: academy.id } }).then(([s]) => s);
      const pickleball = await Sport.findOrCreate({ where: { name: 'Pickleball' }, defaults: { description: 'Enjoy the fast-growing sport of pickleball on our elite courts.', icon: '🏓', academy_id: academy.id } }).then(([s]) => s);

      const courts = [];
      for (const [sport, names, loc, prices] of [
        [football, ['Football Turf A','Football Turf B'], 'Zone Alpha', [1500,1200]],
        [cricket, ['Cricket Pitch 1','Cricket Pitch 2'], 'Zone Beta', [2000,1800]],
        [badminton, ['Badminton Court 1','Badminton Court 2'], 'Indoor Arena', [600,600]],
        [pickleball, ['Pickleball Court 1','Pickleball Court 2'], 'Zone Gamma', [900,900]]
      ]) {
        for (let i = 0; i < names.length; i++) {
          const [c] = await Court.findOrCreate({ where: { name: names[i] }, defaults: { sport_id: sport.id, location: loc, price_per_hour: prices[i] } });
          courts.push(c);
        }
      }

      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
      for (const court of courts) {
        for (const day of days) {
          await Schedule.findOrCreate({ where: { court_id: court.id, day_of_week: day }, defaults: { sport_id: court.sport_id, manager_id: Math.random() > 0.5 ? mgr1.id : mgr2.id, start_time: '06:00', end_time: '22:00' } });
        }
      }

      await Notification.findOrCreate({ where: { user_id: c1.id, title: 'Welcome!' }, defaults: { sender_id: admin.id, message: 'Welcome to ProStar Sports Academy!', type: 'general' } });

      console.log('✅ Auto-seed complete! Accounts: admin@sports.com / manager1@sports.com / client1@sports.com (password: ProStar@Academy2024)');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

start();
