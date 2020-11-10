import * as express from 'express';

import auth from './v1/auth';
import user from './v1/user';

import middleware from './middleware';

const router = express.Router();


router.use('/v1', auth);
router.use('/v1/user', middleware.validateToken, user);


export default router;