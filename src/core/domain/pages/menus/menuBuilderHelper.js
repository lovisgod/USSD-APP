/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import HelperUtils from '../../../../utils/HelperUtils';
import GamePages from '../games';

class MenuBuilderHelper {
  static async gameMenus(args) {
    const gameType = '';
    const lotteryGameSelected = '';
    const menu = new UssdMenu();

    const sessions = {};

    menu.sessionConfig({
      start(sessionId, callback) {
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        if (!(sessionId in sessions)) sessions[sessionId] = {};
        callback();
      },
      end(sessionId, callback) {
        // clear current session
        // this is called by menu.end()
        delete sessions[sessionId];
        callback();
      },
      set: (sessionId, key, value, callback) => {
        // store key-value pair in current session
        sessions[sessionId][key] = value;
        callback();
      },
      get(sessionId, key) {
        return new Promise((resolve, reject) => {
          const value = sessions[sessionId][key] ? sessions[sessionId][key] : '';
          resolve(value);
        });
      }
    });

    // Define menu states
    menu.startState({
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con(GamePages.firstPage());
      },
      // next object links to next state based on user input
      next: {
        1: 'PlayGames',
        2: 'PlayBookingCode'
      }
    });

    menu.state('PlayGames', {
      run: () => {
        menu.con(GamePages.playGameMenu());
      },
      next: {
        1: 'LotteryGames',
        2: 'JackpotGames'
      }
    });

    menu.state('PlayBookingCode', {
      run: () => {
        menu.con('Enter Booking code:');
      },
      next: {
        // using regex to match user input to next state
        '*\\d+': 'PlayBookingCode.code'
      }
    });

    // nesting states
    menu.state('PlayBookingCode.code', {
      run: () => {
        // use menu.val to access user input value
        const code = menu.val;
        menu.end('Booking completed.');
      }
    });

    // lottery games state
    menu.state('LotteryGames', {
      run: () => {
        menu.session.set('gameType', 'lottery');
        menu.con(GamePages.lotteryGameMenu());
      },
      next: {
        1: 'lottoIndoor',
        2: 'lottoGhana',
        3: 'salary4Life',
        4: 'legendaryLotto',
        5: 'PlayGames'
      }
    });

    // lottery games state
    menu.state('lottoIndoor', {
      run: () => {
        menu.session.set('LotteryGamesType', 'lottoIndoor');
        menu.con(GamePages.gameschedules());
      },
      // select day of week and go to next state
      next: {
        '*\\d+': 'loadedGamesforDailyGames',
      }
    });

    // lottery games state
    menu.state('lottoGhana', {
      run: () => {
        menu.session.set('LotteryGamesType', 'lottoGhana');
        menu.con(GamePages.gameschedules());
      },
      // select day of week and go to next state
      next: {
        '*\\d+': 'loadedGamesforDailyGames',
      }
    });

    // lottery games state
    menu.state('legendaryLotto', {
      run: () => {
        menu.session.set('LotteryGamesType', 'legendaryLotto');
        menu.con(GamePages.gameschedules());
      },
      // select day of week and go to next state
      next: {
        '*\\d+': 'loadedGamesforDailyGames',
      }
    });

    // loadedGamesforDailyGames state
    menu.state('loadedGamesforDailyGames', {
      run: () => {
        // get the day of the week choosen
        const code = menu.val;
        menu.con(GamePages.loadedGamesforDailyGames());
      },
      next: {
        '*\\d+': 'lottoGameType',
      }
    });

    // lottoGameTypes state
    menu.state('lottoGameType', {
      run: () => {
        menu.con(GamePages.lottoGameTypes());
      },
      next: {
        1: 'instructionForLotto',
        2: 'instructionForLotto',
        3: 'instructionForLotto',
        4: 'instructionForLotto',
        5: 'instructionForLotto',
        6: 'instructionForLotto',
        7: 'instructionForLotto',
        8: 'instructionForLotto',
        9: 'instructionForLotto',
        10: 'lottoGameType2',
        11: 'LotteryGames',
      }
    });

