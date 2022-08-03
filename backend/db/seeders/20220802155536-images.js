'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Images', [
      {
        url: 'URLaddress1',
        previewImage: false,
        spotId: 1,
        reviewId:  null,
        userId: 1
      },
      {
        url: 'URLaddress2',
        previewImage: false,
        spotId: 1,
        reviewId:  null,
        userId: 1
      },
      {
        url: 'URLaddress3',
        previewImage: false,
        spotId: null,
        reviewId:  1,
        userId: 2
      },
      {
        url: 'URLaddress4',
        previewImage: true,
        spotId: 2,
        reviewId:  null,
        userId: 2
      },
      {
        url: 'URLaddress5',
        previewImage: false,
        spotId: 2,
        reviewId:  null,
        userId: 2
      },
      {
        url: 'URLaddress6',
        previewImage: true,
        spotId: 3,
        reviewId:  null,
        userId: 3
      },
      {
        url: 'URLaddress7',
        previewImage: false,
        spotId: 3,
        reviewId:  null,
        userId: 3
      },
      {
        url: 'URLaddress8',
        previewImage: true,
        spotId: 4,
        reviewId:  null,
        userId: 3
      },
      {
        url: 'URLaddress9',
        previewImage: true,
        spotId: null,
        reviewId: 3,
        userId: 1
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Images', {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
