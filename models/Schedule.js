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
  start_date: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME, 
    allowNull: false,
  },
  interval: {  
    type: DataTypes.INTEGER, 
    allowNull: false, 
  },
  completed: {  
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
}, {
  timestamps: true,  
});

// Associations
Schedule.belongsTo(Device, { foreignKey: 'device_id' }); 
Device.hasMany(Schedule, { foreignKey: 'device_id' });  

module.exports = Schedule;
