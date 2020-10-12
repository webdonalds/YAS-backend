import * as express from 'express';

const router = express.Router();


router.get('/hello', (request: express.Request, response: express.Response) => {
    response.send('hello');
});



export default router;

