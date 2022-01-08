/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */

// import db into this repo
import axios from 'axios';
import {
  BankAccount,
  BankCard,
  Transaction,
  Transactionotp,
  DisputedTransaction,
} from '../../../models';

import QrHelper from '../../utils/QRHelper';
import HelperUtils from '../../utils/HelperUtils';

const { Op } = require('sequelize');
const { sendSMS, sendEmail, sendEmailToUser } = require('../../utils/sendNotifications');
/**
 * @class
 */
class DataRepo {
  // PAY WITH BANK AND ACCOUNT ADDED

  /**
   *
   * @param {*} token
   * @param {*} authorizationCode
   * @param {*} email
   * @param {*} amount
   */
  async payWithCard(token, authorizationCode, email, amount) {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.PAYMENT_SERVICE_URL}/paystack/rechargetoken`,
        // headers: { 'authorization': `${token}` },
        data: {
          authorizationCode,
          email,
          amount
        }
      });

      console.log(response.data);
      if (response.data.status === 'success') {
        return response.data;
      }
      return {
        status: response.data.status,
        responsemessage: response.data.responsemessage,
      };
    } catch (error) {
      return error.response.data;
    }
  }

  // TRANSACTIONS
  /**
   * @param {*} token
   * @param {*} details detail of the payment
   */
  async TransferFromAdmin(token, details) {
    console.log('got here actually');
    const { reference, narration, amount } = details;

    const response = await axios({
      method: 'post',
      url: `${process.env.PAYMENT_SERVICE_URL}/admin-fund-user`,
      // headers: { 'authorization': `${token}` },
      data: {
        amount,
        trackingReference: reference,
        narration
      }
    });

    if (response.data.status === 'success') {
      return response.data;
    }
  }

  /**
   * @param {*} token
   * @param {*} details detail of the payment
   */
  async debitByAdmin(token, details) {
    const { reference, narration, amount } = details;
    const response = await axios({
      method: 'post',
      url: `${process.env.PAYMENT_SERVICE_URL}/admin-debit-user`,
      //  headers: { Authorization: `Bearer ${token}` },
      data: {
        amount,
        trackingReference: reference,
        narration
      }
    });
    console.log(response.data);
    if (response.data.status === 'success') {
      return response.data;
    }
    return {
      status: response.data.status,
      message: response.data.error,
    };
  }

  /**
   * @param {*} detail detail of the payment
   * @param {*} token
   * @param {*} transactionPin
   */
  async performWalletTransaction(detail, token, transactionPin) {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.WALLET_SERVICE_URL}/transfer/fund-to-fund`,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          toAccount: detail.toAccount,
          fromAccount: detail.fromAccount,
          amount: detail.amount,
          narration: detail.naration,
          transactionPin,
        },
      });
      console.log(response);
      if (response.data.status === 'success') {
        return response.data;
      }
      return {
        status: response.data.status,
        responsemessage: response.data.responsemessage,
      };
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }

  /**
   * @method
   *@param { object } detail detail of the payment
   * @returns object
   */
  async performWalletPaymentCodeTransaction(detail, token, transactionPin) {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.WALLET_SERVICE_URL}/payment-request/resolve`,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          code: detail.code,
          transactionPin,
        },
      });
      // console.log(response.data);
      if (response.data.status === 'success') {
        return response.data;
      }
      return {
        status: response.data.status,
        message: response.data.responsemessage,
      };
    } catch (error) {
      return error.response.data;
    }
  }

  /**
   * @method
   * @description this starts a transaction and create an otp for that transaction
   *@param { string } transaction_uuid reference of the transaction
   * @returns object
   */
  async startTransaction(transaction_uuid) {
    const code = await QrHelper.generate6Code();
    const otp = await this.createTransactionotp({
      otp: code,
      transaction_uuid,
    });
    return otp;
  }

  /**
   *@description this creates a transaction otp
   * @param { object } data
   * @returns object
   */
  async createTransactionotp(data) {
    return Transactionotp.create(data);
  }

  /**
   *@description check if an otp exist and then check if it has not expired
   * @param { object } data
   * @returns boolean
   */
  async validateTransactionotp(data) {
    let status = 'pending';
    const otpData = await Transactionotp.findOne({
      where: {
        otp: data.otp,
        transaction_uuid: data.transaction_uuid,
      },
    });
    if (otpData) {
      if (HelperUtils.timeHasElapsed(otpData.createdAt, Date.now(), 3600000)) {
        status = 'expired';
        return false;
      }
      status = 'verified';

      await this.updatesTransactionotp({
        transaction_uuid: data.transaction_uuid,
        otp: data.otp,
        status,
      });

      return true;
    }
    return false;
  }

  /**
   *@description this updates a transaction otp
   * @param { object } data
   * @returns object
   */
  async updatesTransactionotp(data) {
    const { transaction_uuid, otp, status } = data;
    return Transactionotp.update(
      { status },
      {
        where: {
          otp,
          transaction_uuid,
        },
      }
    );
  }

  /**
   *
   * @param { object } transaction
   * @returns object
   */
  async createTransaction(transaction) {
    return Transaction.create(transaction);
  }

  /**
   *
   * @param {string} searchparameter
   * @param {any} dateObject this is nullable
   * @returns object
   */
  async findTransaction(searchparameter, dateObject = undefined) {
    if (dateObject !== undefined) {
      return Transaction.findAll({
        where: {
          createdAt: {
            [Op.between]: [dateObject.startDate, dateObject.endDate],
          },
        },
      });
    }
    return Transaction.findAll({
      where: {
        [Op.or]: [
          // { uuid: searchParameter }, This option causes an invalid type error
          // { userUuid: searchParameter }, This option causes an invalid type error
          { receiver_uuid: searchparameter },
          { user_uuid: searchparameter },
          { status: searchparameter },
          { receiver_name: searchparameter },
          { sender_name: searchparameter },
          { sending_account: searchparameter },
          { receiving_account: searchparameter },
          { payment_type: searchparameter },
        ],
      },
    });
  }

  /**
   *
   * @param {string} searchparameter
   * @param {any} dateObject this is nullable
   * @returns object
   */
  async findTransactionForAuser(
    searchparameter,
    dateObject = undefined,
    userUuid
  ) {
    if (dateObject !== undefined) {
      return Transaction.findAll({
        where: {
          createdAt: {
            [Op.between]: [dateObject.startDate, dateObject.endDate],
            user_uuid: userUuid,
          },
        },
      });
    }
    return Transaction.findAll({
      where: {
        [Op.or]: [
          { [Op.and]: [{ receiver_uuid: searchparameter }, { user_uuid: userUuid }] },
          { [Op.and]: [{ status: searchparameter }, { user_uuid: userUuid }] },
          { [Op.and]: [{ receiver_name: searchparameter }, { user_uuid: userUuid }] },
          { [Op.and]: [{ sender_name: searchparameter }, { user_uuid: userUuid }] },
          { [Op.and]: [{ sending_account: searchparameter }, { user_uuid: userUuid }] },
          { [Op.and]: [{ receiving_account: searchparameter }, { user_uuid: userUuid }] },
          { [Op.and]: [{ payment_type: searchparameter }, { user_uuid: userUuid }] }
        ],
      },
    });
  }

  // ACCOUNTS AND CARDS
  /**
   *@description save a bank account
   * @param { BankAccountModel } ABankAccount
   * @returns BankAccountModel
   */
  async saveBankAccount(ABankAccount) {
    return BankAccount.create(ABankAccount);
  }

  /**
   *
   * @param { CardModel } ABankCard
   * @returns CardModel
   */
  async saveBankCard(ABankCard) {
    return BankCard.create(ABankCard);
  }

  /**
   *
   * @param { string } uuid
   * @returns Any
   */
  async deleteBankAccount(uuid) {
    return BankAccount.destroy({
      where: { uuid },
    });
  }

  /**
   *
   * @param { string } uuid
   * @param { string } userUuid
   * @returns BankAccount
   */
  async findAnAccountBankAccount(uuid, userUuid) {
    const account = await BankAccount.findOne({
      where: { uuid, userUuid },
    });
    return account;
  }

  /**
   *
   * @param { string } uuid
   * @returns Any
   */
  async deleteBankCard(uuid) {
    return BankCard.destroy({
      where: { uuid },
    });
  }

  /**
   *
   * @param { string } uuid
   * @param { string } userUuid
   * @returns BankCard
   */
  async findBankCard(uuid, userUuid) {
    const account = await BankCard.findOne({
      where: { uuid, userUuid },
    });
    return account;
  }

  /**
   *
   * @param { string } userUuid
   * @returns List<BankCard>
   */
  async findAllUserBankCard(userUuid) {
    const cards = await BankCard.findAll({
      where: { userUuid },
    });
    return cards;
  }

  /**
   *
   * @param { string } userUuid
   * @returns List<BankAccount>
   */
  async findAllUserBankAccount(userUuid) {
    const accounts = await BankAccount.findAll({
      where: { userUuid },
    });
    return accounts;
  }

  /**
   *
   * @param { string } uauthorization_codeuid
   * @param { string } userUuid
   * @returns BankAccount
   */
  async findBankCardByAuthorization(authorization_code, userUuid) {
    const account = await BankCard.findOne({
      where: { authorization_code, userUuid },
    });
    return account;
  }

  /**
   * @method
   * @param { object } bankObject bank oject inputed by the user
   * @returns object
   */
  async addBankAccount(bankObject) {
    /**
     *@param { string } email email of the user
     *@param { string } account_number account_number of the user
     *@param { string } code bankcode of the user
     *@param { string }  birthday birthday of the user
     */
    const {
      email, account_number, code, birthday
    } = bankObject;
    const response = await axios({
      method: 'post',
      url: `${process.env.PAYMENT_SERVICE_URL}/paystack/chargebank`,
      // headers: { Authorization: `Bearer ${process.env.paystack_secret_key}` },
      data: {
        email,
        account_number,
        code,
        birthday,
      },
    });
    console.log(response.data);
    if (
      response.data.status === 'success'
      && response.data.data.status === true
    ) {
      return response.data;
    }
    return {
      status: response.data.status,
      message: response.data.message,
    };
  }

  /**
   * @method
   *@param { string } reference reference of the payment
   *@param { string } otp otp sent to the use by the bank institution
   * @returns object
   */
  async verifyOtp(reference, otp) {
    const response = await axios({
      method: 'post',
      url: `${process.env.PAYMENT_SERVICE_URL}/paystack/submit-otp`,
      // headers: { Authorization: `Bearer ${process.env.paystack_secret_key}` },
      data: { reference, otp },
    });
    console.log(response.data);
    if (
      response.data.status === 'success'
      && response.data.data.status === true
    ) {
      return response.data;
    }
    return {
      status: response.data.status,
      message: response.data.message,
    };
  }

  /**
   * @method
   * @param { string } reference the reference from the payment made. this is
   * also used when a card is charged from SDK and reference is sent to the server
   * for verification. this is used when you want to add a payment card using paystack
   * @returns object
   */
  async verifyPayment(reference) {
    /**
     *@param { string } email reference of the payment you want to verify
     */
    const response = await axios({
      method: 'post',
      url: `${process.env.PAYMENT_SERVICE_URL}/paystack/verify-payment`,
      // headers: { Authorization: `Bearer ${process.env.paystack_secret_key}` },
      data: { reference },
    });
    if (
      response.data.status === 'success'
      && response.data.data.status === true
    ) {
      return response.data;
    }
    return {
      status: response.data.status,
      message: response.data.error,
    };
  }

  /**
    * @method
    * @param {string} message the content of the notification
    * @param { string } title the title of the notification
    * @param { string } token token to be passed into the header
    */
  async sendSmsTransactionNotification(message, title, token) {
    const response = await axios({
      method: 'post',
      url: `${process.env.NOTIFICATION_SERVICE_URL}/GeneralNotification/SendEmailNotification`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title,
        description: message,
      },
    });
    console.log(response.data);
  }

  /**
    * @method
    * @param {string} message the content of the notification
    * @param { string } title the title of the notification
    */
  async sendEmailTransactionNotification(message, title, userUuid) {
    const email = {
      title,
      message,
      userUuid,
      usage: 'Transaction',
    };
    await sendEmailToUser(email);
  }

  /**
    * @method
    * @param {string} reason reason for the dispute
    * @param { string } transaction_uuid uuid of the transaction
    */
  async createTransactionDispute(reason, transaction_uuid, token, user_uuid) {
    const response = await DisputedTransaction.create(
      {
        transaction_uuid,
        reason,
        userUuid: user_uuid,
      }
    );
    if (response) return true;
    return false;
  }

  /**
    * @method
    * @param { string } transaction_uuid uuid of the transaction
    * @param { string } token the authentication token of the user
    */
  async closeTransactionDispute(transaction_uuid, user_uuid) {
    const response = await DisputedTransaction.update(
      {
        status: 'closed'
      }, {
        where: {
          transaction_uuid
        }
      }
    );
    if (response) {
      this.sendEmailTransactionNotification('Transaction dispute as been closed',
        'Transaction Alert', user_uuid);
      return true;
    }
    return false;
  }

  // /**
  //   * @method
  //   * @param {string} reason reason for the dispute
  //   * @param { string } transaction_uuid uuid of the transaction
  //   */
  // async createTransactionDispute(reason, transaction_uuid, token) {
  //   const response = await DisputedTransaction.create(
  //     {
  //       transaction_uuid,
  //       reason
  //     }
  //   );

  //   if (response) return true;
  //   return false;
  // }

//   /**
//     * @method
//     * @param { string } transaction_uuid uuid of the transaction
//     * @param { string } token the authentication token of the user
//     */
//   async closeTransactionDispute(transaction_uuid, token) {
//     const response = await DisputedTransaction.update(
//       {
//         status: 'closed'
//       }, {
//         where: {
//           transaction_uuid
//         }
//       }
//     );
//     if (response) {
//       this.sendEmailTransactionNotification('Transaction dispute as been closed',
//         'Transaction Alert', token);
//       return true;
//     }
//     return false;
//   }
}

export default DataRepo;
