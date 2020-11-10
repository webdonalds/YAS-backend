import * as express from 'express';
import tokenService from '../service/tokenService';

import { Token } from '../model/index';

const validateToken = async (request: express.Request, response: express.Response, next) => {
    const encryptedToken = request.headers['x-access-token'] || request.query.token;

    // if token does not exist
    if(!encryptedToken) {
        response.status(403).json({
            error:{
                message : 'no_token',
                code : 403
            }
        });
        return;
    }

    const yasToken = tokenService.extractPayloadFromToken(encryptedToken);

    if(yasToken==null){
        response.status(401).json({
            error:{
                message: 'invalid_token',
                code : 401
            }
        });
        return;
    }

    
    const result = await Token.findOne({
        where: { yasToken: yasToken }
    });

    // no token found from database
    if(result==null){
        response.status(401).json({
            error:{
                message: 'invalid_token',
                code : 401
            }
        });
        return;
    }

    const validity = tokenService.verifyToken(encryptedToken, result.yasSecretKey);

    if(validity == tokenService.TOKEN_VALID){
        next();
    }
    else if(validity == tokenService.TOKEN_INVALID){
        response.status(401).json({
            error:{
                message: 'invalid_token',
                code : 401
            }
        });
        return;
    }
    else{
        response.status(405).json({
            error:{
                message: 'token_expired',
                code : 405
            }
        });
        // TODO : erase expired token
        return;
    }
};





export default {
    validateToken
};