/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
class RegisterPage {
  /**
   * @method
   * @returns String
   */
  static async page() {
    return `CON 11.Accept Registration
    12.Decline Registration
    98.Main Menu
    99.Exit`;
  }
}
export default RegisterPage;
