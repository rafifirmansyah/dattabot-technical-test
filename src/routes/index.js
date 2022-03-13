import express from 'express';
import multer from 'multer';
import os from 'os';

import BypassAttachFilesMiddleware from '../middlewares/BypassAttachFilesMiddleware.js';
import isLoginMiddleware from '../middlewares/isLoginMiddleware.js';

import UsersController from '../controllers/UsersController.js';
import TimeCapsulesController from '../controllers/TimeCapsulesController.js';

const router = express.Router();

router.get('/', (req, res) => res.send('Dattabot Technical Test'));

// Authentication
router.post('/register', UsersController.registerValidation, UsersController.register);
router.post('/login', UsersController.loginValidation, UsersController.login);

// Time Capsule
router.post('/time-capsules', multer({dest: os.tmpdir()}).array('attach_files'), isLoginMiddleware, BypassAttachFilesMiddleware, TimeCapsulesController.createValidation, TimeCapsulesController.create);
router.get('/time-capsules', isLoginMiddleware, TimeCapsulesController.getAll);
router.get('/time-capsules/:slug', isLoginMiddleware, TimeCapsulesController.getDetail);

export default router;