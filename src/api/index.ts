import * as express from 'express';

import hello from './v1/hello';
import auth from './v1/auth';

const router = express.Router();

router.use('/v1', hello);
router.use('/v1', auth);



export default router;