const Device = require('../models/Device');

class DeviceService {
  static async getAllDevices() {
    return await Device.findAll();
  }

  static async updateStatus(device_id, status, time_interval = null) {
    return await Device.update({ status, time_interval }, { where: { device_id } });
  }

  static async getDeviceById(device_id) {
    return await Device.findByPk(device_id);
  }
}

module.exports = DeviceService;
