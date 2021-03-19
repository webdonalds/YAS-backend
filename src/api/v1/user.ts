import * as express from 'express';
import { errorSend } from '../../error/errorUtil';
import { User } from '../../model/index';
import userInfoValidation from '../../validation/userInfoValidation';

const router = express.Router();


router.put('/user-info', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const nickname = request.body.nickname;
    const aboutMe = request.body.aboutMe;

    const parameters = {
        userId: userId,
        nickname: nickname,
        aboutMe: aboutMe
    };

    const error = await userInfoValidation.validateUserInfoParameters(parameters);
    
    if(error){
        response.status(400).json(error);
        return;
    }

    try {
        await User.update(
            {
                nickname: nickname,
                aboutMe: aboutMe
            },
            {
                where: {
                    id: userId
                }
            }
        );
    } catch(e) {
        errorSend(response, 'fail_update_user', null);
        return;
    }

    response.json({
        nickname: nickname,
        aboutMe: aboutMe
    });
    return;
});


router.put('/profile-image', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const imagePath = request.body.imagePath ? request.body.imagePath : null;

    if(!userId){
        errorSend(response, 'require_user_id', null);
        return;
    }

    if(imagePath && imagePath.length > 1000000){
        errorSend(response, 'image_file_too_big', 'image file length should be less than 1000000');
        return;
    }

    try {
        await User.update(
            {
                imagePath: imagePath
            },
            {
                where: {
                    id: userId
                }
            }
        );
    } catch(e) {
        errorSend(response, 'fail_update_user', null);
        return;
    }

    response.json({
        message: 'success'
    });
    return;
});


router.get('/user-info', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;

    if(!userId){
        errorSend(response, 'require_body_parameter_userId', null);
        return;
    }

    const userInfo = await User.findByPk(userId);

    if(!userInfo){
        errorSend(response, 'no_user_found', 'No corresponding user for given token');
        return;
    }

    response.json({
        id: userInfo.id,
        email: userInfo.email,
        nickname: userInfo.nickname,
        imagePath: userInfo.imagePath,
        aboutMe: userInfo.aboutMe
    });
    return;
});

export default router;