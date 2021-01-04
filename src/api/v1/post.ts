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