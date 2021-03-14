import * as express from 'express';
import { Like } from '../../model/index';
import { errorSend } from '../../error/errorUtil';

const router = express.Router();


// post like (set like)
router.post('/', async (request: express.Request, response: express.Response) => {
  const userId = request.body.userInfo.userId;
  const videoId = request.body.videoId;

  try {
    await Like.create({
      userId: userId,
      videoId: videoId
    });

    response.json({
      message: 'success'
    });
  } catch (e) {
    errorSend(response, 'videoId is invalid', null);
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

    if(deleteCount > 0) {
      response.json({
        message: 'success'
      });
    } else {
      throw '';
    }
  } catch (e) {
    errorSend(response, 'videoId is invalid', null);
  }
});


export default router;