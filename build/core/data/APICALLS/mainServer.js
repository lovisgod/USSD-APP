"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable require-jsdoc */

/* eslint-disable no-unused-vars */

/* eslint-disable max-len */
const API_VERSION = 'v1';
const BASE_URL = `https://lottery-api.zendost.co/api/${API_VERSION}`;
const REGISTER_ENDPOINT = '/auth/signup-with-ussd';
const GET_DAILY_GAMES = '/game/fetch-games';

function GET_BET_TYPE(name) {
  return `/site-settings/fetch-setting-by-slug/${name}`;
}

const GET_POTENTIAL_WIN = '/game/ticket/get-potential-winning';
const CREATE_TICKET = '/game/create-ticket';
const CHECK_RESULT = '/game/fetch-ticket-result';
const FETCH_BANK_LIST = '/fetch-banks';
const WITHDRAWAL = '/wallet/bank-withdrawal/initialize';

class MainServer {
  static async register(args) {
    try {
      const {
        phoneNumber,
        email
      } = args;
      console.log(`${phoneNumber} ${email}`);
      const response = await _axios.default.post(`${BASE_URL}${REGISTER_ENDPOINT}`, {
        phone: phoneNumber,
        email
      });
      console.log(response.data);

      if (response != null) {
        if (response.status === 201) {
          return 'Registration completed!\n' + `Your ID is ${phoneNumber};\n` + 'Kindly note that this ID can be used to fund your Account directly from all Nigerian Banks' + `Your Temporary Password is: ${response.data.data.tempPassword}`;
        }

        return 'Registration failed. Please try again';
      }

      return 'Registration failed. Please try again';
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getDailyGames(args) {
    try {
      const {
        page,
        limit,
        currentWeekDay
      } = args;
      console.log(`${page} ${limit} ${currentWeekDay}`);
      console.log(`${BASE_URL}${GET_DAILY_GAMES}`);
      const response = await _axios.default.get(`${BASE_URL}${GET_DAILY_GAMES}`, {
        params: {
          page,
          limit,
          currentWeekDay
        },
        headers: {
          'X-mobile-Authorization': '08123456789'
        }
      });
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          console.log(response.data.data.data);
          return {
            games: response.data.data.data,
            message: 'success'
          };
        }

        return {
          games: [],
          message: 'Could not fecch games, Please try again!!!'
        };
      }

      return {
        games: [],
        message: 'Could not fecch games, Please try again!!!'
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getGameTypes(args) {
    try {
      const {
        page,
        limit,
        name
      } = args;
      console.log(`${page} ${limit}`);
      console.log(`${BASE_URL}${GET_BET_TYPE(name)}`);
      const response = await _axios.default.get(`${BASE_URL}${GET_BET_TYPE(name)}`, {
        params: {
          page,
          limit
        },
        headers: {
          'X-mobile-Authorization': '08123456789'
        }
      });
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          return {
            games: JSON.parse(response.data.data.data.content),
            message: 'success'
          };
        }

        return {
          games: [],
          message: 'Could not fecth games, Please try again!!!'
        };
      }

      return {
        games: [],
        message: 'Could not fecth games, Please try again!!!'
      };
    } catch (error) {
      console.log(error);
      return {
        games: [],
        message: 'Could not fecth games, Please try again!!!'
      };
    }
  }

  static async getPotWining(args) {
    try {
      const {
        amount,
        betType,
        booster,
        resultType,
        selections,
        lotteryName,
        category
      } = args;
      console.log(`${amount} ${betType} ${selections}!!!`);
      console.log(`${BASE_URL}${GET_POTENTIAL_WIN}`);
      const data = JSON.stringify({
        betSlips: JSON.stringify(selections),
        category
      });
      const config = {
        method: 'post',
        url: 'https://lottery-api.zendost.co/api/v1/game/ticket/get-potential-winning',
        headers: {
          'X-mobile-Authorization': '08123456789',
          'Content-Type': 'application/json'
        },
        data
      };
      const response = await (0, _axios.default)(config);
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          console.log(response.data.data);
          return {
            data: response.data.data.data,
            message: 'success'
          };
        }

        return {
          data: {},
          message: `Could not fecth games, Please try again\n${response.data.responsemessage}`
        };
      }

      return {
        data: {},
        message: 'Could not fecth games, Please try again!!!'
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async createTicket(args) {
    try {
      const {
        gameId,
        linesCount,
        amount,
        totalStakedAmount,
        betType,
        booster,
        resultType,
        selections,
        bookingCode,
        isBooking,
        isSalary
      } = args;
      console.log(`${amount} ${betType} ${selections}`);
      console.log(`${BASE_URL}${CREATE_TICKET}`);
      let data;

      if (isBooking) {
        data = JSON.stringify({
          amount,
          bookingCode
        });
      } else if (isSalary) {
        data = JSON.stringify({
          amount,
          betType,
          selections
        });
      } else {
        data = JSON.stringify({
          gameId,
          linesCount,
          amount,
          totalStakedAmount,
          betType,
          booster: booster.toLowerCase(),
          resultType: resultType.toLowerCase(),
          selections
        });
      }

      const config = {
        method: 'post',
        url: `${BASE_URL}${CREATE_TICKET}`,
        headers: {
          'X-mobile-Authorization': '08123456789',
          'Content-Type': 'application/json'
        },
        data
      };
      const response = await (0, _axios.default)(config);
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          return {
            data: response.data.data,
            message: 'success'
          };
        }

        return {
          data: {},
          message: `Error Please try again!!! \n ${response.data.responsemessage}`
        };
      }

      return {
        data: {},
        message: 'Error, Please try again!!!'
      };
    } catch (error) {
      console.log('error', error);

      if (error.response) {
        return {
          data: {},
          message: `Error, Please try again!!! \n ${error.response.data.responsemessage}`
        };
      }

      return {
        data: {},
        message: 'An error Just occurred'
      };
    }
  }

