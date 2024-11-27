module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Devices', [{
        flower_id: 1, 
        location: 'Greenhouse 1', 
        status: 'inactive', 
        time_interval: 0, 
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Devices', null, {});
    }
  };
  