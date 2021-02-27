import * as express from 'express';
import googleService from '../../service/googleService';
import tokenService from '../../service/tokenService';

import { User, Token } from '../../model/index';
import { errorSend } from '../../error/errorUtil';

const router = express.Router();

router.get('/login', async (request: express.Request, response: express.Response) => {
    const code: string = request.query.code as string;

    // when no code is returned
    if (code == null) {
        errorSend(response, 'require_url_parameter_code', null);
        return;
    }

    let googleTokens;

    // check code validation
    try {
        googleTokens = await googleService.getTokens(code);
    } catch (error) {
        errorSend(response, 'invalid_code', error);
        return;
    }

    // if no access_token is returned, then something went wrong
    if (!('access_token' in googleTokens)) {
        errorSend(response, 'invalid_code_no_access_token', 'Access token was not returned');
        return;
    }


    const userInfo = await googleService.getUserInfo(googleTokens.access_token);

    let result = await User.findOne({
        where: { email: userInfo.email }
    });

    // TODO: error handling => rollback? transaction?
    try {
        if (result == null) {
            if (!('refresh_token' in googleTokens)) {
                errorSend(response, 'user_not_found', null);
                return;
            }
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
    } catch(e) {
        errorSend(response, 'internal_server_error', e);
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

    try {
        await Token.create({
            userId: result.id,
            yasToken: yasToken,
            yasSecretKey: yasSecretKey
        });
    } catch(e) {
        errorSend(response, 'fail_create_token', null);
    }

    response.json({
        data: data,
        auth: auth,
    });
    return;
});




router.get('/access-token', async (request: express.Request, response: express.Response) => {
    const encryptedRefreshToken: string = request.query.token as string;

    // if token does not exist
    if (!encryptedRefreshToken) {
        errorSend(response, 'no_refresh_token', null);
        return;
    }

    const {yasToken, type} = tokenService.extractPayloadFromToken(encryptedRefreshToken);

    if (yasToken == null) {
        errorSend(response, 'invalid_refresh_token', 'payload not extracted from token');
        return;
    }

    // need to give refresh type token
    if (type != 'refresh'){
        errorSend(response, 'wrong_token_type', 'require token type : refresh');
        return;
    }

    let tokenInfo;
    try {
        tokenInfo = await Token.findOne({
            where: { yasToken: yasToken }
        });
    } catch(e) {
        errorSend(response, 'cannot_find_token', null);
    }

    // no token found from database
    if (tokenInfo == null) {
        errorSend(response, 'invalid_refresh_token', 'no refresh token found in DB');
        return;
    }

    const validity = tokenService.verifyToken(encryptedRefreshToken, tokenInfo.yasSecretKey);

    if (validity == tokenService.TOKEN_VALID) {
        response.json({
            yasAccessToken: tokenService.makeYasAccessToken(yasToken, tokenInfo.yasSecretKey)
        });
    } else if (validity == tokenService.TOKEN_INVALID) {
        errorSend(response, 'invalid_refresh_token', 'not valid jwt refresh token');
    } else if (validity == tokenService.TOKEN_EXPIRED) {
        errorSend(response, 'refresh_token_expired', null);
        await Token.destroy({ 
            where: { yasToken: yasToken } 
        });
    }
    return;
});

export default router;

