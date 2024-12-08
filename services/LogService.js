const Log = require('../models/Log');
const { DateTime } = require('luxon');

class LogService {
  static async createLog(device_id, action, details) {
    return await Log.create({
      device_id,
      action,
      details,
      timestamp: DateTime.now().setZone('Europe/Helsinki').toISO(),
    });
  }
}

module.exports = LogService;
