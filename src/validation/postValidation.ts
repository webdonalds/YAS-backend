import { Video } from '../model/index';

/*
  Validation for Tags
*/

const TAG_MAX_LENGTH = 10;
const TAG_MAX_NUM = 5;


// validation codes
const TAGS_OKAY = 1;
const TAGS_TOO_LONG = 0;
const TAGS_WITH_FORBIDDEN_CHAR = -1;
const TAGS_TOO_MANY = -2;


// patterns
const TAG_ALLOWED_PATTERN = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z|0-9]*$/;


function validateTags(tags: Array<string>): number {
    if(tags.length > TAG_MAX_NUM) return TAGS_TOO_MANY;

    for(let i=0;i<tags.length;i++){
        if(tags[i].length > TAG_MAX_LENGTH) return TAGS_TOO_LONG;
        if(!TAG_ALLOWED_PATTERN.test(tags[i])) return TAGS_WITH_FORBIDDEN_CHAR;
    }

    return TAGS_OKAY;   
}


/*
  Validation values for parameters
*/
const TITLE_MAX_LENGTH = 100;
const TITLE_MIN_LENGTH = 2;
const DESCRIPTION_MAX_LENGTH = 250;


/*
  Validate if user is owner of Video
*/
async function validateVideoOwner(userId:number, videoPostId:number): Promise<boolean> {
    const result = await Video.findOne({
        where: { userId: userId, id: videoPostId }
    });

    if(result==null) return false;

    return true;
}



// error for : POST - /v1/post/video
function validatePostVideoParameters(parameters: PostVideoParameters): ApiError | null{
    if(!parameters.userId){
        return {
            error: {
                message: 'require_body_parameter_userId',
                specific: null
            }
        };
    }

    if(!parameters.videoId){
        return {
            error: {
                message: 'require_body_parameter_videoId',
                specific: null
            }
        };
    }

    if(!parameters.title){
        return {
            error: {
                message: 'require_body_parameter_title',
                specific: null
            }
        };
    }

    if(!parameters.description){
        return {
            error: {
                message: 'require_body_parameter_description',
                specific: null
            }
        };
    }

    if (parameters.title.length > TITLE_MAX_LENGTH) {
        return {
            error: {
                message: 'title_too_long',
                specific: 'title length cannot be longer than ' + TITLE_MAX_LENGTH.toString(),
            }
        };
    }

    if (parameters.title.length < TITLE_MIN_LENGTH) {
        return {
            error: {
                message: 'title_too_short',
                specific: 'title length cannot be shorter than ' + TITLE_MIN_LENGTH.toString(),
            }
        };
    }
    
    if (parameters.description.length > DESCRIPTION_MAX_LENGTH) {
        return {
            error: {
                message: 'description_too_long',
                specific: 'description length cannot be longer than ' + DESCRIPTION_MAX_LENGTH.toString(),
            }
        };
    }

    const tagValidation = validateTags(parameters.tags);

    // tag errors
    if(tagValidation == TAGS_TOO_LONG){
        return {
            error: {
                message: 'tags_too_long',
                specific: 'Each tag\'s length should be less or equal than ' + TAG_MAX_LENGTH.toString(),
            }
        };
    }

    if(tagValidation == TAGS_TOO_MANY){ 
        return {
            error: {
                message: 'tags_too_many',
                specific: 'The number of tags should be less or equal than ' + TAG_MAX_NUM.toString(),
            }
        };
    }

    if(tagValidation == TAGS_WITH_FORBIDDEN_CHAR){ 
        return {
            error: {
                message: 'tags_with_forbidden_char',
                specific: 'Only English, Korean, numbers are allowed in tags'
            }
        };
    }

    return null;
}


async function validatePutVideoParameters(parameters: PutVideoParameters): Promise<ApiError> | null{
    if(!parameters.userId){
        return {
            error: {
                message: 'require_body_parameter_userId',
                specific: null
            }
        };
    }

    if(!parameters.videoPostId){
        return {
            error: {
                message: 'require_body_parameter_videoPostId',
                specific: null
            }
        };
    }

    if(!parameters.title){
        return {
            error: {
                message: 'require_body_parameter_title',
                specific: null
            }
        };
    }

    if(!parameters.description){
        return {
            error: {
                message: 'require_body_parameter_description',
                specific: null
            }
        };
    }

    if (parameters.title.length > TITLE_MAX_LENGTH) {
        return {
            error: {
                message: 'title_too_long',
                specific: 'title length cannot be longer than ' + TITLE_MAX_LENGTH.toString(),
            }
        };
    }

    if (parameters.title.length < TITLE_MIN_LENGTH) {
        return {
            error: {
                message: 'title_too_short',
                specific: 'title length cannot be shorter than ' + TITLE_MIN_LENGTH.toString(),
            }
        };
    }
    
    if (parameters.description.length > DESCRIPTION_MAX_LENGTH) {
        return {
            error: {
                message: 'description_too_long',
                specific: 'description length cannot be longer than ' + DESCRIPTION_MAX_LENGTH.toString(),
            }
        };
    }

    const tagValidation = validateTags(parameters.tags);

    // tag errors
    if(tagValidation == TAGS_TOO_LONG){
        return {
            error: {
                message: 'tags_too_long',
                specific: 'Each tag\'s length should be less or equal than ' + TAG_MAX_LENGTH.toString(),
            }
        };
    }

    if(tagValidation == TAGS_TOO_MANY){ 
        return {
            error: {
                message: 'tags_too_many',
                specific: 'The number of tags should be less or equal than ' + TAG_MAX_NUM.toString(),
            }
        };
    }

    if(tagValidation == TAGS_WITH_FORBIDDEN_CHAR){ 
        return {
            error: {
                message: 'tags_with_forbidden_char',
                specific: 'Only English, Korean, numbers are allowed in tags'
            }
        };
    }

    if(!(await validateVideoOwner(parameters.userId, parameters.videoPostId))){
        return {
            error: {
                message: 'not_owner',
                specific: 'Given user is not the owner of the video post'
            }
        };
    }

    return null;
}


async function validateDeleteVideoParameters(parameters: DeleteVideoParameters): Promise<ApiError> | null{
    if(!parameters.userId){
        return {
            error: {
                message: 'require_body_parameter_userId',
                specific: null
            }
        };
    }

    if(!parameters.videoPostId){
        return {
            error: {
                message: 'require_body_parameter_videoPostId',
                specific: null
            }
        };
    }

    if(!(await validateVideoOwner(parameters.userId, parameters.videoPostId))){
        return {
            error: {
                message: 'not_owner',
                specific: 'Given user is not the owner of the video post'
            }
        };
    }

    return null;
}


export default {
    validatePostVideoParameters,
    validatePutVideoParameters,
    validateDeleteVideoParameters
};