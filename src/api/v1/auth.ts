import * as express from 'express';
import googleService from '../../service/googleService';
import tokenService from '../../service/tokenService';

import { User, Token } from '../../model/index';



const router = express.Router();


router.get('/authentication-url', (request: express.Request, response: express.Response) => {
    response.json({
        oauth2Url: googleService.getAuthUrl()
    });
});


router.get('/auth', async (request: express.Request, response: express.Response, next) => {
    const code:string = request.query.code;

    // when no code is returned
    if(code==null){
        response.status(400).json({
            error:{
                message: 'Need code parameter'
            }
        });
        return;
    }
    
    let googleTokens;

    // check code validation
    try{
        googleTokens = await googleService.getTokens(code);
    } catch(error){
        response.status(401).json({
            error:{
                message : 'Invalid code value',
                specific : error
            }
        });
        return;
    }
    
    // if no access_token is returned, then something went wrong
    if(!('access_token' in googleTokens)){
        response.status(409).json({
            error:{
                message : 'Google Api has not returned access_token!',
                code : 410
            }
        });
        return;
    }

    const userInfo = await googleService.getUserInfo(googleTokens.access_token);


    // if refresh_token exists, it's new user
    if('refresh_token' in googleTokens){
        await User.create({
            userId: userInfo.id,
            email: userInfo.email,
            refreshToken: googleTokens.refresh_token,
            registered: false
        });

        response.json({
            email: userInfo.email,
            registered: false
        });

        return;
    } 
    else {
        const result = await User.findOne({
            where: {email: userInfo.email}
        });

        if(result == null){
            response.status(409).json({
                error:{
                    message : 'Need to erase access grant for our app at Google acount setting',
                    code : 411
                }
            });
            return;
        }
        
        // when it's registered user
        if(result.registered){
            const data = {
                id: result.id,
                email: result.email,
                nickname: result.nickname,
                imagePath: result.imagePath,
                aboutMe: result.aboutMe,
            };
            
            const auth = {
                yasToken: tokenService.makeYasToken(),
                yasSecretKey: tokenService.makeYasSecretKey()
            };
            
            await Token.create({
                userId: result.id,
                yasToken: auth.yasToken,
                yasSecretKey: auth.yasSecretKey
            });

            response.json({
                data: data,
                auth: auth,
                registered: true
            });

            return;
        }
        // if not registered
        else{
            response.json({
                email: userInfo.email,
                registered: false
            });
    
            return;
        }
    }
});

export default router;

