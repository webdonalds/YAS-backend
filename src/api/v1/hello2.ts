import * as express from 'express';

const router = express.Router();


router.get('/hello2', (request: express.Request, response: express.Response) => {
    response.send("hello2");
});



module.exports = router;

