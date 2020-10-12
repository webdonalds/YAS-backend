import * as express from 'express';
import * as hello from './v1/hello';


const router = express.Router();

router.use('/v1', hello);



module.exports = router;