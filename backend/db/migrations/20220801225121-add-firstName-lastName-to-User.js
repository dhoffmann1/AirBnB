'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'firstName', Sequelize.STRING(30), {
      allowNull: false
    });
    await queryInterface.addColumn('Users', 'lastName', Sequelize.STRING(30), {
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'firstName');
    await queryInterface.removeColumn('Users', 'lastName');
  }
};
