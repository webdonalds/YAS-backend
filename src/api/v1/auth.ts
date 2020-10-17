import * as express from 'express';
import axios from 'axios';
import { stringify } from 'querystring';
import googleService from '../../service/googleService';

import { User } from '../../model/index';

import * as config from '../../config/config.json';


const router = express.Router();


router.get('/get-authentication-url', (request: express.Request, response: express.Response) => {
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

    } else if (!('refresh_token' in tokens)){
        //TODO : case 별로 request처리하기
        
        // case 1 : DB에 이메일 존재(refresh_token 존재) & 생성됨
        // => Access token과 함께 홈페이지로 redirect

        // case 2 : DB에 이메일 존재(refresh_token 존재) & 생성안됌
        // => email 정보와 함께 regitser page로 redirect

        // case 3 : DB에 이메일이 존재 안함
        // => 유저가 직접 Google 계정 엑세스 가능 앱에서 삭제해줘야함.
    }
});


export default router;

