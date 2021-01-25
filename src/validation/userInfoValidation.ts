import { User } from '../model/index';


const NICKNAME_MAX_LENGTH = 40;
const NICKNAME_MIN_LENGTH = 2;

const ABOUTME_MAX_LENGTH = 100;


async function isDuplicatedNickname(nickname: string): Promise<boolean> {
    const result = await User.findOne({
        where: { nickname: nickname }
    });

    if(result==null){
        return false;
    }

    return true;
}


async function validateUserInfoParameters(parameters: userInfoParameters): Promise<ApiError> | null {
    if(!parameters.userId){
        return {
            error: {
                message: 'require_body_parameter_userId',
                specific: null
            }
        };
    }

    if(!parameters.nickname){
        return {
            error: {
                message: 'require_body_parameter_nickname',
                specific: null
            }
        };
    }

    if(parameters.nickname.length > NICKNAME_MAX_LENGTH) {
        return {
            error: {
                message: 'nickname_too_long',
                specific: 'nickname length cannot be longer than ' + NICKNAME_MAX_LENGTH.toString()
            }
        };
    }

    if (parameters.nickname.length < NICKNAME_MIN_LENGTH) {
        return {
            error: {
                message: 'nickname_too_short',
                specific: 'nickname length cannot be shorter than ' + NICKNAME_MIN_LENGTH.toString(),
            }
        };
    }

    if(parameters.aboutMe.length > ABOUTME_MAX_LENGTH) {
        return { 
            error: {
                message: 'aboutMe_too_long',
                specific: 'aboutMe length cannot be longer than ' + ABOUTME_MAX_LENGTH.toString()
            }
        };
    }

    if(isDuplicatedNickname(parameters.nickname)){
        return {
            error: {
                message: 'nickname_already_exists',
                specific: null
            }
        };
    }


    return null;
}



export default {
    validateUserInfoParameters
};