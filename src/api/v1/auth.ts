import * as express from 'express';
import axios from 'axios';
import { stringify } from 'querystring';
import googleService from '../../service/googleService';

import { User } from '../../model/index';

import * as config from '../../config/config.json';


const router = express.Router();


router.get('/authentication-url', (request: express.Request, response: express.Response) => {
    response.json({
        oauth2Url: googleService.getAuthUrl()
    });
});


router.get('/try-login', async (request: express.Request, response: express.Response, next) => {
    const code:string = request.query.code;
    let tokens;
    try{
        tokens = await googleService.getTokens(code);
    } catch(error){
        //TODO : Add exception handling for router async error
        next(error);
    }
    
    // if no access_token is returned, then something went wrong
    if(!('access_token' in tokens)){
        //TODO : Handle error response
        response.send('no access token found');
    }

    const userInfo = await googleService.getUserInfo(tokens.access_token);
    const email:string = userInfo.email;

    // TODO : Change redirect URL to registerUrl
    const registerUrl = 'http://127.0.0.1/';


    if('refresh_token' in tokens){
        await User.create({
            email: email,
            refreshToken: tokens.refresh_token,
            registered: false
        });

        const params = stringify({
            email: email,
            access_token: tokens.access_token
        });
        
        response.redirect(registerUrl + '?' + params);

    } 
    else if (!('refresh_token' in tokens)){
        const result = await User.findOne({
            where: {email: email},
            attributes: ['email', 'refreshToken', 'registered']
        });

        if(result == null){
            // TODO : 해당 경우에 대한 처리
            response.send('Need to erase our app from your google account');
        }
        
        if(result.registered){
            // TODO : Switch redirect url to homepage or some login success page
            response.redirect('http://127.0.0.1/?page=loginsuccess');
        }
        else{
            const params = stringify({
                email: email,
                access_token: tokens.access_token
            });
            
            response.redirect(registerUrl + '?' + params);
        }
    }
});


export default router;

