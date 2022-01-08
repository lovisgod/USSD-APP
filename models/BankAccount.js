/* eslint-disable no-useless-escape */
const {
  Model, UUIDV4,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class BankAccount extends Model {
    // /**
    //  *
    //  * @param {Models} models
    //  */
    // static associate(models) {
    //   // define association here
    // }
  }
  BankAccount.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorization_code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    bin: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    last4: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    exp_month : {
      allowNull: true,
      type: DataTypes.STRING,
    },
    exp_year: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    channel: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    card_type: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    bank: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    country_code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    brand : {
      allowNull: true,
      type: DataTypes.STRING,
    },
    reusable: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    signature: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    account_name : {
      allowNull: false,
      type: DataTypes.STRING,
    },
    first_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    last_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    customer_code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'BankAccount',
    freezeTableName: true
  });
  // BankAccount.sync();
  return BankAccount;
};
