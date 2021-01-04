import * as express from 'express';
import { Video } from '../../model/index';
import tagService from '../../service/tagService';
import postErrors from '../../error/postErrors';

const router = express.Router();


// post video
router.post('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoId = request.body.videoId;
    const title = request.body.title;
    const description = request.body.description;
    const tags = request.body.tags;

    const parameters = {
        userId: userId,
        videoId: videoId, 
        title: title,
        description: description,
        tags: tags
    };


    const error = postErrors.validatePostVideoParameters(parameters);
    
    if(error){
        response.status(400).json(error);
        return;
    }
    

    const result = await Video.create({
        videoId: videoId,
        userId: userId,
        title: title,
        description: description,
    });


    const tagIds = await tagService.storeTagsIfNewAndGetTagIds(tags);
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
    const tags = request.body.tags;

    const parameters = {
        userId: userId,
        videoPostId: videoPostId,
        title: title,
        description: description,
        tags: tags
    };


    const error = postErrors.validatePutVideoParameters(parameters);

    if(error){
        response.status(400).json(error);
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


    // update tags
    const tagIds = await tagService.storeTagsIfNewAndGetTagIds(tags);
    await tagService.deleteVideoHasTag(videoPostId);
    tagService.addVideoHasTag(videoPostId, tagIds);
    

    response.json({
        message: 'success',
    });

    return;
});


// delete video
router.delete('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoPostId = request.body.videoPostId;

    const parameters = {
        userId: userId,
        videoPostId: videoPostId
    };


    const error = postErrors.validateDeleteVideoParameters(parameters);

    if(error){
        response.status(400).json(error);
        return;
    }


    await Video.destroy({ 
        where: { 
            userId: userId,
            id: videoPostId
        } 
    });
    // video_has_tag will be deleted automatically by Database setting.

    
    response.json({
        message: 'success',
    });


    return;
});


export default router;