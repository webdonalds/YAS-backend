import * as express from 'express';
import axios from 'axios';
import googleService from '../../service/googleService';

import * as config from '../../config/config.json';

const router = express.Router();


router.get('/get-authentication-url', (request: express.Request, response: express.Response) => {
    response.json({
        oauth2Url: googleService.getAuthUrl()
    });
});




export default router;

