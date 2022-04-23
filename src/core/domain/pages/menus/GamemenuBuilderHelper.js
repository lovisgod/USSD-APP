/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import HelperUtils from '../../../../utils/HelperUtils';
import GamePages from '../games';
import MainServer from '../../../data/APICALLS/mainServer';

const sessions = {};
const betTypePageCount = 1;
let feedbackMenuToShow = '';

class MenuBuilderHelper {
// static sessions = {};

  static async gameMenus(args, checkGame = false, menu) {
    const gameType = '';
    const lotteryGameSelected = '';

    // Define menu states
    menu.state('Play Games', {
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
    // }

    menu.state('PlayGames', {
      run: async () => {
        // check game from the server and display the result to user
        const data = { name: 'game-categories' };
        const res = await MainServer.getGamesCategories(data);
        console.log('this is it', res);
        if (res.message === 'success') {
          if (res.games.length > 0) {
            menu.session.set('gamescategorys', JSON.stringify(res.games));
            let games = '';
            res.games.forEach((element) => {
              games += `${res.games.indexOf(element) + 1}. ${element}\n`;
            });
            console.log('games', games);
            menu.con(`${games}`);
          } else {
            menu.con(`No games category fetch
              98. Main Menu
              99. Exit`);
          }
        } else {
          menu.con(`${res.message}
      98. Main Menu
      99. Exit`);
        }
        menu.con(GamePages.lotteryGameMenu());
      },
      next: {
        '*\\d+': 'fetchCategoryGames',
      }
    });

    menu.state('fetchCategoryGames', {
      run: async () => {
        console.log('input', menu.val);
        const input = menu.val;
        const gamescategorys = await menu.session.get('gamescategorys');
        console.log('gamescategorys', gamescategorys);
        const gameCategory = JSON.parse(gamescategorys)[input - 1];
        console.log('gameCategory', gameCategory);
        menu.session.set('gameCategory', gameCategory);
        // check game from the server and display the result to user
        const data = { name: gameCategory, page: 1, limit: 10 };
        const res = await MainServer.getGamesForcategory(data);
        console.log('this is it', res);
        if (res.message === 'success') {
          if (res.games.length > 0) {
            menu.session.set('games', JSON.stringify(res.games));
            let games = '';
            res.games.forEach((element) => {
              games += `${res.games.indexOf(element) + 1}.${element.name} - ${element.lotteryName}\n`;
            });
            console.log('games', games);
            menu.con(`${games}`);
          } else {
            menu.con(`No games for this category
                      98. Main Menu
                      99. Exit`);
          }
        } else {
          menu.con(`${res.message}
          98. Main Menu
          99. Exit`);
        }
      },
      next: {
        '*\\d+': 'getBetTypeMenu',
      }
    });

    menu.state('getBetTypeMenu', {
      run: async () => {
        const input = menu.val;
        const games = await menu.session.get('games');
        const game = JSON.parse(games)[input - 1];
        console.log('game', game);
        menu.session.set('game', game);
        let show = '';
        const betOptions = JSON.parse(game.Lottery.betOptions);
        const resultOptions = JSON.parse(game.Lottery.resultOptions);
        menu.session.set('gameid', game.gameId);
        menu.session.set('lotteryid', game.lotteryId);
        // game.Lottery.betOptions = betOptions;
        menu.session.set('game', JSON.stringify(game));
        menu.session.set('betOptions', JSON.stringify(betOptions));
        menu.session.set('resultOptions', JSON.stringify(resultOptions));
        betOptions.forEach((element) => {
          show += `${betOptions.indexOf(element) + 1}. ${element.name}\n`;
        });
        menu.con(show);
      },
      next: {
        '*\\d+': 'getResultTypeMenu',
      }
    });

    menu.state('getResultTypeMenu', {
      run: async () => {
        const input = menu.val;
        console.log('just got here');
        const game = await menu.session.get('game');
        let betOptions = await menu.session.get('betOptions');
        let resultOptions = await menu.session.get('resultOptions');
        betOptions = JSON.parse(betOptions);
        const betTypeChosen = betOptions[input - 1];
        console.log('betTypeChosen', betTypeChosen);
        menu.session.set('betTypeChosen', betTypeChosen);
        resultOptions = JSON.parse(resultOptions);
        console.log('resultOptions', resultOptions);
        let show = '';
        resultOptions.forEach((element) => {
          show += `${resultOptions.indexOf(element) + 1}. ${element}\n`;
        });
        menu.con(show);
      },
      next: {
        '*\\d+': 'selectionInputMenu',
      }
    });

    menu.state('selectionInputMenu', {
      run: async () => {
        const input = menu.val;
        const resultOptions = await menu.session.get('resultOptions');
        const resultOption = JSON.parse(resultOptions)[input - 1];
        console.log('resultOptions', resultOption);
        menu.session.set('resultOptionChoosen', resultOption);
        const instruction = 'Enter your selectiions here';
        menu.con(instruction);
      },
      next: {
        '*\\d+': 'amountmenu'
      }
    });

    menu.state('amountmenu', {
      run: () => {
        const input = menu.val;
        menu.session.set('numbersSelected', input);
        const instruction = `Your Selections are ${input}
          Kindly insert Bet Amount and Submit Your Bet.`;
        menu.con(instruction);
      },
      next: {
        '*\\d+': 'winingPot'
      }
    });

    // POTENTIAL WINNING

    // result types
    menu.state('winingPot', {
      run: async () => {
        const amount = menu.val;
        // get value for the booster selected
        const resultType = await menu.session.get('resultOptionChoosen');
        const selectionsValue = await menu.session.get('numbersSelected');
        const booster = 'default';
        const betTypeChosen = await menu.session.get('betTypeChosen');
        const betType = betTypeChosen.name;
        const gameTypex = await menu.session.get('gameCategory');
        const selections = selectionsValue.replace(/,/g, '-');
        const lotteryId = await menu.session.get('lotteryid');

        console.log('lotteryIID', lotteryId);
        console.log('betType', betType);

        // set summary menu to show based on game type selected

        if (gameTypex === 'salary4life') {
          feedbackMenuToShow = 'salary4lifefeedbackMenu';
        } else {
          feedbackMenuToShow = 'feedbackMenu';
        }
        // get potential winning
        const bodyData = {
          lotteryId,
          amount,
          betType,
          booster,
          resultType,
          category: gameTypex,
          selections: [{
            booster: booster || null, resultType: resultType || null, amount, selections, betType
          }],
          lotteryName: gameTypex,
        };
        MainServer.getPotWining(bodyData).then((response) => {
          console.log('response', response);
          console.log('xxxx', response.data.data);
          if (response.message === 'success') {
            const instruction = `GAME SUMMARY
            Line Count - ${response.data.data.linesCount}
            Total Staked Amount - ${response.data.data.totalStakedAmount}
            Potential Winning - ${response.data.data.totalPotentialWinning}

            Kindly choose 1 to continue or 99 to Exit.

            1. Continue.
            99. Exit.`;
            menu.session.set('potentialWinning', JSON.stringify(response.data.data));
            menu.con(instruction);
          } else {
            console.log('response', response);
            menu.end(`Error Occured \n ${response.message}`);
          }
        });
      },
      next: {
        1: feedbackMenuToShow,
      }
    });

    // CREATE TICKET

    menu.state('feedbackMenu', {
      run: async () => {
        const input = menu.val;
        const potWining = await menu.session.get('potentialWinning');
        console.log('potWining', potWining);
        const game = await menu.session.get('game');
        const gameIdx = await menu.session.get('gameid');
        const { linesCount, totalStakedAmount, betSlips } = JSON.parse(potWining);

        const response = await MainServer.createTicket({
          gameId: gameIdx,
          linesCount,
          totalStakedAmount,
          betSlips
        });
        console.log('response', response);
        let instruction = '';
        if (response.message === 'success') {
          instruction = `${response.data.message}!
            Ticket Details are:
            Ticket-ID => ${response.data.data.ticketId}

            1. Play Another Game.
            98. Main Menu.
            99. Exit.`;
          menu.con(instruction);
        } else {
          instruction = `${response.message}
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

    // menu.state('checkGame.code', {
    //   run: () => {
    //     // use menu.con() to send response without terminating session
    //     menu.con('Please Enter your Game Ticket ID');
    //   },
    //   next: {
    //     '*\\d+': 'checkGame.result',
    //   }
    // });

    // menu.state('checkGame.result', {
    //   run: async () => {
    //     const input = menu.val;
    //     // check game from the server and display the result to user
    //     const data = { ticketId: input };
    //     const response = await MainServer.getTicketResult(data);
    //     console.log('this is it', response);
    //     if (response.message === 'success') {
    //       menu.con(`${response.message}
    //       haswon: ${response.data.haswon}
    //       total Win Amount: ${response.data.totalWinAmount}
    //       98. Main Menu
    //       99. Exit`);
    //     } else {
    //       menu.con(`${response.message}
    //       98. Main Menu
    //       99. Exit`);
    //     }
    //   }
    // });

    // // lottery games state
    // menu.state('LotteryGames', {
    //   run: () => {
    //     menu.session.set('gameType', 'lottery');
    //     menu.con(GamePages.lotteryGameMenu());
    //   },
    //   next: {
    //     1: 'lottoIndoor',
    //     2: 'lottoGhana',
    //     3: 'salary4Life',
    //     4: 'legendaryLotto',
    //     5: 'mega-7',
    //     6: 'PlayGames'
    //   }
    // });

    // // lottery games state
    // menu.state('lottoIndoor', {
    //   run: () => {
    //     menu.session.set('LotteryGamesType', 'lottoIndoor');
    //     menu.con(GamePages.gameschedules());
    //   },
    //   // select day of week and go to next state
    //   next: {
    //     '*\\d+': 'loadedGamesforDailyGames',
    //   }
    // });

    // // lottery games state
    // menu.state('lottoGhana', {
    //   run: () => {
    //     menu.session.set('LotteryGamesType', 'lottoGhana');
    //     menu.con(GamePages.gameschedules());
    //   },
    //   // select day of week and go to next state
    //   next: {
    //     '*\\d+': 'loadedGamesforDailyGames',
    //   }
    // });

    // // lottery games state
    // menu.state('legendaryLotto', {
    //   run: () => {
    //     menu.session.set('LotteryGamesType', 'legendaryLotto');
    //     menu.con(GamePages.gameschedules());
    //   },
    //   // select day of week and go to next state
    //   next: {
    //     '*\\d+': 'loadedGamesforDailyGames',
    //   }
    // });

    // // loadedGamesforDailyGames state
    // menu.state('loadedGamesforDailyGames', {
    //   run: () => {
    //     // get the day of the week choosen
    //     const code = menu.val;
    //     // fetch the games for the day of the week
    //     MainServer.getDailyGames(
    //       { page: 1, limit: 10, currentWeekDay: code }
    //     ).then((res) => {
    //       console.log('res', res);
    //       if (res.message === 'success') {
    //         menu.session.set('gamesDaily', res.games);
    //         if (res.games.length > 0) {
    //           let games = '';
    //           res.games.forEach((element) => {
    //             games += `${res.games.indexOf(element) + 1}.${element.name} - ${element.lotteryName}\n`;
    //           });
    //           console.log('games', games);
    //           menu.con(`${games}`);
    //         } else {
    //           menu.con(`No games for this day
    //           98. Main Menu
    //           99. Exit`);
    //         }
    //       } else {
    //         menu.con(`${res.message}
    //           98. Main Menu
    //           99. Exit`);
    //       }
    //     });
    //   },
    //   next: {
    //     '*\\d+': 'lottoGameType',
    //   }
    // });

    // // lottoGameTypes state
    // menu.state('lottoGameType', {
    //   run: async () => {
    //     const input = menu.val;
    //     menu.session.set('gameType', input);
    //     // fetch bet types
    //     const response = await MainServer.getGameTypes({ page: betTypePageCount, limit: 10, name: 'five-ninety-bet-options' });
    //     if (response.message === 'success') {
    //       if (response.games.length > 0) {
    //         menu.session.set('betTypes', response.games);
    //         let games = '';
    //         response.games.forEach((element) => {
    //           games += `${element.number}.${element.value}\n`;
    //         });
    //         console.log('games', games);
    //         menu.con(`${games}
    //         96. Back
    //         97.Next Page
    //         98. Main Menu
    //         99. Exit`);
    //       } else {
    //         menu.con(`No bet type available
    //         98. Main Menu
    //         99. Exit`);
    //       }
    //     }
    //     // menu.con(GamePages.lottoGameTypes());
    //   },
    //   next: {
    //     '*\\d+': 'instructionForLotto',
    //     96: 'LotteryGames',
    //     97: 'lottoGameType2'
    //   }
    // });

    // // lottoGameTypes state
    // menu.state('lottoGameType2', {
    //   run: async () => {
    //     betTypePageCount += 1;
    //     // fetch bet types
    //     const response = await MainServer.getGameTypes({ page: betTypePageCount, limit: 10, name: '5-of-90' });
    //     if (response.message === 'success') {
    //       if (response.games.length > 0) {
    //         let betypesAlreadySaved = await menu.session.get('betTypes');
    //         betypesAlreadySaved = betypesAlreadySaved.concat(response.games);
    //         menu.session.set('betTypes', betypesAlreadySaved);
    //         let games = '';
    //         response.games.forEach((element) => {
    //           games += `${element.number}.${element.value}\n`;
    //         });
    //         console.log('games', games);
    //         menu.con(`${games}
    //          96. Back
    //          97.Next Page
    //          98. Main Menu
    //          99. Exit`);
    //       } else {
    //         menu.con(`No bet type available
    //          96. Back
    //          98. Main Menu
    //          99. Exit`);
    //       }
    //     }
    //     // menu.con(GamePages.lottoGameTypes2());
    //   },
    //   next: {
    //     '*\\d+': 'instructionForLotto',
    //     96: 'LotteryGames',
    //     97: 'lottoGameType2'
    //   }
    // });

    // // instruction for lotto state
    // menu.state('instructionForLotto', {
    //   run: async () => {
    //     const input = menu.val;
    //     const betTypes = await menu.session.get('betTypes');
    //     const betType = betTypes[input - 1];
    //     menu.session.set('lottoGameName', betType.value);
    //     // const instruction = GamePages.getGameInstructionForInput(input);
    //     const instruction = `${betType.description}instruction will be here!!!`;
    //     menu.con(instruction);
    //   },
    //   next: {
    //     '*\\d+': 'gameBoosters',
    //   }
    // });

    // // instruction for lotto state
    // menu.state('amountmenu', {
    //   run: () => {
    //     const input = menu.val;
    //     menu.session.set('numbersSelected', input);
    //     const instruction = `Your Selections are ${input}
    // Kindly insert Bet Amount and Submit Your Bet.`;
    //     menu.con(instruction);
    //   },
    //   next: {
    //     '*\\d+': 'feedbackMenu'
    //   }
    // });

    // // SALARY FOR LIFE SESSION //

    // // mega 7 games menu
    // menu.state('mega-7', {
    //   run: async () => {
    //     menu.session.set('LotteryGamesType', 'mega-7');
    //     const response = await MainServer.getGameTypes({
    //       page: betTypePageCount,
    //       limit: 10,
    //       name: 'mega-7'
    //     });
    //     if (response.message === 'success') {
    //       if (response.games.length > 0) {
    //         menu.session.set('betTypes', response.games);
    //         let games = '';
    //         response.games.forEach((element) => {
    //           games += `${element.number + 1}.${element.value}\n`;
    //         });
    //         console.log('games', games);
    //         menu.con(`${games}
    //         96. Back
    //         98. Main Menu
    //         99. Exit`);
    //       } else {
    //         menu.con(`No bet type available
    //         98. Main Menu
    //         99. Exit`);
    //       }
    //     } else {
    //       menu.con(`cannot fetch bet type available
    //       98. Main Menu
    //       99. Exit`);
    //     }
    //     // menu.con(GamePages.raffleDrawMenu());
    //   },
    //   next: {
    //     '*\\d+': 'salary4Life.code',
    //     96: 'LotteryGames'
    //   }
    // });

    // // lottery games state
    // menu.state('salary4Life', {
    //   run: async () => {
    //     menu.session.set('LotteryGamesType', 'salary4life');
    //     const response = await MainServer.getGameTypes({
    //       page: betTypePageCount,
    //       limit: 10,
    //       name: 'salary-for-life-bet-options'
    //     });
    //     if (response.message === 'success') {
    //       if (response.games.length > 0) {
    //         menu.session.set('betTypes', response.games);
    //         let games = '';
    //         response.games.forEach((element) => {
    //           games += `${element.number}.${element.value}\n`;
    //         });
    //         console.log('games', games);
    //         menu.con(`${games}
    //         96. Back
    //         98. Main Menu
    //         99. Exit`);
    //       } else {
    //         menu.con(`No bet type available
    //         98. Main Menu
    //         99. Exit`);
    //       }
    //     } else {
    //       menu.con(`cannot fetch bet type available
    //       98. Main Menu
    //       99. Exit`);
    //     }
    //     // menu.con(GamePages.raffleDrawMenu());
    //   },
    //   next: {
    //     '*\\d+': 'salary4Life.code',
    //     96: 'LotteryGames'
    //   }
    // });

    // // nesting states
    // menu.state('salary4Life.code', {
    //   run: async () => {
    //     const input = menu.val;
    //     // const name = GamePages.getGameNameForInput(input);
    //     const betTypes = await menu.session.get('betTypes');
    //     const betType = betTypes[input - 1];
    //     menu.session.set('lottoGameName', betType.value);
    //     // const instruction = GamePages.getGameInstructionForInput(input);
    //     const instruction = betType.description.toString().length > 0
    //       ? `${betType.description}` : 'instruction will be here!!!';
    //     menu.con(instruction);
    //   },
    //   next: {
    //     '*\\d+,': 'salaryenterAmount',
    //   }
    // });

    // // enter amount for salary4life

    // menu.state('salaryenterAmount', {
    //   run: async () => {
    //     const inputSelected = menu.val;
    //     // set the input selected to the session
    //     menu.session.set('numbersSelected', inputSelected);
    //     // enter amount and submit
    //     menu.con(`Enter Bet Amount.
    //     98. Main Menu.
    //     99. Exit.`);
    //   },
    //   next: {
    //     '*\\d+': 'winingPot',
    //   }
    // });

    // // make request to book ticket for salary4life
    // menu.state('salary4lifefeedbackMenu', {
    //   run: async () => {
    //     const input = menu.val;
    //     let instruction = '';
    //     // send request to server to play game and get response
    //     // display response to user and display menu
    //     const amount = input;
    //     const selectionsValues = await menu.session.get('numbersSelected');
    //     const selections = selectionsValues.replace(/,/g, '-');
    //     const gameType = await menu.session.get('gameType');
    //     const betType = await menu.session.get('lottoGameName');
    //     let potentialWin = await menu.session.get('potentialWinning');
    //     potentialWin = JSON.parse(potentialWin);
    //     const bodyData = {
    //       amount,
    //       betType,
    //       selections,
    //       isSalary: true,
    //       betSlips: potentialWin.betSlips
    //     };
    //     const response = await MainServer.createTicket(bodyData);
    //     console.log('response', response);
    //     if (response.message === 'success') {
    //       instruction = `${response.data.message}!
    //         Ticket Details are:
    //         Ticket-ID => ${response.data.data.ticketId}

    //         1. Play Another Game.
    //         98. Main Menu.
    //         99. Exit.`;
    //       menu.con(instruction);
    //     } else {
    //       instruction = `${response.message}
    //         1. Play Another Game.
    //         98. Main Menu.
    //         99. Exit.`;
    //       menu.con(instruction);
    //     }
    //   },
    //   next: {
    //     1: 'PlayGames'
    //   }
    // });

    // // validating user input
    // menu.state('validateInput', {
    //   run: () => {
    //     console.log('got here here');
    //     const input = menu.val;
    //     console.log(input);
    //     let lotteryGamePlayed = '';
    //     menu.session.get('LotteryGamesType').then((gameType) => {
    //       lotteryGamePlayed = gameType;
    //       console.log('lotteryPlayedX', lotteryGamePlayed);
    //       if (lotteryGamePlayed === 'salary4Life') {
    //         let salarySelected = '';
    //         menu.session.get('salaryOptionselected').then((salarySelectedX) => {
    //           salarySelected = salarySelectedX;
    //           console.log('selectx', salarySelected);
    //           const inputArray = input.split(',');
    //           const valid = HelperUtils.checksalary4LifeInput(inputArray, salarySelected);
    //           if (valid) {
    //             menu.session.set('numbersSelected', input);
    //             menu.con(`Your Selections are ${input}
    //               Kindly insert Bet Amount and Submit Your Bet.`);
    //           } else {
    //             menu.end('You have entered invalid length of numbers!!');
    //           }
    //         });
    //       }
    //     });
    //   },
    //   next: {
    //     '*\\d+': 'feedbackMenu'
    //   }
    // });

    // // instruction for lotto state
    // menu.state('feedbackMenu', {
    //   run: async () => {
    //     const input = menu.val;
    //     let instruction = '';
    //     // send request to server to play game and get response
    //     // display response to user and display menu
    //     const gameType = await menu.session.get('gameType');
    //     const gamesDaily = await menu.session.get('gamesDaily');
    //     const game = gamesDaily[input - 1];
    //     console.log('game', game);
    //     let lottoGameName = '';
    //     const LotteryGamesType = await menu.session.get('LotteryGamesType');
    //     const resultType = await menu.session.get('resultType');
    //     const selectionsValue = await menu.session.get('numbersSelected');
    //     const booster = await menu.session.get('gameBooster');
    //     const betType = await menu.session.get('lottoGameName');
    //     const selections = selectionsValue.replace(/,/g, '-');
    //     if (LotteryGamesType === 'lottoIndoor'
    //      || LotteryGamesType === 'lottoGhana' || LotteryGamesType === 'legendaryLotto') {
    //       lottoGameName = await menu.session.get('lottoGameName');
    //       let pottentialWin = await menu.session.get('potentialWinning');
    //       pottentialWin = JSON.parse(pottentialWin);
    //       console.log('game', game);
    //       console.log('pottentialWin', pottentialWin);
    //       console.log('selections', selections);
    //       console.log('betType', betType);
    //       console.log('booster', booster);
    //       console.log(`${game} ${pottentialWin} ${selections}, ${betType}, ${booster}`);
    //       const bodyData = {
    //         gameId: game.gameId,
    //         linesCount: pottentialWin.linesCount,
    //         amount: pottentialWin.amount,
    //         totalStakedAmount: pottentialWin.totalStakedAmount,
    //         betType,
    //         booster,
    //         resultType,
    //         selections,
    //       };
    //       const response = await MainServer.createTicket(bodyData);
    //       console.log('response', response);
    //       if (response.message === 'success') {
    //         instruction = `${response.data.message}!
    //         Ticket Details are:
    //         Ticket-ID => ${response.data.data.ticketId}

    //         1. Play Another Game.
    //         98. Main Menu.
    //         99. Exit.`;
    //         menu.con(instruction);
    //       } else {
    //         instruction = `${response.message}
    //         1. Play Another Game.
    //         98. Main Menu.
    //         99. Exit.`;
    //         menu.con(instruction);
    //       }
    //     } else {
    //       instruction = `Bet Submitted Successfully!
    //       Ticket Details are: Ticket-ID, Pot. Winning,
    //       Bet Amount:, Game Name, Bet-Type, Result Time, selections.

    //       1. Play Another Game.
    //       98. Main Menu.
    //       99. Exit.`;
    //       menu.con(instruction);
    //     }
    //   },
    //   next: {
    //     1: 'PlayGames'
    //   }
    // });

    // // get boosters
    // // TODO: Write codes for getting boosters;
    // menu.state('gameBoosters', {
    //   run: () => {
    //     const input = menu.val;
    //     // set the value selected for the game
    //     menu.session.set('numbersSelected', input);
    //     const instruction = `Select Game Booster.
    //     ${GamePages.getBoosters()}`;
    //     menu.con(instruction);
    //   },
    //   next: {
    //     '*\\d+': 'resultTypes'
    //   }
    // });

    // // result types
    // menu.state('resultTypes', {
    //   run: () => {
    //     const boosterNumber = menu.val;
    //     // get value for the booster selected
    //     const boosterValue = GamePages.getBoosterfromInput(boosterNumber);
    //     // set the value selected for the game booster
    //     menu.session.set('gameBooster', boosterValue);
    //     const instruction = `Select Result type.
    //     ${GamePages.getReultTypes()}`;
    //     menu.con(instruction);
    //   },
    //   next: {
    //     '*\\d+': 'enterAmount'
    //   }
    // });

    // // result types
    // menu.state('enterAmount', {
    //   run: async () => {
    //     const resultTypesNumber = menu.val;
    //     // get value for the booster selected
    //     const resultTypeValue = GamePages.getResultTypefromInput(resultTypesNumber);
    //     // set the value selected for the result type
    //     menu.session.set('resultType', resultTypeValue);
    //     menu.con(`Enter Bet Amount.
    //     98. Main Menu.
    //     99. Exit.`);
    //   },
    //   next: {
    //     '*\\d+': 'winingPot',
    //   }
    // });

    // // result types
    // menu.state('winingPot', {
    //   run: async () => {
    //     const amount = menu.val;
    //     // get value for the booster selected
    //     const resultType = await menu.session.get('resultType');
    //     const selectionsValue = await menu.session.get('numbersSelected');
    //     const booster = await menu.session.get('gameBooster');
    //     const betType = await menu.session.get('lottoGameName');
    //     const gameTypex = await menu.session.get('LotteryGamesType');
    //     const selections = selectionsValue.replace(/,/g, '-');

    //     // set summary menu to show based on game type selected

    //     if (gameTypex === 'lottoIndoor') {
    //       feedbackMenuToShow = 'feedbackMenu';
    //     } else if (gameTypex === 'salary4life') {
    //       feedbackMenuToShow = 'salary4lifefeedbackMenu';
    //     } else {
    //       feedbackMenuToShow = 'feedbackMenu';
    //     }
    //     // get potential winning
    //     const bodyData = {
    //       amount,
    //       betType,
    //       booster,
    //       resultType,
    //       category: gameTypex,
    //       selections: [{
    //         booster: booster || null, resultType: resultType || null, amount, selections, betType
    //       }],
    //       lotteryName: '5/90',
    //     };
    //     MainServer.getPotWining(bodyData).then((response) => {
    //       console.log('response', response);
    //       if (response.message === 'success') {
    //         const instruction = `GAME SUMMARY
    //         Line Count - ${response.data.linesCount}
    //         Amount - ${response.data.amount}
    //         Total Staked Amount - ${response.data.totalStakedAmount}
    //         Potential Winning - ${response.data.potentialWinning}

    //         Kindly choose 1 to continue or 99 to Exit.

    //         1. Continue.
    //         99. Exit.`;
    //         menu.session.set('potentialWinning', JSON.stringify(response.data));
    //         menu.con(instruction);
    //       } else {
    //         console.log('response', response);
    //         menu.end(`Error Occured \n ${response.message}`);
    //       }
    //     });
    //   },
    //   next: {
    //     1: feedbackMenuToShow,
    //   }
    // });

    // // BOOKING CODE SESSIONS

    // menu.state('PlayBookingCode', {
    //   run: () => {
    //     menu.con('Enter Booking code:');
    //   },
    //   next: {
    //     // using regex to match user input to next state
    //     '*\\d+': 'bookingCodeamountmenu'
    //   }
    // });

    // // nesting states
    // // menu.state('PlayBookingCode.code', {
    // //   run: () => {
    // //     // use menu.val to access user input value
    // //     const code = menu.val;
    // //     menu.end('Booking completed.');
    // //   }
    // // });

    // menu.state('bookingCodeamountmenu', {
    //   run: () => {
    //     const input = menu.val;
    //     menu.session.set('bookingCode', input);
    //     menu.session.set('isBooking', true);
    //     const instruction = 'Kindly insert Bet Amount and Submit Your Bet.';
    //     menu.con(instruction);
    //   },
    //   next: {
    //     '*\\d+': 'bookingCodefeedbackMenu'
    //   }
    // });

    // menu.state('bookingCodefeedbackMenu', {
    //   run: async () => {
    //     const input = menu.val;
    //     let instruction = '';
    //     // send request to server to play game and get response
    //     // display response to user and display menu
    //     const amount = input;
    //     const bookingCode = await menu.session.get('bookingCode');
    //     const gameType = await menu.session.get('gameType');
    //     const bodyData = {
    //       amount,
    //       bookingCode,
    //       isBooking: true
    //     };
    //     const response = await MainServer.createTicket(bodyData);
    //     console.log('response', response);
    //     if (response.message === 'success') {
    //       instruction = `${response.data.message}!
    //         Ticket Details are:
    //         Ticket-ID => ${response.data.data.ticketId}

    //         1. Play Another Game.
    //         98. Main Menu.
    //         99. Exit.`;
    //       menu.con(instruction);
    //     } else {
    //       instruction = `${response.message}
    //         1. Play Another Game.
    //         98. Main Menu.
    //         99. Exit.`;
    //       menu.con(instruction);
    //     }
    //   },
    //   next: {
    //     1: 'PlayGames'
    //   }
    // });

    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }
}

export default MenuBuilderHelper;
