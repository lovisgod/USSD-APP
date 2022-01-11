"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _index = _interopRequireDefault(require("./api/routes/index"));

var _ErrorHandler = _interopRequireDefault(require("./ErrorHelpers/ErrorHandler"));

var _sendResponses = require("./utils/sendResponses");

var _WistonLogger = _interopRequireDefault(require("./ErrorHelpers/WistonLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// logs with wiston
const app = (0, _express.default)(); // add stream option to morgan

app.use((0, _morgan.default)('combined', {
  stream: _WistonLogger.default.stream
}));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use('/api/v1', _index.default); // catch 404 and forward to error handler

app.all('/*', (req, res) => {
  _WistonLogger.default.error(`404 -${res.message || 'Route not found'} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(404).send({
    status: 'error',
    error: 'This route is unavailable on this server'
  });
}); // get the unhandled rejection and throw it to another fallback handler we already have.
// eslint-disable-next-line no-unused-vars

process.on('unhandledRejection', (error, _promise) => {
  throw error;
}); // handle any uncaught exceptions

process.on('uncaughtException', error => {
  _ErrorHandler.default.handleError(error);

  if (!_ErrorHandler.default.isTrustedError(error)) {
    process.exit(1);
  }
}); // error handler

app.use(async (err, req, res, next) => {
  // console.log({ app: err });
  if (err instanceof Error) {
    _WistonLogger.default.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip},`);

    if (_ErrorHandler.default.isTrustedError(err)) {
      await _ErrorHandler.default.handleError(err, res);
    } else if (err.isAxiosError && err.response) {
      return (0, _sendResponses.sendErrorResponse)(res, err.response.status || 500, `[Axios]: ${err.message}`);
    } else {
      // what do we do when error is not operational
      let responseMessage = '';
      const isTimedOut = err.message && (err.message.toLowerCase().includes('timedout') || err.message.toLowerCase().includes('timeout'));
      const isNotNullError = err.message && err.message.toLowerCase().includes('not-null');

      switch (true) {
        case isTimedOut:
          err.status = 504;
          responseMessage = 'Request timeout! Try again';
          break;

        case isNotNullError:
          err.status = 400;
          responseMessage = 'Incomplete parameters or a non null value was expected!';
          break;

        default:
          responseMessage = 'An error just occured, please try again';
          break;
      }

      (0, _sendResponses.sendErrorResponse)(res, err.status || 500, responseMessage);
    }
  } else {
    next(err);
  }
});
var _default = app;
exports.default = _default;