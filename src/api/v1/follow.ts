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
    return ;
  }

  if(!parameters.followeeId){
    errorSend(response, 'require_path_parameter_followeeId', null);
    return;
  }

  if(parameters.followeeId == parameters.followerId){
    errorSend(response, 'follower_and_followee_same', 'Cannot self follow');
    return ;
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
    return ;
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


router.get('/followeesByFollower/:followerId', async (request: express.Request, response: express.Response) => {
  const followerId = request.params.followerId;
  const lastFollowId = parseInt(request.query.pageToken as string);

  let result;

  const includeOptions = [
    {
      model: User,
      as: 'Followee',
      attributes: ['id', 'userId', 'nickname', 'imagePath']
    }
  ];

  try {
    if(isNaN(lastFollowId)){
      result = await Follow.findAll({
        where: {
          followerId: followerId
        },
        order: [
            ['id', 'DESC']
        ],
        limit: FOLLOW_LIMIT,
        include: includeOptions
      });
    } else {
      result = await Follow.findAll({
        where:{
            id: { [Op.lt]: lastFollowId },
            followerId: followerId
        },
        order: [
            ['id', 'DESC']
        ],
        limit: FOLLOW_LIMIT,
        include: includeOptions
    });
    }
  } catch(e) {
    errorSend(response, 'fail_get_followees', null);
    return;
  }

  const followees = [];

  for(let i=0;i<result.length;i++){
    followees.push(result[i].dataValues['Followee']);
  }

  response.json({
    followees: followees,
    pageToken: followees.length > 0 ? followees[followees.length - 1].id : null
  });
  return;
});


router.get('/followersByFollowee/:followeeId', async (request: express.Request, response: express.Response) => {
  const followeeId = request.params.followeeId;
  const lastFollowId = parseInt(request.query.pageToken as string);

  let result;

  const includeOptions = [
    {
      model: User,
      as: 'Follower',
      attributes: ['id', 'userId', 'nickname', 'imagePath']
    }
  ];

  try {
    if(isNaN(lastFollowId)){
      result = await Follow.findAll({
        where: {
          followeeId: followeeId
        },
        order: [
            ['id', 'DESC']
        ],
        limit: FOLLOW_LIMIT,
        include: includeOptions
      });
    } else {
      result = await Follow.findAll({
        where:{
            id: { [Op.lt]: lastFollowId },
            followeeId: followeeId
        },
        order: [
            ['id', 'DESC']
        ],
        limit: FOLLOW_LIMIT,
        include: includeOptions
    });
    }
  } catch(e) {
    errorSend(response, 'fail_get_followers', null);
  }

  const followers = [];

  for(let i=0;i<result.length;i++){
    followers.push(result[i].dataValues['Follower']);
  }

  response.json({
    followers: followers,
    pageToken: followers.length > 0 ? followers[followers.length - 1].id : null
  });
  return;
});

export default router;