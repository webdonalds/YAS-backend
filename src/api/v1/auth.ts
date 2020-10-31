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


router.get('/auth', async (request: express.Request, response: express.Response) => {
    const code:string = request.query.code;

    // when no code is returned
    if(code==null){
        response.status(400).json({
            error:{
                message : 'Lack of parameter : code',
                code : 400
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
                specific : error,
                code : 401
            }
        });
        return;
    }
    
    // if no access_token is returned, then something went wrong
    if(!('access_token' in googleTokens)){
        response.status(401).json({
            error:{
                message : 'Invalid code value : access_token not returned',
                code : 401
            }
        });
        return;
    }

    const userInfo = await googleService.getUserInfo(googleTokens.access_token);


    const result = await User.findOne({
        where: {email: userInfo.email}
    });


    if(result == null){
        if(!('refresh_token' in googleTokens)){
            response.status(404).json({
                error:{
                    message : 'user not found : please reset Google OAUTH2 for out app',
                    code : 404
                }
            });

            return;
        } 
        else{
            await User.create({
                userId: userInfo.id,
                email: userInfo.email,
                googleRefreshToken: googleTokens.refresh_token,
                registered: false
            });
    
            response.json({
                email: userInfo.email,
                registered: false
            });

            return;
        }

    }
    else{
        // if new refresh_token is given, update to new one
        if('refresh_token' in googleTokens){
            await User.update({
                googleRefreshToken: googleTokens.refresh_token
            },
            {
                where:{
                    email: userInfo.email
                }
            });
        }

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
                yasSecretKey: tokenService.makeYasSecretKey(),
                expireTime: tokenService.expireTime
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

