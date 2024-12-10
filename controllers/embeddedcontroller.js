const { DB_WRITE_POINT, Point } = require('../config/influxConfig');
const Device = require('../models/Device');
const fs = require('fs');
const path = require('path');

// Define the path for the influx.log file
const logFilePath = path.join(__dirname, '../logs/influx.log');

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

  static async receiveSensorData(req, res) {
    const { temperature, moisture, humidity, device_id } = req.body;
    try {
      await logSensorData(device_id, temperature, moisture, humidity);
      await insertIntoInfluxDB(device_id, temperature, moisture, humidity);
      res.status(200).json({ message: 'Data received' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save sensor data' });
    }
  }
}

async function insertIntoInfluxDB(device_id, temperature, moisture, humidity) {
  const point = new Point('environment_data')
    .floatField('temperature', temperature)
    .floatField('moisture', moisture)
    .floatField('humidity', humidity)
    .tag('device_id', device_id);

  DB_WRITE_POINT.writePoint(point);
  await DB_WRITE_POINT.flush();
  console.log(`Data saved: Device ${device_id}, Temp: ${temperature}, Moisture: ${moisture}, Humidity: ${humidity}`);
}

async function logSensorData(device_id, temperature, moisture, humidity) {
  const logEntry = {
    time: new Date().toISOString(),
    device_id: device_id.toString(),
    data: [
      { field: 'temperature', value: temperature },
      { field: 'moisture', value: moisture },
      { field: 'humidity', value: humidity },
    ],
  };

  let logData = { data: [] };
  if (fs.existsSync(logFilePath)) {
    const fileContent = fs.readFileSync(logFilePath, 'utf-8');
    logData = JSON.parse(fileContent || '{"data": []}');
  }

  logData.data.push(logEntry);

  fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
}

module.exports = EmbeddedController;
