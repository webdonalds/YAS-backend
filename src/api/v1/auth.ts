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
                message: 'Lack of parameter : code',
                code: 400
            }
        });
        return;
    }

    let googleTokens;

    // check code validation
    try {
        googleTokens = await googleService.getTokens(code);
    } catch (error) {
        response.status(401).json({
            error: {
                message: 'Invalid code value',
                specific: error,
                code: 401
            }
        });
        return;
    }

    // if no access_token is returned, then something went wrong
    if (!('access_token' in googleTokens)) {
        response.status(401).json({
            error: {
                message: 'Invalid code value : access_token not returned',
                code: 401
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
            response.status(404).json({
                error: {
                    message: 'user not found : please reset Google OAUTH2 for out app',
                    code: 404
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
        imagePath: result.imagePath,
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




router.get('/access-token-by-refresh', async (request: express.Request, response: express.Response) => {

    const encryptedRefreshToken: string = (request.headers['x-access-token'] || request.query.token) as string;


    // if token does not exist
    if (!encryptedRefreshToken) {
        response.status(403).json({
            error: {
                message: 'no_token',
                code: 403
            }
        });
        return;
    }

    const {yasToken, type} = tokenService.extractPayloadFromToken(encryptedRefreshToken);

    if (yasToken == null) {
        response.status(401).json({
            error: {
                message: 'invalid_token',
                code: 401
            }
        });
        return;
    }

    // need to give refresh type token
    if (type != 'refresh'){
        response.status(400).json({
            error:{
                message: 'wrong_token_type',
                code: 400
            }
        });
        return;
    }


    const tokenInfo = await Token.findOne({
        where: { yasToken: yasToken }
    });


    // no token found from database
    if (tokenInfo == null) {
        response.status(401).json({
            error: {
                message: 'invalid_token',
                code: 401
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
        response.status(401).json({
            error: {
                message: 'invalid_token',
                code: 401
            }
        });
        return;
    }
    else if (validity == tokenService.TOKEN_EXPIRED) {
        response.status(405).json({
            error: {
                message: 'token_expired',
                code: 405
            }
        });

        await Token.destroy({ 
            where: { yasToken: yasToken } 
        });
        return;
    }


});

export default router;

