const Schedule = require('../models/Schedule');
const { Op } = require('sequelize');
const { DateTime } = require('luxon');

class ScheduleService {
  // Create a new schedule
  static async createSchedule(data) {
    return await Schedule.create(data);
  }

  // Find today's schedules based on the current date and time
  static async findTodaySchedules(date, time) {
    return await Schedule.findAll({
      where: {
        start_date: date,
        start_time: { [Op.lte]: time },
        completed: false,
      },
      include: [{ model: require('../models/Device'), where: { status: 'inactive' } }],
    });
  }

  // Mark a schedule as completed
  static async markScheduleCompleted(schedule_id) {
    return await Schedule.update({ completed: true }, { where: { schedule_id } });
  }

  // Reset 'completed' status for schedules where today falls between start_date and end_date (excluding end_date)
  static async resetDailyCompletion() {
    const today = DateTime.now().setZone('Europe/Helsinki').toISODate();

    try {
      const schedules = await Schedule.findAll({
        where: {
          start_date: { [Op.lte]: today },
          end_date: { [Op.gte]: today },
          completed: true,
        },
      });

      for (const schedule of schedules) {
        if (schedule.end_date !== today) {
          await Schedule.update({ completed: false }, { where: { schedule_id: schedule.schedule_id } });
          console.log(`Reset 'completed' status for schedule_id: ${schedule.schedule_id}`);
        }
      }
    } catch (error) {
      console.error('Error resetting daily completion:', error);
    }
  }
}

module.exports = ScheduleService;
