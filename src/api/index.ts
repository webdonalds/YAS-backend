import * as express from 'express';

import auth from './v1/auth';

const router = express.Router();

router.use('/v1', auth);



export default router;