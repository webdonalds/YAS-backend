import * as express from 'express';
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
        response.status(400).json({
            error: {
                message: 'require_userId',
                specific: null
            }
        });
        return;
    }

    if(imagePath && imagePath.length > 1000000){
        response.status(400).json({
            error: {
                message: 'image_file_too_big',
                specific: 'image file length should be less than 1000000'
            }
        });
        return;
    }

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

    response.json({
        message: 'success'
    });

    return;
});


router.get('/user-info', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;

    if(!userId){
        response.status(400).json({
            error: {
                message: 'require_body_parameter_userId',
                specific: null
            }
        });
        return;
    }

    const userInfo = await User.findByPk(userId);

    if(!userInfo){
        response.status(400).json({
            error: {
                message: 'no_user_found',
                specific: 'No corresponding user for given token'
            }
        });
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