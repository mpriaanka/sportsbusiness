const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sport = sequelize.define('Sport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING, defaultValue: '⚽' },
  academy_id: { type: DataTypes.INTEGER }
}, { tableName: 'sports', timestamps: true });

module.exports = Sport;
