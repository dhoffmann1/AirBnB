'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 2,
        startDate: '2022-02-12 07:00:00',
        endDate:  '2022-02-16 15:00:00'
      },
      {
        spotId: 1,
        userId: 3,
        startDate:  '2022-02-18 07:00:00',
        endDate:  '2022-02-22 15:00:00'
      },
      {
        spotId: 1,
        userId: 2,
        startDate:  '2022-03-15 07:00:00',
        endDate:  '2022-03-22 15:00:00'
      },
      {
        spotId: 2,
        userId: 1,
        startDate:  '2022-05-12 07:00:00',
        endDate:  '2022-05-15 15:00:00'
      },
      {
        spotId: 2,
        userId: 1,
        startDate:  '2022-06-03 07:00:00',
        endDate:  '2022-06-06 15:00:00'
      },
      {
        spotId: 3,
        userId: 1,
        startDate:  '2022-06-15 07:00:00',
        endDate:  '2022-06-30 15:00:00'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
