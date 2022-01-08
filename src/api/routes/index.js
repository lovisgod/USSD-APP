import express from 'express';
import ApiRepo from '../ApiRepo';
import Validator from '../middlewares/validatorMiddleWare';
import authmid from '../middlewares/authMid';

const router = express.Router();
const repo = new ApiRepo();

router.get('/get-logs', repo.getLogs);
router.post('/dump-logs', repo.dumpLogs);
router.get('/health-check', repo.healthCheck);

export default router;
