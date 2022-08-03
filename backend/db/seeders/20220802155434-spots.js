'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        lat: 29.76,
        lng: 95.37,
        name: 'Demo-1-Home',
        description: 'Cozy 3/2 home in houston suburb',
        price: 125
      },
      {
        ownerId: 2,
        address: '12 Washington Ave',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: 30.27,
        lng: 97.74,
        name: 'Demo-2-Apt',
        description: '2/2 apt in complex with pool and grill',
        price: 185
      },
      {
        ownerId: 3,
        address: '247 Mickey Way',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 28.54,
        lng: 81.38,
        name: 'La Riviera Unit 22',
        description: 'Beautiful 4/2 home just 15 minutes away from Disney',
        price: 215
      },
      {
        ownerId: 3,
        address: '247 Mickey Way',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 28.54,
        lng: 81.38,
        name: 'La Riviera Unit 23',
        description: 'Beautiful 3/2 home just 15 minutes away from Disney',
        price: 195
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ['Demo-1-Home', 'Demo-2-Apt', 'La Riviera Unit 22', 'La Riviera Unit 23'] }
    }, {});
  }
};
