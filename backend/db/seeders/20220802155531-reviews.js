'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        review: 'greate house and host',
        stars: 5,
        userId: 2,
        spotId:  1
      },
      {
        review: 'your normal suburb house',
        stars: 2,
        userId:  3,
        spotId:  1
      },
      {
        review: 'convenient location in austin',
        stars: 4,
        userId:  1,
        spotId:  2
      },
      {
        review: 'great location near disney',
        stars: 5,
        userId:  1,
        spotId:  3
      },
      {
        review: 'great location near disney as well',
        stars: 5,
        userId:  1,
        spotId:  4
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews', {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
