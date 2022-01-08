/**
 *
 * Description. (This module handles input validation globaly in the app)
 *
 * @file   validatorMiddleWare
 * @author Ayooluwa Olosunde.
 * @since  24.05.2021
 */

const { sendErrorResponse } = require("../../utils/sendResponses");
const { body, validationResult } = require("express-validator");
/**
 * @class
 * @name ValidatorMiddleWare
 */
class ValidatorMiddleWare {
  static login = [
    body("email", "please enter a valid email").normalizeEmail().isEmail(),
    body("password").trim().escape().isLength({ min: 6 }),
  ];

  static transactions = [
    body("transactionPin")
      .exists()
      .withMessage("transactionPin parameter required")
      .isLength({ min: 4, max: 4 })
      .withMessage("transaction pin requires 4 digits")
      .isNumeric()
      .isInt(),
  ];

  static handleAliases(aliasedName) {
    // ALIASED_PARAM_VALIDATIONS contains validators for parameters with a different name (alias) not in KNOWN_PARAMETERS
    const ALIASED_PARAM_VALIDATIONS = {
      accountName: body(aliasedName)
        .exists()
        .withMessage(aliasedName + " parameter required")
        .trim()
        .escape()
        .isAlpha(),
      accountNumber: body(aliasedName)
        .exists()
        .withMessage(aliasedName + " parameter required")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .custom((value) => {
          let isValidAccountNumer = parseInt(value) > 0;
          return isValidAccountNumer;
        }),
      name: body(aliasedName)
        .exists()
        .withMessage(`${aliasedName} parameter required`)
        .trim()
        .escape()
        .isAlpha()
        .isLength({ min: 3 })
        .toLowerCase(),
      uuid: body(aliasedName).exists()
        .withMessage(`${aliasedName} parameter required`)
        .not().isEmpty()
        .custom((value) => {
          const containsAlphabetNumber = value.match(/(\w+\d+)+/g) !== null;
          return containsAlphabetNumber;
        })
        .customSanitizer((value) => value.replace(/[–]/g, '-'))
        .isLength({ min: 36, max: 36 }),
    };

    // Defines conditions for parameter to be an alias of uuid
    let isUuidAlias =
      aliasedName.toLowerCase() === "transaction_uuid";
    // Defines conditions for parameter to be an alias of accountNumber
    let isAccountNumberAlias =
      aliasedName.toLowerCase() === "toaccount" ||
      aliasedName.toLowerCase() === "fromaccount";
    // Defines conditions for parameter to be an alias of accountName
    let isAccountNameAlias =
      aliasedName.toLowerCase() === "craccountname" ||
      aliasedName.toLowerCase() === "draccountname";
    // Defines conditions for parameter to be an alias of name
    let isNameAlias =
      aliasedName.toLowerCase() === "firstname" ||
      aliasedName.toLowerCase() === "lastname" ||
      aliasedName.toLowerCase() === "name";

    // Use accountNumber validation if parameter is an alias of accountNumber
    if (isAccountNumberAlias === true) {
      return ALIASED_PARAM_VALIDATIONS["accountNumber"];
    }
    // Use accountName validation if parameter is an alias of accountName
    else if (isAccountNameAlias === true) {
      return ALIASED_PARAM_VALIDATIONS["accountName"];
    }
    // Use name validation if parameter is an alias of name
    else if (isNameAlias === true) return ALIASED_PARAM_VALIDATIONS["name"];
    // Use uuid validation if parameter is an alias of name
    else if (isUuidAlias === true) return ALIASED_PARAM_VALIDATIONS["uuid"];
    // Else, just return validator to test existence of this aliased parameter in request
    else return body(aliasedName)
      .exists()
      .withMessage(`${aliasedName} parameter required`);
  }

  static selectValidation(...params) {
    // params is an array of arguments which specify the parameters to validate in the request
    // VALIDATION_CHAIN is the final array of validators that would be passed to express validator
    const VALIDATION_CHAIN = [];
    // KNOWN_PARAMETERS is an array of all defined parameters used in the app
    const KNOWN_PARAMETERS = [
      "userUuid",
      "name",
      "walletName",
      "accountName",
      "accountNumber",
      "walletType",
      "amount",
    ];

    // console.log("123e4567-e89b-12d3-a456-426614174000".match(/(\w+\d+)+/g) !== null)
    // PARAMETER_VALIDATIONS contains all KNOWN_PARAMETERS and their required validations
    const PARAMETER_VALIDATIONS = {
      userUuid: body("userUuid").exists().withMessage("userUuid parameter required")
        .not().isEmpty()
        .custom((value) => {
          const containsAlphabetNumber = value.match(/(\w+\d+)+/g) !== null;
          return containsAlphabetNumber;
        })
        .customSanitizer((value) => value.replace(/[–]/g, '-'))
        .isLength({ min: 36, max: 36 }),
      walletType: body("walletType")
        .exists()
        .withMessage("walletType parameter required")
        .trim()
        .escape()
        .toLowerCase()
        .isIn(["point", "fund"])
        .toLowerCase(),
      name: body("name")
        .exists()
        .withMessage("name parameter required")
        .trim()
        .escape()
        .isAlpha()
        .isLength({ min: 3 })
        .toLowerCase(),
      walletName: body("walletName")
        .exists()
        .withMessage("walletName parameter required")
        .trim()
        .escape()
        .isAlpha(),
      accountName: body("accountName")
        .exists()
        .withMessage("accountName parameter required")
        .trim()
        .escape()
        .isAlpha(),
      accountNumber: body("accountNumber")
        .exists()
        .withMessage("accountNumber parameter required")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .custom((value) => {
          let isValidAccountNumer = parseInt(value) > 0;
          return isValidAccountNumer;
        }),
      amount: body("amount")
        .exists()
        .withMessage("amount parameter required")
        .isNumeric()
        .withMessage("Invalid value for amount parameter")
        .custom((value) => value > 0)
        .withMessage("Amount cannot be zero or negative")
        .custom((value) => value >= 10)
        .withMessage("Minimum amount is 10")
        .toFloat(),
    };

    params.forEach((eachParam) => {
      // Checks if the parameter from request is in KNOWN_PARAMETERS
      let isInKnownParameters =
        KNOWN_PARAMETERS.findIndex((eachKnownParam) => {
          return eachKnownParam === eachParam;
        }) > -1;

      // if parameter from request is in KNOWN_PARAMETERS, add the corresponding validator to VALIDATION_CHAIN
      if (isInKnownParameters) {
        VALIDATION_CHAIN.push(PARAMETER_VALIDATIONS[eachParam]);
      } else {
        // if parameter from request is not in KNOWN_PARAMETERS, check if parameter is just another name for a known parameter (alias)
        // and add returned validator to VALIDATION_CHAIN.
        VALIDATION_CHAIN.push(this.handleAliases(eachParam));
      }
    });

    return VALIDATION_CHAIN;
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Any
   */
  static validateRequest(req, res, next) {
    const errors = validationResult(req);
    return errors.isEmpty()
      ? next()
      : sendErrorResponse(res, 422, errors.array()[0]);
  }
}

export default ValidatorMiddleWare;
