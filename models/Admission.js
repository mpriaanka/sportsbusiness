const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admission = sequelize.define('Admission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  client_id: { type: DataTypes.INTEGER, allowNull: false },
  sport_id: { type: DataTypes.INTEGER, allowNull: false },
  fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active'
  }
}, { tableName: 'admissions', timestamps: true });

module.exports = Admission;
