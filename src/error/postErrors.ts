import tagService from '../service/tagService';

type postVideoParameters = {
    userId: number | null,
    videoId: string | null,
    title: string | null,
    description: string | null,
    tags: Array<string> | null
}

type putVideoParameters = {
    userId: number | null,
    videoPostId: number | null,
    title: string | null,
    description: string | null,
    tags: Array<string> | null
};

type deleteVideoParameters = {
    userId: number | null,
    videoPostId: number | null
}

type postApiError = {
    error: {
        message: string,
        specific: string | null
    }
};



// error for : POST - /v1/post/video
function validatePostVideoParameters(parameters: postVideoParameters): postApiError | null{
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

    if (parameters.title.length >= 100) {
        return {
            error: {
                message: 'title_too_long',
                specific: 'title length should be less than 100',
            }
        };
    }

    if (parameters.title.length <= 1) {
        return {
            error: {
                message: 'title_too_short',
                specific: 'title length should be more than 2',
            }
        };
    }
    
    if (parameters.description.length >= 250) {
        return {
            error: {
                message: 'description_too_long',
                specific: 'description length should be less than 250',
            }
        };
    }

    const tagValidation = tagService.validateTags(parameters.tags);

    // tag errors
    if(tagValidation == tagService.TAGS_TOO_LONG){
        return {
            error: {
                message: 'tags_too_long',
                specific: 'Each tag\'s length should be less or equal than ' + tagService.TAG_MAX_LENGTH.toString(),
            }
        };
    }

    if(tagValidation == tagService.TAGS_TOO_MANY){ 
        return {
            error: {
                message: 'tags_too_many',
                specific: 'The number of tags should be less or equal than ' + tagService.TAG_MAX_NUM.toString(),
            }
        };
    }

    if(tagValidation == tagService.TAGS_WITH_FORBIDDEN_CHAR){ 
        return {
            error: {
                message: 'tags_with_forbidden_char',
                specific: 'Only English, Korean, numbers are allowed in tags'
            }
        };
    }

    return null;
}


function validatePutVideoParameters(parameters: putVideoParameters): postApiError | null{
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

    if (parameters.title.length >= 100) {
        return {
            error: {
                message: 'title_too_long',
                specific: 'title length should be less than 100',
            }
        };
    }

    if (parameters.title.length <= 1) {
        return {
            error: {
                message: 'title_too_short',
                specific: 'title length should be more than 2',
            }
        };
    }

    if (parameters.description.length >= 250) {
        return {
            error: {
                message: 'description_too_long',
                specific: 'description length should be less than 250',
            }
        };
    }


    return null;
}


function validateDeleteVideoParameters(parameters: deleteVideoParameters): postApiError | null{
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


    return null;
}


export default {
    validatePostVideoParameters,
    validatePutVideoParameters,
    validateDeleteVideoParameters
};