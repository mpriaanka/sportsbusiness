const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Court = sequelize.define('Court', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  sport_id: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.STRING },
  price_per_hour: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 500 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'courts', timestamps: true });

module.exports = Court;
