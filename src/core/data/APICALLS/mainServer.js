/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import axios from 'axios';

const API_VERSION = 'v1';
const BASE_URL = `https://lottery-api.zendost.co/api/${API_VERSION}`;
const REGISTER_ENDPOINT = '/auth/signup-with-ussd';
const GET_DAILY_GAMES = '/game/fetch-games';

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
                     + 'Kindly note that this ID can be used to fund your Account directly from all Nigerian Banks';
      }
      return 'END Registration failed. Please try again';
    }
    return 'END Registration failed. Please try again';
  }

  static async getDailyGames(args) {
    const { page, limit, currentWeekDay } = args;
    console.log(`${page} ${limit} ${currentWeekDay}`);
    const response = await axios.get(`${BASE_URL}${GET_DAILY_GAMES}
    ?page=${page}&limit=${limit}&currentWeekDay=${currentWeekDay}`, {
      headers: {
        'X-mobile-Authorization': '09059620514'
      }
    });
    console.log(response.data);
    if (response != null) {
      if (response.status === 200 && response.data.status === 'success') {
        return {
          games: response.data.data.games,
          message: 'Success'
        };
      }
      return {
        games: [],
        message: 'END Could not fecch games, Please try again'
      };
    }
    return {
      games: [],
      message: 'END Could not fecch games, Please try again'
    };
  }
}

export default MainServer;
