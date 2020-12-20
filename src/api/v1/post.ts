import * as express from 'express';

import { Video } from '../../model/index';

const router = express.Router();


// post video
router.post('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoPost = request.body.videoPost ? request.body.videoPost : null;


    if(!userId){
        response.status(403).json({
            error: {
                message: 'require_parameter_userId',
                code: 403
            }
        });
        return;
    }

    if(!videoPost.videoId){
        response.status(403).json({
            error: {
                message: 'require_parameter_videoPost.videoId',
                code: 403
            }
        });
        return;
    }

    if(!videoPost.title){
        response.status(403).json({
            error: {
                message: 'require_parameter_videoPost.title',
                code: 403
            }
        });
        return;
    }

    if(!videoPost.description){
        response.status(403).json({
            error: {
                message: 'require_parameter_videoPost.description',
                code: 403
            }
        });
        return;
    }

    if (videoPost.title.length >= 100) {
        response.status(401).json({
            error: {
                message: 'videoPost.title_too_long',
                specific: 'videoPost.title length should be less than 100',
                code: 401
            }
        });
        return;
    }

    if (videoPost.title.length <= 1) {
        response.status(401).json({
            error: {
                message: 'videoPost.title_too_short',
                specific: 'videoPost.title length should be more than 2',
                code: 401
            }
        });
        return;
    }

    if (videoPost.description.length >= 250) {
        response.status(401).json({
            error: {
                message: 'videoPost.title_too_long',
                specific: 'videoPost.title length should be less than 250',
                code: 401
            }
        });
        return;
    }


    const postId = await Video.create({
        videoId: videoPost.videoId,
        userId: userId,
        title: videoPost.title,
        description: videoPost.description
    });

    // TODO : add tags for video posts.


    response.json({
        message: 'success',
        postId: postId
    });

    return;
});



export default router;