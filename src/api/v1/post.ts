import * as express from 'express';
import { Tag, Video } from '../../model/index';
import tagService from '../../service/tagService';
import postValidation from '../../validation/postValidation';
import { Op } from 'sequelize';

import middleware from '../middleware';

const router = express.Router();

// get video
router.get('/video/:videoId', async (request: express.Request, response: express.Response) => {
    const videoId = Number(request.params.videoId);
    if(isNaN(videoId)) {
        response.status(400).json({
            error: {
                message: 'invalid_id',
                specific: null,
            }
        });
        return;
    }

    const video = await Video.findByPk(videoId, {
        include: {
            model: Tag,
        }
    });
    if(video == null) {
        response.status(400).json({
            error: {
                message: 'not_found',
                specific: null,
            }
        });
        return;
    }
    // for security
    video.userId = null;
    response.json(video);
});


const USER_VIDEO_LIMIT = 3;


// get videos of specific user
router.get('/user-videos/:userId', async (request: express.Request, response: express.Response) => {
    const ownerId = Number(request.params.userId);
    
    // if no userId parameter is given, use id of api caller
    if(isNaN(ownerId)){
        response.status(400).json({
            error: {
                message: 'invalid_id',
                specific: null,
            }
        });
        return;
    }

    const lastPostId = parseInt(request.query.pageToken as string);

    let result;

    if(isNaN(lastPostId)){
        result = await Video.findAll({
            where: {
                userId: ownerId
            },
            order: [
                ['id', 'DESC']
            ],
            limit: USER_VIDEO_LIMIT
        });
    } else{
        result = await Video.findAll({
            where:{
                id: { [Op.lt]: lastPostId },
                userId: ownerId
            },
            order: [
                ['id', 'DESC']
            ],
            limit: USER_VIDEO_LIMIT
        });
    }

    const userVideos = [];

    for(let i=0;i<result.length;i++){
        userVideos.push(result[i].dataValues);
    }

    response.json({
        videoList: userVideos,
        pageToken: userVideos.length > 0 ? userVideos[userVideos.length - 1].id : null
    });

    return;
});


// post video
router.post('/video', middleware.validateToken, async (request: express.Request, response: express.Response) => {
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


    const error = postValidation.validatePostVideoParameters(parameters);
    
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
router.put('/video', middleware.validateToken, async (request: express.Request, response: express.Response) => {
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


    const error = await postValidation.validatePutVideoParameters(parameters);

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
router.delete('/video', middleware.validateToken, async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoPostId = request.body.videoPostId;

    const parameters = {
        userId: userId,
        videoPostId: videoPostId
    };


    const error = await postValidation.validateDeleteVideoParameters(parameters);

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