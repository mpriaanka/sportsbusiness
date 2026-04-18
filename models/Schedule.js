const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Schedule = sequelize.define('Schedule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sport_id: { type: DataTypes.INTEGER, allowNull: false },
  court_id: { type: DataTypes.INTEGER, allowNull: false },
  manager_id: { type: DataTypes.INTEGER },
  day_of_week: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_time: { type: DataTypes.STRING, allowNull: false },
  end_time: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'schedules', timestamps: true });

module.exports = Schedule;