    // lottoGameTypes state
    menu.state('lottoGameType2', {
      run: () => {
        menu.con(GamePages.lottoGameTypes2());
      },
      next: {
        12: 'instructionForLotto',
        13: 'instructionForLotto',
        14: 'instructionForLotto',
        15: 'instructionForLotto',
        16: 'lottoGameType',
      }
    });

    // instruction for lotto state
    menu.state('instructionForLotto', {
      run: () => {
        const input = menu.val;
        const name = GamePages.getGameNameForInput(input);
        menu.session.set('lottoGameName', name);
        const instruction = GamePages.getGameInstructionForInput(input);
        menu.con(instruction);
      },
      next: {
        '*\\d+': 'amountmenu',
      }
    });

    // instruction for lotto state
    menu.state('amountmenu', {
      run: () => {
        const input = menu.val;
        menu.session.set('numbersSelected', input);
        const instruction = `Your Selections are ${input}
    Kindly insert Bet Amount and Submit Your Bet.`;
        menu.con(instruction);
      },
      next: {
        '*\\d+': 'feedbackMenu'
      }
    });

    // lottery games state
    menu.state('salary4Life', {
      run: () => {
        menu.session.set('LotteryGamesType', 'salary4Life');
        menu.con(GamePages.raffleDrawMenu());
      },
      next: {
        '*\\d+': 'salary4Life.code',
        6: 'LotteryGames'
      }
    });

    // nesting states
    menu.state('salary4Life.code', {
      run: () => {
        // use menu.val to access user input value
        const code = menu.val;
        // call the server to get the raffle draw
        menu.session.set('salaryOptionselected', code);
        const instruction = 'Please your selections between 1 and 39';
        menu.con(instruction);
      },
      next: {
        '(\\d+)(,\\s*\\d+)*': 'validateInput',
      }
    });

    // validating user input
    menu.state('validateInput', {
      run: () => {
        const input = menu.val;
        const gamePlayed = menu.session.get('gameType');
        console.log(gamePlayed);
        if (gamePlayed === 'lottery') {
          const lotteryGamePlayed = menu.session.get('LotteryGamesType');
          if (lotteryGamePlayed === 'Sala4Life') {
            const salarySelected = menu.session.get('salaryOptionselected');
            console.log(salarySelected);
            const inputArray = input.split(',');
            const valid = HelperUtils.checksalary4LifeInput(inputArray, salarySelected);
            if (valid) {
              menu.session.set('numbersSelected', input);
              menu.con(`Your Selections are ${input}
              Kindly insert Bet Amount and Submit Your Bet.`);
            } else {
              menu.end('You have entered invalid length of numbers');
            }
          }
        }
      },
      next: {
        '*\\d+': 'feedbackMenu'
      }
    });

    // instruction for lotto state
    menu.state('feedbackMenu', {
      run: () => {
        const amount = menu.val;
        // send request to server to play game and get response
        // display response to user and display menu
        const gameType = menu.session.get('gameType');
        let lottoGameName = '';
        const LotteryGamesType = menu.session.get('LotteryGamesType');
        if (LotteryGamesType === 'lottoIndoor'
     || LotteryGamesType === 'lottoGhana' || LotteryGamesType === 'legendaryLotto') {
          lottoGameName = menu.session.get('lottoGameName');
        }
        const numbersSelected = menu.session.get('numbersSelected');
        console.log(`${gameType} ${lottoGameName} ${numbersSelected} ${amount}`);
        const instruction = `Bet Submitted Successfully!
    Ticket Details are: Ticket-ID, Pot. Winning, 
    Bet Amount:${amount}, Game Name, Bet-Type, Result Time, selections.
    
    1. Play Another Game.
    98. Main Menu.
    99. Exit.`;
        menu.con(instruction);
      },
      next: {
        1: 'PlayGames'
      }
    });

    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }
}

export default MenuBuilderHelper;
