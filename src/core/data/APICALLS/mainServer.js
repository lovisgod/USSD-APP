/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import axios from 'axios';

const API_VERSION = 'v1';
const BASE_URL = `https://lottery-api.zendost.co/api/${API_VERSION}`;
const REGISTER_ENDPOINT = '/auth/signup-with-ussd';

class MainServer {
  static async register(args) {
    const { phoneNumber, email } = args;
    console.log(`${phoneNumber} ${email}`);
    const response = await axios.post(`${BASE_URL}${REGISTER_ENDPOINT}`, {
      phone: phoneNumber,
      email
    });
    if (response != null) {
      if (response.status === 200) {
        return 'END Registration completed!\n'
                     + `Your ID is ${phoneNumber};\n`
                     + 'Kindly note that this ID can be used to fund your Account directly from all Nigerian Banks';
      }
      return 'END Registration failed. Please try again';
    }
    return 'END Registration failed. Please try again';
  }
}

export default MainServer;