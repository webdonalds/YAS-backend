import * as express from 'express';
import middleware from '../middleware';
import { errorSend } from '../../error/errorUtil';

import { Op } from 'sequelize';
import { Follow, User } from '../../model';


const router = express.Router();

const FOLLOW_LIMIT = 10;

router.post('/:followeeId', middleware.validateToken, async (request: express.Request, response: express.Response) => {
  const userId = request.body.userInfo ? request.body.userInfo.userId : null;
  const followeeId = request.params.followeeId;
  
  const parameters = {
    followerId: userId,
    followeeId: followeeId
  };
  
  if(!parameters.followerId){
    errorSend(response, 'require_body_parameter_followerId', 'Require login');
    return;
  }

  if(!parameters.followeeId){
    errorSend(response, 'require_path_parameter_followeeId', null);
    return;
  }

  if(parameters.followeeId == parameters.followerId){
    errorSend(response, 'follower_and_followee_same', 'Cannot self follow');
    return;
  }

  try {
    const follow = await Follow.create({
      followerId: parameters.followerId,
      followeeId: parameters.followeeId
    });

    response.json({
      followerId: follow.followerId,
      followeeId: follow.followeeId
    });
  } catch(e) {
    errorSend(response, 'failed_to_add_follow', e.message);
  }

  return;
});


router.delete('/:followeeId', middleware.validateToken, async (request: express.Request, response: express.Response) => {
  const userId = request.body.userInfo ? request.body.userInfo.userId : null;
  const followeeId = request.params.followeeId;
  
  const parameters = {
    followerId: userId,
    followeeId: followeeId
  };


  if(!parameters.followerId){
    errorSend(response, 'require_body_parameter_followerId', 'Require login');
    return;
  }

  if(!parameters.followeeId){
    errorSend(response, 'require_path_parameter_followeeId', null);
    return;
  }

  try {
    await Follow.destroy({
      where: {
        followerId: parameters.followerId,
        followeeId: parameters.followeeId
      }
    });

    response.json({
      message: 'success',
    });

  } catch(e) {
    errorSend(response, 'failed_to_delete_follow', e.message);
  }

  return;
});

router.get('/', async (request: express.Request, response: express.Response) => {
  const followerId = request.query.followerId;
  const followeeId = request.query.followeeId;
  const lastFollowId = parseInt(request.query.pageToken as string);

  if((followerId && followeeId) || (!followerId && !followeeId)){
    errorSend(response, 'require_1_between_followerId_or_followeeId', 'Require 1 query param between followerId or followeeId)');
    return;
  }

  let whereOption;
  let target;

  if(followerId != null && followerId != undefined) {
    whereOption = { followerId: followerId };
    target = 'Followee';
  } else if (followeeId != null && followeeId != undefined){
    whereOption = { followeeId: followeeId };
    target = 'Follower';
  }

  if(lastFollowId) {
    whereOption['id'] = { [Op.lt]: lastFollowId } ;
  }

  let result;

  try {
    result = await Follow.findAll({
      where: whereOption,
      order: [
          ['id', 'DESC']
      ],
      limit: FOLLOW_LIMIT,
      include: [
        {
          model: User,
          as: target,
          attributes: ['id', 'nickname', 'imagePath', 'aboutMe']
        }
      ]
    });
  } catch(e) {
    errorSend(response, 'fail_get_follows', null);
    return;
  }

  const follows = result.map(data => data.dataValues[target]);

  response.json({
    follows: follows,
    pageToken: follows.length > 0 ? follows[follows.length - 1].id : null
  });

  return;
});

router.get('/isFollowing', async (request: express.Request, response: express.Response) => {
  const followeeId = parseInt(request.query.followeeId as string);
  const followerId = parseInt(request.query.followerId as string);

  if(!followeeId){
    errorSend(response, 'require_query_parameter_followeeId', null);
    return;
  }

  if(!followerId){
    errorSend(response, 'require_query_parameter_followerId', null);
    return;
  }

  let result;

  try {
    result = await Follow.findAll({
      where: {
        followeeId: followeeId,
        followerId: followerId
      }
    });
  } catch(e) {
    errorSend(response, 'fail_get_is_following', e.message);
    return;
  }

  response.json({
    isFollowing: result.length > 0 ? true:false
  });
  return;
});

export default router;
