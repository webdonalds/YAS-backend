import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';


function makeYasSecretKey(size = 50):string{
    return crypto.randomBytes(size).toString('hex');
}

function makeYasToken(size = 40):string{
    return crypto.randomBytes(size).toString('hex');
}

const expireTime = 3600;

export default {
    makeYasSecretKey,
    makeYasToken,
    expireTime
};