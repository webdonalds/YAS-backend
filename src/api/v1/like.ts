import * as express from 'express';
import { Like, Video } from '../../model/index';
import { errorSend } from '../../error/errorUtil';
import { Sequelize } from 'sequelize';
import { LikeResponse } from '../../model/dto/Like';

const router = express.Router();

router.get('/myLike/:videoId', async (request: express.Request, response: express.Response) => {
  const userId = request.body.userInfo.userId;
  const videoId = Number(request.params.videoId);

  try {
    const like = await Like.findOne({
      where: {
        userId: userId,
        videoId: videoId,
      }
    });

    const likeResponse: LikeResponse = {
      like: (like ? true : false)
    };
    response.json(likeResponse);
  }
  catch (e) {
    errorSend(response, 'videoId is invalid', null);
    return;
  }
});

// post like (set like)
router.post('/', async (request: express.Request, response: express.Response) => {
  const userId = request.body.userInfo.userId;
  const videoId = request.body.videoId;

  try {
    await Like.create({
      userId: userId,
      videoId: videoId
    });
  }
  catch (e) {
    errorSend(response, 'videoId is invalid', null);
    return;
  }

  try {
    Video.update({
      totalLikes: Sequelize.literal('totalLikes + 1')
    }, {
      where: {
        id: videoId
      }
    });
    response.json();
  } catch (e) {
    await Like.destroy({
      where: {
        userId: userId,
        videoId: videoId
      }
    });
    errorSend(response, 'fail to update video totalLikes', null);
    return;
  }
});


// delete like (unset like)
router.delete('/', async (request: express.Request, response: express.Response) => {
  const userId = request.body.userInfo.userId;
  const videoId = request.body.videoId;

  try {
    const deleteCount = await Like.destroy({
      where: {
        userId: userId,
        videoId: videoId
      }
    });
    if(deleteCount == 0) {
      throw '';
    }
  } catch (e) {
    errorSend(response, 'videoId is invalid', null);
    return;
  }

  try {
    await Video.update({
      totalLikes: Sequelize.literal('totalLikes - 1')
    }, {
      where: {
        id: videoId
      }
    });
    response.json();
  } catch (e) {
    await Like.create({
      userId: userId,
      videoId: videoId
    });
    errorSend(response, 'fail to update video totalLikes', null);
    return;
  }
});


export default router;
