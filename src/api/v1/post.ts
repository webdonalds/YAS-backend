import * as express from 'express';
import { Tag, User, Video } from '../../model/index';
import tagService from '../../service/tagService';
import postValidation from '../../validation/postValidation';
import { Op } from 'sequelize';

import middleware from '../middleware';
import { errorSend } from '../../error/errorUtil';
import { VideoListResponse } from '../../model/dto/Video';

const router = express.Router();

// get video
// id: db id, videoId: youtube video id
router.get('/video/:id', async (request: express.Request, response: express.Response) => {
    const id = Number(request.params.id);
    if(isNaN(id)) {
        errorSend(response, 'invalid_id', null);
        return;
    }

    try {
        const video = await Video.findByPk(id, {
            include: [{
                model: Tag,
            }, {
                model: User,
            }]
        });
        if(video == null) {
            throw 'not_found';
        }

        response.json(video.toVideoResponse());
    } catch (e) {
        errorSend(response, 'not_found', null);
    }
});


const USER_VIDEO_LIMIT = 8;


// get videos of specific user
router.get('/user-videos/:userId', async (request: express.Request, response: express.Response) => {
    const ownerId = Number(request.params.userId);
    
    // if no userId parameter is given, use id of api caller
    if(isNaN(ownerId)){
        errorSend(response, 'invalid_id', null);
        return;
    }

    const lastPostId = parseInt(request.query.pageToken as string);

    let videos: Video[];
  
    try {
        const whereOpt = isNaN(lastPostId) ? {
            userId: ownerId
        } : {
            id: { [Op.lt]: lastPostId },
            userId: ownerId
        };

        videos = await Video.findAll({
            where: whereOpt,
            order: [
                ['id', 'DESC']
            ],
            limit: USER_VIDEO_LIMIT,
            include: [{
                model: Tag,
            },{
                model: User
            }]
        });
    } catch(e) {
        errorSend(response, 'not_found', null);
        return;
    }

    const videoListResponse: VideoListResponse = {
        videoList: videos.map((video) => video.toVideoResponse()),
        pageToken: videos.length > 0 ? videos[videos.length - 1].id : null
    };
    response.json(videoListResponse);
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
    
    try {
        const result = await Video.create({
            videoId: videoId,
            userId: userId,
            title: title,
            description: description,
        });

        // TODO: error handling => rollback? transaction?
        const tagIds = await tagService.storeTagsIfNewAndGetTagIds(tags);
        tagService.addVideoHasTag(result.id, tagIds);
    
        response.json({
            postId: result.id
        });
    } catch(e) {
        errorSend(response, 'internal_server_error', e);
        return;
    }
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

    // TODO: error handling => rollback? transaction?
    try {
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
    } catch(e) {
        errorSend(response, 'internal_server_error', null);
        return;
    }

    response.json({
        postId: videoPostId,
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

    // TODO: error handling => rollback? transaction?
    try {
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
    } catch(e) {
        errorSend(response, 'internal_server_error', null);
        return;
    }
    
    response.json({
        postId: videoPostId,
    });
    return;
});


export default router;
