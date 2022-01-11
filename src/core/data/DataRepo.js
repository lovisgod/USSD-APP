/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */

import axios from 'axios';

import HelperUtils from '../../utils/HelperUtils';
import Ussd1 from '../domain/pages/ussd1';

/**
 * @class
 */
class DataRepo {
  /**
   *
   * @param {string} text - text sent by the ussd service
   * @param {string} phoneNumber - phone number of the user
   */
  async page(text, phoneNumber) {
    try {
      let page = '';
      switch (text) {
        case '':
          page = await Ussd1.page();
          break;
        case '1':
          page = await Ussd1.page();
          break;
        default:
          break;
      }
      return page;
    } catch (error) {
      return 'An error Just occurred';
    }
  }
}

export default DataRepo;
