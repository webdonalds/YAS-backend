import * as express from 'express';

import auth from './v1/auth';
import user from './v1/user';
import contents from './v1/contents';
import post from './v1/post';

import middleware from './middleware';

const router = express.Router();

router.use('/v1/auth', auth);
router.use('/v1/user', middleware.validateToken, user);
router.use('/v1/contents', middleware.validateToken, middleware.getGoogleAccessToken, contents);
router.use('/v1/post', middleware.validateToken, post);

export default router;