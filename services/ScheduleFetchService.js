const Schedule = require('../models/Schedule');

const getSchedulesByDeviceId = async (device_id) => {
  try {
    return await Schedule.findAll({
      where: { device_id },
      order: [['start_date', 'ASC']],
    });
  } catch (error) {
    throw new Error(`Error fetching schedules for device_id ${device_id}: ${error.message}`);
  }
};

module.exports = {
  getSchedulesByDeviceId,
};
