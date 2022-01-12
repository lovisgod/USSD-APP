/* eslint-disable require-jsdoc */
class GamePages {
  /**
   * @method
   * @returns String
   */
  static async firstPage() {
    return `1.Play Games.
    2.Play Booking Code.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static async playGameMenu() {
    return `1.Lottery Game.
    2.Jackpot Game.
    98.Main Menu.
    99.Exit.`;
  }
}

export default GamePages;
