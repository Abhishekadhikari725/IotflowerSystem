const Log = require('../models/Log');
const Device= require('../models/Device');

class EmbeddedController {
  // Endpoint for embedded system to fetch pump status
  static async shouldActivatePump(req, res) {
    const { device_id } = req.query;
  
    try {
      const device = await Device.findByPk(device_id);
  
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      res.json({
        activate: device.status === 'active',
        seconds: device.time_interval || 5, 
      });
    } catch (error) {
      console.error('Error fetching pump status:', error);
      res.status(500).json({ error: 'Failed to fetch pump status' });
    }
  }
  

  // Endpoint for embedded system to send sensor data
  static async receiveSensorData(req, res) {
    const { temperature, moisture, humidity, device_id } = req.body;
    try {
      // Store the sensor data in InfluxDB or MySQL (example for InfluxDB)
      await insertIntoInfluxDB(device_id, temperature, moisture, humidity);
      res.status(200).json({ message: 'Data received' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save sensor data' });
    }
  }
}

// Helper function to insert data into InfluxDB
async function insertIntoInfluxDB(device_id, temperature, moisture, humidity) {
  console.log(`Data saved: Device ${device_id}, Temp: ${temperature}, Moisture: ${moisture}, Humidity: ${humidity}`);
}

module.exports = EmbeddedController;
