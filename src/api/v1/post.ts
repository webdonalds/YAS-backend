import * as express from 'express';

import { Video, Tag, VideoHasTag } from '../../model/index';
import tagService from '../../service/tagService';

const router = express.Router();


// post video
router.post('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoId = request.body.videoId;
    const title = request.body.title;
    const description = request.body.description;
    const tags = request.body.tags;


    if(!userId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_userId',
            }
        });
        return;
    }

    if(!videoId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_videoId',
            }
        });
        return;
    }

    if(!title){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_title',
            }
        });
        return;
    }

    if(!description){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_description',
            }
        });
        return;
    }

    if (title.length >= 100) {
        response.status(400).json({
            error: {
                message: 'title_too_long',
                specific: 'title length should be less than 100',
            }
        });
        return;
    }

    if (title.length <= 1) {
        response.status(400).json({
            error: {
                message: 'title_too_short',
                specific: 'title length should be more than 2',
            }
        });
        return;
    }

    if (description.length >= 250) {
        response.status(400).json({
            error: {
                message: 'description_too_long',
                specific: 'description length should be less than 250',
            }
        });
        return;
    }

    const tagValidation = tagService.validateTags(tags);

    // tag errors
    if(tagValidation == tagService.TAGS_TOO_LONG){
        response.status(400).json({
            error: {
                message: 'tags_too_long',
                specific: 'Each tag\'s lenght should be less or equal than ' + tagService.TAG_MAX_LENGTH.toString(),
            }
        });
        return;
    }

    if(tagValidation == tagService.TAGS_TOO_MANY){ 
        response.status(400).json({
            error: {
                message: 'tags_too_many',
                specific: 'The number of tags should be less or equal than ' + tagService.TAG_MAX_NUM.toString(),
            }
        });
        return;
    }

    if(tagValidation == tagService.TAGS_WITH_FORBIDDEN_CHAR){ 
        response.status(400).json({
            error: {
                message: 'tags_with_forbidden_char',
                specific: 'Only English, Korean, numbers are allowed in tags'
            }
        });
        return;
    }

    // Store new tags to database, and get tagId of all tags.
    const tagIds = await tagService.storeTagsIfNewAndGetTagIds(tags);
    
    const result = await Video.create({
        videoId: videoId,
        userId: userId,
        title: title,
        description: description,
    });

    // Store new relation ship between video and tags
    tagService.addVideoHasTag(result.id, tagIds);

    response.json({
        postId: result.id
    });

    return;
});


// TODO : videoPost의 주인이 아닌 다른 userId로 요청이 오는 경우 - put과 delete에 대해서
// AS-IS : SQL query 자체에서 만족하는 조건의 row가 없으면 수정되는 row 없음
// TO-BE : 요청된 videoPost가 요청한 user의 post인지를 확인?

// modify video post
router.put('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoPostId = request.body.videoPostId;
    const title = request.body.title;
    const description = request.body.description;

    if(!userId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_userId',
            }
        });
        return;
    }

    if(!videoPostId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_videoPostId',
            }
        });
        return;
    }

    if(!title){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_title',
            }
        });
        return;
    }

    if(!description){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_description',
            }
        });
        return;
    }

    if (title.length >= 100) {
        response.status(400).json({
            error: {
                message: 'title_too_long',
                specific: 'title length should be less than 100',
            }
        });
        return;
    }

    if (title.length <= 1) {
        response.status(400).json({
            error: {
                message: 'title_too_short',
                specific: 'title length should be more than 2',
            }
        });
        return;
    }

    if (description.length >= 250) {
        response.status(400).json({
            error: {
                message: 'description_too_long',
                specific: 'description length should be less than 250',
            }
        });
        return;
    }


    
    await Video.update(
        {
            title: title,
            description: description
        },
        {
            where: {
                id: videoPostId,
                userId: userId
            }
        }
    );

    // TODO : modify tags for video posts.


    response.json({
        message: 'success',
    });

    return;
});


// delete video
router.delete('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoPostId = request.body.videoPostId;

    if(!userId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_userId',
            }
        });
        return;
    }

    if(!videoPostId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_videoPostId',
            }
        });
        return;
    }


    await Video.destroy({ 
        where: { 
            userId: userId,
            id: videoPostId
        } 
    });

    // TODO : Delete tags 

    
    response.json({
        message: 'success',
    });


    return;
});


export default router;