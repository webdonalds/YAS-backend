import * as express from 'express';

const router = express.Router();


router.get('/hello', (request: express.Request, response: express.Response) => {
    console.log(request);
    response.send("Hello! I'm Node.js!");
});







module.exports = router;