  static async getTicketResult(args) {
    try {
      const {
        ticketId
      } = args;
      console.log(`${ticketId}`);
      console.log(`${BASE_URL}${CHECK_RESULT}`);
      const response = await _axios.default.get(`${BASE_URL}${CHECK_RESULT}/${ticketId}`, {
        headers: {
          'X-mobile-Authorization': '08123456789'
        }
      });
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          return {
            data: response.data.data.data,
            message: 'success'
          };
        }

        return {
          data: {},
          message: 'Could not fetch result, Please try again!!!'
        };
      }

      return {
        data: {},
        message: 'Could not fecth result, Please try again!!!'
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async getBankLists() {
    try {
      const response = await _axios.default.get(`${BASE_URL}${FETCH_BANK_LIST}`, {
        headers: {
          'X-mobile-Authorization': '08123456789'
        }
      });
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          return {
            data: response.data.data.data,
            message: 'success'
          };
        }

        return {
          data: {},
          message: 'Could not fetch banks, Please try again!!!'
        };
      }

      return {
        data: {},
        message: 'Could not fecth banks, Please try again!!!'
      };
    } catch (error) {
      console.log(error);
      return this.handleError(error);
    } // return {
    //   data: [
    //     {
    //       name: 'Abbey Mortgage Bank',
    //       slug: 'abbey-mortgage-bank',
    //       code: '801',
    //       longcode: '',
    //       gateway: null,
    //       pay_with_bank: false,
    //       active: true,
    //       is_deleted: false,
    //       country: 'Nigeria',
    //       currency: 'NGN',
    //       type: 'nuban',
    //       id: 174,
    //       createdAt: '2020-12-07T16:19:09.000Z',
    //       updatedAt: '2020-12-07T16:19:19.000Z'
    //     },
    //     {
    //       name: 'Above Only MFB',
    //       slug: 'above-only-mfb',
    //       code: '51204',
    //       longcode: '',
    //       gateway: null,
    //       pay_with_bank: false,
    //       active: true,
    //       is_deleted: null,
    //       country: 'Nigeria',
    //       currency: 'NGN',
    //       type: 'nuban',
    //       id: 188,
    //       createdAt: '2021-10-13T20:35:17.000Z',
    //       updatedAt: '2021-10-13T20:35:17.000Z'
    //     },
    //     {
    //       name: 'Access Bank',
    //       slug: 'access-bank',
    //       code: '044',
    //       longcode: '044150149',
    //       gateway: 'emandate',
    //       pay_with_bank: false,
    //       active: true,
    //       is_deleted: null,
    //       country: 'Nigeria',
    //       currency: 'NGN',
    //       type: 'nuban',
    //       id: 1,
    //       createdAt: '2016-07-14T10:04:29.000Z',
    //       updatedAt: '2020-02-18T08:06:44.000Z'
    //     },
    //     {
    //       name: 'Access Bank (Diamond)',
    //       slug: 'access-bank-diamond',
    //       code: '063',
    //       longcode: '063150162',
    //       gateway: 'emandate',
    //       pay_with_bank: false,
    //       active: true,
    //       is_deleted: null,
    //       country: 'Nigeria',
    //       currency: 'NGN',
    //       type: 'nuban',
    //       id: 3,
    //       createdAt: '2016-07-14T10:04:29.000Z',
    //       updatedAt: '2020-02-18T08:06:48.000Z'
    //     }
    //   ],
    //   message: 'success'
    // };

  }

  static async createWithdrawal(args) {
    try {
      const {
        accountNumber,
        bankCode,
        amount
      } = args;
      let data = null;
      console.log(`${BASE_URL}${WITHDRAWAL}`);
      data = {
        bankCode,
        accountNumber,
        accountName: 'customer name',
        amount
      };
      const config = {
        method: 'post',
        url: `${BASE_URL}${WITHDRAWAL}`,
        headers: {
          'X-mobile-Authorization': '09012345678',
          'Content-Type': 'application/json'
        },
        data
      };
      const response = await (0, _axios.default)(config);
      console.log(response.status);

      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          return {
            data: response.data.data.data,
            message: 'success'
          };
        }

        return {
          data: {},
          message: 'Could not make withdrawal, Please try again!!!'
        };
      }

      return {
        data: {},
        message: 'Could not make withdrawal, Please try again!!!'
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  static handleError(error) {
    if (error.response) {
      console.log('it is axios response');
      console.log('datatatata', error);
      return {
        data: {},
        message: `error, Please try again!!! \n REASON => ${error.response.data.responsemessage}`
      };
    }

    console.log(error);
    return {
      data: {},
      message: 'An error Just occurred'
    };
  }

}

var _default = MainServer;
exports.default = _default;