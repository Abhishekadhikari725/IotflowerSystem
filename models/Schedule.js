const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Device = require('./Device'); 

// Define the Schedule model
const Schedule = sequelize.define('Schedule', {
  schedule_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  device_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Device,  
      key: 'device_id',      
    },
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  interval: {  
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  completed: {  
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,  
});

// Associations
Schedule.belongsTo(Device, { foreignKey: 'device_id' }); // Each schedule belongs to a device
Device.hasMany(Schedule, { foreignKey: 'device_id' });   // A device can have many schedules

module.exports = Schedule;
