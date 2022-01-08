/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
// import Wallet from '../domain/WalletModel.js';
import DataRepo from "./DataRepo.js";

/**
@class DataSource
* */
class DataSource {
  /**
   *
   * @param {DataRepo} dataRepo;
   */
  constructor(dataRepo) {
    this.datarepo = dataRepo;
  }

  // TRANSACTIONS

  /**
   * @method
   *@param { object } detail detail of the payment
   * @returns object
   */
  async performWalletTransaction(detail, token, transactionPin) {
    return this.datarepo.performWalletTransaction(
      detail,
      token,
      transactionPin
    );
  }

  /**
   * @method
   *@param { object } detail detail of the payment
   * @returns object
   */
  async adminFundWallet(detail, token) {
    return this.datarepo.TransferFromAdmin(token, detail);
  }

  /**
   * @method
   *@param { object } detail detail of the payment
   * @returns object
   */
  async adminDebitWallet(detail, token) {
    return this.datarepo.debitByAdmin(token, detail);
  }

  /**
   * @method
   *@param { object } detail detail of the payment
   * @returns object
   */
  async performWalletPaymentCodeTransaction(detail, token, transactionPin) {
    return this.datarepo.performWalletPaymentCodeTransaction(
      detail,
      token,
      transactionPin
    );
  }

  /**
   *
   * @param { object } transaction
   * @returns object
   */
  async createTransaction(transaction) {
    return this.datarepo.createTransaction(transaction);
  }

  /**
   *
   * @param {string} searchparameter
   * @param {any} dateObject this is nullable
   * @returns object
   */
  async findTransaction(searchparameter, dateObject = undefined) {
    return this.datarepo.findTransaction(searchparameter, dateObject);
  }

  /**
 *
 * @param {string} searchparameter
 * @param {any} dateObject this is nullable
 * @returns object
 */
  async findTransactionForAuser(searchparameter, dateObject = undefined, userUuid) {
    return this.datarepo.findTransactionForAuser(searchparameter, dateObject, userUuid);
  }

  // ACCOUNTS AND CARDS
  /**
   *
   * @param { BankAccountModel } ABankAccount
   * @returns BankAccountModel
   */
  async saveBankAccount(ABankAccount) {
    return this.datarepo.saveBankAccount(ABankAccount);
  }

  /**
   *
   * @param { CardModel } ABankCard
   * @returns CardModel
   */
  async saveBankCard(ABankCard) {
    return this.datarepo.saveBankCard(ABankCard);
  }

  /**
   *
   * @param { string } uuid
   * @returns Any
   */
  async deleteBankAccount(uuid) {
    return this.datarepo.deleteBankAccount(uuid);
  }

  /**
   *
   * @param { string } uuid
   * @param { string } userUuid
   * @returns Promise<BankAccount>
   */
  async findAnAccountBankAccount(uuid, userUuid) {
    return this.datarepo.findAnAccountBankAccount(uuid, userUuid);
  }

  /**
   *
   * @param { string } uuid
   * @returns Any
   */
  async deleteBankCard(uuid) {
    return this.datarepo.deleteBankCard(uuid);
  }

  /**
   *
   * @param { string } uuid
   * @param { string } userUuid
   * @returns Promise<BankAccount>
   */
  async findBankCard(uuid, userUuid) {
    return this.datarepo.findBankCard(uuid, userUuid);
  }

  /**
   *
   * @param { string } authorization_code
   * @param { string } userUuid
   * @returns Promise<BankAccount>
   */
  async findBankCardByAuthorization(authorization_code, userUuid) {
    return this.datarepo.findBankCardByAuthorization(
      authorization_code,
      userUuid
    );
  }

  /**
   *
   * @param { string } userUuid
   * @returns List<BankCard>
   */
  async findAllUserBankCard(userUuid) {
    return this.datarepo.findAllUserBankCard(userUuid);
  }

  /**
   *
   * @param { string } userUuid
   * @returns List<BankAccount>
   */
  async findAllUserBankAccount(userUuid) {
    return this.datarepo.findAllUserBankAccount(userUuid);
  }

  /**
   * @method
   * @param { object } bankObject bank oject inputed by the user
   * @returns object
   */
  async addBankAccount(bankObject) {
    const response = await this.datarepo.addBankAccount(bankObject);
    return response;
  }

  /**
   * @method
   *@param { string } reference reference of the payment
   *@param { string } otp otp sent to the use by the bank institution
   * @returns object
   */
  async verifyOtp(reference, otp) {
    const response = await this.datarepo.verifyOtp(reference, otp);
    return response;
  }

  /**
   * @method
   * @param { string } reference payment reference to be verified
   * @returns object
   */
  async verifyPayment(reference) {
    const response = await this.datarepo.verifyPayment(reference);
    return response;
  }

  /**
   * @method
   *@param { string } token token header
   *@param { string } authorizationCode the authorizationCode of the payment card
   * @returns object
   */
  async payWithCard(token, authorizationCode, email, amount) {
    return await this.datarepo.payWithCard(
      token,
      authorizationCode,
      email,
      amount
    );
  }

  /**
   * @method
   * @description this starts a transaction and create an otp for that transaction
   *@param { string } transaction_uuid reference of the transaction
   * @returns object
   */
  async startTransaction(transaction_uuid) {
    return await this.datarepo.startTransaction(transaction_uuid);
  }

  /**
   *@description this updates a transaction otp
   * @param { object } data
   * @returns object
   */
  async updatesTransactionotp(data) {
    return await this.datarepo.updatesTransactionotp(data);
  }

  /**
   *@description check if an otp exist and then check if it has not expired
   * @param { object } data
   * @returns boolean
   */
  async validateTransactionotp(data) {
    return await this.datarepo.validateTransactionotp(data);
  }

  /**
    * @method
    * @param {string} message the content of the notification
    * @param { string } title the title of the notification
    */
  async sendSmsTransactionNotification(message, title, token) {
    const response = await this.datarepo.sendSmsTransactionNotification(message, title, token);
    return response;
  }

  /**
    * @method
    * @param {string} message the content of the notification
    * @param { string } title the title of the notification
    */
  async sendEmailTransactionNotification(message, title) {
    const response = await this.datarepo.sendEmailTransactionNotification(message, title);
    return response;
  }

  /**
    * @method
    * @param {string} reason reason for the dispute
    * @param { string } transaction_uuid uuid of the transaction
    */
  async createTransactionDispute(reason, transaction_uuid, token, user_uuid) {
    const response = await this.datarepo.createTransactionDispute(reason,
      transaction_uuid, token, user_uuid);
    return response;
  }

  /**
    * @method
    * @param { string } transaction_uuid uuid of the transaction
    * @param { string } token the authentication token of the user
    */
  async closeTransactionDispute(transaction_uuid, user_uuid) {
    const response = await this.datarepo.closeTransactionDispute(transaction_uuid, user_uuid);
    return response;
  }
}

export default DataSource;
