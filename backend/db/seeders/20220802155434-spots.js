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
        ownerId: 1,
        address: '247 Maverick St',
        city: 'Kemah',
        state: 'TX',
        country: 'USA',
        lat: 30.22,
        lng: 97.60,
        name: "Fully equipped 52' Houseboat",
        description: '"Life is just a whisper in time." Feel like relaxing and enjoying life on the water with all the creature comforts of your home?',
        price: 134
      },
      {
        ownerId: 1,
        address: '58 Leonard Ave',
        city: 'Jonestown',
        state: 'TX',
        country: 'USA',
        lat: 33.76,
        lng: 105.37,
        name: 'Hollows Beach Club',
        description: 'Enjoy breathtaking views of Lake Travis while living the high life within The Hollows Resort Community.',
        price: 545
      },
      {
        ownerId: 1,
        address: '1055 Hillcroft Ln',
        city: 'Lakeway',
        state: 'TX',
        country: 'USA',
        lat: 40.09,
        lng: 101.12,
        name: 'Tree House on Lake Travis #15',
        description: 'Enjoy this peaceful beautiful lake view Treehouse on the south shore of Lake Travis. The "Treehouse on Lake Travis: Unit#15" offers 1st class amenities to give you a wonderful living space.',
        price: 233
      },
      {
        ownerId: 2,
        address: '12 Washington Ave',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: 30.27,
        lng: 97.74,
        name: 'Work from Home in our Extremely Comfortable House',
        description: 'Be prepared to be wowed by this brand-new space with modern farmhouse vibes. Walking through the sky-high front door, you will immediately notice the kitchen upgrades, vaulted ceilings, and comfortable gathering room.',
        price: 103
      },
      {
        ownerId: 2,
        address: '16 San Jacinto Blvd',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: 27.12,
        lng: 99.57,
        name: 'The Texas Suite by Rainey Street',
        description: 'The Texas Suite is the perfect place to stay in downtown Austin if you are looking for convenient access to the Austin Convention Center and all of the bars, restaurants, and nightlife that the city has to offer.',
        price: 190
      },
      {
        ownerId: 2,
        address: '66 Red River St',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: 28.27,
        lng: 92.74,
        name: "The Marfa Suite in Downtown Austin's City Center",
        description: 'Enjoy your stay in our studio condo with a Walk Score of 97! See the best of Austin with little effort as you will be in the very heart of all the action, just next door to the Austin Convention Center.',
        price: 158
      },
      {
        ownerId: 2,
        address: '13 East 6th St',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: 27.55,
        lng: 98.11,
        name: "Condo in the Heart of Downtown!",
        description: 'Located right in the heart of downtown Austin. Walk to Rainey St, 6th St, Congress, Convention Center and the Captiol. No need to rent a car while staying here!',
        price: 147
      },
      {
        ownerId: 3,
        address: '247 Mickey Way #22',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 28.54,
        lng: 152.38,
        name: 'La Riviera Unit 22',
        description: 'Beautiful 4/2 home just 15 minutes away from Disney',
        price: 215
      },
      {
        ownerId: 3,
        address: '247 Mickey Way #23',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 28.54,
        lng: 152.38,
        name: 'La Riviera Unit 23',
        description: 'Beautiful 3/2 home just 15 minutes away from Disney',
        price: 195
      },
      {
        ownerId: 3,
        address: '16 Vistana Resort Trl',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 22.54,
        lng: 151.38,
        name: 'NOT A BORING HOUSE , THIS UNIT WITH ALL THE FUN !',
        description: 'Make some memories at this unique and family-friendly place.  YOU MUST BE 21+ FOR THIS RESERVATION',
        price: 69
      },
      {
        ownerId: 3,
        address: '77 Woodpiper Ln',
        city: 'Orlando',
        state: 'FL',
        country: 'USA',
        lat: 23.59,
        lng: 154.07,
        name: '1BR Villa Family Resort near Disney - Free Parking',
        description: 'Worry free location. Short driving distance to Premium Outlets & Convention Center.',
        price: 107
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
