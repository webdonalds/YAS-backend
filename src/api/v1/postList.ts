import * as express from 'express';
import { Video } from '../../model/index';
import { Op } from 'sequelize';

const router = express.Router();


const VIDEO_LIST_LIMIT = 10;


// get recent posts
router.get('/recent-videos', async (request: express.Request, response: express.Response) => {
    const lastPostId = parseInt(request.query.lastPostId as string);
    
    let result;

    if(isNaN(lastPostId)){
        result = await Video.findAll({
            order: [
                ['id', 'DESC']
            ],
            limit: VIDEO_LIST_LIMIT
        });
    }

    else{
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
        recentVideos: recentVideoList
    });

    return;
});


export default router;