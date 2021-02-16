import * as express from 'express';
import googleService from '../../service/googleService';
import tokenService from '../../service/tokenService';

import { User, Token } from '../../model/index';

const router = express.Router();

router.get('/login', async (request: express.Request, response: express.Response) => {
    const code: string = request.query.code as string;

    // when no code is returned
    if (code == null) {
        response.status(400).json({
            error: {
                message: 'require_url_parameter_code',
            }
        });
        return;
    }

    let googleTokens;

    // check code validation
    try {
        googleTokens = await googleService.getTokens(code);
    } catch (error) {
        response.status(400).json({
            error: {
                message: 'invalid_code',
                specific: error,
            }
        });
        return;
    }

    // if no access_token is returned, then something went wrong
    if (!('access_token' in googleTokens)) {
        response.status(400).json({
            error: {
                message: 'invalid_code_no_access_token',
                specific: 'Access token was not returned'
            }
        });
        return;
    }

    const userInfo = await googleService.getUserInfo(googleTokens.access_token);


    let result = await User.findOne({
        where: { email: userInfo.email }
    });


    if (result == null) {
        if (!('refresh_token' in googleTokens)) {
            response.status(400).json({
                error: {
                    message: 'user_not_found',
                }
            });

            return;
        }
        else {
            await User.create({
                userId: userInfo.id,
                email: userInfo.email,
                nickname: userInfo.email.split('@')[0],
                googleRefreshToken: googleTokens.refresh_token,
            });

            result = await User.findOne({
                where: { email: userInfo.email }
            });
        }
    }
    else {
        // if new refresh_token is given, update to new one
        if ('refresh_token' in googleTokens) {
            await User.update(
                {
                    googleRefreshToken: googleTokens.refresh_token
                },
                {
                    where: {
                        email: userInfo.email
                    }
                }
            );
        }
    }

    const data = {
        id: result.id,
        email: result.email,
        nickname: result.nickname,
        imageFile: result.imageFile,
        aboutMe: result.aboutMe,
    };

    const yasToken = tokenService.makeYasToken();
    const yasSecretKey = tokenService.makeYasSecretKey();

    const yasAccessToken = tokenService.makeYasAccessToken(yasToken, yasSecretKey);
    const yasRefreshToken = tokenService.makeYasRefreshToken(yasToken, yasSecretKey);

    const auth = {
        yasAccessToken: yasAccessToken,
        yasRefreshToken: yasRefreshToken
    };

    await Token.create({
        userId: result.id,
        yasToken: yasToken,
        yasSecretKey: yasSecretKey
    });

    response.json({
        data: data,
        auth: auth,
    });

    return;
});




router.get('/access-token', async (request: express.Request, response: express.Response) => {

    const encryptedRefreshToken: string = (request.headers['x-access-token'] || request.query.token) as string;


    // if token does not exist
    if (!encryptedRefreshToken) {
        response.status(400).json({
            error: {
                message: 'no_refresh_token',
            }
        });
        return;
    }

    const {yasToken, type} = tokenService.extractPayloadFromToken(encryptedRefreshToken);

    if (yasToken == null) {
        response.status(400).json({
            error: {
                message: 'invalid_refresh_token',
                specific: 'payload not extracted from token'
            }
        });
        return;
    }

    // need to give refresh type token
    if (type != 'refresh'){
        response.status(400).json({
            error:{
                message: 'wrong_token_type',
                specific: 'require token type : refresh'
            }
        });
        return;
    }


    const tokenInfo = await Token.findOne({
        where: { yasToken: yasToken }
    });


    // no token found from database
    if (tokenInfo == null) {
        response.status(400).json({
            error: {
                message: 'invalid_refresh_token',
                specific: 'no refresh token found in DB'
            }
        });
        return;
    }

    const validity = tokenService.verifyToken(encryptedRefreshToken, tokenInfo.yasSecretKey);

    if (validity == tokenService.TOKEN_VALID) {
        response.json({
            yasAccessToken: tokenService.makeYasAccessToken(yasToken, tokenInfo.yasSecretKey)
        });
        return;
    }
    else if (validity == tokenService.TOKEN_INVALID) {
        response.status(400).json({
            error: {
                message: 'invalid_refresh_token',
                specific: 'not valid jwt refresh token'
            }
        });
        return;
    }
    else if (validity == tokenService.TOKEN_EXPIRED) {
        response.status(400).json({
            error: {
                message: 'refresh_token_expired',
            }
        });

        await Token.destroy({ 
            where: { yasToken: yasToken } 
        });
        return;
    }


});

export default router;

