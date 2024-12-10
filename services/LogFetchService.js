const Log = require('../models/Log');

const getLogsByDeviceId = async (device_id) => {
  try {
    return await Log.findAll({
      where: { device_id },
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    throw new Error(`Error fetching logs for device_id ${device_id}: ${error.message}`);
  }
};

module.exports = {
  getLogsByDeviceId,
};
