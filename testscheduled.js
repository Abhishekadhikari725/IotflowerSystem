const Device = require('../models/Device');
const Log = require('../models/Log');
const Schedule = require('../models/Schedule');

class FrontendController {
  // ... (existing methods)

  // Function to execute scheduled tasks
  static async checkSchedules() {
    try {
      const currentTime = new Date();

      // Find schedules where start_time is now or has passed and are not yet completed
      const schedules = await Schedule.findAll({
        where: {
          start_time: { [Op.lte]: currentTime }, // lte: less than or equal to current time
        },
        include: [{ model: Device, where: { status: 'inactive' } }] // Ensure device is off
      });

      for (const schedule of schedules) {
        const { device_id, interval } = schedule;

        // Start the pump
        await FrontendController.startPumpInternal(device_id, interval);

        // Stop the pump after the interval
        setTimeout(async () => {
          await FrontendController.stopPumpInternal(device_id);
        }, interval * 1000); // Convert interval to milliseconds
      }
    } catch (error) {
      console.error('Error executing scheduled tasks:', error);
    }
  }

  // Internal method to start the pump (no HTTP response)
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

  // Internal method to stop the pump (no HTTP response)
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
