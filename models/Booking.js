const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  client_id: { type: DataTypes.INTEGER, allowNull: false },
  court_id: { type: DataTypes.INTEGER, allowNull: false },
  schedule_id: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time_slot: { type: DataTypes.STRING, allowNull: false },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    defaultValue: 'Pending'
  },
  notes: { type: DataTypes.TEXT }
}, { tableName: 'bookings', timestamps: true });

module.exports = Booking;
