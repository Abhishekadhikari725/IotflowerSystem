const DeviceService = require('./DeviceService');
const LogService = require('./LogService');

class PumpService {
  static async startPump(device_id, interval) {
    await DeviceService.updateStatus(device_id, 'active',interval);
    await LogService.createLog(device_id, 'Pump turned ON', `Pump activated for ${interval} seconds`);
  }

  static async stopPump(device_id) {
    await DeviceService.updateStatus(device_id, 'inactive');
    await LogService.createLog(device_id, 'Pump turned OFF', 'Pump deactivated after scheduled interval');
  }
}

module.exports = PumpService;
