const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const FrontendController = require('./controllers/frontendcontroller');
const EmbeddedController = require('./controllers/embeddedcontroller');

const scheduler = require('./schedulers/Scheduler');
const cron = require('node-cron');

const app = express();

app.use(bodyParser.json());

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Frontend Routes
app.get('/devices', FrontendController.getDevices);
app.post('/schedule', FrontendController.createSchedule);
app.get('/pump-status', FrontendController.getPumpStatus);
app.post('/set-pump-status', FrontendController.setPumpStatus);
app.get('/dashboard-data', FrontendController.getDashboardData);
app.get('/logs', FrontendController.getLogs);           
app.get('/schedules', FrontendController.getSchedules);



// Embedded Routes
app.get('/should-activate-pump', EmbeddedController.shouldActivatePump);
app.post('/sensor-data', EmbeddedController.receiveSensorData);


// Start the scheduler
setInterval(scheduler.checkSchedules, 60 * 1000);  // Check schedules every minute
scheduler.resetDailyCompletion();  // Start the reset process for daily completion at midnight

// Cron job to clear influx.log every Sunday at midnight
cron.schedule('0 0 * * 0', () => {
  clearLogFile();
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database tables have been synched.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
