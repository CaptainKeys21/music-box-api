/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id:{
        type: Sequelize.UUID,
        primaryKey: true
      },
      username: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.CHAR(100),
        allowNull: false,
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
