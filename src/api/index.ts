import * as express from 'express';
import hello from './v1/hello';


const router = express.Router();

router.use('/v1', hello);



export default router;