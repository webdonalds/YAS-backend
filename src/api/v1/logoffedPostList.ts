import * as express from 'express';
import { Video } from '../../model/index';
import { Op } from 'sequelize';

const router = express.Router();


const VIDEO_LIST_LIMIT = 3;
const HOT_VIDEO_LIST_LIMIT = 20;


// get recent posts
router.get('/recent-videos', async (request: express.Request, response: express.Response) => {
    // for this API, pageToken is the last video id of the previous response list.
    const lastPostId = parseInt(request.query.pageToken as string);
    
    let result;

    if(isNaN(lastPostId)){
        result = await Video.findAll({
            order: [
                ['id', 'DESC']
            ],
            limit: VIDEO_LIST_LIMIT
        });
    } else{
        result = await Video.findAll({
            where:{
                id: { [Op.lt]: lastPostId }
            },
            order: [
                ['id', 'DESC']
            ],
            limit: VIDEO_LIST_LIMIT
        });
    }

    const recentVideoList = [];

    for(let i=0;i<result.length;i++){
        recentVideoList.push(result[i].dataValues);
    }

    response.json({
        videoList: recentVideoList,
        pageToken: recentVideoList.length > 0 ? recentVideoList[recentVideoList.length - 1].id : null
    });

    return;
});


// get hot posts
router.get('/hot-videos', async (request: express.Request, response: express.Response) => {
    const result = await Video.findAll({
        order: [
            ['totalLikes', 'DESC']
        ],
        limit: HOT_VIDEO_LIST_LIMIT
    });

    const hotVideoList = [];

    for(let i=0;i<result.length;i++){
        hotVideoList.push(result[i]);
    }

    response.json({
        videoList: hotVideoList
    });

    return;
});



export default router;