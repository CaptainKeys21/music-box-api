/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },

      slug: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },

      profile_name: {
        type: Sequelize.CHAR(100),
        allowNull: false,
      },

      local: {
        type: Sequelize.CHAR(255),
        allowNull: true,
      },

      website: {
        type: Sequelize.CHAR(255),
        allowNull: true,
      },

      bio: {
        type: Sequelize.CHAR(1024),
        allowNull: true,
      },

      image_url: {
        type: Sequelize.CHAR,
        allowNull: false,
      },

      user_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('Profiles');
  },
};
