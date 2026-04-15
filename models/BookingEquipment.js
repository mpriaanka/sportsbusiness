const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingEquipment = sequelize.define('BookingEquipment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  booking_id: { type: DataTypes.INTEGER, allowNull: false },
  equipment_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'booking_equipment', timestamps: true });

module.exports = BookingEquipment;
