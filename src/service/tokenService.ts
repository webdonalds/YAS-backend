import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';


function makeYasSecretKey(size = 50): string {
    return crypto.randomBytes(size).toString('hex');
}

function makeYasToken(size = 40): string {
    return crypto.randomBytes(size).toString('hex');
}

function makeYasAccessToken(yasToken:string, yasSecretKey:string): string{
    return jwt.sign({
        yasToken: yasToken,
        type: 'access'
    }, yasSecretKey, {
        expiresIn: yasAccessTokenExpireTime
    });
}

function makeYasRefreshToken(yasToken:string, yasSecretKey:string): string{
    return jwt.sign({
        yasToken: yasToken,
        type: 'refresh'
    }, yasSecretKey, {
        expiresIn: yasRefreshTokenExpireTime
    });
}


function extractPayloadFromToken(encryptedToken: string): {yasToken:string, type:string} {
    let ret = null;
    try {
        const payload = jwt.decode(encryptedToken);
        ret = payload;
    } catch (err) {
        console.log(err.message);
    }

    return ret;
}

function verifyToken(encryptedToken: string, secret: string): number {
    try {
        jwt.verify(encryptedToken, secret);
        return TOKEN_VALID;
    } catch (err) {
        if (err.name == 'TokenExpiredError') {
            return TOKEN_EXPIRED;
        }
        return TOKEN_INVALID;
    }
}

const TOKEN_EXPIRED = -1;
const TOKEN_INVALID = 0;
const TOKEN_VALID = 1;

const yasAccessTokenExpireTime = 3600; // 1 hour;
const yasRefreshTokenExpireTime = 604800; // 1 week;

export default {
    makeYasSecretKey,
    makeYasToken,
    makeYasAccessToken,
    makeYasRefreshToken,
    yasAccessTokenExpireTime,
    yasRefreshTokenExpireTime,
    extractPayloadFromToken,
    verifyToken,
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VALID
};