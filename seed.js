const bcrypt = require('bcryptjs');
const { sequelize, Academy, User, Sport, Court, Schedule, Equipment, Booking, Payment, Notification } = require('./models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Academy
    const academy = await Academy.create({
      name: 'ProStar Sports Academy',
      address: '123 Sports Avenue, Stadium Road',
      phone: '9876543210',
      email: 'info@prostarsports.com',
      description: 'Premier sports academy with world-class facilities'
    });

    // Users
    const hashedPw = await bcrypt.hash('password123', 10);

    const admin = await User.create({ name: 'Admin User', email: 'admin@sports.com', password: hashedPw, role: 'admin', phone: '9000000001', academy_id: academy.id });
    const manager1 = await User.create({ name: 'Rahul Sharma', email: 'manager1@sports.com', password: hashedPw, role: 'manager', phone: '9000000002', academy_id: academy.id });
    const manager2 = await User.create({ name: 'Priya Singh', email: 'manager2@sports.com', password: hashedPw, role: 'manager', phone: '9000000003', academy_id: academy.id });
    const client1 = await User.create({ name: 'Arjun Kumar', email: 'client1@sports.com', password: hashedPw, role: 'client', phone: '9000000004', academy_id: academy.id });
    const client2 = await User.create({ name: 'Sneha Patel', email: 'client2@sports.com', password: hashedPw, role: 'client', phone: '9000000005', academy_id: academy.id });
    const client3 = await User.create({ name: 'Vikram Reddy', email: 'client3@sports.com', password: hashedPw, role: 'client', phone: '9000000006', academy_id: academy.id });

    // Sports
    const football = await Sport.create({ name: 'Football', description: 'Join exciting football matches on our premium turf grounds.', icon: '⚽', academy_id: academy.id });
    const cricket = await Sport.create({ name: 'Cricket', description: 'Practice and play cricket on our well-maintained pitches.', icon: '🏏', academy_id: academy.id });
    const badminton = await Sport.create({ name: 'Badminton', description: 'Play badminton in our air-conditioned indoor arena.', icon: '🏸', academy_id: academy.id });
    const pickleball = await Sport.create({ name: 'Pickleball', description: 'Enjoy the fast-growing sport of pickleball on our elite courts.', icon: '🏓', academy_id: academy.id });

    // Courts (2 per sport)
    const fc1 = await Court.create({ name: 'Football Turf A', sport_id: football.id, location: 'Zone Alpha', price_per_hour: 1500 });
    const fc2 = await Court.create({ name: 'Football Turf B', sport_id: football.id, location: 'Zone Alpha', price_per_hour: 1200 });
    const cc1 = await Court.create({ name: 'Cricket Pitch 1', sport_id: cricket.id, location: 'Zone Beta', price_per_hour: 2000 });
    const cc2 = await Court.create({ name: 'Cricket Pitch 2', sport_id: cricket.id, location: 'Zone Beta', price_per_hour: 1800 });
    const bc1 = await Court.create({ name: 'Badminton Court 1', sport_id: badminton.id, location: 'Indoor Arena', price_per_hour: 600 });
    const bc2 = await Court.create({ name: 'Badminton Court 2', sport_id: badminton.id, location: 'Indoor Arena', price_per_hour: 600 });
    const pb1 = await Court.create({ name: 'Pickleball Court 1', sport_id: pickleball.id, location: 'Zone Gamma', price_per_hour: 900 });
    const pb2 = await Court.create({ name: 'Pickleball Court 2', sport_id: pickleball.id, location: 'Zone Gamma', price_per_hour: 900 });

    // Equipment (Premium Selection)
    await Equipment.create({ name: 'Pro Match Ball', sport_id: football.id, price: 120, description: 'FIFA Quality Pro match ball', available_quantity: 24 });
    await Equipment.create({ name: 'Elite Goalie Gloves', sport_id: football.id, price: 180, description: 'Pro-grip goalkeeper gloves', available_quantity: 12 });
    await Equipment.create({ name: 'Training Cones (Set)', sport_id: football.id, price: 40, description: 'Set of 50 agility cones', available_quantity: 10 });
    
    await Equipment.create({ name: 'English Willow Bat', sport_id: cricket.id, price: 450, description: 'Grade 1+ English Willow', available_quantity: 8 });
    await Equipment.create({ name: 'Tournament Stumps', sport_id: cricket.id, price: 150, description: 'Spring-back tournament stumps', available_quantity: 6 });
    await Equipment.create({ name: 'Carbon Fiber Helmet', sport_id: cricket.id, price: 220, description: 'Elite protection helmet', available_quantity: 12 });
    
    await Equipment.create({ name: 'Pro Carbon Racket', sport_id: badminton.id, price: 280, description: 'High-tension carbon fiber', available_quantity: 18 });
    await Equipment.create({ name: 'Tournament Shuttlecocks', sport_id: badminton.id, price: 85, description: 'Grade A goose feather (Dozen)', available_quantity: 60 });
    await Equipment.create({ name: 'Badminton Net (Pro)', sport_id: badminton.id, price: 120, description: 'Tournament grade court net', available_quantity: 4 });
    
    await Equipment.create({ name: 'Pro Paddle', sport_id: pickleball.id, price: 240, description: 'Graphite face pro paddle', available_quantity: 14 });
    await Equipment.create({ name: 'Outdoor Pro Balls', sport_id: pickleball.id, price: 55, description: 'Precision weighted balls (Pack)', available_quantity: 48 });
    await Equipment.create({ name: 'Pickleball Net System', sport_id: pickleball.id, price: 350, description: 'Portable tournament net system', available_quantity: 4 });

    // Schedules for all courts, all days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const allCourts = [fc1, fc2, cc1, cc2, bc1, bc2, pb1, pb2];
    for (const court of allCourts) {
      for (const day of days) {
        await Schedule.create({
          sport_id: court.sport_id,
          court_id: court.id,
          manager_id: Math.random() > 0.5 ? manager1.id : manager2.id,
          day_of_week: day,
          start_time: '06:00',
          end_time: '22:00'
        });
      }
    }

    // Sample Notifications
    await Notification.create({ user_id: client1.id, sender_id: admin.id, title: 'Welcome!', message: 'Welcome to ProStar Sports Academy! Explore our sports and book your first session.', type: 'general' });

    console.log('✅ Seed data created successfully!');
    console.log('');
    console.log('Test Accounts (password: password123 for all):');
    console.log('  Admin:   admin@sports.com');
    console.log('  Manager: manager1@sports.com / manager2@sports.com');
    console.log('  Client:  client1@sports.com / client2@sports.com / client3@sports.com');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
