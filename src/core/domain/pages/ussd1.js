/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
class Ussd1 {
  /**
   * @method
   * @returns String
   */
  static async page() {
    return `CON 1.Register
    2.Deposit
    3.Withdraw
    4.Play Games
    5. Check Result
    99.Exit`;
  }

  /**
   * @method
   * @returns String
   */
  static async comingSoonPage() {
    return 'END Sorry, this feature is not available yet.';
  }
}
export default Ussd1;
