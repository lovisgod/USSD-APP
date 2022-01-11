"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _ApiRepo = _interopRequireDefault(require("../ApiRepo"));

var _validatorMiddleWare = _interopRequireDefault(require("../middlewares/validatorMiddleWare"));

var _authMid = _interopRequireDefault(require("../middlewares/authMid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

const repo = new _ApiRepo.default();
router.get('/get-logs', repo.getLogs);
router.post('/dump-logs', repo.dumpLogs);
router.get('/health-check', repo.healthCheck);
router.post('/ussd_', repo.ussd);
var _default = router;
exports.default = _default;