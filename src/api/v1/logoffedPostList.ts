import * as express from 'express';
import { Video, Tag, User } from '../../model/index';
import { Op } from 'sequelize';
import { errorSend } from '../../error/errorUtil';

const router = express.Router();


const VIDEO_LIST_LIMIT = 8;
const HOT_VIDEO_LIST_LIMIT = 20;

// get recent posts
router.get('/recent-videos', async (request: express.Request, response: express.Response) => {
    // for this API, pageToken is the last video id of the previous response list.
    const lastPostId = parseInt(request.query.pageToken as string);
    
    let videos: Video[];

    try {
        const whereOpt = isNaN(lastPostId) ? {
        } : {
            id: { [Op.lt]: lastPostId },
        };

        videos = await Video.findAll({
            where: whereOpt,
            order: [
                ['id', 'DESC']
            ],
            limit: VIDEO_LIST_LIMIT,
            include: [{
                model: Tag,
            }, {
                model: User,
            }]
        });
    } catch(e) {
        errorSend(response, 'fail_get_video', null);
        return;
    }

    const videoListResponse: VideoListResponse = {
        videoList: videos.map((video) => video.toVideoResponse()),
        pageToken: videos.length > 0 ? videos[videos.length - 1].id : null
    };
    response.json(videoListResponse);
    return;
});

// get hot posts
router.get('/hot-videos', async (request: express.Request, response: express.Response) => {
    try {
        const videos: Video[] = await Video.findAll({
            order: [
                ['totalLikes', 'DESC']
            ],
            limit: HOT_VIDEO_LIST_LIMIT,
            include: [{
                model: Tag,
            }, {
                model: User,
            }]
        });

        const videoListResponse: VideoListResponse = {
            videoList: videos.map((video) => video.toVideoResponse()),
            pageToken: null
        };
        response.json(videoListResponse);
    } catch(e) {
        errorSend(response, 'fail_get_video', null);
    }
    return;
});

export default router;
