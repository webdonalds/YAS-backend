import * as express from 'express';
import { stringify } from 'querystring';
import googleService from '../../service/googleService';

import { User } from '../../model/index';



const router = express.Router();


router.get('/authentication-url', (request: express.Request, response: express.Response) => {
    response.json({
        oauth2Url: googleService.getAuthUrl()
    });
});


router.get('/auth', async (request: express.Request, response: express.Response, next) => {
    const code:string = request.query.code;

    if(code==null){
        response.status(400).json({
            error:{
                message: 'Need code parameter'
            }
        });
        return;
    }
    
    let googleTokens;

    try{
        googleTokens = await googleService.getTokens(code);
    } catch(error){
        //TODO : Add exception handling for router async error
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
    const email:string = userInfo.email;


    if('refresh_token' in googleTokens){
        await User.create({
            email: email,
            refreshToken: googleTokens.refresh_token,
            registered: false
        });

        response.json({
            email: email,
            registered: false
        });

        return;
    } 
    else {
        const result = await User.findOne({
            where: {email: email},
            attributes: ['email', 'refreshToken', 'registered']
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
        
        if(result.registered){
            // TODO : send our token.
            

            return;
        }
        else{
            response.json({
                email: email,
                registered: false
            });
    
            return;
        }
    }
});


export default router;

