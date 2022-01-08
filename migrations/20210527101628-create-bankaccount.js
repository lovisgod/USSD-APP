'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BankAccount', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userUuid: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      authorization_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      bin: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last4: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      exp_month : {
        allowNull: true,
        type: Sequelize.STRING,
      },
      exp_year: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      channel: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      card_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bank: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      country_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      brand : {
        allowNull: true,
        type: Sequelize.STRING,
      },
      reusable: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      signature: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      account_name : {
        allowNull: false,
        type: Sequelize.STRING,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      customer_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BankAccount');
  },
};
