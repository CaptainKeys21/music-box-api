/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },

      slug: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },

      title: {
        type: Sequelize.CHAR(128),
        allowNull: false,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      imageUrl: {
        type: Sequelize.CHAR(128),
        allowNull: true,
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

  async down(queryInterface) {
    await queryInterface.dropTable('Articles');
  },
};
