const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const FrontendController = require('./controllers/frontendcontroller');
const EmbeddedController = require('./controllers/embeddedcontroller');

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

// Embedded Routes
app.get('/should-activate-pump', EmbeddedController.shouldActivatePump);
app.post('/sensor-data', EmbeddedController.receiveSensorData);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database tables have been synched.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
