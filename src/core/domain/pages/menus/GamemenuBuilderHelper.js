/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import HelperUtils from '../../../../utils/HelperUtils';
import GamePages from '../games';
import MainServer from '../../../data/APICALLS/mainServer';

const sessions = {};

class MenuBuilderHelper {
// static sessions = {};

  static async gameMenus(args, checkGame = false) {
    const gameType = '';
    const lotteryGameSelected = '';
    const menu = new UssdMenu();

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
        console.log(`set ${key} to ${value}`);
        // store key-value pair in current session
        sessions[sessionId][key] = value;
        callback();
      },

      get(sessionId, key) {
        return new Promise((resolve, reject) => {
          const value = sessions[sessionId][key];
          resolve(value);
        });
      }

    });

    if (checkGame) {
      console.log('got here here');
      menu.startState({
        run: () => {
          // use menu.con() to send response without terminating session
          menu.con(GamePages.checkGame());
        },
        next: {
          1: 'checkGame.code'
        }
      });
    } else {
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
    }

    menu.state('PlayGames', {
      run: () => {
        menu.con(GamePages.playGameMenu());
      },
      next: {
        1: 'LotteryGames',
        2: 'JackpotGames'
      }
    });

    menu.state('checkGame.code', {
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con('Please Enter your Game Code');
      },
      next: {
        '*\\d+': 'checkGame.result',
      }
    });

    menu.state('checkGame.result', {
      run: () => {
        // check game from the server and display the result to user
        menu.end('This will be your result');
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
        // fetch the games for the day of the week
        MainServer.getDailyGames(
          { page: 1, limit: 10, currentWeekDay: 6 }
        ).then((res) => {
          console.log('res', res);
          if (res.message === 'success') {
            menu.session.set('gamesDaily', res.games);
            if (res.games.length > 0) {
              let games = '';
              res.games.forEach((element) => {
                games += `${res.games.indexOf(element) + 1}.${element.name} - ${element.lotteryName}\n`;
              });
              console.log('games', games);
              menu.con(`${games}`);
            } else {
              menu.con(`No games for this day
              98. Main Menu
              99. Exit`);
            }
          } else {
            menu.con(`${res.message}
              98. Main Menu
              99. Exit`);
          }
        });
      },
      next: {
        '*\\d+': 'lottoGameType',
      }
    });

    // lottoGameTypes state
    menu.state('lottoGameType', {
      run: async () => {
        const input = menu.val;
        menu.session.set('gameType', input);
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
        '*\\d+': 'gameBoosters',
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
        '*\\d+,': 'validateInput',
      }
    });

    // validating user input
    menu.state('validateInput', {
      run: () => {
        console.log('got here here');
        const input = menu.val;
        console.log(input);
        let lotteryGamePlayed = '';
        menu.session.get('LotteryGamesType').then((gameType) => {
          lotteryGamePlayed = gameType;
          console.log('lotteryPlayedX', lotteryGamePlayed);
          if (lotteryGamePlayed === 'salary4Life') {
            let salarySelected = '';
            menu.session.get('salaryOptionselected').then((salarySelectedX) => {
              salarySelected = salarySelectedX;
              console.log('selectx', salarySelected);
              const inputArray = input.split(',');
              const valid = HelperUtils.checksalary4LifeInput(inputArray, salarySelected);
              if (valid) {
                menu.session.set('numbersSelected', input);
                menu.con(`Your Selections are ${input}
                  Kindly insert Bet Amount and Submit Your Bet.`);
              } else {
                menu.end('You have entered invalid length of numbers!!');
              }
            });
          }
        });
      },
      next: {
        '*\\d+': 'feedbackMenu'
      }
    });

    // instruction for lotto state
    menu.state('feedbackMenu', {
      run: async () => {
        const input = menu.val;
        let instruction = '';
        // send request to server to play game and get response
        // display response to user and display menu
        const gameType = await menu.session.get('gameType');
        const gamesDaily = await menu.session.get('gamesDaily');
        const game = gamesDaily[input - 1];
        console.log('game', game);
        let lottoGameName = '';
        const LotteryGamesType = await menu.session.get('LotteryGamesType');
        const resultType = await menu.session.get('resultType');
        const selectionsValue = await menu.session.get('numbersSelected');
        const booster = await menu.session.get('gameBooster');
        const betType = await menu.session.get('lottoGameName');
        const selections = selectionsValue.replace(/,/g, '-');
        if (LotteryGamesType === 'lottoIndoor'
         || LotteryGamesType === 'lottoGhana' || LotteryGamesType === 'legendaryLotto') {
          lottoGameName = await menu.session.get('lottoGameName');
          let pottentialWin = await menu.session.get('potentialWinning');
          pottentialWin = JSON.parse(pottentialWin);
          console.log('game', game);
          console.log('pottentialWin', pottentialWin);
          console.log('selections', selections);
          console.log('betType', betType);
          console.log('booster', booster);
          console.log(`${game} ${pottentialWin} ${selections}, ${betType}, ${booster}`);
          const bodyData = {
            gameId: game.gameId,
            linesCount: pottentialWin.linesCount,
            amount: pottentialWin.amount,
            totalStakedAmount: pottentialWin.totalStakedAmount,
            betType,
            booster,
            resultType,
            selections,
          };
          const response = await MainServer.createTicket(bodyData);
          console.log('response', response);
          if (response.message === 'success') {
            instruction = `${response.data.message}!
            Ticket Details are: 
            Ticket-ID => ${response.data.data.ticketId}
            
            1. Play Another Game.
            98. Main Menu.
            99. Exit.`;
            menu.con(instruction);
          } else {
            instruction = `Ticket creation not successful!
            1. Play Another Game.
            98. Main Menu.
            99. Exit.`;
            menu.con(instruction);
          }
        } else {
          instruction = `Bet Submitted Successfully!
          Ticket Details are: Ticket-ID, Pot. Winning, 
          Bet Amount:, Game Name, Bet-Type, Result Time, selections.
          
          1. Play Another Game.
          98. Main Menu.
          99. Exit.`;
          menu.con(instruction);
        }
      },
      next: {
        1: 'PlayGames'
      }
    });

    // get boosters
    menu.state('gameBoosters', {
      run: () => {
        const input = menu.val;
        // set the value selected for the game
        menu.session.set('numbersSelected', input);
        const instruction = `Select Game Booster.
        ${GamePages.getBoosters()}`;
        menu.con(instruction);
      },
      next: {
        '*\\d+': 'resultTypes'
      }
    });

    // result types
    menu.state('resultTypes', {
      run: () => {
        const boosterNumber = menu.val;
        // get value for the booster selected
        const boosterValue = GamePages.getBoosterfromInput(boosterNumber);
        // set the value selected for the game booster
        menu.session.set('gameBooster', boosterValue);
        const instruction = `Select Result type.
        ${GamePages.getReultTypes()}`;
        menu.con(instruction);
      },
      next: {
        '*\\d+': 'enterAmount'
      }
    });

    // result types
    menu.state('enterAmount', {
      run: async () => {
        const resultTypesNumber = menu.val;
        // get value for the booster selected
        const resultTypeValue = GamePages.getResultTypefromInput(resultTypesNumber);
        // set the value selected for the result type
        menu.session.set('resultType', resultTypeValue);
        menu.con(`Enter Bet Amount.
        98. Main Menu.
        99. Exit.`);
      },
      next: {
        '*\\d+': 'winingPot',
      }
    });

    // result types
    menu.state('winingPot', {
      run: async () => {
        const amount = menu.val;
        // get value for the booster selected
        const resultType = await menu.session.get('resultType');
        const selectionsValue = await menu.session.get('numbersSelected');
        const booster = await menu.session.get('gameBooster');
        const betType = await menu.session.get('lottoGameName');
        const selections = selectionsValue.replace(/,/g, '-');
        // get potential winning
        const bodyData = {
          amount, betType, booster, resultType, selections
        };
        MainServer.getPotWining(bodyData).then((response) => {
          console.log('response', response);
          if (response.message === 'success') {
            const instruction = `GAME SUMMARY
            Line Count - ${response.data.linesCount}
            Amount - ${response.data.amount}
            Total Staked Amount - ${response.data.totalStakedAmount}
            Potential Winning - ${response.data.potentialWinning}

            Kindly choose 1 to continue or 99 to Exit.

            1. Continue.
            99. Exit.`;
            menu.session.set('potentialWinning', JSON.stringify(response.data));
            menu.con(instruction);
          } else {
            menu.end('Error Occured');
          }
        });
      },
      next: {
        1: 'feedbackMenu',
      }
    });

    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }
}

export default MenuBuilderHelper;
