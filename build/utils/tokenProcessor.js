"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.createToken = void 0;

require("dotenv/config");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {object} payload
 * @returns {string} token
 */
const createToken = payload => _jsonwebtoken.default.sign(payload, `${process.env.JWT_SECRET}`, {
  expiresIn: '1h'
});
/**
 *
 * @param {string} token
 * @returns {object} verifiedToken
 */


exports.createToken = createToken;

const verifyToken = token => _jsonwebtoken.default.verify(token, `${process.env.JWT_SECRET}`, {
  expiresIn: '1h',
  algorithms: ['HS256']
});

exports.verifyToken = verifyToken;