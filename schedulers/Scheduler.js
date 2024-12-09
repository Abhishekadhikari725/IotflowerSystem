const { DateTime } = require('luxon');
const ScheduleService = require('../services/ScheduleService');
const PumpService = require('../services/PumpService');

// Function to check schedules every minute
const checkSchedules = async () => {
  const now = DateTime.now().setZone('Europe/Helsinki');
  const currentTime = now.toFormat('HH:mm:ss');
  const currentDate = now.toISODate();

  try {
    const schedules = await ScheduleService.findTodaySchedules(currentDate, currentTime);
    for (const schedule of schedules) {
      const { device_id, interval, schedule_id } = schedule;
      await PumpService.startPump(device_id, interval);

      setTimeout(async () => {
        await PumpService.stopPump(device_id);
        await ScheduleService.markScheduleCompleted(schedule_id);
      }, interval * 1000);
    }
  } catch (error) {
    console.error('Error checking schedules:', error);
  }
};

// Function to reset the 'completed' field at midnight
const resetDailyCompletion = () => {
  const now = DateTime.now().setZone('Europe/Helsinki');
  const resetTime = now.set({ hour: 23, minute: 59, second: 0 });

  let msUntilReset = resetTime - now;
  if (msUntilReset < 0) {
    msUntilReset += 24 * 60 * 60 * 1000;
  }

  setTimeout(async () => {
    await ScheduleService.resetDailyCompletion();
    resetDailyCompletion();
  }, msUntilReset);
};

module.exports = {
  checkSchedules,
  resetDailyCompletion
};
