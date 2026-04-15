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
    const tennis = await Sport.create({ name: 'Tennis', description: 'Experience professional tennis on our synthetic and clay courts.', icon: '🎾', academy_id: academy.id });
    const badminton = await Sport.create({ name: 'Badminton', description: 'Play badminton in our air-conditioned indoor arena.', icon: '🏸', academy_id: academy.id });
    const basketball = await Sport.create({ name: 'Basketball', description: 'Shoot hoops on our professional basketball courts.', icon: '🏀', academy_id: academy.id });

    // Courts (min 2 per sport)
    const fc1 = await Court.create({ name: 'Turf Ground A', sport_id: football.id, location: 'Block A', price_per_hour: 1500 });
    const fc2 = await Court.create({ name: 'Turf Ground B', sport_id: football.id, location: 'Block A', price_per_hour: 1200 });
    const cc1 = await Court.create({ name: 'Cricket Pitch 1', sport_id: cricket.id, location: 'Block B', price_per_hour: 2000 });
    const cc2 = await Court.create({ name: 'Cricket Pitch 2', sport_id: cricket.id, location: 'Block B', price_per_hour: 1800 });
    const tc1 = await Court.create({ name: 'Tennis Court 1', sport_id: tennis.id, location: 'Block C', price_per_hour: 800 });
    const tc2 = await Court.create({ name: 'Tennis Court 2', sport_id: tennis.id, location: 'Block C', price_per_hour: 800 });
    const bc1 = await Court.create({ name: 'Badminton Court 1', sport_id: badminton.id, location: 'Indoor Arena', price_per_hour: 600 });
    const bc2 = await Court.create({ name: 'Badminton Court 2', sport_id: badminton.id, location: 'Indoor Arena', price_per_hour: 600 });
    const bk1 = await Court.create({ name: 'Basketball Court 1', sport_id: basketball.id, location: 'Block D', price_per_hour: 1000 });
    const bk2 = await Court.create({ name: 'Basketball Court 2', sport_id: basketball.id, location: 'Block D', price_per_hour: 1000 });

    // Equipment
    await Equipment.create({ name: 'Football', sport_id: football.id, price: 100, description: 'Match-quality football', available_quantity: 20 });
    await Equipment.create({ name: 'Shin Guards', sport_id: football.id, price: 50, description: 'Protective shin guards', available_quantity: 30 });
    await Equipment.create({ name: 'Goalkeeper Gloves', sport_id: football.id, price: 150, description: 'Pro goalkeeper gloves', available_quantity: 10 });
    await Equipment.create({ name: 'Cricket Bat', sport_id: cricket.id, price: 200, description: 'English willow bat', available_quantity: 15 });
    await Equipment.create({ name: 'Cricket Pads', sport_id: cricket.id, price: 100, description: 'Batting leg guards', available_quantity: 20 });
    await Equipment.create({ name: 'Cricket Helmet', sport_id: cricket.id, price: 150, description: 'Protective helmet', available_quantity: 15 });
    await Equipment.create({ name: 'Tennis Racket', sport_id: tennis.id, price: 250, description: 'Professional racket', available_quantity: 12 });
    await Equipment.create({ name: 'Tennis Balls (Can)', sport_id: tennis.id, price: 80, description: 'Pack of 3 balls', available_quantity: 30 });
    await Equipment.create({ name: 'Badminton Racket', sport_id: badminton.id, price: 200, description: 'Lightweight racket', available_quantity: 20 });
    await Equipment.create({ name: 'Shuttlecocks (Box)', sport_id: badminton.id, price: 60, description: 'Feather shuttlecocks', available_quantity: 50 });
    await Equipment.create({ name: 'Basketball', sport_id: basketball.id, price: 120, description: 'Official size basketball', available_quantity: 15 });

    // Schedules for all courts, all days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const allCourts = [fc1, fc2, cc1, cc2, tc1, tc2, bc1, bc2, bk1, bk2];
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

    // Sample Bookings
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const b1 = await Booking.create({ client_id: client1.id, court_id: fc1.id, date: today, time_slot: '10:00-11:00', total_amount: 1600, status: 'Confirmed' });
    const b2 = await Booking.create({ client_id: client2.id, court_id: tc1.id, date: today, time_slot: '14:00-15:00', total_amount: 1080, status: 'Pending' });
    const b3 = await Booking.create({ client_id: client3.id, court_id: cc1.id, date: tomorrow, time_slot: '09:00-10:00', total_amount: 2200, status: 'Confirmed' });
    const b4 = await Booking.create({ client_id: client1.id, court_id: bc1.id, date: tomorrow, time_slot: '16:00-17:00', total_amount: 800, status: 'Pending' });

    // Sample Payments
    await Payment.create({ booking_id: b1.id, amount_paid: 1600, payment_type: 'Full', payment_status: 'Success' });
    await Payment.create({ booking_id: b2.id, amount_paid: 540, payment_type: 'Advance', payment_status: 'Success' });
    await Payment.create({ booking_id: b3.id, amount_paid: 1100, payment_type: 'Advance', payment_status: 'Success' });

    // Sample Notifications
    await Notification.create({ user_id: client1.id, sender_id: manager1.id, title: 'Booking Confirmed', message: 'Your football booking has been confirmed!', type: 'booking' });
    await Notification.create({ user_id: client2.id, sender_id: manager1.id, title: 'Payment Reminder', message: 'Please complete your remaining payment for tennis court booking.', type: 'payment' });
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
