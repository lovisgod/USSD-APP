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
          return {
            games: response.data.data,
            // games: [
            //   {
            //     gameId: '1d1aff0d-2131-4a99-9eba-dcc37ac765b4',
            //     name: 'Cameroun',
            //     startTime: '14:15:00',
            //     endTime: '16:00:00',
            //     weekday: 2,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:54:34.000Z',
            //     updatedAt: '2022-01-19T10:54:34.000Z'
            //   },
            //   {
            //     gameId: '702abaf4-212b-49e3-8f78-21107d30960b',
            //     name: 'Abidjan',
            //     startTime: '12:15:00',
            //     endTime: '14:00:00',
            //     weekday: 2,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:54:17.000Z',
            //     updatedAt: '2022-01-19T10:54:17.000Z'
            //   },
            //   {
            //     gameId: 'd05b4829-6922-4c6c-b1ff-fb0532ab8bb4',
            //     name: 'Titans',
            //     startTime: '10:15:00',
            //     endTime: '12:00:00',
            //     weekday: 2,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:53:35.000Z',
            //     updatedAt: '2022-01-19T10:53:35.000Z'
            //   },
            //   {
            //     gameId: '1f8a9584-3182-4707-9780-2abc609dc0b5',
            //     name: 'Clans',
            //     startTime: '08:15:00',
            //     endTime: '10:00:00',
            //     weekday: 2,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:53:07.000Z',
            //     updatedAt: '2022-01-19T10:53:07.000Z'
            //   },
            //   {
            //     gameId: '48a8b074-47fb-44c1-a120-635e2214987b',
            //     name: 'Super Tuesday',
            //     startTime: '06:00:00',
            //     endTime: '08:00:00',
            //     weekday: 2,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:52:40.000Z',
            //     updatedAt: '2022-01-19T10:52:40.000Z'
            //   },
            //   {
            //     gameId: 'a6bd35c7-3e57-4771-917d-f1e02d7c7cfc',
            //     name: '9jc',
            //     startTime: '22:15:00',
            //     endTime: '00:00:00',
            //     weekday: 1,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:51:42.000Z',
            //     updatedAt: '2022-01-19T10:51:42.000Z'
            //   },
            //   {
            //     gameId: 'ab6ba542-2229-4a5b-998d-016951a9fa54',
            //     name: 'Abuja',
            //     startTime: '20:15:00',
            //     endTime: '22:00:00',
            //     weekday: 1,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:51:15.000Z',
            //     updatedAt: '2022-01-19T10:51:15.000Z'
            //   },
            //   {
            //     gameId: '43624a4c-4958-4c4a-aeee-a6f1e65abbcc',
            //     name: 'Imo',
            //     startTime: '18:15:00',
            //     endTime: '20:00:00',
            //     weekday: 1,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:50:45.000Z',
            //     updatedAt: '2022-01-19T10:50:45.000Z'
            //   },
            //   {
            //     gameId: '687b7f4d-9758-402a-9ffb-653474c9d029',
            //     name: 'Lokoja',
            //     startTime: '16:15:00',
            //     endTime: '18:00:00',
            //     weekday: 1,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:50:25.000Z',
            //     updatedAt: '2022-01-19T10:50:25.000Z'
            //   },
            //   {
            //     gameId: '05ddc89b-1ca8-47e7-bb42-403ca0c0bf3e',
            //     name: 'Ogun',
            //     startTime: '14:15:00',
            //     endTime: '16:00:00',
            //     weekday: 1,
            //     lotteryName: '5 of 90',
            //     lotteryId: 'bb40de09-e007-4a80-97b6-5ff3a62f5ecf',
            //     status: false,
            //     createdAt: '2022-01-19T10:50:03.000Z',
            //     updatedAt: '2022-01-19T10:50:03.000Z'
            //   }
            // ],
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
}

export default MainServer;
