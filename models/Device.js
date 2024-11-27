const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Device = sequelize.define('Device', {
  device_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  flower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive',
  },
  time_interval: {
    type: DataTypes.INTEGER, 
    allowNull: true, 
  },
}, {
  timestamps: true, 
});

module.exports = Device;
