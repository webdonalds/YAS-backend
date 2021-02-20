import * as express from 'express';

import auth from './v1/auth';
import user from './v1/user';
import contents from './v1/contents';
import post from './v1/post';
import logoffedPostList from './v1/logoffedPostList';

import middleware from './middleware';

const router = express.Router();

router.use('/v1/auth', auth);
router.use('/v1/user', middleware.validateToken, user);
router.use('/v1/contents', middleware.validateToken, middleware.getGoogleAccessToken, contents);
// handle middleware in post
router.use('/v1/post', post);
router.use('/v1/logoffed-post-list', logoffedPostList);

export default router;