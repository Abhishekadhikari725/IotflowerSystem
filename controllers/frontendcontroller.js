const Device = require('../models/Device');
const Log = require('../models/Log');
const Schedule = require('../models/Schedule');
const { Op } = require('sequelize');


class FrontendController {
  // Fetch all devices
  static async getDevices(req, res) {
    try {
      const devices = await Device.findAll();
      res.json(devices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }

  // Create schedule
  static async createSchedule(req, res) {
    const { device_id, start_time, interval,description} = req.body;

    try {
      const schedule = await Schedule.create({ device_id, start_time, interval, description});

      await Log.create({
        device_id,
        action: `Scheduled watering for ${interval} seconds at ${start_time}`,
        details: `Water schedule updated for device_id ${device_id}`,
        timestamp: new Date(),
      });

      res.status(201).json(schedule);
      console.log("Log is here.")
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  }

  // Get pump activation status (for embedded system)
  static async getPumpStatus(req, res) {
    try {
      console.log(`from getting status`);
      console.log(req.query.device_id);
      const device = await Device.findByPk(req.query.device_id);
      res.json({ activate: device.status === 'active' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch pump status' });
    }
  }
  
  static async setPumpStatus(req, res) {
    const { device_id, status, interval } = req.body; 
    // Validate input
    if (!device_id || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid device_id or status value. Must be "active" or "inactive".' });
    }
  
    try {
      // Debug: Log incoming data
      console.log(`Updating pump status for device_id: ${device_id}, status: ${status}, interval: ${interval}`);
  
      // Turn on the pump and handle interval logic if provided
      if (status === 'active' && interval && interval > 0) {
        // Immediate response for manual activation
        await Device.update({ status: 'active', time_interval: interval }, { where: { device_id } });
        await Log.create({
          device_id,
          action: 'Manual pump ON',
          details: `Pump manually activated for ${interval} seconds`,
          timestamp: new Date(),
        });
  
        res.status(200).json({ message: `Pump turned on for ${interval} seconds` });
        console.log(`Manual pump started for device ${device_id}`)
        // Turn off the pump after the interval
        setTimeout(async () => {
          await Device.update({ status: 'inactive' }, { where: { device_id } });
          await Log.create({
            device_id,
            action: 'Manual pump OFF',
            details: `Pump manually deactivated after ${interval} seconds`,
            timestamp: new Date(),
          });
          console.log(`Manual pump stopped for device ${device_id}`);
        }, interval * 1000); // Convert interval to milliseconds
      } else {
        // Standard status update (without interval)
        const [updatedRows] = await Device.update(
          { status },
          { where: { device_id } }
        );
  
        if (updatedRows === 0) {
          return res.status(404).json({ error: 'Device not found or status not changed.' });
        }
  
        // Log the status update
        await Log.create({
          device_id,
          action: `Pump status set to ${status}`,
          details: `Pump status updated manually`,
          timestamp: new Date(),
        });
  
        res.json({ message: 'Pump status updated successfully' });
      }
    } catch (error) {
      console.error('Error updating pump status:', error);
      res.status(500).json({ error: 'Failed to update pump status.' });
    }
  }

  static async checkSchedules() {
    try {
      const currentTime = new Date();
  
      // Find schedules that are not completed and start_time has passed
      const schedules = await Schedule.findAll({
        where: {
          start_time: { [Op.lte]: currentTime },
          completed: false,  // Only select incomplete schedules
        },
        include: [{ model: Device, where: { status: 'inactive' } }],
      });
  
      for (const schedule of schedules) {
        const { device_id, interval, schedule_id } = schedule;
  
        // Start the pump
        await FrontendController.startPumpInternal(device_id, interval);
  
        setTimeout(async () => {
          await FrontendController.stopPumpInternal(device_id);
          // Mark the schedule as completed after the pump stops
          await Schedule.update({ completed: true }, { where: { schedule_id } });
        }, interval * 1000);
      }
    } catch (error) {
      console.error('Error executing scheduled tasks:', error);
    }
  }
  

  static async startPumpInternal(device_id, interval) {
    try {
      await Device.update({ status: 'active' }, { where: { device_id } });
      await Log.create({
        device_id,
        action: 'Pump turned ON',
        details: `Pump activated for ${interval} seconds`,
        timestamp: new Date(),
      });
      console.log(`Pump started for device ${device_id}`);
    } catch (error) {
      console.error('Failed to start pump:', error);
    }
  }

  static async stopPumpInternal(device_id) {
    try {
      await Device.update({ status: 'inactive' }, { where: { device_id } });
      await Log.create({
        device_id,
        action: 'Pump turned OFF',
        details: 'Pump deactivated after scheduled interval',
        timestamp: new Date(),
      });
      console.log(`Pump stopped for device ${device_id}`);
    } catch (error) {
      console.error('Failed to stop pump:', error);
    }
  }
}

// Run the scheduler every minute
setInterval(() => {
  FrontendController.checkSchedules();
}, 60 * 1000); // 60 seconds

module.exports = FrontendController;
