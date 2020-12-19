import * as express from 'express';
import tokenService from '../service/tokenService';

import { Token, User } from '../model/index';
import googleService from '../service/googleService';

const validateToken = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
    //TODO : Token will be given as header -> Authorization : Bearer token
    const encryptedAccessToken: string = (request.headers['x-access-token'] || request.query.token) as string;

    // if token does not exist
    if (!encryptedAccessToken) {
        response.status(403).json({
            error: {
                message: 'no_token',
                code: 403
            }
        });
        return;
    }

    const {yasToken, type} = tokenService.extractPayloadFromToken(encryptedAccessToken);

    if (yasToken == null) {
        response.status(401).json({
            error: {
                message: 'invalid_token',
                code: 401
            }
        });
        return;
    }

    // need to give access type token
    if (type != 'access'){
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

    const validity = tokenService.verifyToken(encryptedAccessToken, tokenInfo.yasSecretKey);

    if (validity == tokenService.TOKEN_VALID) {
        request.body.userInfo = {
            userId: tokenInfo.userId
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

const getGoogleAccessToken = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
    const nonSecurePaths = ['/search'];
    if(nonSecurePaths.includes(request.path)) {
        next();
        return;
    }

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