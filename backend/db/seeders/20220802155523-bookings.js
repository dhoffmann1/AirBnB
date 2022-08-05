'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 2,
        startDate: '2022-02-12',
        endDate:  '2022-02-16'
      },
      {
        spotId: 1,
        userId: 3,
        startDate:  '2022-02-18',
        endDate:  '2022-02-22'
      },
      {
        spotId: 1,
        userId: 2,
        startDate:  '2022-03-15',
        endDate:  '2022-03-22'
      },
      {
        spotId: 2,
        userId: 1,
        startDate:  '2022-05-12',
        endDate:  '2022-05-15'
      },
      {
        spotId: 2,
        userId: 1,
        startDate:  '2022-06-03',
        endDate:  '2022-06-06'
      },
      {
        spotId: 3,
        userId: 1,
        startDate:  '2022-06-15',
        endDate:  '2022-06-30'
      },
      {
        spotId: 4,
        userId: 1,
        startDate:  '2022-07-01',
        endDate:  '2022-07-15'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
