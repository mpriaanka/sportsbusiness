const sequelize = require('../config/db');
const Academy = require('./Academy');
const User = require('./User');
const Sport = require('./Sport');
const Court = require('./Court');
const Schedule = require('./Schedule');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Equipment = require('./Equipment');
const BookingEquipment = require('./BookingEquipment');
const Notification = require('./Notification');
const Admission = require('./Admission');

// Academy associations
Academy.hasMany(User, { foreignKey: 'academy_id' });
User.belongsTo(Academy, { foreignKey: 'academy_id' });
Academy.hasMany(Sport, { foreignKey: 'academy_id' });
Sport.belongsTo(Academy, { foreignKey: 'academy_id' });

// Sport associations
Sport.hasMany(Court, { foreignKey: 'sport_id' });
Court.belongsTo(Sport, { foreignKey: 'sport_id' });
Sport.hasMany(Equipment, { foreignKey: 'sport_id' });
Equipment.belongsTo(Sport, { foreignKey: 'sport_id' });
Sport.hasMany(Schedule, { foreignKey: 'sport_id' });
Schedule.belongsTo(Sport, { foreignKey: 'sport_id' });

// Court associations
Court.hasMany(Booking, { foreignKey: 'court_id' });
Booking.belongsTo(Court, { foreignKey: 'court_id' });
Court.hasMany(Schedule, { foreignKey: 'court_id' });
Schedule.belongsTo(Court, { foreignKey: 'court_id' });

// User associations
User.hasMany(Booking, { foreignKey: 'client_id' });
Booking.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
User.hasMany(Schedule, { foreignKey: 'manager_id' });
Schedule.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

// Booking associations
Booking.hasMany(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });
Booking.belongsTo(Schedule, { foreignKey: 'schedule_id' });
Schedule.hasMany(Booking, { foreignKey: 'schedule_id' });

// Booking-Equipment (many-to-many)
Booking.belongsToMany(Equipment, { through: BookingEquipment, foreignKey: 'booking_id' });
Equipment.belongsToMany(Booking, { through: BookingEquipment, foreignKey: 'equipment_id' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'recipient' });
Notification.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Admission associations
User.hasMany(Admission, { foreignKey: 'client_id' });
Admission.belongsTo(User, { foreignKey: 'client_id', as: 'admClient' });
Sport.hasMany(Admission, { foreignKey: 'sport_id' });
Admission.belongsTo(Sport, { foreignKey: 'sport_id' });

module.exports = {
  sequelize,
  Academy,
  User,
  Sport,
  Court,
  Schedule,
  Booking,
  Payment,
  Equipment,
  BookingEquipment,
  Notification,
  Admission
};
