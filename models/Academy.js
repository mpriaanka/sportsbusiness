const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Academy = sequelize.define('Academy', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
}, { tableName: 'academies', timestamps: true });

module.exports = Academy;
