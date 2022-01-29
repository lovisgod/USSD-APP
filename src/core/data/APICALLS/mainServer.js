/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import axios from 'axios';

const API_VERSION = 'v1';
const BASE_URL = `https://lottery-api.zendost.co/api/${API_VERSION}`;
const REGISTER_ENDPOINT = '/auth/signup-with-ussd';
const GET_DAILY_GAMES = '/game/fetch-games';
const GET_BET_TYPE = '/game-config/fetch-bettypes';
const GET_POTENTIAL_WIN = '/game/ticket/get-potential-winning';
const CREATE_TICKET = '/game/create-ticket';

class MainServer {
  static async register(args) {
    const { phoneNumber, email } = args;
    console.log(`${phoneNumber} ${email}`);
    const response = await axios.post(`${BASE_URL}${REGISTER_ENDPOINT}`, {
      phone: phoneNumber,
      email
    });
    console.log(response.data);
    if (response != null) {
      if (response.status === 201) {
        return 'END Registration completed!\n'
                     + `Your ID is ${phoneNumber};\n`
                     + 'Kindly note that this ID can be used to fund your Account directly from all Nigerian Banks'
                     + `Your Temporary Password is: ${response.data.data.tempPassword}`;
      }
      return 'END Registration failed. Please try again';
    }
    return 'END Registration failed. Please try again';
  }

  static async getDailyGames(args) {
    try {
      const { page, limit, currentWeekDay } = args;
      console.log(`${page} ${limit} ${currentWeekDay}`);
      console.log(`${BASE_URL}${GET_DAILY_GAMES}`);
      const response = await axios.get(`${BASE_URL}${GET_DAILY_GAMES}`, {
        params: {
          page,
          limit,
          currentWeekDay
        },
        headers: {
          'X-mobile-Authorization': '09059620514'
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
          message: 'END Could not fecch games, Please try again!!!'
        };
      }
      return {
        games: [],
        message: 'END Could not fecch games, Please try again!!!'
      };
    } catch (error) {
      console.log('error', error);
      return 'END An error Just occurred';
    }
  }

  static async getGameTypes(args) {
    try {
      const { page, limit } = args;
      console.log(`${page} ${limit}`);
      console.log(`${BASE_URL}${GET_BET_TYPE}`);
      const response = await axios.get(`${BASE_URL}${GET_BET_TYPE}`, {
        params: {
          page,
          limit,
        },
        headers: {
          'X-mobile-Authorization': '09059620514'
        }
      });
      console.log(response.status);
      if (response != null) {
        if (response.status === 200 && response.data.status === 'success') {
          return {
            games: response.data.data.data,
            message: 'success'
          };
        }
        return {
          games: [],
          message: 'END Could not fecth games, Please try again!!!'
        };
      }
      return {
        games: [],
        message: 'END Could not fecth games, Please try again!!!'
      };
    } catch (error) {
      console.log('error', error);
      return 'END An error Just occurred';
    }
  }

  static async getPotWining(args) {
    try {
      const {
        amount, betType, booster, resultType, selections
      } = args;
      console.log(`${amount} ${betType} ${selections}!!!`);
      console.log(`${BASE_URL}${GET_POTENTIAL_WIN}`);
      const data = JSON.stringify({
        amount,
        betType,
        booster: booster.toLowerCase(),
        resultType: resultType.toLowerCase(),
        selections
      });

      const config = {
        method: 'post',
        url: 'https://lottery-api.zendost.co/api/v1/game/ticket/get-potential-winning',
        headers: {
          'X-mobile-Authorization': '09059620514',
          'Content-Type': 'application/json'
        },
        data
      };
      const response = await axios(config);
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
      console.log('error', error);
      return {
        data: {},
        message: 'Could not fecth games, Please try again!!!'
      };
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
      } = args;
      console.log(`${amount} ${betType} ${selections}`);
      console.log(`${BASE_URL}${CREATE_TICKET}`);
      const data = JSON.stringify({
        gameId,
        linesCount,
        amount,
        totalStakedAmount,
        betType,
        booster: booster.toLowerCase(),
        resultType: resultType.toLowerCase(),
        selections
      });
      const config = {
        method: 'post',
        url: `${BASE_URL}${CREATE_TICKET}`,
        headers: {
          'X-mobile-Authorization': '09059620514',
          'Content-Type': 'application/json'
        },
        data
      };
      const response = await axios(config);
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
          message: `Could not create Ticket, Please try again!!! \n ${response.data.responsemessage}`
        };
      }
      return {
        data: {},
        message: 'Could not Create Ticket, Please try again!!!'
      };
    } catch (error) {
      console.log('error', error);
      if (error.response) {
        return {
          data: {},
          message: `Could not create Ticket, Please try again!!! \n ${error.response.data.responsemessage}`
        };
      }
      return {
        data: {},
        message: 'An error Just occurred'
      };
    }
  }
}

export default MainServer;
