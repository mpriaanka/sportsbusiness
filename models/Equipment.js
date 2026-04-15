const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Equipment = sequelize.define('Equipment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  sport_id: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  description: { type: DataTypes.TEXT },
  available_quantity: { type: DataTypes.INTEGER, defaultValue: 10 }
}, { tableName: 'equipment', timestamps: true });

module.exports = Equipment;
