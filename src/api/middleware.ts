import * as express from 'express';
import tokenService from '../service/tokenService';

import { Token, User } from '../model/index';
import googleService from '../service/googleService';

const validateToken = async (request: express.Request, response: express.Response, next) => {
    //TODO : Token will be given as header -> Authorization : Bearer token
    const encryptedToken: string = (request.headers['x-access-token'] || request.query.token) as string;

    // if token does not exist
    if (!encryptedToken) {
        response.status(403).json({
            error: {
                message: 'no_token',
                code: 403
            }
        });
        return;
    }

    const yasToken = tokenService.extractPayloadFromToken(encryptedToken);

    if (yasToken == null) {
        response.status(401).json({
            error: {
                message: 'invalid_token',
                code: 401
            }
        });
        return;
    }

    const result = await Token.findOne({
        where: { yasToken: yasToken }
    });

    // no token found from database
    if (result == null) {
        response.status(401).json({
            error: {
                message: 'invalid_token',
                code: 401
            }
        });
        return;
    }

    const validity = tokenService.verifyToken(encryptedToken, result.yasSecretKey);

    if (validity == tokenService.TOKEN_VALID) {
        request.body.userInfo = {
            userId: result.userId
        };
        next();
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
};

const getGoogleAccessToken = async (request: express.Request, response: express.Response, next) => {
    const userId = request.body.userInfo.userId;
    if(!userId) {
        response.status(403).json({
            error: {
                message: 'no_user_id',
                code: 403
            }
        });
        return;
    }

    const user = await User.findOne({
        where: { id: userId }
    });

    if(user == null) {
        response.status(404).json({
            error: {
                message: 'user_not_found',
                code: 404
            }
        });
        return;
    }

    try {
        const accessToken = await googleService.getAccessToken(user.googleRefreshToken);
        request.body.userInfo.accessToken = accessToken;
        next();
    } catch (e) {
        console.log(e);
        response.status(403).json({
            error: {
                message: 'google_api_error',
                code: 410
            }
        });
        return;
    }
};

export default {
    validateToken,
    getGoogleAccessToken
};