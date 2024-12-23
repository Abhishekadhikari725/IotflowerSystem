const DeviceService = require('../services/DeviceService');
const LogService = require('../services/LogService');
const ScheduleService = require('../services/ScheduleService');
const PumpService = require('../services/PumpService');
const DashboardService= require('../services/DashboardService')
const LogFetchService=require('../services/LogFetchService')
const ScheduleFetchService=require('../services/ScheduleFetchService')


class FrontendController {
  // Fetch all devices
  static async getDevices(req, res) {
    try {
      const devices = await DeviceService.getAllDevices();
      res.json(devices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }

  // Create schedule
  static async createSchedule(req, res) {
    const { device_id, start_date, end_date, time, interval, description } = req.body;
    try {
      const schedule = await ScheduleService.createSchedule({ device_id, start_date, end_date, time, interval, description });
      await LogService.createLog(device_id, `Scheduled watering for ${interval} seconds from ${start_date} to ${end_date} at ${time}.`, `Water schedule updated for device_id ${device_id}`);
      res.status(201).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  }

  // Get pump activation status
  static async getPumpStatus(req, res) {
    try {
      const device = await DeviceService.getDeviceById(req.query.device_id);
      res.json({ activate: device.status === 'active' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch pump status' });
    }
  }

  // Update pump activation status
  static async setPumpStatus(req, res) {
    const { device_id, status, interval } = req.body;
    if (!device_id || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid device_id or status value. Must be "active" or "inactive".' });
    }

    try {
      if (status === 'active' && interval && interval > 0) {
        await PumpService.startPump(device_id, interval);
        res.status(200).json({ message: `Pump turned on for ${interval} seconds` });

        setTimeout(async () => {
          await PumpService.stopPump(device_id);
        }, interval * 1000);
      } else {
        await DeviceService.updateStatus(device_id, status);
        await LogService.createLog(device_id, `Pump status set to ${status}`, `Pump status updated manually`);
        res.json({ message: 'Pump status updated successfully' });
      }
    } catch (error) {
      console.error('Error updating pump status:', error);
      res.status(500).json({ error: 'Failed to update pump status.' });
    }
  }

  static async getDashboardData(req, res) {
    try {
      const data = await DashboardService.fetchSensorData();
      res.status(200).json({ data });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }

  static async getLogs(req, res) {
    const { device_id } = req.query;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    try {
      const logs = await LogFetchService.getLogsByDeviceId(device_id);
      res.status(200).json({ success: true, logs });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }

  // Fetch schedules by device_id
  static async getSchedules(req, res) {
    const { device_id } = req.query;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    try {
      const schedules = await ScheduleFetchService.getSchedulesByDeviceId(device_id);
      res.status(200).json({ success: true, schedules });
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  }

}

module.exports = FrontendController;
