import { User } from '../model/index';

type putUserInfoParameters = {
    userId: number | null,
    nickname: string | null,
    aboutMe: string | null
}

const NICKNAME_MAX_LENGTH = 20;
const NICKNAME_MIN_LENGTH = 2;

const ABOUT_ME_MAX_LENGTH = 100;


async function validatePutUserInfoParameters (parameters: putUserInfoParameters) : Promise<postApiError> | null {
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

    if(parameters.nickname.length > NICKNAME_MAX_LENGTH){
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

    if(parameters.aboutMe.length > ABOUT_ME_MAX_LENGTH){
        return {
            error: {
                message: 'about_me_too_long',
                specific: 'about me length cannot be longer than ' + ABOUT_ME_MAX_LENGTH.toString()
            }
        };
    }

    // check if nickname is already used
    const result = await User.findOne({
        where: { nickname: parameters.nickname }
    });

    if(result!=null){
        if(result.id!=parameters.userId){
            return {
                error: {
                    message: 'duplicated_nickname',
                    specific: null
                }
            };
        }
    }

    return null;
}


export default {
    validatePutUserInfoParameters
};