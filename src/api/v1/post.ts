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
        response.status(403).json({
            error: {
                message: 'require_parameter_userId',
                code: 403
            }
        });
        return;
    }

    if(!videoPostId){
        response.status(403).json({
            error: {
                message: 'require_parameter_videoPostId',
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



export default router;