/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Article_Profile', {
      profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      article_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Articles',
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
    await queryInterface.dropTable('Article_Profile');
  },
};
