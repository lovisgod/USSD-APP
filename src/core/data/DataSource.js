/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
// import Wallet from '../domain/WalletModel.js';
import DataRepo from './DataRepo.js';

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
   * @returns String
   */
  async page(text, phoneNumber, args) {
    return this.datarepo.page(
      text, phoneNumber, args
    );
  }
}

export default DataSource;
