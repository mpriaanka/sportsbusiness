const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  booking_id: { type: DataTypes.INTEGER, allowNull: false },
  amount_paid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'payments', timestamps: true });

module.exports = Payment;
