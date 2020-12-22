import * as express from 'express';
import tokenService from '../service/tokenService';

import { Token, User } from '../model/index';
import googleService from '../service/googleService';

const validateToken = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
    //TODO : Token will be given as header -> Authorization : Bearer token
    const encryptedAccessToken: string = (request.headers['x-access-token'] || request.query.token) as string;

    // if token does not exist
    if (!encryptedAccessToken) {
        response.status(401).json({
            error: {
                message: 'no_access_token',
            }
        });
        return;
    }

    const {yasToken, type} = tokenService.extractPayloadFromToken(encryptedAccessToken);

    if (yasToken == null) {
        response.status(401).json({
            error: {
                message: 'invalid_access_token',
                specific: 'token payload cannot be extracted'
            }
        });
        return;
    }

    // need to give access type token
    if (type != 'access'){
        response.status(401).json({
            error:{
                message: 'wrong_token_type',
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
                message: 'invalid_access_token',
                specific: 'token not found in DB'
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
                specific: 'failed to be verified by jwt'
            }
        });
        return;
    }
    else if (validity == tokenService.TOKEN_EXPIRED) {
        response.status(401).json({
            error: {
                message: 'access_token_expired',
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
        response.status(401).json({
            error: {
                message: 'no_user_id',
            }
        });
        return;
    }

    const user = await User.findOne({
        where: { id: userId }
    });

    if(user == null) {
        response.status(401).json({
            error: {
                message: 'user_not_found',
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
        response.status(401).json({
            error: {
                message: 'google_api_error',
            }
        });
        return;
    }
};

export default {
    validateToken,
    getGoogleAccessToken
};