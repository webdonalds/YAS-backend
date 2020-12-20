import * as express from 'express';

import { Video } from '../../model/index';

const router = express.Router();


// post video
router.post('/video', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const videoId = request.body.videoId;
    const title = request.body.title;
    const description = request.body.description;


    if(!userId){
        response.status(403).json({
            error: {
                message: 'require_parameter_userId',
                code: 403
            }
        });
        return;
    }

    if(!videoId){
        response.status(403).json({
            error: {
                message: 'require_parameter_videoId',
                code: 403
            }
        });
        return;
    }

    if(!title){
        response.status(403).json({
            error: {
                message: 'require_parameter_title',
                code: 403
            }
        });
        return;
    }

    if(!description){
        response.status(403).json({
            error: {
                message: 'require_parameter_description',
                code: 403
            }
        });
        return;
    }

    if (title.length >= 100) {
        response.status(401).json({
            error: {
                message: 'title_too_long',
                specific: 'title length should be less than 100',
                code: 401
            }
        });
        return;
    }

    if (title.length <= 1) {
        response.status(401).json({
            error: {
                message: 'title_too_short',
                specific: 'title length should be more than 2',
                code: 401
            }
        });
        return;
    }

    if (description.length >= 250) {
        response.status(401).json({
            error: {
                message: 'description_too_long',
                specific: 'description length should be less than 250',
                code: 401
            }
        });
        return;
    }


    const result = await Video.create({
        videoId: videoId,
        userId: userId,
        title: title,
        description: description
    });

    // TODO : add tags for video posts.


    response.json({
        message: 'success',
        postId: result.id
    });

    return;
});



export default router;